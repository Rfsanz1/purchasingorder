import { Router, type IRouter, type Request } from "express";
import { SubmitOrderBody } from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { randomUUID, randomBytes } from "crypto";
import { logger } from "../lib/logger";
import { fetchWithTimeout } from "../lib/httpFetch";
import {
  findOrCreateKledoContact,
  createKledoInvoice,
  searchKledoProductByName,
  payInvoiceKledo,
  uploadKledoInvoiceAttachment,
  type KledoInvoiceItem,
} from "./kledo";
import { getSetting } from "./appSettings";

// Build URL public yang bisa dibuka customer dari HP-nya.
// Prioritas: PUBLIC_APP_URL (production) → REPLIT_DEV_DOMAIN (dev) → header host (fallback)
function buildPublicUrl(req: Request, path: string): string {
  const explicit = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return `${explicit}${path}`;
  const replit = process.env.REPLIT_DEV_DOMAIN;
  if (replit) return `https://${replit}${path}`;
  const proto =
    (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}${path}`;
}

// Akun Kledo untuk auto-lunas
const KLEDO_KAS_ELEKTRONIK = 1;
const KLEDO_KAS_SULAWESI = 1466;

// ID kategori produk Kledo yang dianggap ELEKTRONIK
// (sama dengan daftar di event-registration/src/lib/salesFilters.ts)
const ELEKTRONIK_CATEGORY_IDS = new Set<number>([
  3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 17, 21, 22, 23, 29, 35, 36, 37, 38,
  42, 44, 45, 74, 75, 77, 78, 80, 98, 102, 110, 120, 130, 131, 138, 141, 142,
  143, 144, 145,
]);

// Daftar keyword nama produk yang dianggap ELEKTRONIK — dipakai sebagai
// fallback kalau item tidak punya kategoriId (mis. produk diketik manual
// tanpa pilih dari dropdown Kledo, atau produk Kledo belum di-set kategorinya).
// Diturunkan dari nama-nama kategori Kledo di ELEKTRONIK_CATEGORY_IDS di atas.
const ELEKTRONIK_NAME_KEYWORDS: readonly string[] = [
  "antena",
  "parabola",
  "set top box",
  "receiver",
  "tv",
  "television",
  "kulkas",
  "refrigerator",
  "freezer",
  "showcase",
  "display cooler",
  "chest freezer",
  "mesin cuci",
  "washing machine",
  "dispenser",
  "air purifier",
  "penjernih udara",
  "vacuum cleaner",
  "vacum cleaner",
  "cooker hood",
  "dish washer",
  "dishwasher",
  "oven",
  "microwave",
  "panggang listrik",
  "air fryer",
  "slow cooker",
  "water heater",
  "pemanas air",
  "kipas angin",
  "exhaust fan",
  "air cooler",
  "blender",
  "mixer",
  "chopper",
  "juicer",
  "magicom",
  "magic com",
  "magic jar",
  "rice cooker",
  "setrika",
  "hair dryer",
  "hair dyer",
  "ac ",
  "air conditioner",
  " ac", // " ac" + "ac " untuk hindari false-match kata "achmad" dsb.
  "speaker",
  "radio",
  "mic ",
  "microphone",
  "kompor",
  "cup sealer",
  "pest control",
];

// Daftar keyword nama produk yang dianggap BAHAN BANGUNAN — fallback yang
// mirroring ELEKTRONIK_NAME_KEYWORDS di atas. Mencakup material toko bangunan
// umum di Indonesia: semen, cat, kayu, pipa, keramik, dsb.
const BAHAN_BANGUNAN_NAME_KEYWORDS: readonly string[] = [
  "semen",
  "cement",
  "mortar",
  "pasir",
  "kerikil",
  "split",
  "batu",
  "bata",
  "batako",
  "hebel",
  "celcon",
  "paku",
  "skrup",
  "sekrup",
  "screw",
  "mur",
  "baut",
  "ring",
  "kawat",
  "wire mesh",
  "wiremesh",
  "besi",
  "baja",
  "plat",
  "siku",
  "hollow",
  "cnp",
  "unp",
  "pipa",
  "gypsum",
  "gipsum",
  "plafon",
  "triplek",
  "plywood",
  "kayu",
  "balok",
  "papan",
  "lis ",
  "profil",
  "cat ",
  "paint",
  "tinner",
  "thinner",
  "dempul",
  "plamir",
  "plamur",
  "lem ",
  "glue",
  "epoxy",
  "sealant",
  "silikon",
  "silicone",
  "kaca ",
  "cermin",
  "keramik",
  "granit",
  "marmer",
  "tile",
  "ubin",
  "pipa pvc",
  " pvc",
  "pralon",
  "selang",
  "genteng",
  "asbes",
  "atap",
  "spandek",
  "galvalum",
  "polycarbonate",
  "kunci",
  "engsel",
  "gembok",
  "handle ",
  "pegangan",
  "kran",
  "keran",
  "faucet",
  "shower",
  "kloset",
  "closet",
  "wastafel",
  "westafel",
  "washtafel",
  "pintu",
  "jendela",
  "kusen",
  "kasement",
  "rolling door",
  "sealer",
  "waterproof",
  "waterproofing",
  "kabel",
  "stop kontak",
  "saklar",
  "fitting",
  "mcb",
  "lampu", // lampu = bisa di kedua sisi tapi sering bahan bangunan
];

function nameMatch(nama: string, keywords: readonly string[]): boolean {
  const n = ` ${nama.toLowerCase().trim()} `; // padding spasi supaya " ac " bisa match
  return keywords.some((k) => n.includes(k));
}

// Klasifikasi 1 item: elektronik / bahan bangunan / unknown.
// Aturan: kategoriId Kledo = sumber kebenaran utama (paling akurat).
//        Kalau tidak ada kategoriId, coba keyword nama produk: elektronik
//        dulu (lebih spesifik), lalu bahan bangunan. Hanya benar-benar
//        "unknown" kalau kedua daftar keyword tidak ada yang nempel.
function klasifikasiItem(
  catId: number | null,
  nama: string,
): "Elektronik" | "BahanBangunan" | "unknown" {
  if (catId !== null) {
    return ELEKTRONIK_CATEGORY_IDS.has(catId) ? "Elektronik" : "BahanBangunan";
  }
  if (nameMatch(nama, ELEKTRONIK_NAME_KEYWORDS)) return "Elektronik";
  if (nameMatch(nama, BAHAN_BANGUNAN_NAME_KEYWORDS)) return "BahanBangunan";
  return "unknown";
}

// Daftar bank rekening transfer + EDC yang dipakai untuk display info di WA
const BANK_INFO: Record<
  number,
  { name: string; rekening: string; atasNama: string }
> = {
  1470: {
    name: "BCA GIRO",
    rekening: "155 91 99999",
    atasNama: "INDARTO WIBOWO",
  },
  3: { name: "MANDIRI", rekening: "136 000 4780612", atasNama: "DIAN PURNAMA" },
  1456: { name: "BNI", rekening: "0822 705 836", atasNama: "INDARTO WIBOWO" },
  1464: {
    name: "BRI",
    rekening: "0262 01 000031 562",
    atasNama: "DIAN PURNAMA REZA T.",
  },
  1465: { name: "BCA EDC", rekening: "(EDC mesin di toko)", atasNama: "-" },
  1457: { name: "BRI EDC", rekening: "(EDC mesin di toko)", atasNama: "-" },
};

const SALES_PHONE: Record<string, string> = {
  LEHAN: "+62 857-2982-4485",
  AGUS: "+62 857-3084-5708",
  IVAN: "+62 857-1820-0975",
  DIAS: "+62 852-2996-0722",
  "RIO BRANDON": "+62 859-5282-5277",
  IMAM: "+62 858-9233-3127",
  AGUNG: "+62 882-3368-4224",
  ANDRE: "+62 821-3763-3912",
  PRIYANTO: "+62 823-3479-2357",
  WIWIT: "+62 857-4115-6110",
  WIWID: "+62 857-4115-6110",
  DHANI: "+62 812-1599-2058",
};

const router: IRouter = Router();

function formatRupiah(num: number): string {
  return num.toLocaleString("id-ID");
}

// === Multi-metode pembayaran helpers ===
type SplitMethod = "CASH" | "Transfer" | "Debit" | "BelumBayar";
interface PaymentSplit {
  method: SplitMethod;
  amount: number; // Rp dibayar untuk split ini (0 untuk BelumBayar)
  bankAccountId?: number | null; // bank Kledo (Transfer/Debit). null/undefined untuk CASH/BelumBayar
}

// Bersihkan & normalisasi splits dari body request. Buang yg invalid; clamp amount jadi integer non-negatif.
function normalizeSplits(raw: unknown): PaymentSplit[] {
  if (!Array.isArray(raw)) return [];
  const out: PaymentSplit[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const method = String(o.method ?? "");
    if (!["CASH", "Transfer", "Debit", "BelumBayar"].includes(method)) continue;
    const amount = Math.max(0, Math.floor(Number(o.amount) || 0));
    const bankAccountId =
      typeof o.bankAccountId === "number" && o.bankAccountId > 0
        ? o.bankAccountId
        : null;
    out.push({ method: method as SplitMethod, amount, bankAccountId });
  }
  return out;
}

// Hitung ringkasan dari splits: metodePembayaran summary, dpAmount (yg dibayar sekarang), sisa (belum bayar).
function summarizeSplits(
  splits: PaymentSplit[],
  totalHarga: number,
): {
  metodePembayaran: string;
  dpAmount: number;
  sisaPembayaran: number;
} {
  const paying = splits.filter(
    (s) => s.method !== "BelumBayar" && s.amount > 0,
  );
  const dpAmount = paying.reduce((s, x) => s + x.amount, 0);
  const sisaPembayaran = Math.max(0, totalHarga - dpAmount);
  let metodePembayaran: string;
  if (paying.length === 0) metodePembayaran = "BelumBayar";
  else if (sisaPembayaran > 0) metodePembayaran = "DP";
  else if (paying.length === 1) metodePembayaran = paying[0].method;
  else metodePembayaran = "Multi";
  return { metodePembayaran, dpAmount, sisaPembayaran };
}

function cleanPhoneNumber(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  if (cleaned.startsWith("62")) return cleaned;
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("8")) return "62" + cleaned;
  return null;
}

async function kirimWA(
  target: string,
  message: string,
  options: {
    button?: string;
    footer?: string;
    file?: { buffer: Buffer; filename: string; mime: string };
    /**
     * URL public dari file (foto/dokumen) yang mau dikirim. Fonnte akan
     * fetch sendiri dari URL ini. Lebih andal daripada upload multipart
     * binary, jadi dipakai untuk forward bukti transfer ke grup WA.
     */
    fileUrl?: string;
  } = {},
): Promise<boolean> {
  // Pilih token berdasarkan target. Sumber nilai prioritas:
  //   1) Database (di-set lewat halaman Settings di admin)
  //   2) Environment variable (FONNTE_TOKEN_GROUP / _CUSTOMER / FONNTE_TOKEN)
  // - Target ID grup (berakhir "@g.us") → pakai token GROUP (mis. device 081225804632).
  // - Target nomor HP customer → pakai token CUSTOMER (mis. device 085603590049).
  const isGroupTarget = target.endsWith("@g.us");
  const token = await getSetting(
    isGroupTarget ? "fonnteTokenGroup" : "fonnteTokenCustomer",
  );
  if (!token) {
    logger.warn(
      { isGroupTarget, target },
      "Fonnte token not set untuk target ini, skipping WA notification",
    );
    return false;
  }
  try {
    const res = await fetchWithTimeout("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token },
      body: (() => {
        const fd = new FormData();
        fd.append("target", target);
        fd.append("message", message);
        if (options.button) fd.append("button", options.button);
        if (options.footer) fd.append("footer", options.footer);
        if (options.fileUrl) {
          // Cara paling andal: kirim URL — Fonnte yang akan fetch fotonya.
          // Multipart binary upload sering tidak terbaca sebagai gambar.
          fd.append("url", options.fileUrl);
        } else if (options.file) {
          // Fallback: upload binary lewat multipart (dipakai endpoint
          // foto driver yang belum diarsip ke DB). Pakai File supaya
          // nama file + ekstensi tetap dikirim dengan benar.
          fd.append(
            "file",
            new File(
              [new Uint8Array(options.file.buffer)],
              options.file.filename,
              { type: options.file.mime },
            ),
          );
        }
        return fd;
      })(),
    });
    const text = await res.text();
    logger.info(
      { target, status: res.status, response: text },
      "Fonnte WA sent",
    );
    return res.ok;
  } catch (err) {
    logger.error({ err, target }, "Failed to send WA via Fonnte");
    return false;
  }
}

// GET /orders — daftar semua order (halaman admin).
// Catatan: kolom buktiTransferData (base64 foto, bisa ratusan KB per row)
// SENGAJA tidak ikut diambil di list — cukup expose flag boolean
// `hasBuktiTf`. Foto bukti tf diambil terpisah lewat
// /orders/:orderId/bukti-tf supaya halaman admin tetap ringan walau
// jumlah order sudah banyak.
router.get("/orders", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: ordersTable.id,
      orderId: ordersTable.orderId,
      namaKontak: ordersTable.namaKontak,
      nomorTelepon: ordersTable.nomorTelepon,
      alamat: ordersTable.alamat,
      patokanLokasi: ordersTable.patokanLokasi,
      namaProduk: ordersTable.namaProduk,
      jumlahProduk: ordersTable.jumlahProduk,
      hargaProduk: ordersTable.hargaProduk,
      biayaPengiriman: ordersTable.biayaPengiriman,
      totalHarga: ordersTable.totalHarga,
      salesPerson: ordersTable.salesPerson,
      metodePembayaran: ordersTable.metodePembayaran,
      keteranganPembayaran: ordersTable.keteranganPembayaran,
      whatsappSent: ordersTable.whatsappSent,
      statusPengiriman: ordersTable.statusPengiriman,
      driverName: ordersTable.driverName,
      metodePengiriman: ordersTable.metodePengiriman,
      kategoriProduk: ordersTable.kategoriProduk,
      createdAt: ordersTable.createdAt,
      // Cuma flag — base64 fotonya di-serve terpisah lewat /orders/:orderId/bukti-tf
      hasBuktiTf: sql<boolean>`(${ordersTable.buktiTransferData} IS NOT NULL)`,
    })
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));
  res.json(rows);
});

// Helper: serve gambar base64 sebagai response image/* (dipakai oleh
// dua endpoint di bawah — bukti TF tunggal & bukti TF per index untuk
// order multi-Transfer).
function sendBase64Image(res: import("express").Response, data: string): void {
  const m = data.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  const mime = m ? m[1] : "image/jpeg";
  const b64 = m ? m[2] : data;
  const buffer = Buffer.from(b64, "base64");
  res.setHeader("Content-Type", mime);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("Content-Length", String(buffer.length));
  res.end(buffer);
}

// GET /orders/:orderId/bukti-tf — bukti TF tunggal (order single-Transfer / lama).
// Endpoint ini PUBLIC (tanpa auth) supaya Fonnte bisa fetch fotonya dari URL ini
// dan melampirkan ke pesan WA grup. Untuk order multi-Transfer pakai
// endpoint `/bukti-tf/:index` di bawah.
router.get("/orders/:orderId/bukti-tf", async (req, res): Promise<void> => {
  const { orderId } = req.params;
  if (!orderId || typeof orderId !== "string") {
    res.status(400).send("orderId tidak valid");
    return;
  }
  const rows = await db
    .select({
      data: ordersTable.buktiTransferData,
      list: ordersTable.buktiTransferList,
    })
    .from(ordersTable)
    .where(eq(ordersTable.orderId, orderId))
    .limit(1);
  // Kalau order baru pakai list, ambil index 0 dari list dulu.
  // Kalau tidak ada list, fallback ke kolom lama buktiTransferData.
  let data = rows[0]?.data ?? null;
  if (rows[0]?.list) {
    try {
      const arr = JSON.parse(rows[0].list) as string[];
      if (Array.isArray(arr) && arr.length > 0) data = arr[0];
    } catch {
      /* abaikan parse error, fallback ke data */
    }
  }
  if (!data) {
    res.status(404).send("Bukti transfer tidak ditemukan");
    return;
  }
  sendBase64Image(res, data);
});

// GET /orders/:orderId/bukti-tf/:index — bukti TF ke-N untuk order multi-Transfer.
router.get(
  "/orders/:orderId/bukti-tf/:index",
  async (req, res): Promise<void> => {
    const { orderId, index } = req.params;
    const idx = Number(index);
    if (!orderId || !Number.isInteger(idx) || idx < 0) {
      res.status(400).send("Parameter tidak valid");
      return;
    }
    const rows = await db
      .select({
        list: ordersTable.buktiTransferList,
        data: ordersTable.buktiTransferData,
      })
      .from(ordersTable)
      .where(eq(ordersTable.orderId, orderId))
      .limit(1);
    if (rows.length === 0) {
      res.status(404).send("Order tidak ditemukan");
      return;
    }

    // Coba list dulu, fallback ke kolom lama (hanya valid untuk index 0)
    let data: string | null = null;
    if (rows[0].list) {
      try {
        const arr = JSON.parse(rows[0].list) as string[];
        if (Array.isArray(arr) && idx < arr.length) data = arr[idx];
      } catch {
        /* abaikan */
      }
    }
    if (!data && idx === 0) data = rows[0].data ?? null;
    if (!data) {
      res.status(404).send("Bukti transfer tidak ditemukan");
      return;
    }
    sendBase64Image(res, data);
  },
);

// DELETE /orders/:id — hapus order (untuk transaksi yang batal)
router.delete("/orders/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ ok: false, error: "ID order tidak valid" });
    return;
  }
  const existing = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: "Order tidak ditemukan" });
    return;
  }
  await db.delete(ordersTable).where(eq(ordersTable.id, id));
  logger.info({ orderId: existing[0].orderId, id }, "Order deleted by admin");
  res.json({ ok: true, deleted: existing[0].orderId });
});

// POST /orders — terima order baru
router.post("/orders", async (req, res): Promise<void> => {
  // Proses items array jika ada (multi-produk)
  interface RawItem {
    namaProduk: string;
    jumlahProduk: number;
    hargaProduk: number;
    kledoProductId?: number;
    kledoFinanceAccountId?: number;
    kledoUnitId?: number;
    kategoriId?: number | null;
  }
  const rawItems: RawItem[] = Array.isArray(req.body.items)
    ? req.body.items
    : [];

  // === Multi-metode pembayaran (split + DP) ===
  // paymentSplits: array of { method, amount, bankAccountId? }. Optional —
  // jika tidak dikirim (client lama), fallback ke single-method dari kledoBankAccountId + buktiTransferBase64.
  // buktiTfList: array base64 data URL, urutannya searah dengan urutan Transfer di paymentSplits.
  const rawSplits = req.body.paymentSplits;
  const rawBuktiTfList: unknown = req.body.buktiTfList;
  const buktiTfList: string[] = Array.isArray(rawBuktiTfList)
    ? rawBuktiTfList.filter(
        (s): s is string => typeof s === "string" && s.length > 0,
      )
    : [];

  // Fallback fields untuk client lama (single-method): kledoBankAccountId + buktiTransferBase64
  const kledoBankAccountIdFallback: number | null =
    typeof req.body.kledoBankAccountId === "number"
      ? req.body.kledoBankAccountId
      : null;
  const buktiTransferBase64Fallback: string | null =
    typeof req.body.buktiTransferBase64 === "string" &&
    req.body.buktiTransferBase64.length > 0
      ? req.body.buktiTransferBase64
      : null;

  let bodyToValidate = req.body;
  if (rawItems.length > 0) {
    const totalQty = rawItems.reduce(
      (s, i) => s + (Number(i.jumlahProduk) || 1),
      0,
    );
    const totalProductPrice = rawItems.reduce(
      (s, i) =>
        s + (Number(i.hargaProduk) || 0) * (Number(i.jumlahProduk) || 1),
      0,
    );
    const namaProduk =
      rawItems.length === 1
        ? rawItems[0].namaProduk
        : rawItems
            .map(
              (it, idx) =>
                `${idx + 1}. ${it.namaProduk} (${it.jumlahProduk}x @ Rp ${formatRupiah(Number(it.hargaProduk))})`,
            )
            .join("\n");
    bodyToValidate = {
      ...req.body,
      namaProduk,
      jumlahProduk: totalQty,
      hargaProduk: totalProductPrice,
    };
  }

  const parsed = SubmitOrderBody.safeParse(bodyToValidate);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const d = parsed.data;
  const orderId = randomUUID().slice(0, 8).toUpperCase();
  // Token unik untuk link "Bagikan Lokasi" yang dikirim ke customer di WA
  const customerLocToken = randomBytes(12).toString("base64url");
  const namaToko = process.env.NAMA_TOKO ?? "Toko Kami";
  // Grup WA tujuan notifikasi order baru (form purchase order).
  // Hard-coded ke grup "Order Form Masuk".
  // ID grup Invoice — bisa di-set lewat halaman Settings, fallback ke env
  // FONNTE_GROUP_INVOICE, fallback ke ID hard-coded "Order Form Masuk".
  const adminWA =
    (await getSetting("grupInvoiceId")) ?? "120363405869453556@g.us";
  const ongkir = d.biayaPengiriman ?? 0;
  // Untuk multi-item: hargaProduk sudah berisi total semua line (qty × price terjumlah)
  // jadi tidak perlu dikalikan lagi dengan jumlahProduk.
  const subtotalProduk =
    rawItems.length > 0 ? d.hargaProduk : d.hargaProduk * d.jumlahProduk;
  const total = subtotalProduk + ongkir;

  // === Resolusi paymentSplits ===
  // 1. Jika client mengirim paymentSplits → pakai itu (mode multi-metode / DP).
  // 2. Jika tidak → bangun 1-element split dari metodePembayaran tunggal (backward compat).
  let paymentSplits: PaymentSplit[] = normalizeSplits(rawSplits);
  if (paymentSplits.length === 0) {
    // Fallback single-method: build 1 split. Untuk Transfer/Debit tanpa bukti TF,
    // tetap masuk sebagai split (amount=total) supaya summary konsisten.
    if (d.metodePembayaran === "BelumBayar") {
      paymentSplits = [{ method: "BelumBayar", amount: 0 }];
    } else {
      paymentSplits = [
        {
          method: d.metodePembayaran,
          amount: total,
          bankAccountId: kledoBankAccountIdFallback,
        },
      ];
    }
  }
  const {
    metodePembayaran: metodeSummary,
    dpAmount,
    sisaPembayaran,
  } = summarizeSplits(paymentSplits, total);

  // Susun list bukti TF: indeks searah dgn urutan Transfer di paymentSplits.
  // Kalau client kirim list eksplisit (multi-Transfer), pakai itu. Kalau tidak,
  // dan ada single-Transfer dgn buktiTransferBase64, pakai itu sebagai 1-element list.
  let buktiTfListFinal: string[] = buktiTfList;
  if (
    buktiTfListFinal.length === 0 &&
    buktiTransferBase64Fallback &&
    paymentSplits.some((s) => s.method === "Transfer")
  ) {
    buktiTfListFinal = [buktiTransferBase64Fallback];
  }
  // Sinkronkan panjang list dgn jumlah Transfer split: pad dengan "" supaya index match.
  const numTransferSplits = paymentSplits.filter(
    (s) => s.method === "Transfer",
  ).length;
  while (buktiTfListFinal.length < numTransferSplits) buktiTfListFinal.push("");

  // Untuk backward-compat kolom buktiTransferData (tunggal): pakai bukti TF pertama jika ada.
  const buktiTransferDataLegacy =
    buktiTfListFinal.find((s) => s && s.length > 0) ??
    buktiTransferBase64Fallback ??
    null;

  // === Tentukan metode pengiriman & status awal ===
  // "BawaSendiri" → status langsung "Selesai" (customer ambil sendiri di toko)
  // "Dikirim" (default) → status "Menunggu" (perlu di-assign driver)
  const metodePengiriman: "Dikirim" | "BawaSendiri" =
    d.metodePengiriman === "BawaSendiri" ? "BawaSendiri" : "Dikirim";
  const statusAwal =
    metodePengiriman === "BawaSendiri" ? "Selesai" : "Menunggu";

  // === Tentukan kategori produk untuk pemisahan tampilan admin ===
  // Aturan: per item, klasifikasi pakai kategoriId Kledo dulu (paling akurat).
  // Kalau kategoriId tidak ada (mis. produk diketik manual / belum di-set
  // kategori di Kledo), fallback ke keyword nama produk. Semua "unknown"
  // diabaikan supaya tidak salah masuk tab BahanBangunan secara default.
  const itemsForKategori = rawItems.length > 0 ? rawItems : [];
  let adaElektronik = false;
  let adaBahanBangunan = false;
  for (const it of itemsForKategori) {
    const catId = typeof it.kategoriId === "number" ? it.kategoriId : null;
    const klas = klasifikasiItem(catId, it.namaProduk || "");
    if (klas === "Elektronik") adaElektronik = true;
    if (klas === "BahanBangunan") adaBahanBangunan = true;
  }
  // Jika sama sekali tidak bisa diklasifikasi (semua "unknown"), default ke
  // BahanBangunan supaya order tetap muncul di salah satu tab admin.
  const kategoriProduk: "Elektronik" | "BahanBangunan" | "Campuran" =
    adaElektronik && adaBahanBangunan
      ? "Campuran"
      : adaElektronik
        ? "Elektronik"
        : adaBahanBangunan
          ? "BahanBangunan"
          : "BahanBangunan";

  req.log.info(
    { orderId, namaKontak: d.namaKontak, metodePengiriman, kategoriProduk },
    "New purchase order received",
  );

  // Simpan ke database
  try {
    await db.insert(ordersTable).values({
      orderId,
      namaKontak: d.namaKontak,
      nomorTelepon: d.nomorTelepon,
      alamat: d.alamat,
      patokanLokasi: d.patokanLokasi,
      namaProduk: d.namaProduk,
      jumlahProduk: d.jumlahProduk,
      hargaProduk: d.hargaProduk,
      biayaPengiriman: d.biayaPengiriman ?? null,
      totalHarga: total,
      salesPerson: d.salesPerson,
      // metodePembayaran disimpan sebagai SUMMARY (CASH / Transfer / Debit / DP / Multi / BelumBayar)
      // supaya filter & badge admin tetap kompak. Detail per-metode disimpan di paymentSplits.
      metodePembayaran: metodeSummary,
      keteranganPembayaran: d.keteranganPembayaran ?? null,
      whatsappSent: "false",
      statusPengiriman: statusAwal,
      metodePengiriman,
      kategoriProduk,
      customerLocToken,
      buktiTransferData: buktiTransferDataLegacy,
      // Multi-metode + DP fields
      paymentSplits: JSON.stringify(paymentSplits),
      buktiTransferList:
        buktiTfListFinal.length > 0 ? JSON.stringify(buktiTfListFinal) : null,
      dpAmount,
      sisaPembayaran,
    });
  } catch (dbErr: unknown) {
    const cause =
      dbErr instanceof Error ? (dbErr.cause as Error | undefined) : undefined;
    req.log.error(
      {
        dbErr,
        cause,
        code: (cause as { code?: string })?.code,
        detail: (cause as { detail?: string })?.detail,
      },
      "DB insert failed",
    );
    res
      .status(500)
      .json({ success: false, error: "Gagal menyimpan order ke database" });
    return;
  }

  // === Balas browser SECEPATNYA setelah data tersimpan ===
  // WhatsApp + Kledo + forward bukti TF dijalankan di background supaya
  // koneksi tidak menggantung saat layanan luar lambat (penyebab utama
  // "koneksi terputus" di sisi user).
  res.status(201).json({
    success: true,
    message:
      "Order berhasil dikirim! Notifikasi WA & invoice Kledo sedang diproses.",
    orderId,
    pending: { whatsapp: true, kledo: Boolean(process.env.KLEDO_TOKEN) },
  });

  // === Bangun blok rincian split + info rekening (multi-Transfer aware) ===
  // Untuk tiap Transfer split tampilkan bank tujuannya. Cocok untuk DP +
  // multi-metode (mis. CASH 100rb + Transfer BCA 200rb).
  const transferSplits = paymentSplits.filter((s) => s.method === "Transfer");
  const uniqueTransferBanks = Array.from(
    new Set(
      transferSplits
        .map((s) => s.bankAccountId)
        .filter((b): b is number => typeof b === "number" && b > 0),
    ),
  );
  const adaBuktiTfTerlampir = buktiTfListFinal.some((s) => s && s.length > 0);
  const infoRekening =
    uniqueTransferBanks.length > 0
      ? `\n🏦 *Rekening Pembayaran*\n` +
        (uniqueTransferBanks.length === 1
          ? `Silahkan transfer ke rekening berikut:\n\n`
          : `Silahkan transfer ke rekening berikut (kalau split, transfer sesuai pembagiannya):\n\n`) +
        uniqueTransferBanks
          .map((id) => {
            const b = BANK_INFO[id];
            return b
              ? `• *${b.name}*\n  ${b.rekening}\n  a.n. ${b.atasNama}`
              : `• Bank ID ${id}`;
          })
          .join("\n") +
        `\n` +
        (adaBuktiTfTerlampir
          ? `\n_(Bukti transfer sudah kami terima ✅)_\n`
          : "")
      : "";

  // Helper format nama metode untuk pesan WA
  const labelMetode = (m: SplitMethod): string =>
    m === "BelumBayar" ? "Belum Bayar" : m;

  // Blok rincian pembayaran per split (untuk pesan customer & admin)
  const blokRincianPembayaran =
    paymentSplits.length > 1 || sisaPembayaran > 0
      ? `\n💰 *Rincian Pembayaran:*\n` +
        paymentSplits
          .filter((s) => s.method !== "BelumBayar" && s.amount > 0)
          .map((s) => {
            const bankInfo = s.bankAccountId
              ? BANK_INFO[s.bankAccountId]
              : null;
            const bankLabel = bankInfo ? ` – ${bankInfo.name}` : "";
            return `• ${labelMetode(s.method)}${bankLabel}: Rp ${formatRupiah(s.amount)}`;
          })
          .join("\n") +
        (sisaPembayaran > 0
          ? `\n• ⏳ *Belum Bayar (sisa): Rp ${formatRupiah(sisaPembayaran)}*`
          : "") +
        `\n`
      : "";

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Link "Bagikan Lokasi" — customer cukup tap link ini di WA, lalu pencet
  // tombol di halaman yang terbuka untuk mengirim koordinat GPS ke driver kami.
  const locationShareUrl = buildPublicUrl(req, `/loc/${customerLocToken}`);
  const blokBagikanLokasi =
    metodePengiriman === "Dikirim"
      ? `\n📍 *Bagikan Lokasi Anda*\n` +
        `Agar driver kami mudah menemukan rumah Anda, mohon bagikan titik lokasi GPS Anda dengan menekan link berikut:\n` +
        `👉 ${locationShareUrl}\n\n` +
        `_(Cukup buka link, lalu tekan tombol "Bagikan Lokasi Saya" — sangat membantu driver kami 🙏)_\n`
      : "";

  // Penanda DP / Lunas / Belum Bayar
  const statusBayarLabel =
    sisaPembayaran > 0 && dpAmount > 0
      ? `🟡 *DP Diterima:* Rp ${formatRupiah(dpAmount)} (sisa Rp ${formatRupiah(sisaPembayaran)} ditagih kemudian)`
      : sisaPembayaran > 0
        ? `⏳ *Status Pembayaran:* Belum Bayar (Rp ${formatRupiah(total)})`
        : `✅ *Status Pembayaran:* Lunas`;

  const pesanPelanggan =
    `Halo Kak 👋\n\n` +
    `Terima kasih sudah mengisi form Purchase Order Customer 🙏\n\n` +
    `Pesanan Kakak sudah kami terima dan saat ini sedang diproses oleh tim kami. Berikut ringkasan pesanan Kakak:\n\n` +
    `📦 *Nama Produk:* ${d.namaProduk}\n` +
    `🔢 *Jumlah:* ${d.jumlahProduk} unit\n` +
    `💰 *Harga:* Rp ${formatRupiah(d.hargaProduk)}\n` +
    (ongkir ? `🚚 *Ongkir:* Rp ${formatRupiah(ongkir)}\n` : "") +
    `📍 *Alamat:* ${d.alamat}` +
    (d.patokanLokasi ? ` – ${d.patokanLokasi}` : "") +
    `\n\n` +
    `💳 *Total Pembayaran: Rp ${formatRupiah(total)}*\n` +
    blokRincianPembayaran +
    `${statusBayarLabel}\n` +
    infoRekening +
    blokBagikanLokasi +
    (sisaPembayaran > 0
      ? `\nMohon lakukan pelunasan sisa pembayaran sesuai kesepakatan ya 🙏\n`
      : `\nPesanan Kakak sudah lunas, kami akan segera memproses ya 🙏\n`) +
    `_(Jika ada bukti transfer tambahan, mohon kirim ke chat ini)_\n\n` +
    `Jika ada pertanyaan, jangan ragu untuk menghubungi kami 😊\n\n` +
    `Terima kasih atas kepercayaannya 🙌`;

  // Untuk admin: tampilkan summary metode di header + breakdown lengkap di body
  const labelStatusBayarAdmin =
    sisaPembayaran > 0 && dpAmount > 0
      ? `DP Rp ${formatRupiah(dpAmount)} (sisa Rp ${formatRupiah(sisaPembayaran)})`
      : sisaPembayaran > 0
        ? `Belum Bayar`
        : paymentSplits.length > 1
          ? `Lunas (Multi)`
          : `Lunas (${labelMetode(paymentSplits[0]?.method ?? "BelumBayar")})`;

  const pesanAdmin =
    `🔔 *Order masuk bossku!* 👀\n\n` +
    `📌 *Customer:*\n` +
    `${d.namaKontak} – ${d.nomorTelepon}\n\n` +
    `📍 *Alamat:* ${d.alamat}\n` +
    (d.patokanLokasi ? `🏠 *Patokan:* ${d.patokanLokasi}\n` : "") +
    `\n📦 *Pesanan:*\n` +
    `${d.namaProduk} x ${d.jumlahProduk} unit\n\n` +
    `💰 *Total: Rp ${formatRupiah(total)}*` +
    (ongkir ? ` (Ongkir: Rp ${formatRupiah(ongkir)})` : "") +
    `\n` +
    `💳 Pembayaran: ${labelStatusBayarAdmin}` +
    (transferSplits.length > 0
      ? adaBuktiTfTerlampir
        ? ` ✅ (${buktiTfListFinal.filter((s) => s && s.length > 0).length} bukti TF terlampir)`
        : ` ⏳ (belum ada bukti TF)`
      : "") +
    (d.keteranganPembayaran ? ` – ${d.keteranganPembayaran}` : "") +
    `\n` +
    blokRincianPembayaran +
    `\n👨‍💼 *Sales:* ${d.salesPerson}\n\n` +
    `⚡ Yuk langsung di-follow up sebelum dia keburu cancel 😄\n\n` +
    `🕒 ${timestamp}`;

  // === Background: WA + Kledo + forward bukti TF ===
  // Browser sudah dibalas di atas. Semua kerja ke layanan luar dijalankan
  // di sini supaya kalau Fonnte/Kledo lambat tidak menyebabkan koneksi
  // browser putus. Setiap helper sudah punya try/catch + fetch timeout
  // sendiri, dan kita bungkus lagi dengan try/catch luar untuk jaga-jaga.
  void (async () => {
    try {
      let whatsappSent = false;

      const nomorPelanggan = cleanPhoneNumber(d.nomorTelepon);
      if (nomorPelanggan) {
        const sent = await kirimWA(nomorPelanggan, pesanPelanggan);
        whatsappSent = sent;
      }

      if (adminWA) {
        await kirimWA(adminWA, pesanAdmin, {
          button:
            "✅ Siap meluncur bossku!,📞 Hubungi customer,⏳ Follow up nanti",
          footer: `Order #${orderId} – ${d.salesPerson}`,
        });
        whatsappSent = true;
      }

      // Update status WA di database
      await db
        .update(ordersTable)
        .set({ whatsappSent: whatsappSent ? "true" : "false" })
        .where(eq(ordersTable.orderId, orderId));

      // Buat invoice di Kledo
      let kledoInvoiceId: number | undefined;
      let kledoInvoiceNumber: string | undefined;

      // Susun daftar item untuk Kledo — jika kledoProductId tidak ada, cari otomatis by nama
      if (process.env.KLEDO_TOKEN) {
        try {
          const sourceItems: RawItem[] =
            rawItems.length > 0
              ? rawItems
              : [
                  {
                    namaProduk: d.namaProduk,
                    jumlahProduk: d.jumlahProduk,
                    hargaProduk: d.hargaProduk,
                    kledoProductId:
                      typeof req.body.kledoProductId === "number"
                        ? req.body.kledoProductId
                        : undefined,
                    kledoFinanceAccountId:
                      typeof req.body.kledoFinanceAccountId === "number"
                        ? req.body.kledoFinanceAccountId
                        : undefined,
                    kledoUnitId:
                      typeof req.body.kledoUnitId === "number"
                        ? req.body.kledoUnitId
                        : undefined,
                    kategoriId:
                      typeof req.body.kategoriId === "number"
                        ? req.body.kategoriId
                        : null,
                  },
                ];

          const kledoItems: KledoInvoiceItem[] = (
            await Promise.all(
              sourceItems.map(async (i): Promise<KledoInvoiceItem | null> => {
                let productId =
                  typeof i.kledoProductId === "number" && i.kledoProductId > 0
                    ? i.kledoProductId
                    : null;
                let unitId =
                  typeof i.kledoUnitId === "number" && i.kledoUnitId > 0
                    ? i.kledoUnitId
                    : 73;

                // Kalau belum ada ID dari dropdown, cari otomatis di Kledo berdasarkan nama
                if (!productId && i.namaProduk?.trim()) {
                  const found = await searchKledoProductByName(
                    i.namaProduk.trim(),
                  );
                  if (found) {
                    productId = found.id;
                    unitId = found.unitId;
                    logger.info(
                      { namaProduk: i.namaProduk, productId },
                      "Produk Kledo ditemukan otomatis",
                    );
                  } else {
                    logger.warn(
                      { namaProduk: i.namaProduk },
                      "Produk tidak ditemukan di Kledo, item dilewati",
                    );
                    return null;
                  }
                }

                if (!productId) return null;
                return {
                  kledoProductId: productId,
                  kledoFinanceAccountId:
                    typeof i.kledoFinanceAccountId === "number"
                      ? i.kledoFinanceAccountId
                      : undefined,
                  kledoUnitId: unitId,
                  jumlahProduk: Number(i.jumlahProduk) || 1,
                  hargaProduk: Number(i.hargaProduk) || 0,
                };
              }),
            )
          ).filter((item): item is KledoInvoiceItem => item !== null);

          if (kledoItems.length > 0) {
            const contactId = await findOrCreateKledoContact(
              d.namaKontak,
              d.nomorTelepon,
              d.alamat,
            );
            if (contactId) {
              const salesPhone = SALES_PHONE[d.salesPerson.toUpperCase()] ?? "";
              const baseMemo = salesPhone
                ? `Sales: ${d.salesPerson} - ${salesPhone}`
                : `Sales: ${d.salesPerson}`;
              // Tambahkan label status pembayaran ke memo invoice Kledo supaya
              // status (BELUM BAYAR / DP / LUNAS) langsung kelihatan dari list
              // invoice Kledo tanpa harus buka detail.
              const allUnpaid = paymentSplits.every(
                (s) => s.method === "BelumBayar" || s.amount <= 0,
              );
              let statusMemo = "";
              if (allUnpaid) {
                statusMemo = " | BELUM BAYAR";
              } else if (sisaPembayaran > 0) {
                statusMemo = ` | DP Rp ${formatRupiah(dpAmount)} / Sisa Rp ${formatRupiah(sisaPembayaran)}`;
              } else {
                statusMemo = " | LUNAS";
              }
              const memo = baseMemo + statusMemo;
              const inv = await createKledoInvoice({
                contactId,
                orderId,
                items: kledoItems,
                biayaPengiriman: ongkir,
                memo,
                patokanLokasi: d.patokanLokasi,
              });
              if (inv.success && typeof inv.invoiceId === "number") {
                kledoInvoiceId = inv.invoiceId;
                kledoInvoiceNumber = inv.invoiceNumber;
                const invoiceIdSafe: number = inv.invoiceId;
                req.log.info(
                  { orderId, kledoInvoiceId, kledoInvoiceNumber },
                  "Kledo invoice created",
                );

                // === Upload bukti TF pertama sebagai attachment di INVOICE Kledo ===
                // Foto nempel di section "Attachment" pada halaman invoice Kledo,
                // bisa dibuka kapan saja dari dashboard. Ambil bukti pertama saja
                // (kalau ada >1, sisanya tetap di DB & terkirim ke grup WA terpisah).
                const firstBukti = buktiTfListFinal.find(
                  (b) => b && b.length > 0,
                );
                if (firstBukti) {
                  try {
                    await uploadKledoInvoiceAttachment(
                      invoiceIdSafe,
                      firstBukti,
                      `bukti-tf-order-${orderId}.jpg`,
                    );
                  } catch (attachErr) {
                    logger.error(
                      { attachErr, orderId, invoiceIdSafe },
                      "Upload bukti TF ke invoice Kledo gagal",
                    );
                  }
                }

                // === AUTO-CATAT PEMBAYARAN ke Kledo (multi-metode aware) ===
                // Loop tiap split (kecuali BelumBayar). Tiap CASH split tetap di-pecah
                // per kategori (Elektronik vs Bahan Bangunan), Transfer/Debit pakai
                // bankAccountId masing-masing. Transfer hanya dicatat kalau ada bukti TF.
                try {
                  const paymentMemo = `Order #${orderId} - ${d.salesPerson}`;
                  // Index Transfer split untuk match ke buktiTfListFinal (urutan sama)
                  let transferIdx = 0;
                  for (const split of paymentSplits) {
                    if (split.method === "BelumBayar" || split.amount <= 0)
                      continue;

                    if (split.method === "CASH") {
                      // Split CASH per kategori: bagi proporsional total order, lalu
                      // di-scale ke amount split ini. Untuk single-CASH (amount=total)
                      // hasilnya sama dengan logika lama.
                      let elektronikAmount = 0;
                      let lainnyaAmount = 0;
                      for (const it of sourceItems) {
                        const lineTotal =
                          (Number(it.hargaProduk) || 0) *
                          (Number(it.jumlahProduk) || 1);
                        const klas = klasifikasiItem(
                          typeof it.kategoriId === "number"
                            ? it.kategoriId
                            : null,
                          it.namaProduk || "",
                        );
                        if (klas === "Elektronik")
                          elektronikAmount += lineTotal;
                        else lainnyaAmount += lineTotal;
                      }
                      if (elektronikAmount > 0 && lainnyaAmount === 0)
                        elektronikAmount += ongkir;
                      else lainnyaAmount += ongkir;

                      // Scale ke amount split ini (proporsional thd total)
                      const totalKategori = elektronikAmount + lainnyaAmount;
                      const ratio =
                        totalKategori > 0 ? split.amount / totalKategori : 0;
                      const scaledElektronik = Math.round(
                        elektronikAmount * ratio,
                      );
                      const scaledLainnya = split.amount - scaledElektronik;
                      if (scaledElektronik > 0) {
                        await payInvoiceKledo({
                          invoiceId: invoiceIdSafe,
                          bankAccountId: KLEDO_KAS_ELEKTRONIK,
                          amount: scaledElektronik,
                          memo: `${paymentMemo} (CASH-Elektronik)`,
                        });
                      }
                      if (scaledLainnya > 0) {
                        await payInvoiceKledo({
                          invoiceId: invoiceIdSafe,
                          bankAccountId: KLEDO_KAS_SULAWESI,
                          amount: scaledLainnya,
                          memo: `${paymentMemo} (CASH-Bahan)`,
                        });
                      }
                    } else if (
                      split.method === "Debit" &&
                      split.bankAccountId
                    ) {
                      await payInvoiceKledo({
                        invoiceId: invoiceIdSafe,
                        bankAccountId: split.bankAccountId,
                        amount: split.amount,
                        memo: `${paymentMemo} (Debit)`,
                      });
                    } else if (
                      split.method === "Transfer" &&
                      split.bankAccountId
                    ) {
                      const buktiAda =
                        buktiTfListFinal[transferIdx] &&
                        buktiTfListFinal[transferIdx].length > 0;
                      transferIdx++;
                      if (buktiAda) {
                        // Transfer hanya auto-lunas jika ada bukti TF
                        await payInvoiceKledo({
                          invoiceId: invoiceIdSafe,
                          bankAccountId: split.bankAccountId,
                          amount: split.amount,
                          memo: `${paymentMemo} (Transfer)`,
                        });
                      }
                    }
                  }
                } catch (payErr) {
                  logger.error(
                    { payErr, orderId, kledoInvoiceId },
                    "Auto-lunas Kledo gagal — invoice tetap dibuat",
                  );
                }
              }
            }
          }
        } catch (err) {
          logger.error(
            { err, orderId },
            "Kledo invoice creation error — order tetap tersimpan",
          );
        }
      }

      // === Forward semua bukti transfer ke grup WA terpisah (multi-Transfer aware) ===
      // Loop tiap Transfer split yg punya bukti TF, kirim 1 pesan per foto ke grup.
      const grupBuktiTF =
        (await getSetting("grupBuktiTfId")) ?? "120363425112329389@g.us";
      if (grupBuktiTF) {
        let txIdx = 0;
        for (const split of paymentSplits) {
          if (split.method !== "Transfer") continue;
          const currentIdx = txIdx;
          txIdx++;
          const buktiAda =
            buktiTfListFinal[currentIdx] &&
            buktiTfListFinal[currentIdx].length > 0;
          if (!buktiAda) continue;
          try {
            const bankInfo = split.bankAccountId
              ? BANK_INFO[split.bankAccountId]
              : null;
            // Kirim foto sebagai binary (multipart) langsung — sama seperti
            // foto pengiriman driver yang terbukti berjalan. Metode fileUrl
            // sebelumnya tidak berfungsi karena Fonnte tidak bisa mengakses
            // URL internal Replit.
            const rawBukti = buktiTfListFinal[currentIdx];
            const mMatch = rawBukti.match(
              /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
            );
            const mime = mMatch ? mMatch[1] : "image/jpeg";
            const b64 = mMatch ? mMatch[2] : rawBukti;
            const buffer = Buffer.from(b64, "base64");
            const ext = mime.split("/")[1]?.split("+")[0] || "jpg";
            const filename = `bukti-tf-${orderId}-${currentIdx}.${ext}`;
            await kirimWA(
              grupBuktiTF,
              `💸 *Bukti Transfer Masuk*${transferSplits.length > 1 ? ` (${currentIdx + 1}/${transferSplits.length})` : ""}\n\n` +
                `Order: #${orderId}\n` +
                `Customer: ${d.namaKontak} – ${d.nomorTelepon}\n` +
                `Total Order: Rp ${formatRupiah(total)}\n` +
                `Nominal Transfer: Rp ${formatRupiah(split.amount)}\n` +
                `Bank Tujuan: ${bankInfo?.name ?? "-"}\n` +
                (sisaPembayaran > 0
                  ? `Status: DP (sisa Rp ${formatRupiah(sisaPembayaran)})\n`
                  : "") +
                `Sales: ${d.salesPerson}`,
              { file: { buffer, filename, mime } },
            );
          } catch (waErr) {
            logger.error(
              { waErr, orderId, splitIdx: currentIdx },
              "Gagal forward bukti transfer ke grup WA",
            );
          }
        }
      }
    } catch (bgErr) {
      logger.error(
        { bgErr, orderId },
        "Background WA/Kledo flow gagal — order tetap tersimpan",
      );
    }
  })();
});

