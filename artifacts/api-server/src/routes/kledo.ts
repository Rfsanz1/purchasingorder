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

// GET /kledo/contacts?search=keyword
router.get("/kledo/contacts", async (req, res): Promise<void> => {
  const search = (req.query.search as string) || "";
  if (!search || search.length < 2) {
    res.json({ contacts: [] });
    return;
  }

  try {
    // search= menyaring berdasarkan nama, type_id=3 = customer (kontak penjualan)
    const url = `${KLEDO_BASE}/contacts?per_page=15&search=${encodeURIComponent(search)}&type_id=3`;
    const resp = await fetch(url, { headers: kledoHeaders() });
    const data = await resp.json() as {
      success: boolean;
      data: { data: Array<{ id: number; name: string; mobile_phone?: string; phone?: string; email?: string }> };
    };

    if (!data.success) {
      logger.error({ data }, "Kledo contacts API returned success=false");
      res.status(502).json({ error: "Gagal mengambil kontak dari Kledo" });
      return;
    }

    res.json({ contacts: data.data?.data ?? [] });
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
// Hanya gunakan contact yang tipe customer (type_id: 3) agar bisa dibuat invoice penjualan
export async function findOrCreateKledoContact(namaKontak: string, nomorTelepon: string, alamat: string): Promise<number | null> {
  try {
    // Cari contact dulu — gunakan search= agar Kledo memfilter berdasarkan nama
    const searchUrl = `${KLEDO_BASE}/contacts?per_page=20&search=${encodeURIComponent(namaKontak)}&type_id=3`;
    const searchResp = await fetch(searchUrl, { headers: kledoHeaders() });
    const searchData = await searchResp.json() as { success: boolean; data: { data: Array<{ id: number; name: string }> } };

    if (searchData.success && searchData.data.data.length > 0) {
      // Cari yang nama persis cocok (sudah type_id=3 = customer)
      for (const c of searchData.data.data) {
        if (c.name.toLowerCase() === namaKontak.toLowerCase()) {
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
        mobile_phone: nomorTelepon,
        type_id: 3,
      }),
    });
    const createData = await createResp.json() as { success: boolean; data: { id: number } };
    if (createData.success && createData.data?.id) {
      return createData.data.id;
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
}): Promise<{ success: boolean; invoiceId?: number; invoiceNumber?: string }> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const body = {
      contact_id: params.contactId,
      trans_date: today,
      due_date: today,
      memo: params.memo,
      shipping_cost: params.biayaPengiriman || 0,
      include_tax: 0,
      items: params.items.map(item => ({
        finance_account_id: item.kledoFinanceAccountId ?? item.kledoProductId,
        product_id: item.kledoProductId,
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

    logger.error({ response: data, requestBody: body, httpStatus: resp.status }, "Kledo invoice creation failed — response from Kledo");
    return { success: false };
  } catch (err) {
    logger.error({ err }, "createKledoInvoice error");
    return { success: false };
  }
}

export default router;
