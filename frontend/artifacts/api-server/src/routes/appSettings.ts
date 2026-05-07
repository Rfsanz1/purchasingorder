import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db/schema";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Daftar key yang dianggap "rahasia" — nilainya tidak akan dikirim plain ke
// frontend (cuma dikirim flag isSet=true/false). Ini supaya token Fonnte tidak
// bocor ke layar admin atau ke siapa pun yang nge-inspect network tab.
const SECRET_KEYS = new Set(["fonnteTokenGroup", "fonnteTokenCustomer"]);

// Daftar key valid yang boleh disimpan
const ALLOWED_KEYS = new Set([
  "fonnteTokenGroup",
  "fonnteTokenCustomer",
  "grupInvoiceId",
  "grupBuktiTfId",
]);

export type AppSettingsKey =
  | "fonnteTokenGroup"
  | "fonnteTokenCustomer"
  | "grupInvoiceId"
  | "grupBuktiTfId";

// Helper: ambil value 1 setting, fallback ke env var bila tidak ada di DB.
// Dipakai oleh kode lain (mis. orders.ts) untuk resolve token + grup ID.
const ENV_FALLBACK: Record<AppSettingsKey, string | undefined> = {
  fonnteTokenGroup:    process.env.FONNTE_TOKEN_GROUP || process.env.FONNTE_TOKEN,
  fonnteTokenCustomer: process.env.FONNTE_TOKEN_CUSTOMER || process.env.FONNTE_TOKEN,
  grupInvoiceId:       process.env.FONNTE_GROUP_INVOICE  || "120363405869453556@g.us",
  grupBuktiTfId:       process.env.FONNTE_GROUP_BUKTI_TF || "120363425112329389@g.us",
};

export async function getSetting(key: AppSettingsKey): Promise<string | undefined> {
  try {
    const rows = await db.select().from(appSettingsTable);
    const found = rows.find(r => r.key === key)?.value;
    if (found && found.length > 0) return found;
  } catch (err) {
    logger.warn({ err, key }, "getSetting DB read failed, fallback ke env var");
  }
  return ENV_FALLBACK[key];
}

// GET /settings — kembalikan semua pengaturan; untuk key rahasia hanya kirim
// { isSet: boolean } (tanpa nilai aslinya), supaya token tidak bocor.
router.get("/settings", async (_req, res): Promise<void> => {
  try {
    const rows = await db.select().from(appSettingsTable);
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;

    res.json({
      fonnteTokenGroup: {
        isSet: !!(map.fonnteTokenGroup || ENV_FALLBACK.fonnteTokenGroup),
        source: map.fonnteTokenGroup ? "db" : (ENV_FALLBACK.fonnteTokenGroup ? "env" : "none"),
      },
      fonnteTokenCustomer: {
        isSet: !!(map.fonnteTokenCustomer || ENV_FALLBACK.fonnteTokenCustomer),
        source: map.fonnteTokenCustomer ? "db" : (ENV_FALLBACK.fonnteTokenCustomer ? "env" : "none"),
      },
      grupInvoiceId: {
        value:  map.grupInvoiceId || ENV_FALLBACK.grupInvoiceId || "",
        source: map.grupInvoiceId ? "db" : (process.env.FONNTE_GROUP_INVOICE ? "env" : "default"),
      },
      grupBuktiTfId: {
        value:  map.grupBuktiTfId || ENV_FALLBACK.grupBuktiTfId || "",
        source: map.grupBuktiTfId ? "db" : (process.env.FONNTE_GROUP_BUKTI_TF ? "env" : "default"),
      },
    });
  } catch (err) {
    logger.error({ err }, "GET /settings failed");
    res.status(500).json({ error: "Gagal membaca pengaturan" });
  }
});

// PUT /settings — set/clear satu atau lebih pengaturan. Body bisa berisi
// nilai string (set) atau null/empty string (hapus, fallback ke env var).
router.put("/settings", async (req, res): Promise<void> => {
  const body = req.body as Record<string, string | null | undefined>;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Body harus object" });
    return;
  }

  const updates: Array<{ key: string; value: string }> = [];
  const deletes: string[] = [];

  for (const [k, v] of Object.entries(body)) {
    if (!ALLOWED_KEYS.has(k)) continue;
    if (v == null || (typeof v === "string" && v.trim().length === 0)) {
      deletes.push(k);
    } else if (typeof v === "string") {
      updates.push({ key: k, value: v.trim() });
    }
  }

  try {
    for (const d of deletes) {
      await db.delete(appSettingsTable).where(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await import("drizzle-orm")).eq(appSettingsTable.key, d) as any,
      );
    }
    for (const u of updates) {
      // upsert: insert atau update kalau key sudah ada
      await db
        .insert(appSettingsTable)
        .values({ key: u.key, value: u.value })
        .onConflictDoUpdate({
          target: appSettingsTable.key,
          set: { value: u.value, updatedAt: new Date() },
        });
    }
    logger.info({ updated: updates.map(u => u.key), deleted: deletes }, "App settings updated");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "PUT /settings failed");
    res.status(500).json({ error: "Gagal menyimpan pengaturan" });
  }
});

// (re-export untuk kemudahan import, tapi tetap pakai getSetting() helper)
export { SECRET_KEYS };
export default router;