// POST /orders/:id/foto — driver upload foto bukti pengiriman → kirim ke grup WA
router.post("/orders/:id/foto", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { photoBase64, driverName, caption } = req.body as {
    photoBase64?: string;
    driverName?: string;
    caption?: string;
  };

  if (!photoBase64) {
    res.status(400).json({ ok: false, error: "Foto wajib diisi" });
    return;
  }

  // Ambil order untuk konteks pesan
  const orderRows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);
  const order = orderRows[0];
  if (!order) {
    res.status(404).json({ ok: false, error: "Order tidak ditemukan" });
    return;
  }

  // Decode base64 (data:image/jpeg;base64,xxxx atau raw base64)
  const m = photoBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  const mime = m ? m[1] : "image/jpeg";
  const b64 = m ? m[2] : photoBase64;
  const buffer = Buffer.from(b64, "base64");
  const ext = mime.split("/")[1]?.split("+")[0] || "jpg";
  const filename = `bukti-${order.orderId}.${ext}`;

  const groupId = process.env.FONNTE_GROUP_ID ?? "120363356936985289@g.us";
  const driverLabel = driverName || order.driverName || "Driver";

  const message =
    `📸 *Bukti Pengiriman*\n\n` +
    `Order: #${order.orderId}\n` +
    `Customer: ${order.namaKontak} – ${order.nomorTelepon}\n` +
    `Alamat: ${order.alamat}` +
    (order.patokanLokasi ? ` – ${order.patokanLokasi}` : "") +
    `\n` +
    `Produk: ${order.namaProduk} × ${order.jumlahProduk}\n` +
    `Driver: ${driverLabel}` +
    (caption ? `\n\nCatatan: ${caption}` : "");

  const sent = await kirimWA(groupId, message, {
    file: { buffer, filename, mime },
  });

  if (!sent) {
    res.status(502).json({ ok: false, error: "Gagal mengirim ke grup WA" });
    return;
  }

  res.json({ ok: true });
});

