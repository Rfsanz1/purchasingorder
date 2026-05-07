import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "driver-areas.json");

const DEFAULT_DRIVERS = ["Yanto", "Wawan", "Chaidar"];

type DriverAreas = Record<string, string[]>;

function ensureFile(): DriverAreas {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const init: DriverAreas = Object.fromEntries(DEFAULT_DRIVERS.map(d => [d, []]));
    fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as DriverAreas;
    // pastikan semua driver default ada
    for (const d of DEFAULT_DRIVERS) if (!(d in raw)) raw[d] = [];
    return raw;
  } catch {
    const init: DriverAreas = Object.fromEntries(DEFAULT_DRIVERS.map(d => [d, []]));
    fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
    return init;
  }
}

router.get("/driver-areas", (_req, res) => {
  res.json(ensureFile());
});

router.put("/driver-areas", (req, res): void => {
  const body = req.body as DriverAreas;
  if (!body || typeof body !== "object") {
    res.status(400).json({ ok: false, error: "Body harus berupa object" });
    return;
  }
  const cleaned: DriverAreas = {};
  for (const [driver, areas] of Object.entries(body)) {
    if (typeof driver !== "string") continue;
    const list = Array.isArray(areas)
      ? areas.map(a => String(a).trim()).filter(Boolean)
      : [];
    // dedup case-insensitive
    const seen = new Set<string>();
    cleaned[driver] = list.filter(a => {
      const k = a.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  for (const d of DEFAULT_DRIVERS) if (!(d in cleaned)) cleaned[d] = [];
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(cleaned, null, 2));
  logger.info({ drivers: Object.keys(cleaned) }, "Driver areas updated");
  res.json({ ok: true, data: cleaned });
});

export default router;
