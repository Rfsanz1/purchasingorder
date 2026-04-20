import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, ordersTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";
import { findOrCreateKledoContact, createKledoInvoice, type KledoInvoiceItem } from "./kledo";

const SALES_DATA: Record<string, string> = {
  "Lehan":    "+62 857-2982-4485",
  "Agus":     "+62 857-3084-5708",
  "Imam":     "+62 858-9233-3127",
  "Agung":    "0882-3368-4224",
  "Andre":    "+62 821-3763-3912",
  "Priyanto": "+62 823-3479-2357",
  "Wiwid":    "+62 857-4115-6110",
  "Dhani":    "+62 812-1599-2058",
};

const OrderBodySchema = z.object({
  namaKontak:          z.string().min(1, "Nama konsumen wajib diisi"),
  nomorTelepon:        z.string().optional().default(""),
  alamat:              z.string().optional().default(""),
  alamatKledo:         z.string().optional().default(""),
  patokanLokasi:       z.string().optional().default(""),
  salesPerson:         z.string().min(1, "Sales person wajib dipilih"),
  referensi:           z.string().optional().default(""),
  metodePembayaran:    z.string().optional().default("CASH"),
  keteranganPembayaran:z.string().optional().nullable().default(null),
  biayaPengiriman:     z.number().optional().nullable().default(null),
  namaProduk:          z.string().optional().default(""),
  jumlahProduk:        z.number().optional().default(1),
  hargaProduk:         z.number().optional().default(0),
});

const router: IRouter = Router();

function formatRupiah(num: number): string {
  return num.toLocaleString("id-ID");
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
  options: { button?: string; footer?: string } = {}
): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    logger.warn("FONNTE_TOKEN not set, skipping WA notification");
    return false;
  }
  try {
    const params: Record<string, string> = { target, message };
    if (options.button)  params.button  = options.button;
    if (options.footer)  params.footer  = options.footer;
    const form = new URLSearchParams(params);
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const text = await res.text();
    logger.info({ target, status: res.status, response: text }, "Fonnte WA sent");
    return res.ok;
  } catch (err) {
    logger.error({ err, target }, "Failed to send WA via Fonnte");
    return false;
  }
}

// GET /orders — daftar semua order (halaman admin)
router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));
  res.json(orders);
});

