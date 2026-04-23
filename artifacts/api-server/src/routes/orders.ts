import { Router, type IRouter } from "express";
import { SubmitOrderBody } from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";
import { findOrCreateKledoContact, createKledoInvoice, searchKledoProductByName, payInvoiceKledo, type KledoInvoiceItem } from "./kledo";

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

// Daftar bank rekening transfer + EDC yang dipakai untuk display info di WA
const BANK_INFO: Record<number, { name: string; rekening: string; atasNama: string }> = {
  1470: { name: "BCA GIRO",  rekening: "155 91 99999",         atasNama: "INDARTO WIBOWO" },
  3:    { name: "MANDIRI",   rekening: "136 000 4780612",      atasNama: "DIAN PURNAMA" },
  1456: { name: "BNI",       rekening: "0822 705 836",         atasNama: "INDARTO WIBOWO" },
  1464: { name: "BRI",       rekening: "0262 01 000031 562",   atasNama: "DIAN PURNAMA REZA T." },
  1465: { name: "BCA EDC",   rekening: "(EDC mesin di toko)",   atasNama: "-" },
  1457: { name: "BRI EDC",   rekening: "(EDC mesin di toko)",   atasNama: "-" },
};

const SALES_PHONE: Record<string, string> = {
  LEHAN:        "+62 857-2982-4485",
  AGUS:         "+62 857-3084-5708",
  IVAN:         "+62 857-1820-0975",
  DIAS:         "+62 852-2996-0722",
  "RIO BRANDON":"+62 859-5282-5277",
  IMAM:     "+62 858-9233-3127",
  AGUNG:    "+62 882-3368-4224",
  ANDRE:    "+62 821-3763-3912",
  PRIYANTO: "+62 823-3479-2357",
  WIWIT:    "+62 857-4115-6110",
  WIWID:    "+62 857-4115-6110",
  DHANI:    "+62 812-1599-2058",
};

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
  options: { button?: string; footer?: string; file?: { buffer: Buffer; filename: string; mime: string } } = {}
): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    logger.warn("FONNTE_TOKEN not set, skipping WA notification");
    return false;
  }
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token },
      body: (() => {
        const fd = new FormData();
        fd.append("target", target);
        fd.append("message", message);
        if (options.button) fd.append("button", options.button);
        if (options.footer) fd.append("footer", options.footer);
        if (options.file) {
          fd.append(
            "file",
            new Blob([new Uint8Array(options.file.buffer)], { type: options.file.mime }),
            options.file.filename,
          );
        }
        return fd;
      })(),
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
  interface RawItem { namaProduk: string; jumlahProduk: number; hargaProduk: number; kledoProductId?: number; kledoFinanceAccountId?: number; kledoUnitId?: number; kategoriId?: number | null }
  const rawItems: RawItem[] = Array.isArray(req.body.items) ? req.body.items : [];

  // Field tambahan untuk pembayaran (di luar zod schema)
  const kledoBankAccountId: number | null = typeof req.body.kledoBankAccountId === "number" ? req.body.kledoBankAccountId : null;
  const buktiTransferBase64: string | null = typeof req.body.buktiTransferBase64 === "string" && req.body.buktiTransferBase64.length > 0
    ? req.body.buktiTransferBase64 : null;

  let bodyToValidate = req.body;
  if (rawItems.length > 0) {
    const totalQty = rawItems.reduce((s, i) => s + (Number(i.jumlahProduk) || 1), 0);
    const totalProductPrice = rawItems.reduce((s, i) => s + (Number(i.hargaProduk) || 0) * (Number(i.jumlahProduk) || 1), 0);
    const namaProduk = rawItems.length === 1
      ? rawItems[0].namaProduk
      : rawItems.map((it, idx) => `${idx + 1}. ${it.namaProduk} (${it.jumlahProduk}x @ Rp ${formatRupiah(Number(it.hargaProduk))})`).join("\n");
    bodyToValidate = { ...req.body, namaProduk, jumlahProduk: totalQty, hargaProduk: totalProductPrice };
  }

  const parsed = SubmitOrderBody.safeParse(bodyToValidate);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const d = parsed.data;
  const orderId = randomUUID().slice(0, 8).toUpperCase();
  const namaToko = process.env.NAMA_TOKO ?? "Toko Kami";
  // Grup WA tujuan notifikasi order baru (form purchase order).
  // Hard-coded ke grup "Order Form Masuk".
  const adminWA = "120363405869453556@g.us";
  const ongkir = d.biayaPengiriman ?? 0;
  // Untuk multi-item: hargaProduk sudah berisi total semua line (qty × price terjumlah)
  // jadi tidak perlu dikalikan lagi dengan jumlahProduk.
  const subtotalProduk = rawItems.length > 0
    ? d.hargaProduk
    : d.hargaProduk * d.jumlahProduk;
  const total = subtotalProduk + ongkir;

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
    throw dbErr;
  }

  // Info rekening: hanya tampilkan bank yang dipilih customer (bukan semua 4)
  const selectedBank = kledoBankAccountId ? BANK_INFO[kledoBankAccountId] : null;
  const infoRekening = (d.metodePembayaran === "Transfer" && selectedBank)
    ? `\n🏦 *Rekening Pembayaran*\n` +
      `Silahkan transfer ke rekening berikut:\n\n` +
      `• *${selectedBank.name}*\n  ${selectedBank.rekening}\n  a.n. ${selectedBank.atasNama}\n` +
      (buktiTransferBase64 ? `\n_(Bukti transfer sudah kami terima ✅)_\n` : "")
    : "";

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const pesanPelanggan =
    `Halo Kak 👋\n\n` +
    `Terima kasih sudah mengisi form Purchase Order Customer 🙏\n\n` +
    `Pesanan Kakak sudah kami terima dan saat ini sedang diproses oleh tim kami. Berikut ringkasan pesanan Kakak:\n\n` +
    `📦 *Nama Produk:* ${d.namaProduk}\n` +
    `🔢 *Jumlah:* ${d.jumlahProduk} unit\n` +
    `💰 *Harga:* Rp ${formatRupiah(d.hargaProduk)}\n` +
    (ongkir ? `🚚 *Ongkir:* Rp ${formatRupiah(ongkir)}\n` : "") +
    `📍 *Alamat:* ${d.alamat}` + (d.patokanLokasi ? ` – ${d.patokanLokasi}` : "") + `\n\n` +
    `💳 *Total Pembayaran: Rp ${formatRupiah(total)}*\n` +
    infoRekening +
    `\nUntuk melanjutkan pesanan, silakan lakukan pembayaran sesuai total di atas ya 🙏\n` +
    `_(Setelah pembayaran, mohon kirim bukti transfer ke chat ini)_\n\n` +
    `Jika ada pertanyaan, jangan ragu untuk menghubungi kami 😊\n\n` +
    `Terima kasih atas kepercayaannya 🙌`;

  const pesanAdmin =
    `🔔 *Order masuk bossku!* 👀\n\n` +
    `📌 *Customer:*\n` +
    `${d.namaKontak} – ${d.nomorTelepon}\n\n` +
    `📍 *Alamat:* ${d.alamat}\n` +
    (d.patokanLokasi ? `🏠 *Patokan:* ${d.patokanLokasi}\n` : "") +
    `\n📦 *Pesanan:*\n` +
    `${d.namaProduk} x ${d.jumlahProduk} unit\n\n` +
    `💰 *Total: Rp ${formatRupiah(total)}*` +
    (ongkir ? ` (Ongkir: Rp ${formatRupiah(ongkir)})` : "") + `\n` +
    `💳 Pembayaran: ${d.metodePembayaran}` +
    (selectedBank ? ` – ${selectedBank.name}` : "") +
    (d.metodePembayaran === "Transfer"
      ? (buktiTransferBase64 ? " ✅ (bukti TF terlampir)" : " ⏳ (belum ada bukti TF)")
      : "") +
    (d.keteranganPembayaran ? ` – ${d.keteranganPembayaran}` : "") + `\n` +
    `\n👨‍💼 *Sales:* ${d.salesPerson}\n\n` +
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

  // Susun daftar item untuk Kledo — jika kledoProductId tidak ada, cari otomatis by nama
  if (process.env.KLEDO_TOKEN) {
    try {
      const sourceItems = rawItems.length > 0 ? rawItems : [{
        namaProduk: d.namaProduk,
        jumlahProduk: d.jumlahProduk,
        hargaProduk: d.hargaProduk,
        kledoProductId: typeof req.body.kledoProductId === "number" ? req.body.kledoProductId : undefined,
        kledoFinanceAccountId: typeof req.body.kledoFinanceAccountId === "number" ? req.body.kledoFinanceAccountId : undefined,
        kledoUnitId: typeof req.body.kledoUnitId === "number" ? req.body.kledoUnitId : undefined,
      }];

      const kledoItems: KledoInvoiceItem[] = (await Promise.all(
        sourceItems.map(async (i): Promise<KledoInvoiceItem | null> => {
          let productId = typeof i.kledoProductId === "number" && i.kledoProductId > 0 ? i.kledoProductId : null;
          let unitId = typeof i.kledoUnitId === "number" && i.kledoUnitId > 0 ? i.kledoUnitId : 73;

          // Kalau belum ada ID dari dropdown, cari otomatis di Kledo berdasarkan nama
          if (!productId && i.namaProduk?.trim()) {
            const found = await searchKledoProductByName(i.namaProduk.trim());
            if (found) {
              productId = found.id;
              unitId = found.unitId;
              logger.info({ namaProduk: i.namaProduk, productId }, "Produk Kledo ditemukan otomatis");
            } else {
              logger.warn({ namaProduk: i.namaProduk }, "Produk tidak ditemukan di Kledo, item dilewati");
              return null;
            }
          }

          if (!productId) return null;
          return {
            kledoProductId: productId,
            kledoFinanceAccountId: typeof i.kledoFinanceAccountId === "number" ? i.kledoFinanceAccountId : undefined,
            kledoUnitId: unitId,
            jumlahProduk: Number(i.jumlahProduk) || 1,
            hargaProduk: Number(i.hargaProduk) || 0,
          };
        })
      )).filter((item): item is KledoInvoiceItem => item !== null);

      if (kledoItems.length > 0) {
        const contactId = await findOrCreateKledoContact(d.namaKontak, d.nomorTelepon, d.alamat);
        if (contactId) {
          const salesPhone = SALES_PHONE[d.salesPerson.toUpperCase()] ?? "";
          const memo = salesPhone
            ? `Sales: ${d.salesPerson} - ${salesPhone}`
            : `Sales: ${d.salesPerson}`;
          const inv = await createKledoInvoice({
            contactId,
            orderId,
            items: kledoItems,
            biayaPengiriman: ongkir,
            memo,
            patokanLokasi: d.patokanLokasi,
          });
          if (inv.success) {
            kledoInvoiceId = inv.invoiceId;
            kledoInvoiceNumber = inv.invoiceNumber;
            req.log.info({ orderId, kledoInvoiceId, kledoInvoiceNumber }, "Kledo invoice created");

            // === AUTO-LUNAS: catat pembayaran sesuai metode ===
            try {
              const paymentMemo = `Order #${orderId} - ${d.salesPerson}`;
              if (d.metodePembayaran === "CASH") {
                // Split per kategori: ELEKTRONIK → KAS_ELEKTRONIK, lainnya + ongkir → KAS_SULAWESI
                let elektronikAmount = 0;
                let lainnyaAmount = 0;
                for (const it of sourceItems) {
                  const lineTotal = (Number(it.hargaProduk) || 0) * (Number(it.jumlahProduk) || 1);
                  const catId = typeof it.kategoriId === "number" ? it.kategoriId : null;
                  if (catId !== null && ELEKTRONIK_CATEGORY_IDS.has(catId)) {
                    elektronikAmount += lineTotal;
                  } else {
                    lainnyaAmount += lineTotal;
                  }
                }
                // Ongkir masuk ke kategori dominan (atau SULAWESI kalau seimbang)
                if (elektronikAmount > 0 && lainnyaAmount === 0) {
                  elektronikAmount += ongkir;
                } else {
                  lainnyaAmount += ongkir;
                }
                if (elektronikAmount > 0) {
                  await payInvoiceKledo({
                    invoiceId: kledoInvoiceId,
                    bankAccountId: KLEDO_KAS_ELEKTRONIK,
                    amount: elektronikAmount,
                    memo: `${paymentMemo} (CASH-Elektronik)`,
                  });
                }
                if (lainnyaAmount > 0) {
                  await payInvoiceKledo({
                    invoiceId: kledoInvoiceId,
                    bankAccountId: KLEDO_KAS_SULAWESI,
                    amount: lainnyaAmount,
                    memo: `${paymentMemo} (CASH-Bahan)`,
                  });
                }
              } else if (d.metodePembayaran === "Debit" && kledoBankAccountId) {
                await payInvoiceKledo({
                  invoiceId: kledoInvoiceId,
                  bankAccountId: kledoBankAccountId,
                  amount: total,
                  memo: `${paymentMemo} (Debit)`,
                });
              } else if (d.metodePembayaran === "Transfer" && kledoBankAccountId && buktiTransferBase64) {
                // Transfer hanya auto-lunas jika ada bukti transfer
                await payInvoiceKledo({
                  invoiceId: kledoInvoiceId,
                  bankAccountId: kledoBankAccountId,
                  amount: total,
                  memo: `${paymentMemo} (Transfer)`,
                });
              }
            } catch (payErr) {
              logger.error({ payErr, orderId, kledoInvoiceId }, "Auto-lunas Kledo gagal — invoice tetap dibuat");
            }
          }
        }
      }
    } catch (err) {
      logger.error({ err, orderId }, "Kledo invoice creation error — order tetap tersimpan");
    }
  }

  // === Forward bukti transfer ke grup WA terpisah (jika ada) ===
  if (buktiTransferBase64 && d.metodePembayaran === "Transfer") {
    try {
      const m = buktiTransferBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const mime = m ? m[1] : "image/jpeg";
      const b64 = m ? m[2] : buktiTransferBase64;
      const buffer = Buffer.from(b64, "base64");
      const ext = mime.split("/")[1]?.split("+")[0] || "jpg";
      const grupBuktiTF = process.env.FONNTE_GROUP_BUKTI_TF ?? "120363425112329389@g.us";
      if (grupBuktiTF) {
        await kirimWA(grupBuktiTF, (
          `💸 *Bukti Transfer Masuk*\n\n` +
          `Order: #${orderId}\n` +
          `Customer: ${d.namaKontak} – ${d.nomorTelepon}\n` +
          `Total: Rp ${formatRupiah(total)}\n` +
          `Bank Tujuan: ${selectedBank?.name ?? "-"}\n` +
          `Sales: ${d.salesPerson}`
        ), {
          file: { buffer, filename: `bukti-tf-${orderId}.${ext}`, mime },
        });
      }
    } catch (waErr) {
      logger.error({ waErr, orderId }, "Gagal forward bukti transfer ke grup WA");
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
  const orderRows = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  const order = orderRows[0];
  if (!order) {
    res.status(404).json({ ok: false, error: "Order tidak ditemukan" });
    return;
  }

  // Decode base64 (data:image/jpeg;base64,xxxx atau raw base64)
  const m = photoBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  const mime = m ? m[1] : "image/jpeg";
  const b64  = m ? m[2] : photoBase64;
  const buffer = Buffer.from(b64, "base64");
  const ext = mime.split("/")[1]?.split("+")[0] || "jpg";
  const filename = `bukti-${order.orderId}.${ext}`;

  const groupId = process.env.FONNTE_GROUP_ID ?? "120363356936985289@g.us";
  const driverLabel = driverName || order.driverName || "Driver";

  const message =
    `📸 *Bukti Pengiriman*\n\n` +
    `Order: #${order.orderId}\n` +
    `Customer: ${order.namaKontak} – ${order.nomorTelepon}\n` +
    `Alamat: ${order.alamat}` + (order.patokanLokasi ? ` – ${order.patokanLokasi}` : "") + `\n` +
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
