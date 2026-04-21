import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const KLEDO_BASE = "https://api.kledo.com/api/v1/finance";

function kledoHeaders() {
  return {
    Authorization: `Bearer ${process.env.KLEDO_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// GET /kledo/products?search=keyword&page=1
router.get("/kledo/products", async (req, res): Promise<void> => {
  const search = (req.query.search as string) || "";
  const page = (req.query.page as string) || "1";

  try {
    const url = `${KLEDO_BASE}/products?per_page=20&page=${page}&search=${encodeURIComponent(search)}`;
    const resp = await fetch(url, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { data: unknown[]; total: number; current_page: number; last_page: number } };

    if (!data.success) {
      res.status(502).json({ error: "Gagal mengambil produk dari Kledo" });
      return;
    }

    res.json({
      products: data.data.data,
      total: data.data.total,
      currentPage: data.data.current_page,
      lastPage: data.data.last_page,
    });
  } catch (err) {
    logger.error({ err }, "Kledo products fetch error");
    res.status(500).json({ error: "Koneksi ke Kledo gagal" });
  }
});

// Helper: cari produk Kledo berdasarkan nama, kembalikan ID-nya
export async function searchKledoProductByName(namaProduk: string): Promise<{ id: number; unitId: number } | null> {
  try {
    const url = `${KLEDO_BASE}/products?per_page=20&search=${encodeURIComponent(namaProduk)}`;
    const resp = await fetch(url, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { data: Array<{ id: number; unit_id: number; name: string }> } };
    if (!data.success || !data.data.data.length) return null;

    // Cari nama yang paling cocok (exact dulu, lalu partial)
    const exact = data.data.data.find(p => p.name.toLowerCase() === namaProduk.toLowerCase());
    const match = exact ?? data.data.data[0];
    return { id: match.id, unitId: match.unit_id ?? 73 };
  } catch (err) {
    logger.error({ err }, "searchKledoProductByName error");
    return null;
  }
}

// Helper: cek apakah contact Kledo adalah customer (type_id: 3)
async function isKledoCustomer(contactId: number): Promise<boolean> {
  try {
    const resp = await fetch(`${KLEDO_BASE}/contacts/${contactId}`, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { type_id: number } };
    return data.success && data.data?.type_id === 3;
  } catch {
    return false;
  }
}

// Helper: cari contact di Kledo berdasarkan nama, buat baru jika tidak ada
// Jika kontak sudah ada tapi bukan customer, update tipenya
export async function findOrCreateKledoContact(namaKontak: string, nomorTelepon: string, alamat: string): Promise<number | null> {
  try {
    // Cari contact dulu
    const searchUrl = `${KLEDO_BASE}/contacts?per_page=10&keyword=${encodeURIComponent(namaKontak)}`;
    const searchResp = await fetch(searchUrl, { headers: kledoHeaders() });
    const searchData = await searchResp.json() as { success: boolean; data: { data: Array<{ id: number; name: string }> } };

    if (searchData.success && searchData.data.data.length > 0) {
      for (const c of searchData.data.data) {
        if (c.name.toLowerCase() === namaKontak.toLowerCase()) {
          // Jika sudah customer, langsung pakai
          if (await isKledoCustomer(c.id)) return c.id;

          // Jika ada tapi bukan customer, update type_id jadi customer
          const updateResp = await fetch(`${KLEDO_BASE}/contacts/${c.id}`, {
            method: "PUT",
            headers: kledoHeaders(),
            body: JSON.stringify({ type_id: 3 }),
          });
          const updateData = await updateResp.json() as { success: boolean };
          if (updateData.success) {
            logger.info({ contactId: c.id }, "Kledo contact updated to customer type");
            return c.id;
          }

          // Update gagal, tetap pakai contact ini (invoice mungkin tetap bisa dibuat)
          logger.warn({ contactId: c.id }, "Gagal update tipe contact Kledo, tetap pakai ID ini");
          return c.id;
        }
      }
    }

    // Buat contact baru sebagai customer (type_id: 3 = customer di Kledo)
    const createResp = await fetch(`${KLEDO_BASE}/contacts`, {
      method: "POST",
      headers: kledoHeaders(),
      body: JSON.stringify({
        name: namaKontak,
        address: alamat,
        phone: nomorTelepon,
        type_id: 3,
      }),
    });
    const createData = await createResp.json() as { success: boolean; data: { id: number }; message?: string };
    if (createData.success && createData.data?.id) {
      return createData.data.id;
    }

    // Jika gagal karena nama sudah ada, coba cari ulang dengan per_page lebih besar
    if (typeof createData.message === "string" && createData.message.includes("sudah ada")) {
      logger.warn({ namaKontak }, "Nama kontak sudah ada, mencari ulang...");
      const retryUrl = `${KLEDO_BASE}/contacts?per_page=50&keyword=${encodeURIComponent(namaKontak)}`;
      const retryResp = await fetch(retryUrl, { headers: kledoHeaders() });
      const retryData = await retryResp.json() as { success: boolean; data: { data: Array<{ id: number; name: string }> } };
      if (retryData.success && retryData.data.data.length > 0) {
        for (const c of retryData.data.data) {
          if (c.name.toLowerCase() === namaKontak.toLowerCase()) {
            logger.info({ contactId: c.id }, "Kontak ditemukan lewat retry search, dipakai untuk invoice");
            return c.id;
          }
        }
        logger.error({ namaKontak }, "Nama kontak ada di Kledo tapi tidak ditemukan lewat search — skip invoice");
      }
    }

    logger.error({ createData }, "Gagal membuat contact Kledo");
    return null;
  } catch (err) {
    logger.error({ err }, "findOrCreateKledoContact error");
    return null;
  }
}

export interface KledoInvoiceItem {
  kledoProductId: number;
  kledoFinanceAccountId?: number;
  kledoUnitId: number;
  jumlahProduk: number;
  hargaProduk: number;
}

// Helper: buat invoice di Kledo (mendukung banyak item)
export async function createKledoInvoice(params: {
  contactId: number;
  orderId: string;
  items: KledoInvoiceItem[];
  biayaPengiriman: number;
  memo: string;
  patokanLokasi?: string;
}): Promise<{ success: boolean; invoiceId?: number; invoiceNumber?: string }> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const body = {
      contact_id: params.contactId,
      trans_date: today,
      due_date: today,
      memo: params.memo,
      message: params.patokanLokasi || "",
      shipping_cost: params.biayaPengiriman || 0,
      include_tax: 0,
      items: params.items.map(item => ({
        finance_account_id: item.kledoFinanceAccountId ?? item.kledoProductId,
        qty: item.jumlahProduk,
        price: item.hargaProduk,
        amount: item.jumlahProduk * item.hargaProduk,
        unit_id: item.kledoUnitId,
        discount_percent: 0,
        discount_amount: 0,
      })),
    };

    const resp = await fetch(`${KLEDO_BASE}/invoices`, {
      method: "POST",
      headers: kledoHeaders(),
      body: JSON.stringify(body),
    });

    const data = await resp.json() as {
      success: boolean;
      data?: { id: number; ref_number?: string };
      message?: string;
    };

    if (data.success && data.data?.id) {
      return { success: true, invoiceId: data.data.id, invoiceNumber: data.data.ref_number };
    }

    logger.error({ data, body }, "Kledo invoice creation failed");
    return { success: false };
  } catch (err) {
    logger.error({ err }, "createKledoInvoice error");
    return { success: false };
  }
}

export default router;
