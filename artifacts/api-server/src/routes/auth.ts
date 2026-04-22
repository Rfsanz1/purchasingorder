import { Router } from "express";

const router = Router();

// Daftar akun sales — username (lowercase) → password.
// Default password = "<nama>123". Bisa di-override via env SALES_PASS_<UPPERCASE>.
const SALES_USERNAMES = [
  "lehan", "wiwid", "priyanto", "agus", "agung",
  "andre", "imam", "dhani", "rio brandon", "ivan", "dias",
];

function salesPassword(username: string): string {
  const envKey = "SALES_PASS_" + username.replace(/\s+/g, "_").toUpperCase();
  return process.env[envKey] ?? `${username.replace(/\s+/g, "")}123`;
}

router.post("/auth/login", (req, res): void => {
  const { role, username, password } = req.body as {
    role?: string;
    username?: string;
    password?: string;
  };

  if (!role || !password) {
    res.status(400).json({ ok: false, error: "Role dan password wajib diisi" });
    return;
  }

  const adminPass  = process.env.ADMIN_PASSWORD  ?? "admin123";
  const driverPass = process.env.DRIVER_PASSWORD ?? "driver123";

  if (role === "admin" && password === adminPass) {
    res.json({ ok: true, role: "admin" });
    return;
  }

  // Driver: kalau username ada → login per orang. Kalau tidak ada → fallback password lama.
  if (role === "driver") {
    const name = (username ?? "").trim().toLowerCase();
    if (name) {
      const known: Record<string, string> = {
        yanto:   process.env.DRIVER_PASS_YANTO   ?? "yanto123",
        wawan:   process.env.DRIVER_PASS_WAWAN   ?? "wawan123",
        chaidar: process.env.DRIVER_PASS_CHAIDAR ?? "idar123",
      };
      if (!(name in known)) {
        res.status(401).json({ ok: false, error: "Username driver tidak dikenal" });
        return;
      }
      if (password !== known[name]) {
        res.status(401).json({ ok: false, error: "Password salah" });
        return;
      }
      res.json({ ok: true, role: "driver", username: name });
      return;
    }
    if (password === driverPass) {
      res.json({ ok: true, role: "driver" });
      return;
    }
  }

  if (role === "sales") {
    const name = (username ?? "").trim().toLowerCase();
    if (!name || !SALES_USERNAMES.includes(name)) {
      res.status(401).json({ ok: false, error: "Username sales tidak dikenal" });
      return;
    }
    if (password !== salesPassword(name)) {
      res.status(401).json({ ok: false, error: "Password salah" });
      return;
    }
    res.json({ ok: true, role: "sales", username: name });
    return;
  }

  res.status(401).json({ ok: false, error: "Password salah" });
});

export default router;