// PATCH /orders/:id/pengiriman — update status pengiriman & driver
router.patch("/orders/:id/pengiriman", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { statusPengiriman, driverName } = req.body as {
    statusPengiriman?: string;
    driverName?: string;
  };

  const validStatus = [
    "Menunggu",
    "Diproses",
    "Dikirim",
    "Selesai",
    "Dibatalkan",
  ];
  if (!statusPengiriman || !validStatus.includes(statusPengiriman)) {
    res.status(400).json({ error: "Status tidak valid" });
    return;
  }

  await db
    .update(ordersTable)
    .set({
      statusPengiriman,
      ...(driverName !== undefined ? { driverName } : {}),
    })
    .where(eq(ordersTable.id, id));

  res.json({ ok: true });
});

// ─── ENDPOINT BAGIKAN LOKASI (dibuka customer dari link di pesan WA) ───
//
// GET /api/orders/loc/:token → info minimal order (untuk ditampilkan di halaman)
// POST /api/orders/loc/:token { lat, lng } → simpan koordinat GPS customer
//
// Tidak butuh auth — token sendiri yang berfungsi sebagai otorisasi
// (token random 12-byte base64url ≈ 96 bit entropy, hanya dimiliki customer).

router.get("/orders/loc/:token", async (req, res): Promise<void> => {
  const token = String(req.params.token || "").trim();
  if (!token) {
    res.status(400).json({ error: "Token tidak valid" });
    return;
  }

  const rows = await db
    .select({
      orderId: ordersTable.orderId,
      namaKontak: ordersTable.namaKontak,
      alamat: ordersTable.alamat,
      hasShared: ordersTable.customerLat,
    })
    .from(ordersTable)
    .where(eq(ordersTable.customerLocToken, token))
    .limit(1);

  if (rows.length === 0) {
    res
      .status(404)
      .json({ error: "Link lokasi tidak ditemukan / sudah kedaluwarsa" });
    return;
  }
  const row = rows[0];
  res.json({
    orderId: row.orderId,
    namaKontak: row.namaKontak,
    alamat: row.alamat,
    alreadyShared: Boolean(row.hasShared),
  });
});

router.post("/orders/loc/:token", async (req, res): Promise<void> => {
  const token = String(req.params.token || "").trim();
  if (!token) {
    res.status(400).json({ error: "Token tidak valid" });
    return;
  }

  const lat = Number(req.body?.lat);
  const lng = Number(req.body?.lng);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    res.status(400).json({ error: "Koordinat GPS tidak valid" });
    return;
  }

  const result = await db
    .update(ordersTable)
    .set({
      customerLat: String(lat),
      customerLng: String(lng),
      customerLocSharedAt: new Date(),
    })
    .where(eq(ordersTable.customerLocToken, token))
    .returning({
      orderId: ordersTable.orderId,
      namaKontak: ordersTable.namaKontak,
    });

  if (result.length === 0) {
    res.status(404).json({ error: "Link lokasi tidak ditemukan" });
    return;
  }

  req.log.info(
    { orderId: result[0].orderId, lat, lng },
    "Customer membagikan lokasi GPS",
  );
  res.json({ ok: true, orderId: result[0].orderId });
});

export default router;
