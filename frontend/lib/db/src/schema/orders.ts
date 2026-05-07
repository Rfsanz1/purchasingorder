import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id:                   serial("id").primaryKey(),
  orderId:              text("order_id").notNull().unique(),
  namaKontak:           text("nama_kontak").notNull(),
  nomorTelepon:         text("nomor_telepon").notNull(),
  alamat:               text("alamat").notNull(),
  patokanLokasi:        text("patokan_lokasi").notNull(),
  namaProduk:           text("nama_produk").notNull(),
  jumlahProduk:         integer("jumlah_produk").notNull(),
  hargaProduk:          integer("harga_produk").notNull(),
  biayaPengiriman:      integer("biaya_pengiriman"),
  totalHarga:           integer("total_harga").notNull(),
  salesPerson:          text("sales_person").notNull(),
  metodePembayaran:     text("metode_pembayaran").notNull(),
  keteranganPembayaran: text("keterangan_pembayaran"),
  whatsappSent:         text("whatsapp_sent").default("false"),
  statusPengiriman:     text("status_pengiriman").default("Menunggu").notNull(),
  driverName:           text("driver_name"),
  metodePengiriman:     text("metode_pengiriman").default("Dikirim").notNull(),
  kategoriProduk:       text("kategori_produk").default("BahanBangunan").notNull(),
  // Lokasi GPS yang dibagikan customer lewat link di pesan WA
  customerLat:          text("customer_lat"),
  customerLng:          text("customer_lng"),
  customerLocToken:     text("customer_loc_token"),
  customerLocSharedAt:  timestamp("customer_loc_shared_at"),
  // Foto bukti transfer (base64 data URL). Disimpan supaya bisa di-serve
  // sebagai URL public ke Fonnte (lebih andal daripada upload multipart),
  // dan supaya admin bisa kirim ulang foto bukti TF ke grup WA kalau perlu.
  // CATATAN: untuk order baru dengan multi-metode (split), foto bukti TF
  // semua disimpan di buktiTransferList (JSON array). Kolom ini dipertahankan
  // untuk backward compat dengan order lama yang single-method.
  buktiTransferData:    text("bukti_transfer_data"),
  // === Multi-metode pembayaran (DP / split CASH+Transfer+Debit) ===
  // Format JSON: [{ method: "CASH"|"Transfer"|"Debit"|"BelumBayar", amount: number, bankAccountId?: number }]
  // null = order lama (sebelum fitur split) — pakai metodePembayaran tunggal di atas.
  paymentSplits:        text("payment_splits"),
  // Daftar foto bukti TF untuk multi-Transfer (1 foto per Transfer split).
  // Format JSON: ["data:image/...;base64,...", ...] — index searah dgn
  // urutan Transfer di paymentSplits. null = order lama / tidak ada.
  buktiTransferList:    text("bukti_transfer_list"),
  // Total uang muka (jumlah yg dibayar sekarang = sum semua amount split).
  // Untuk order single-method: sama dengan totalHarga (lunas) atau 0 (BelumBayar).
  dpAmount:             integer("dp_amount"),
  // Sisa pelunasan = totalHarga - dpAmount. 0 = lunas, >0 = ada DP yang harus ditagih.
  sisaPembayaran:       integer("sisa_pembayaran"),
  createdAt:            timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