// POST /orders — terima order baru
router.post("/orders", async (req, res): Promise<void> => {
  // Proses items array jika ada (multi-produk)
  interface RawItem { namaProduk: string; jumlahProduk: number; hargaProduk: number; kledoProductId?: number; kledoFinanceAccountId?: number; kledoUnitId?: number }
  const rawItems: RawItem[] = Array.isArray(req.body.items) ? req.body.items : [];

  let bodyToValidate = req.body;
  if (rawItems.length > 0) {
    const totalQty = rawItems.reduce((s, i) => s + (Number(i.jumlahProduk) || 1), 0);
    const totalProductPrice = rawItems.reduce((s, i) => s + (Number(i.hargaProduk) || 0) * (Number(i.jumlahProduk) || 1), 0);
    const namaProduk = rawItems.length === 1
      ? `${rawItems[0].namaProduk} (${rawItems[0].jumlahProduk}x @ Rp ${formatRupiah(Number(rawItems[0].hargaProduk))})`
      : rawItems.map((it, idx) => `${idx + 1}. ${it.namaProduk} (${it.jumlahProduk}x @ Rp ${formatRupiah(Number(it.hargaProduk))})`).join("\n");
    bodyToValidate = { ...req.body, namaProduk, jumlahProduk: totalQty, hargaProduk: totalProductPrice };
  }

  const parsed = OrderBodySchema.safeParse(bodyToValidate);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const d = parsed.data;
  const orderId = randomUUID().slice(0, 8).toUpperCase();
  const adminWA = process.env.ADMIN_WA_NUMBER ?? "";
  const ongkir = d.biayaPengiriman ?? 0;
  // hargaProduk sudah berisi total semua item (qty × harga), tidak perlu dikali jumlahProduk lagi
  const total = d.hargaProduk + ongkir;

  // Pastikan referensi selalu konsisten — generate di backend jika frontend tidak kirim
  const referensi = d.referensi || (d.salesPerson
    ? `Sales: ${d.salesPerson} - ${SALES_DATA[d.salesPerson] || "-"}`
    : "");

  req.log.info({ orderId, namaKontak: d.namaKontak }, "New purchase order received");

  // Simpan ke database
  try {
    await db.insert(ordersTable).values({
      orderId,
      namaKontak:           d.namaKontak,
      nomorTelepon:         d.nomorTelepon,
      alamat:               d.alamat,
      patokanLokasi:        d.patokanLokasi,
      namaProduk:           d.namaProduk,
      jumlahProduk:         d.jumlahProduk,
      hargaProduk:          d.hargaProduk,
      biayaPengiriman:      d.biayaPengiriman ?? null,
      totalHarga:           total,
      salesPerson:          d.salesPerson,
      metodePembayaran:     d.metodePembayaran,
      keteranganPembayaran: d.keteranganPembayaran ?? null,
      whatsappSent:         "false",
    });
  } catch (dbErr: unknown) {
    const cause = dbErr instanceof Error ? (dbErr.cause as Error | undefined) : undefined;
    req.log.error({ dbErr, cause, code: (cause as { code?: string })?.code, detail: (cause as { detail?: string })?.detail }, "DB insert failed");
    const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
    res.status(500).json({ error: `Gagal menyimpan pesanan ke database: ${msg}` });
    return;
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const pesanPelanggan =
    `Halo Kak 👋\n\n` +
    `Terima kasih sudah mengisi form Purchase Order Customer 🙏\n\n` +
    `Pesanan Kakak sudah kami terima dan saat ini sedang diproses oleh tim kami. Berikut ringkasan pesanan Kakak:\n\n` +
    `📦 *Produk:* ${d.namaProduk}\n` +
    `🔢 *Jumlah:* ${d.jumlahProduk} unit\n` +
    (d.hargaProduk ? `💰 *Harga:* Rp ${formatRupiah(d.hargaProduk)}\n` : "") +
    (d.alamat ? `📍 *Alamat:* ${d.alamat}\n` : "") +
    (d.patokanLokasi ? `🏠 *Catatan:* ${d.patokanLokasi}\n` : "") +
    `\nJika ada pertanyaan, jangan ragu untuk menghubungi kami 😊\n\n` +
    `Terima kasih atas kepercayaannya 🙌`;

  const pesanAdmin =
    `🔔 *Order masuk bossku!* 👀\n\n` +
    `📌 *Customer:* ${d.namaKontak}` +
    (d.nomorTelepon ? ` – ${d.nomorTelepon}` : "") + `\n` +
    (d.alamat ? `📍 *Alamat:* ${d.alamat}\n` : "") +
    (d.patokanLokasi ? `🏠 *Catatan:* ${d.patokanLokasi}\n` : "") +
    `\n📦 *Pesanan:*\n${d.namaProduk}\n\n` +
    (d.hargaProduk
      ? `💰 *Harga: Rp ${formatRupiah(d.hargaProduk)}*` +
        (ongkir ? ` + Ongkir Rp ${formatRupiah(ongkir)} = *Rp ${formatRupiah(total)}*` : "") + `\n`
      : "") +
    `\n👨‍💼 *${referensi}*\n\n` +
    `⚡ Yuk langsung di-follow up sebelum dia keburu cancel 😄\n\n` +
    `🕒 ${timestamp}`;

  let whatsappSent = false;

  const nomorPelanggan = cleanPhoneNumber(d.nomorTelepon);
  if (nomorPelanggan) {
    const sent = await kirimWA(nomorPelanggan, pesanPelanggan);
    whatsappSent = sent;
  }

  if (adminWA) {
    await kirimWA(adminWA, pesanAdmin, {
      button: "✅ Siap meluncur bossku!,📞 Hubungi customer,⏳ Follow up nanti",
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

  // Susun daftar item untuk Kledo (dari items array atau single product)
  const kledoItems: KledoInvoiceItem[] = rawItems.length > 0
    ? rawItems
        .filter(i => typeof i.kledoProductId === "number" && i.kledoProductId > 0)
        .map(i => ({
          kledoProductId: i.kledoProductId!,
          kledoFinanceAccountId: typeof i.kledoFinanceAccountId === "number" ? i.kledoFinanceAccountId : undefined,
          kledoUnitId: typeof i.kledoUnitId === "number" ? i.kledoUnitId : 73,
          jumlahProduk: Number(i.jumlahProduk) || 1,
          hargaProduk: Number(i.hargaProduk) || 0,
        }))
    : (() => {
        const pid = typeof req.body.kledoProductId === "number" ? req.body.kledoProductId : null;
        if (!pid) return [];
        return [{
          kledoProductId: pid,
          kledoFinanceAccountId: typeof req.body.kledoFinanceAccountId === "number" ? req.body.kledoFinanceAccountId : undefined,
          kledoUnitId: typeof req.body.kledoUnitId === "number" ? req.body.kledoUnitId : 73,
          jumlahProduk: d.jumlahProduk,
          hargaProduk: d.hargaProduk,
        }];
      })();

  // alamatKledo: hanya RT/RW, kelurahan, kecamatan (dikirim dari frontend, tanpa kabupaten)
  const alamatKledo = typeof req.body.alamatKledo === "string" && req.body.alamatKledo
    ? req.body.alamatKledo
    : d.alamat;

  if (kledoItems.length > 0 && process.env.KLEDO_TOKEN) {
    try {
      const contactId = await findOrCreateKledoContact(d.namaKontak, d.nomorTelepon, alamatKledo);
      if (contactId) {
        // Memo (Notes di Kledo): pesan/catatan dari konsumen
        const memo = [
          d.patokanLokasi ? `${d.patokanLokasi}` : "",
          `Order #${orderId}`,
        ].filter(Boolean).join("\n");
        const inv = await createKledoInvoice({
          contactId,
          orderId,
          items: kledoItems,
          biayaPengiriman: ongkir,
          memo,
          billingAddress: alamatKledo,
          referensi,
        });
        if (inv.success) {
          kledoInvoiceId = inv.invoiceId;
          kledoInvoiceNumber = inv.invoiceNumber;
          req.log.info({ orderId, kledoInvoiceId, kledoInvoiceNumber }, "Kledo invoice created");
        }
      }
    } catch (err) {
      logger.error({ err, orderId }, "Kledo invoice creation error — order tetap tersimpan");
    }
  }

  res.status(201).json({
    success: true,
    message: "Order berhasil dikirim!",
    orderId,
    whatsappSent,
    kledoInvoiceId,
    kledoInvoiceNumber,
  });
});

// PATCH /orders/:id/pengiriman — update status pengiriman & driver
router.patch("/orders/:id/pengiriman", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { statusPengiriman, driverName } = req.body as {
    statusPengiriman?: string;
    driverName?: string;
  };

  const validStatus = ["Menunggu", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
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

export default router;
