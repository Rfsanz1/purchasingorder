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

const menuItems = [
  {
    id: "form",
    emoji: "🛒",
    label: "Buat Order",
    desc: "Form pemesanan produk",
    color: "#2563eb",
    bg: "#eff6ff",
    role: null as null,
  },
  {
    id: "admin",
    emoji: "📊",
    label: "Super Admin",
    desc: "Semua pesanan & pengiriman",
    color: "#7c3aed",
    bg: "#f5f3ff",
    role: "admin" as "admin",
  },
  {
    id: "sales",
    emoji: "🧑‍💼",
    label: "Sales",
    desc: "Pesanan unit kamu saja",
    color: "#d97706",
    bg: "#fffbeb",
    role: "sales" as "sales",
  },
  {
    id: "driver",
    emoji: "🚚",
    label: "Driver",
    desc: "Pengiriman & bukti foto",
    color: "#059669",
    bg: "#ecfdf5",
    role: "driver" as "driver",
  },
];

export default function LandingPage({ onForm, onAdmin, onDriver, onSales }: Props) {
  const [modal, setModal] = useState<"admin" | "driver" | "sales" | null>(null);

  const handleMenuClick = (item: typeof menuItems[number]) => {
    if (item.id === "form") { onForm(); return; }
    if (item.role) setModal(item.role);
  };

  return (
    <div className="lp-bg">

      {/* ── Header Hero ── */}
      <div className="lp-header">
        {/* Blob decorations */}
        <div className="lp-header-blob lp-header-blob--1" />
        <div className="lp-header-blob lp-header-blob--2" />

        {/* Top row: title + bell */}
        <div className="lp-header-top">
          <div>
            <p className="lp-header-greeting">Selamat Datang 👋</p>
            <h1 className="lp-header-title">Purchase Order</h1>
          </div>
          <button className="lp-header-bell" aria-label="Notifikasi">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>

        {/* Stats row inside header */}
        <div className="lp-header-stats">
          <div className="lp-hstat">
            <p className="lp-hstat-val">—</p>
            <p className="lp-hstat-key">Total PO</p>
          </div>
          <div className="lp-hstat-div" />
          <div className="lp-hstat">
            <p className="lp-hstat-val">—</p>
            <p className="lp-hstat-key">Tertunda</p>
          </div>
          <div className="lp-hstat-div" />
          <div className="lp-hstat">
            <p className="lp-hstat-val">—</p>
            <p className="lp-hstat-key">Terkirim</p>
          </div>
        </div>
      </div>

      {/* ── Curved wave separator ── */}
      <div className="lp-wave" aria-hidden="true">
        <svg viewBox="0 0 390 40" preserveAspectRatio="none">
          <path d="M0,0 C130,40 260,40 390,0 L390,40 L0,40 Z" fill="#f5f7fb"/>
        </svg>
      </div>

      {/* ── Body ── */}
      <div className="lp-body">

        {/* Quick actions */}
        <div className="lp-quick-row">
          <button className="lp-quick-btn" onClick={onForm}>
            <span className="lp-quick-icon">➕</span>
            <span>Buat PO</span>
          </button>
          <button className="lp-quick-btn" onClick={() => setModal("admin")}>
            <span className="lp-quick-icon">👁️</span>
            <span>Lihat</span>
          </button>
          <button className="lp-quick-btn" onClick={() => setModal("admin")}>
            <span className="lp-quick-icon">⚙️</span>
            <span>Kelola</span>
          </button>
        </div>

        {/* Section header */}
        <div className="lp-section-header">
          <span className="lp-section-title">Pilih Akses</span>
          <span className="lp-section-tag">4 Menu</span>
        </div>

        {/* 2x2 Grid — Medigram style */}
        <div className="lp-grid">
          {menuItems.map(item => (
            <button
              key={item.id}
              className="lp-grid-card"
              onClick={() => handleMenuClick(item)}
            >
              <div className="lp-grid-icon-wrap" style={{ background: item.bg, color: item.color }}>
                <span className="lp-grid-emoji">{item.emoji}</span>
              </div>
              <p className="lp-grid-label">{item.label}</p>
              <p className="lp-grid-desc">{item.desc}</p>
            </button>
          ))}
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
