import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const KLEDO_BASE = "https://api.kledo.com/api/v1/finance";
const FONNTE_BASE = "https://api.fonnte.com";
const TARGET_GROUP = "120363425112329389@g.us";

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

router.get("/system/health-check", async (req, res): Promise<void> => {
  const sendTest = req.query.sendTest === "1";
  const results: CheckResult[] = [];

  // 1) Env vars presence
  const fonnteToken = process.env.FONNTE_TOKEN || "";
  const kledoToken = process.env.KLEDO_TOKEN || "";
  const adminWa = process.env.ADMIN_WA_NUMBER || "";
  const namaToko = process.env.NAMA_TOKO || "";

  results.push({
    name: "Konfigurasi Secrets",
    ok: !!fonnteToken && !!kledoToken && !!adminWa && !!namaToko,
    detail: [
      `FONNTE_TOKEN: ${fonnteToken ? "✓ ada" : "✗ kosong"}`,
      `KLEDO_TOKEN: ${kledoToken ? "✓ ada" : "✗ kosong"}`,
      `ADMIN_WA_NUMBER: ${adminWa ? "✓ " + adminWa : "✗ kosong"}`,
      `NAMA_TOKO: ${namaToko ? "✓ " + namaToko : "✗ kosong"}`,
    ].join(" • "),
  });

  // 2) Fonnte device check
  if (fonnteToken) {
    try {
      const resp = await fetch(`${FONNTE_BASE}/device`, {
        method: "POST",
        headers: { Authorization: fonnteToken },
      });
      const data = await resp.json() as {
        status?: boolean;
        device?: string;
        name?: string;
        device_status?: string;
        quota?: number;
        messages?: string[];
        reason?: string;
      };
      const ok = !!data.status;
      results.push({
        name: "Token Fonnte (WhatsApp)",
        ok,
        detail: ok
          ? `Device: ${data.device ?? data.name ?? "?"} • Status: ${data.device_status ?? "?"} • Sisa kuota: ${data.quota ?? "?"}`
          : `Token ditolak: ${data.reason ?? data.messages?.join(", ") ?? "status " + resp.status}`,
      });
    } catch (err) {
      results.push({
        name: "Token Fonnte (WhatsApp)",
        ok: false,
        detail: `Gagal hubungi Fonnte: ${(err as Error).message}`,
      });
    }
  } else {
    results.push({ name: "Token Fonnte (WhatsApp)", ok: false, detail: "FONNTE_TOKEN belum diisi" });
  }

  // 3) Kledo token check
  if (kledoToken) {
    try {
      const resp = await fetch(`${KLEDO_BASE}/contacts?per_page=1&type_id=3`, {
        headers: {
          Authorization: `Bearer ${kledoToken}`,
          Accept: "application/json",
        },
      });
      const data = await resp.json() as { success?: boolean; message?: string };
      const ok = !!data.success;
      results.push({
        name: "Token Kledo (Invoice)",
        ok,
        detail: ok ? "Berhasil terhubung ke API Kledo" : `Token ditolak: ${data.message ?? "status " + resp.status}`,
      });
    } catch (err) {
      results.push({
        name: "Token Kledo (Invoice)",
        ok: false,
        detail: `Gagal hubungi Kledo: ${(err as Error).message}`,
      });
    }
  } else {
    results.push({ name: "Token Kledo (Invoice)", ok: false, detail: "KLEDO_TOKEN belum diisi" });
  }

  // 4) Test send WA ke grup bukti TF (opsional)
  if (sendTest && fonnteToken) {
    try {
      const fd = new FormData();
      fd.append("target", TARGET_GROUP);
      fd.append(
        "message",
        `🧪 *Test Koneksi*\n\nIni pesan tes dari sistem ${namaToko || "Order"} pada ${new Date().toLocaleString("id-ID")}.\n\nJika Anda menerima pesan ini, integrasi WhatsApp ke grup *bukti transfer* sudah aktif. ✅`,
      );
      const resp = await fetch(`${FONNTE_BASE}/send`, {
        method: "POST",
        headers: { Authorization: fonnteToken },
        body: fd,
      });
      const text = await resp.text();
      let parsed: { status?: boolean; reason?: string } = {};
      try { parsed = JSON.parse(text); } catch { /* ignore */ }
      const ok = !!parsed.status;
      results.push({
        name: `Kirim Test ke Grup ${TARGET_GROUP}`,
        ok,
        detail: ok
          ? "Pesan tes berhasil dikirim — silakan cek grup WhatsApp."
          : `Gagal kirim: ${parsed.reason ?? text.slice(0, 200)}`,
      });
    } catch (err) {
      results.push({
        name: `Kirim Test ke Grup ${TARGET_GROUP}`,
        ok: false,
        detail: `Error: ${(err as Error).message}`,
      });
    }
  }

  const allOk = results.every(r => r.ok);
  logger.info({ allOk, sendTest }, "System health check executed");
  res.json({ ok: allOk, results, group: TARGET_GROUP });
});

export default router;
