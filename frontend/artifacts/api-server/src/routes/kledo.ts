import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";
import { fetchWithTimeout } from "../lib/httpFetch";

const router: IRouter = Router();

const KLEDO_BASE = "https://api.kledo.com/api/v1/finance";

function kledoHeaders() {
  return {
    Authorization: `Bearer ${process.env.KLEDO_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// ── In-memory TTL cache ──────────────────────────────────────────────────────
interface CacheEntry<T> { data: T; expiresAt: number; }
const _cache = new Map<string, CacheEntry<unknown>>();

function cacheGet<T>(key: string): T | null {
  const entry = _cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { _cache.delete(key); return null; }
  return entry.data;
}
function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  _cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

const TTL_PRODUCTS  = 5 * 60 * 1000;  // 5 menit — produk jarang berubah
const TTL_CONTACTS  = 60 * 1000;      // 1 menit — kontak lebih dinamis
// ─────────────────────────────────────────────────────────────────────────────

// GET /kledo/contacts?search=keyword (mendukung pencarian by nama atau nomor HP)
router.get("/kledo/contacts", async (req, res): Promise<void> => {
  const search = (req.query.search as string) || "";
  const digitsOnly = search.replace(/\D/g, "");
  const isPhoneSearch = digitsOnly.length >= 3 && digitsOnly.length === search.replace(/[\s\-\+\(\)\.]/g, "").length;

  type KledoContactList = { id: number; name: string; address?: string };
  type KledoContactDetail = { id: number; name: string; phone?: string; address?: string };

  async function fetchKledo(q: string): Promise<KledoContactList[]> {
    const url = `${KLEDO_BASE}/contacts?per_page=20&type_id=3&search=${encodeURIComponent(q)}`;
    const resp = await fetchWithTimeout(url, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { data: KledoContactList[] }; message?: string };
    if (!data.success) {
      logger.warn({ q, status: resp.status, msg: data.message }, "Kledo contacts query gagal");
      return [];
    }
    return data.data.data;
  }

  async function fetchDetail(id: number): Promise<KledoContactDetail | null> {
    try {
      const resp = await fetchWithTimeout(`${KLEDO_BASE}/contacts/${id}`, { headers: kledoHeaders() });
      const data = await resp.json() as { success: boolean; data: KledoContactDetail };
      return data.success ? data.data : null;
    } catch { return null; }
  }

  const cacheKey = `contacts:${search}`;
  const cached = cacheGet<{ contacts: unknown[] }>(cacheKey);
  if (cached) { res.json(cached); return; }

  try {
    const queryToSend = isPhoneSearch ? digitsOnly : search;
    const candidates = (await fetchKledo(queryToSend)).slice(0, 10);

    // Ambil detail (untuk dapat nomor HP) buat ditampilkan di dropdown
    const detailed = await Promise.all(candidates.map(c => fetchDetail(c.id)));

    const contacts = candidates.map((c, i) => ({
      id: c.id,
      name: c.name,
      mobile_phone: detailed[i]?.phone || "",
      address: detailed[i]?.address || c.address || "",
    }));

    const result = { contacts };
    cacheSet(cacheKey, result, TTL_CONTACTS);
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Kledo contacts fetch error");
    res.status(500).json({ error: "Koneksi ke Kledo gagal" });
  }
});

// GET /kledo/products?search=keyword&page=1
router.get("/kledo/products", async (req, res): Promise<void> => {
  const search = (req.query.search as string) || "";
  const page = (req.query.page as string) || "1";

  const cacheKey = `products:${search}:${page}`;
  const cached = cacheGet<object>(cacheKey);
  if (cached) { res.json(cached); return; }

  try {
    const url = `${KLEDO_BASE}/products?per_page=20&page=${page}&search=${encodeURIComponent(search)}`;
    const resp = await fetchWithTimeout(url, { headers: kledoHeaders() });
    const data = await resp.json() as { success: boolean; data: { data: unknown[]; total: number; current_page: number; last_page: number } };

    if (!data.success) {
      res.status(502).json({ error: "Gagal mengambil produk dari Kledo" });
      return;
    }

    const result = {
      products: data.data.data,
      total: data.data.total,
      currentPage: data.data.current_page,
      lastPage: data.data.last_page,
    };
    cacheSet(cacheKey, result, TTL_PRODUCTS);
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Kledo products fetch error");
    res.status(500).json({ error: "Koneksi ke Kledo gagal" });
  }
});

// Helper: cari produk Kledo berdasarkan nama, kembalikan ID-nya
export async function searchKledoProductByName(namaProduk: string): Promise<{ id: number; unitId: number } | null> {
  try {
    const url = `${KLEDO_BASE}/products?per_page=20&search=${encodeURIComponent(namaProduk)}`;
    const resp = await fetchWithTimeout(url, { headers: kledoHeaders() });
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
    const resp = await fetchWithTimeout(`${KLEDO_BASE}/contacts/${contactId}`, { headers: kledoHeaders() });
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
    const searchResp = await fetchWithTimeout(searchUrl, { headers: kledoHeaders() });
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
    const createResp = await fetchWithTimeout(`${KLEDO_BASE}/contacts`, {
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
      const retryResp = await fetchWithTimeout(retryUrl, { headers: kledoHeaders() });
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

    const resp = await fetchWithTimeout(`${KLEDO_BASE}/invoices`, {
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

// Helper: upload attachment (foto/file) ke INVOICE di Kledo (mis. bukti transfer
// nempel langsung di tagihan, muncul di section "Attachment" pada halaman invoice).
// Endpoint: POST /finance/invoices/{id}/attachments dengan multipart field "file".
//
// `dataInput` boleh berupa:
//   - data URL ("data:image/jpeg;base64,xxx") — prefix-nya otomatis di-strip
//   - base64 murni
// Kembalian: URL S3 publik dari file yang berhasil di-upload, atau null kalau gagal.
export async function uploadKledoInvoiceAttachment(
  invoiceId: number,
  dataInput: string,
  filename = "bukti.jpg",
): Promise<string | null> {
  try {
    const m = dataInput.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    const mime = m ? m[1] : "image/jpeg";
    const b64 = m ? m[2] : dataInput;
    const buffer = Buffer.from(b64, "base64");
    // Pastikan ekstensi filename match dengan mime (Kledo kadang reject kalau beda)
    const extFromMime = mime.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const safeName = filename.match(/\.[a-zA-Z0-9]+$/) ? filename : `${filename}.${extFromMime}`;

    const fd = new FormData();
    fd.append("file", new File([new Uint8Array(buffer)], safeName, { type: mime }));

    const resp = await fetchWithTimeout(
      `${KLEDO_BASE}/invoices/${invoiceId}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KLEDO_TOKEN}`,
          Accept: "application/json",
        },
        body: fd,
      },
    );
    const data = await resp.json() as { success: boolean; data?: string; message?: string };
    if (data.success && typeof data.data === "string") {
      logger.info({ invoiceId, url: data.data }, "Kledo invoice attachment uploaded");
      return data.data;
    }
    logger.error({ invoiceId, data }, "Kledo invoice attachment upload failed");
    return null;
  } catch (err) {
    logger.error({ err, invoiceId }, "uploadKledoInvoiceAttachment error");
    return null;
  }
}

// Helper: catat pembayaran tagihan di Kledo (auto-lunas)
// Endpoint: POST /finance/bankTrans/invoicePayment
export async function payInvoiceKledo(params: {
  invoiceId: number;
  bankAccountId: number;  // ID akun kas/bank di Kledo (KAS ELEKTRONIK, KAS SULAWESI, EDC, dll)
  amount: number;
  transDate?: string;     // YYYY-MM-DD
  memo?: string;
}): Promise<{ success: boolean; paymentId?: number }> {
  try {
    const trans_date = params.transDate || new Date().toISOString().split("T")[0];
    const body = {
      trans_date,
      bank_account_id: params.bankAccountId,
      business_tran_id: params.invoiceId,
      amount: params.amount,
      memo: params.memo || "",
    };
    const resp = await fetchWithTimeout(`${KLEDO_BASE}/bankTrans/invoicePayment`, {
      method: "POST",
      headers: kledoHeaders(),
      body: JSON.stringify(body),
    });
    const data = await resp.json() as { success: boolean; data?: { id: number }; message?: string };
    if (data.success && data.data?.id) {
      return { success: true, paymentId: data.data.id };
    }
    logger.error({ data, body }, "Kledo invoice payment failed");
    return { success: false };
  } catch (err) {
    logger.error({ err }, "payInvoiceKledo error");
    return { success: false };
  }
}

export default router;
