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

// GET /kledo/contacts?search=keyword (mendukung pencarian by nama atau nomor HP)
router.get("/kledo/contacts", async (req, res): Promise<void> => {
  const search = (req.query.search as string) || "";
  const digitsOnly = search.replace(/\D/g, "");
  const isPhoneSearch = digitsOnly.length >= 3 && digitsOnly.length === search.replace(/[\s\-\+\(\)\.]/g, "").length;

  const normalize = (p: string) => {
    const d = (p || "").replace(/\D/g, "");
    if (d.startsWith("62")) return "0" + d.slice(2);
    return d;
  };

  type KledoContact = { id: number; name: string; phone?: string; mobile_phone?: string };

  async function fetchKledo(q: string): Promise<KledoContact[]> {
    const url = `${KLEDO_BASE}/contacts?per_page=50&type_id=3&search=${encodeURIComponent(q)}`;
    const resp = await fetch(url, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { data: KledoContact[] }; message?: string };
    if (!data.success) logger.warn({ q, status: resp.status, msg: data.message }, "Kledo contacts query gagal");
    if (!data.success) return [];
    return data.data.data;
  }

  try {
    let candidates: KledoContact[] = [];

    if (isPhoneSearch) {
      // Coba beberapa variasi format nomor agar match dengan field phone di Kledo
      const variants = new Set<string>();
      const norm = normalize(digitsOnly);
      variants.add(digitsOnly);
      variants.add(norm);
      if (norm.startsWith("0")) {
        variants.add("62" + norm.slice(1));
        variants.add("+62" + norm.slice(1));
      }
      // 8-digit terakhir untuk match parsial (sering nomor disimpan dgn/ tanpa kode negara)
      if (norm.length >= 8) variants.add(norm.slice(-9));
      if (norm.length >= 8) variants.add(norm.slice(-8));

      const seen = new Set<number>();
      for (const v of variants) {
        const list = await fetchKledo(v);
        for (const c of list) {
          if (!seen.has(c.id)) { seen.add(c.id); candidates.push(c); }
        }
      }
    } else {
      candidates = await fetchKledo(search);
    }

    const lower = search.toLowerCase();
    const queryNorm = normalize(digitsOnly);

    const filtered = candidates
      .filter(c => {
        if (isPhoneSearch) {
          const phoneNorm = normalize(c.phone || c.mobile_phone || "");
          if (!phoneNorm) return false;
          // cocok jika salah satu mengandung yang lain (tangani prefix 0/62)
          return phoneNorm.includes(queryNorm) || queryNorm.includes(phoneNorm) ||
            phoneNorm.endsWith(queryNorm) || queryNorm.endsWith(phoneNorm);
        }
        return c.name.toLowerCase().includes(lower);
      })
      .slice(0, 10);

    res.json({
      contacts: filtered.map(c => ({
        id: c.id,
        name: c.name,
        mobile_phone: c.phone || c.mobile_phone || "",
      })),
    });
  } catch (err) {
    logger.error({ err }, "Kledo contacts fetch error");
    res.status(500).json({ error: "Koneksi ke Kledo gagal" });
  }
});

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
    // Cari contact customer (type_id=3) dulu berdasarkan nama
    const searchUrl = `${KLEDO_BASE}/contacts?per_page=20&type_id=3&search=${encodeURIComponent(namaKontak)}`;
    const searchResp = await fetch(searchUrl, { headers: kledoHeaders() });
    const searchData = await searchResp.json() as { success: boolean; data: { data: Array<{ id: number; name: string }> } };

    if (searchData.success && searchData.data.data.length > 0) {
      for (const c of searchData.data.data) {
        if (c.name.toLowerCase() === namaKontak.toLowerCase()) {
          logger.info({ contactId: c.id, namaKontak }, "Kledo customer contact ditemukan");
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
      const retryUrl = `${KLEDO_BASE}/contacts?per_page=50&type_id=3&search=${encodeURIComponent(namaKontak)}`;
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
