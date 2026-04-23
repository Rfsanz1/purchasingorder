import { useState } from "react";
import { SALES_USERNAMES } from "@/lib/salesFilters";

const DRIVER_USERNAMES = ["yanto", "wawan", "chaidar"];

interface Props {
  onForm: () => void;
  onAdmin: () => void;
  onDriver: (username: string) => void;
  onSales: (username: string) => void;
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

async function doLogin(
  role: "admin" | "driver" | "sales",
  password: string,
  username?: string,
): Promise<{ ok: boolean; username?: string; error?: string }> {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, ...(password ? { password } : {}), ...(username ? { username } : {}) }),
  });
  const data = await res.json();
  if (data.ok) {
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("loginAt", Date.now().toString());
    if (data.username) {
      const key = role === "driver" ? "driverUsername" : "salesUsername";
      sessionStorage.setItem(key, data.username);
    }
    return { ok: true, username: data.username };
  }
  return { ok: false, error: data.error };
}

function LoginModal({
  role,
  onClose,
  onSuccess,
}: {
  role: "admin" | "driver" | "sales";
  onClose: () => void;
  onSuccess: (username?: string) => void;
}) {
  const [pw, setPw] = useState("");
  const [user, setUser] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (role === "sales"  && !user.trim()) { setErr("Pilih nama sales"); return; }
    if (role === "driver" && !user.trim()) { setErr("Pilih nama driver"); return; }
    if (role !== "driver" && !pw.trim()) { setErr("Masukkan password"); return; }
    setLoading(true);
    setErr("");
    const r = await doLogin(role, pw, role === "sales" || role === "driver" ? user : undefined);
    setLoading(false);
    if (r.ok) onSuccess(r.username);
    else setErr(r.error || "Login gagal");
  };

  const title =
    role === "admin"  ? "Login Super Admin" :
    role === "driver" ? "Login Driver" :
                        "Login Sales";
  const icon =
    role === "admin"  ? "🔐" :
    role === "driver" ? "🚚" :
                        "🧑‍💼";

  return (
    <div className="lp-overlay" onClick={onClose}>
      <div className="lp-modal" onClick={e => e.stopPropagation()}>
        <div className="lp-modal-icon">{icon}</div>
        <h2 className="lp-modal-title">{title}</h2>
        <p className="lp-modal-sub">
          {role === "driver"
            ? "Pilih nama Anda lalu klik Masuk"
            : role === "sales"
              ? "Pilih nama lalu masukkan password"
              : "Masukkan password untuk melanjutkan"}
        </p>

        {(role === "sales" || role === "driver") && (
          <select
            className="lp-modal-input"
            value={user}
            onChange={e => setUser(e.target.value)}
            style={{ marginBottom: 10 }}
          >
            <option value="">
              {role === "sales" ? "— Pilih nama sales —" : "— Pilih nama driver —"}
            </option>
            {(role === "sales" ? SALES_USERNAMES : DRIVER_USERNAMES).map(u => (
              <option key={u} value={u}>{u.replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
        )}

        {role !== "driver" && (
          <input
            className={`lp-modal-input${err ? " lp-modal-input--err" : ""}`}
            type="password"
            placeholder="Password"
            value={pw}
            autoFocus={role !== "sales"}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        )}
        {err && <div className="lp-modal-err">{err}</div>}
        <button className="lp-modal-btn" onClick={handle} disabled={loading}>
          {loading ? "Memverifikasi..." : "Masuk"}
        </button>
        <button className="lp-modal-cancel" onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}

export default function LandingPage({ onForm, onAdmin, onDriver, onSales }: Props) {
  const [modal, setModal] = useState<"admin" | "driver" | "sales" | null>(null);

  return (
    <div className="lp-bg">
      <div className="lp-wrap">
        <div className="lp-hero">
          <div className="lp-logo">🛒</div>
          <h1 className="lp-title">Purchase Order</h1>
          <p className="lp-sub">Sistem manajemen pesanan terpadu</p>
        </div>

        <div className="lp-cards">
          <button className="lp-card lp-card--customer" onClick={onForm}>
            <div className="lp-card-icon">📝</div>
            <div className="lp-card-label">Buat Purchase Order</div>
            <div className="lp-card-desc">Isi form pemesanan produk</div>
          </button>

          <button className="lp-card lp-card--admin" onClick={() => setModal("admin")}>
            <div className="lp-card-icon">📋</div>
            <div className="lp-card-label">Dashboard Super Admin</div>
            <div className="lp-card-desc">Lihat semua pesanan & pengiriman</div>
          </button>

          <button className="lp-card lp-card--admin" onClick={() => setModal("sales")}>
            <div className="lp-card-icon">🧑‍💼</div>
            <div className="lp-card-label">Dashboard Sales</div>
            <div className="lp-card-desc">Lihat pesanan unit kamu saja</div>
          </button>

          <button className="lp-card lp-card--driver" onClick={() => setModal("driver")}>
            <div className="lp-card-icon">🚚</div>
            <div className="lp-card-label">Dashboard Driver</div>
            <div className="lp-card-desc">Lihat pengiriman & upload bukti foto</div>
          </button>
        </div>
      </div>

      {modal && (
        <LoginModal
          role={modal}
          onClose={() => setModal(null)}
          onSuccess={(username) => {
            const m = modal;
            setModal(null);
            if (m === "admin")  onAdmin();
            if (m === "driver") onDriver(username || "");
            if (m === "sales")  onSales(username || "");
          }}
        />
      )}
    </div>
  );
}
