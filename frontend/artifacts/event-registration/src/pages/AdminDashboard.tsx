import { useEffect, useState } from "react";
import {
  Package, Truck, CheckCircle, DollarSign,
  Search, RefreshCw, LogOut, User, Phone,
  MapPin, ShoppingCart, Clock, ChevronDown, Map, Settings,
} from "lucide-react";

const DRIVER_LIST = ["Yanto", "Wawan", "Chaidar"];

type DriverAreas = Record<string, string[]>;

function DriverAreasPanel() {
  const [data, setData] = useState<DriverAreas>(
    Object.fromEntries(DRIVER_LIST.map(d => [d, []])),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/driver-areas`);
        if (res.ok) setData(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  const addArea = (driver: string) => {
    const v = (draft[driver] ?? "").trim();
    if (!v) return;
    setData(prev => {
      const exists = (prev[driver] ?? []).some(a => a.toLowerCase() === v.toLowerCase());
      if (exists) return prev;
      return { ...prev, [driver]: [...(prev[driver] ?? []), v] };
    });
    setDraft(prev => ({ ...prev, [driver]: "" }));
  };

  const removeArea = (driver: string, area: string) => {
    setData(prev => ({ ...prev, [driver]: (prev[driver] ?? []).filter(a => a !== area) }));
  };

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${baseUrl}/api/driver-areas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setMsg("✅ Tersimpan");
      setTimeout(() => setMsg(""), 2000);
    } catch (e: unknown) {
      setMsg("⚠️ " + (e instanceof Error ? e.message : "Error"));
    } finally { setSaving(false); }
  };

  return (
    <div className="dash-list" style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 6 }}>🗺️ Wilayah Driver per Kecamatan</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Tetapkan kecamatan-kecamatan yang menjadi tanggung jawab tiap driver. Saat
          mengatur pengiriman, Anda bisa lihat referensi ini agar pembagian wilayah konsisten.
        </p>
      </div>

      {loading ? (
        <div className="hc-loading">⏳ Memuat...</div>
      ) : (
        <div className="da-list">
          {DRIVER_LIST.map(driver => (
            <div key={driver} className="da-driver">
              <div className="da-driver-head">🚚 {driver}</div>
              <div className="da-chips">
                {(data[driver] ?? []).length === 0 && (
                  <span className="da-empty">Belum ada kecamatan</span>
                )}
                {(data[driver] ?? []).map(area => (
                  <span key={area} className="da-chip">
                    {area}
                    <button
                      type="button"
                      className="da-chip-x"
                      onClick={() => removeArea(driver, area)}
                      aria-label={`Hapus ${area}`}
                    >×</button>
                  </span>
                ))}
              </div>
              <div className="da-add">
                <input
                  className="da-input"
                  placeholder="Tambah kecamatan, lalu Enter"
                  value={draft[driver] ?? ""}
                  onChange={e => setDraft(prev => ({ ...prev, [driver]: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addArea(driver); } }}
                />
                <button type="button" className="da-add-btn" onClick={() => addArea(driver)}>
                  + Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg && <div className="hc-msg" style={{ marginTop: 12 }}>{msg}</div>}

      <div className="hc-actions" style={{ marginTop: 16, justifyContent: "flex-end" }}>
        <button className="hc-btn hc-btn-primary" onClick={save} disabled={saving || loading}>
          {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
// === Panel: Pengaturan WhatsApp (token Fonnte + ID grup tujuan) ===
type SettingsResponse = {
  fonnteTokenGroup:    { isSet: boolean; source: "db" | "env" | "none" };
  fonnteTokenCustomer: { isSet: boolean; source: "db" | "env" | "none" };
  grupInvoiceId:       { value: string;  source: "db" | "env" | "default" };
  grupBuktiTfId:       { value: string;  source: "db" | "env" | "default" };
};

function SettingsPanel() {
  const [data, setData]       = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState<{ ok: boolean; text: string } | null>(null);

  // Field input. Token: write-only (kosong = jangan ubah, isi = ganti).
  // Grup ID: tampilkan nilai sekarang, user bisa edit langsung.
  const [tokenGroup,    setTokenGroup]    = useState("");
  const [tokenCustomer, setTokenCustomer] = useState("");
  const [grupInvoice,   setGrupInvoice]   = useState("");
  const [grupBuktiTf,   setGrupBuktiTf]   = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/settings`);
      if (res.ok) {
        const j = (await res.json()) as SettingsResponse;
        setData(j);
        setGrupInvoice(j.grupInvoiceId.value || "");
        setGrupBuktiTf(j.grupBuktiTfId.value || "");
      }
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const labelSource = (s: "db" | "env" | "default" | "none") =>
    s === "db"      ? "(diset dari halaman ini)"
    : s === "env"   ? "(diset dari environment server)"
    : s === "default" ? "(pakai nilai default)"
    : "(belum diisi)";

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      // Hanya kirim field yang user ubah:
      // - Untuk token: cuma kirim kalau user mengetik sesuatu (kosong = jangan ubah)
      // - Untuk grup ID: selalu kirim (kosong = reset ke default)
      const body: Record<string, string | null> = {
        grupInvoiceId: grupInvoice.trim(),
        grupBuktiTfId: grupBuktiTf.trim(),
      };
      if (tokenGroup.trim().length > 0)    body.fonnteTokenGroup    = tokenGroup.trim();
      if (tokenCustomer.trim().length > 0) body.fonnteTokenCustomer = tokenCustomer.trim();

      const res = await fetch(`${baseUrl}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setMsg({ ok: true, text: "✅ Pengaturan tersimpan. Perubahan langsung berlaku untuk order berikutnya." });
      setTokenGroup(""); setTokenCustomer("");
      await load();
    } catch (e: unknown) {
      setMsg({ ok: false, text: "❌ " + (e instanceof Error ? e.message : "Error") });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="dash-empty"><div className="dash-empty-icon">⏳</div><p>Memuat pengaturan...</p></div>;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
    borderRadius: 8, fontSize: 14, fontFamily: "monospace",
  };
  const sectionStyle: React.CSSProperties = {
    marginBottom: 24, padding: 16, background: "#f9fafb",
    border: "1px solid #e5e7eb", borderRadius: 10,
  };
  const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 };
  const hintStyle:  React.CSSProperties = { fontSize: 12, color: "#6b7280", marginTop: 4, marginBottom: 8 };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginTop: 0, marginBottom: 4, fontSize: 18, fontWeight: 700 }}>⚙️ Pengaturan WhatsApp & Fonnte</h2>
      <p style={{ marginTop: 0, marginBottom: 20, color: "#6b7280", fontSize: 13 }}>
        Atur token Fonnte dan ID grup tujuan tanpa perlu redeploy. Perubahan langsung berlaku.
      </p>

      {/* Token Group */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Token Fonnte — Grup (kirim ke grup Invoice & Bukti TF)</label>
        <div style={hintStyle}>
          Status: {data?.fonnteTokenGroup.isSet ? "✅ Terisi" : "❌ Belum terisi"} {labelSource(data?.fonnteTokenGroup.source ?? "none")}
          <br />Token dari device Fonnte yang dipakai untuk mengirim ke <strong>grup WA</strong> (mis. nomor 081225804632). Kosongkan untuk membiarkan apa adanya.
        </div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Paste token baru di sini, atau biarkan kosong"
          value={tokenGroup}
          onChange={e => setTokenGroup(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Token Customer */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Token Fonnte — Customer (kirim chat pribadi ke nomor customer)</label>
        <div style={hintStyle}>
          Status: {data?.fonnteTokenCustomer.isSet ? "✅ Terisi" : "❌ Belum terisi"} {labelSource(data?.fonnteTokenCustomer.source ?? "none")}
          <br />Token dari device Fonnte yang dipakai untuk mengirim chat ke <strong>nomor customer</strong> (mis. nomor 085603590049). Kosongkan untuk membiarkan apa adanya.
        </div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Paste token baru di sini, atau biarkan kosong"
          value={tokenCustomer}
          onChange={e => setTokenCustomer(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* ID Grup Invoice */}
      <div style={sectionStyle}>
        <label style={labelStyle}>ID Grup WA — Invoice / Order Form Masuk</label>
        <div style={hintStyle}>
          Sumber: {labelSource(data?.grupInvoiceId.source ?? "default")}.
          Format: <code>120363xxxxxxxx@g.us</code>. Kosongkan untuk reset ke default.
        </div>
        <input
          type="text"
          placeholder="120363xxxxxxxx@g.us"
          value={grupInvoice}
          onChange={e => setGrupInvoice(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* ID Grup Bukti TF */}
      <div style={sectionStyle}>
        <label style={labelStyle}>ID Grup WA — Bukti Transfer / Payment Methode</label>
        <div style={hintStyle}>
          Sumber: {labelSource(data?.grupBuktiTfId.source ?? "default")}.
          Format: <code>120363xxxxxxxx@g.us</code>. Kosongkan untuk reset ke default.
        </div>
        <input
          type="text"
          placeholder="120363xxxxxxxx@g.us"
          value={grupBuktiTf}
          onChange={e => setGrupBuktiTf(e.target.value)}
          style={inputStyle}
        />
      </div>

      {msg && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 14,
          background: msg.ok ? "#d1fae5" : "#fee2e2",
          color:      msg.ok ? "#065f46" : "#991b1b",
        }}>{msg.text}</div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={load}
          disabled={saving}
          style={{ padding: "10px 18px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
        >
          🔄 Muat Ulang
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: "10px 20px", border: "none", background: "#0284c7", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          {saving ? "Menyimpan..." : "💾 Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}

import { filterOrdersForSales, SALES_SCOPES } from "@/lib/salesFilters";

interface Order {
  id: number;
  orderId: string;
  namaKontak: string;
  nomorTelepon: string;
  alamat: string;
  patokanLokasi: string;
  namaProduk: string;
  jumlahProduk: number;
  hargaProduk: number;
  biayaPengiriman: number | null;
  totalHarga: number;
  salesPerson: string;
  metodePembayaran: string;
  keteranganPembayaran: string | null;
  whatsappSent: string;
  statusPengiriman: string;
  driverName: string | null;
  metodePengiriman?: string;
  kategoriProduk?: string;
  customerLat?: string | null;
  customerLng?: string | null;
  customerLocSharedAt?: string | null;
  // Multi-metode pembayaran (DP / split CASH+Transfer+Debit)
  paymentSplits?: string | null;        // JSON: [{method, amount, bankAccountId?}]
  buktiTransferList?: string | null;    // JSON: ["data:image/...", ...]
  dpAmount?: number | null;             // jumlah dibayar di muka
  sisaPembayaran?: number | null;       // sisa yg belum dibayar (DP > 0 berarti ada DP)
  hasBuktiTf?: boolean;                 // flag ringan untuk badge "Lihat Bukti TF" di list
  createdAt: string;
}

// === Helper: parse paymentSplits JSON dengan aman ===
type ParsedSplit = { method: string; amount: number; bankAccountId?: number };
function parsePaymentSplits(raw: string | null | undefined): ParsedSplit[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is ParsedSplit => x && typeof x === "object" && typeof x.method === "string" && typeof x.amount === "number")
      .map(x => ({ method: x.method, amount: x.amount, bankAccountId: typeof x.bankAccountId === "number" ? x.bankAccountId : undefined }));
  } catch { return []; }
}
// Label bank ringkas (untuk detail view) — match TRANSFER_BANKS/EDC_BANKS di form
const BANK_LABELS: Record<number, string> = {
  1470: "BCA GIRO", 3: "MANDIRI", 1456: "BNI", 1464: "BRI",
  1465: "BCA EDC", 1457: "BRI EDC",
};

type KategoriFilter = "Semua" | "Elektronik" | "BahanBangunan" | "Campuran";
const KATEGORI_OPTIONS: { v: KategoriFilter; label: string; icon: string }[] = [
  { v: "Semua",         label: "Semua",          icon: "📦" },
  { v: "Elektronik",    label: "Elektronik",     icon: "⚡" },
  { v: "BahanBangunan", label: "Bahan Bangunan", icon: "🧱" },
  { v: "Campuran",      label: "Campuran",       icon: "🔀" },
];

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const STATUS_LIST = ["Menunggu", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
const STATUS_COLOR: Record<string, string> = {
  Menunggu:   "#6b7280",
  Diproses:   "#3b82f6",
  Dikirim:    "#8b5cf6",
  Selesai:    "#10b981",
  Dibatalkan: "#ef4444",
};
const STATUS_BG: Record<string, string> = {
  Menunggu:   "#f3f4f6",
  Diproses:   "#dbeafe",
  Dikirim:    "#ede9fe",
  Selesai:    "#d1fae5",
  Dibatalkan: "#fee2e2",
};

function formatRupiah(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="dash-status-badge" style={{
      background: STATUS_BG[status] ?? "#f3f4f6",
      color: STATUS_COLOR[status] ?? "#6b7280",
      border: `1.5px solid ${STATUS_COLOR[status] ?? "#d1d5db"}`,
    }}>{status}</span>
  );
}

function PayBadge({ metode, dpAmount, sisaPembayaran }: { metode: string; dpAmount?: number | null; sisaPembayaran?: number | null }) {
  // Backend menyimpan SUMMARY di metodePembayaran:
  //   "CASH"/"Debit"/"Transfer" — single method lunas
  //   "DP"                      — sebagian dibayar, sisa Belum Bayar
  //   "Multi"                   — gabungan beberapa metode (semua lunas)
  //   "BelumBayar"              — belum dibayar sama sekali
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    CASH:       { bg: "#fef9c3", color: "#854d0e", label: "CASH" },
    Debit:      { bg: "#dbeafe", color: "#1d4ed8", label: "Debit" },
    Transfer:   { bg: "#f3e8ff", color: "#7c3aed", label: "Transfer" },
    BelumBayar: { bg: "#fee2e2", color: "#b91c1c", label: "Belum Bayar" },
    DP:         { bg: "#fed7aa", color: "#9a3412", label: sisaPembayaran ? `DP (sisa ${(sisaPembayaran/1000).toFixed(0)}rb)` : "DP" },
    Multi:      { bg: "#ede9fe", color: "#6d28d9", label: "Multi ✓" },
  };
  const s = styles[metode] ?? { bg: "#f3f4f6", color: "#6b7280", label: metode };
  return (
    <span className="dash-status-badge" style={{ background: s.bg, color: s.color, border: `1.5px solid ${s.color}33` }}>
      {s.label}
    </span>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  bg: string;
}
function StatCard({ icon, value, label, color, bg }: StatCardProps) {
  return (
    <div className="dash-stat" style={{ "--stat-accent": color } as React.CSSProperties}>
      <div className="dash-stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="dash-stat-body">
        <div className="dash-stat-val">{value}</div>
        <div className="dash-stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  onLogout,
  salesUsername,
}: {
  onLogout: () => void;
  salesUsername?: string;
}) {
  const isSales = !!salesUsername;
  const scope = salesUsername ? SALES_SCOPES[salesUsername.toLowerCase()] : null;
  const [tab, setTab] = useState<"pesanan" | "pengiriman" | "wilayah" | "pengaturan">("pesanan");
  const [pengirimanSub, setPengirimanSub] = useState<string>("Menunggu");
  const [kategoriFilter, setKategoriFilter] = useState<KategoriFilter>("Semua");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${baseUrl}/api/orders`);
      if (!res.ok) throw new Error("Gagal memuat data");
      setOrders(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error tidak diketahui");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const scoped = isSales ? filterOrdersForSales(orders, salesUsername!) : orders;

  // Filter kategori (super admin only — bahan bangunan vs elektronik vs campuran)
  const byKategori = (!isSales && kategoriFilter !== "Semua")
    ? scoped.filter(o => (o.kategoriProduk ?? "BahanBangunan") === kategoriFilter)
    : scoped;

  const filtered = byKategori.filter(o =>
    [o.namaKontak, o.nomorTelepon, o.namaProduk, o.salesPerson, o.orderId]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPendapatan = filtered.reduce((s, o) => s + o.totalHarga, 0);

  const updateStatus = async (id: number, statusPengiriman: string, driverName?: string) => {
    setUpdatingId(id);
    try {
      await fetch(`${baseUrl}/api/orders/${id}/pengiriman`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusPengiriman, ...(driverName !== undefined ? { driverName } : {}) }),
      });
      setOrders(prev => prev.map(o => o.id === id
        ? { ...o, statusPengiriman, ...(driverName !== undefined ? { driverName } : {}) }
        : o
      ));
    } finally { setUpdatingId(null); }
  };

  return (
    <div className="dash-bg">
      <div className="dash-wrap">

        {/* ── Header ── */}
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-header-icon-wrap">{isSales ? "🧑‍💼" : "📦"}</div>
            <div>
              <h1 className="dash-title">
                {isSales
                  ? `Dashboard Sales — ${salesUsername!.replace(/\b\w/g, c => c.toUpperCase())}`
                  : "Dashboard Super Admin"}
              </h1>
              <p className="dash-sub">
                {isSales
                  ? `Unit yang kamu kelola: ${scope?.label ?? salesUsername}`
                  : "Kelola semua pesanan & pengiriman"}
              </p>
            </div>
          </div>
          <div className="dash-header-actions">
            <button className="dash-btn dash-btn--ghost" onClick={fetchOrders}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="dash-btn dash-btn--danger" onClick={onLogout}>
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dash-stats">
          <StatCard icon={<Package size={18}/>} value={orders.length} label="Total Order" color="#0284c7" bg="#e0f2fe" />
          <StatCard icon={<Truck size={18}/>} value={orders.filter(o => o.statusPengiriman === "Dikirim").length} label="Sedang Dikirim" color="#7c3aed" bg="#ede9fe" />
          <StatCard icon={<CheckCircle size={18}/>} value={orders.filter(o => o.statusPengiriman === "Selesai").length} label="Selesai" color="#059669" bg="#d1fae5" />
          <StatCard icon={<DollarSign size={18}/>} value={formatRupiah(totalPendapatan)} label="Total Pendapatan" color="#d97706" bg="#fef3c7" />
        </div>

        {/* ── Tabs ── */}
        <div className="dash-tabs">
          <button className={`dash-tab${tab === "pesanan" ? " dash-tab--active" : ""}`} onClick={() => setTab("pesanan")}>
            <ShoppingCart size={14} /> Pesanan Masuk
          </button>
          <button className={`dash-tab${tab === "pengiriman" ? " dash-tab--active" : ""}`} onClick={() => setTab("pengiriman")}>
            <Truck size={14} /> Kelola Pengiriman
          </button>
          {!isSales && (
            <button className={`dash-tab${tab === "wilayah" ? " dash-tab--active" : ""}`} onClick={() => setTab("wilayah")}>
              <Map size={14} /> Wilayah Driver
            </button>
          )}
          {!isSales && (
            <button className={`dash-tab${tab === "pengaturan" ? " dash-tab--active" : ""}`} onClick={() => setTab("pengaturan")}>
              <Settings size={14} /> Pengaturan
            </button>
          )}
        </div>

        {/* ── Filter Kategori (super admin saja, sembunyikan di Wilayah & Pengaturan) ── */}
        {!isSales && tab !== "wilayah" && tab !== "pengaturan" && (
          <div className="dash-subtabs" role="tablist" style={{ marginBottom: 10 }}>
            {KATEGORI_OPTIONS.map(k => {
              const count = k.v === "Semua"
                ? scoped.length
                : scoped.filter(o => (o.kategoriProduk ?? "BahanBangunan") === k.v).length;
              const active = kategoriFilter === k.v;
              return (
                <button
                  key={k.v}
                  role="tab"
                  aria-selected={active}
                  className={`dash-subtab${active ? " dash-subtab--active" : ""}`}
                  onClick={() => setKategoriFilter(k.v)}
                  style={active ? {
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    borderColor: "#1d4ed8",
                  } : undefined}
                >
                  <span>{k.icon} {k.label}</span>
                  <span className="dash-subtab-count" style={active ? { background: "#1d4ed8", color: "#fff" } : undefined}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Search (sembunyikan di tab Wilayah) ── */}
        {tab !== "wilayah" && (
          <div className="dash-search-wrap">
            <Search size={15} className="dash-search-icon" />
            <input
              className="dash-search"
              placeholder="Cari nama, nomor, produk, sales, order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="dash-search-clear" onClick={() => setSearch("")}>✕</button>}
          </div>
        )}

        {/* ── Content ── */}
        {tab === "pengaturan" ? (
          <SettingsPanel />
        ) : tab === "wilayah" ? (
          <DriverAreasPanel />
        ) : loading ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">⏳</div>
            <p>Memuat data pesanan...</p>
          </div>
        ) : error ? (
          <div className="dash-empty dash-empty--error">
            <div className="dash-empty-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">{search ? "🔍" : "📭"}</div>
            <p>{search ? "Tidak ada hasil untuk pencarian ini" : "Belum ada order masuk"}</p>
          </div>
        ) : tab === "pesanan" ? (

          /* ── Tab: Pesanan Masuk ── */
          <div className="dash-list">
            {filtered.map(order => (
              <div key={order.id} className="dash-card" style={{ borderLeftColor: STATUS_COLOR[order.statusPengiriman] ?? "#d1d5db" }}>
                <div className="dash-card-top">
                  <div className="dash-card-top-left">
                    <span className="dash-order-id">#{order.orderId}</span>
                    <span className="dash-order-time"><Clock size={11} /> {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="dash-card-badges">
                    <StatusBadge status={order.statusPengiriman} />
                    <PayBadge metode={order.metodePembayaran} dpAmount={order.dpAmount} sisaPembayaran={order.sisaPembayaran} />
                    {order.kategoriProduk && (
                      <span className="dash-status-badge" style={{
                        background: order.kategoriProduk === "Elektronik" ? "#fef3c7"
                                  : order.kategoriProduk === "BahanBangunan" ? "#e0f2fe"
                                  : "#f3e8ff",
                        color: order.kategoriProduk === "Elektronik" ? "#92400e"
                                  : order.kategoriProduk === "BahanBangunan" ? "#0369a1"
                                  : "#6b21a8",
                        border: "1.5px solid currentColor",
                      }}>
                        {order.kategoriProduk === "Elektronik" ? "⚡ Elektronik"
                          : order.kategoriProduk === "BahanBangunan" ? "🧱 Bahan Bangunan"
                          : "🔀 Campuran"}
                      </span>
                    )}
                    {order.metodePengiriman === "BawaSendiri" && (
                      <span className="dash-status-badge" style={{
                        background: "#ecfdf5", color: "#065f46", border: "1.5px solid #10b981",
                      }}>🛍️ Bawa Sendiri</span>
                    )}
                    <span className={`dash-status-badge ${order.whatsappSent === "true" ? "dash-badge--ok" : "dash-badge--fail"}`}>
                      {order.whatsappSent === "true" ? "✅ WA" : "❌ WA"}
                    </span>
                    {order.hasBuktiTf && (
                      <a
                        href={`/api/orders/${order.orderId}/bukti-tf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dash-status-badge"
                        style={{
                          background: "#dbeafe",
                          color: "#1e40af",
                          border: "1.5px solid #3b82f6",
                          textDecoration: "none",
                        }}
                        title="Buka foto bukti transfer di tab baru"
                      >
                        📷 Lihat Bukti TF
                      </a>
                    )}
                  </div>
                </div>

                <div className="dash-card-grid">
                  {/* Left: Customer Info */}
                  <div className="dash-info-col">
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><User size={12}/></span>
                      <div><div className="dash-info-lbl">Nama</div><div className="dash-info-val dash-bold">{order.namaKontak}</div></div>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><Phone size={12}/></span>
                      <div><div className="dash-info-lbl">Telepon</div>
                        <a href={`https://wa.me/${order.nomorTelepon.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="dash-wa-link">{order.nomorTelepon}</a>
                      </div>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><MapPin size={12}/></span>
                      <div><div className="dash-info-lbl">Alamat</div><div className="dash-info-val">{order.alamat}</div></div>
                    </div>
                    {order.patokanLokasi && (
                      <div className="dash-info-row">
                        <span className="dash-info-icon">🗺️</span>
                        <div><div className="dash-info-lbl">Patokan</div><div className="dash-info-val">{order.patokanLokasi}</div></div>
                      </div>
                    )}
                    {order.customerLat && order.customerLng && (
                      <div className="dash-info-row">
                        <span className="dash-info-icon">📍</span>
                        <div>
                          <div className="dash-info-lbl">Lokasi GPS</div>
                          <div className="dash-info-val">
                            <a
                              href={`https://www.google.com/maps?q=${order.customerLat},${order.customerLng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                background: "#16a34a", color: "#fff",
                                padding: "3px 10px", borderRadius: 6,
                                fontSize: 11, fontWeight: 600, textDecoration: "none",
                              }}
                              title="Buka di Google Maps"
                            >
                              🗺️ Buka di Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="dash-info-row">
                      <span className="dash-info-icon">🧑</span>
                      <div><div className="dash-info-lbl">Sales</div><div className="dash-info-val">{order.salesPerson}</div></div>
                    </div>
                    {order.driverName && (
                      <div className="dash-info-row">
                        <span className="dash-info-icon"><Truck size={12}/></span>
                        <div><div className="dash-info-lbl">Driver</div><div className="dash-info-val">{order.driverName}</div></div>
                      </div>
                    )}
                  </div>

                  {/* Right: Product + Price */}
                  <div className="dash-price-col">
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><ShoppingCart size={12}/></span>
                      <div><div className="dash-info-lbl">Produk</div><div className="dash-info-val">{order.namaProduk}</div></div>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><Package size={12}/></span>
                      <div><div className="dash-info-lbl">Jumlah</div><div className="dash-info-val">{order.jumlahProduk} unit</div></div>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-icon"><DollarSign size={12}/></span>
                      <div><div className="dash-info-lbl">Harga Satuan</div><div className="dash-info-val">{formatRupiah(order.hargaProduk)}</div></div>
                    </div>
                    {order.biayaPengiriman ? (
                      <div className="dash-info-row">
                        <span className="dash-info-icon"><Truck size={12}/></span>
                        <div><div className="dash-info-lbl">Ongkir</div><div className="dash-info-val">{formatRupiah(order.biayaPengiriman)}</div></div>
                      </div>
                    ) : null}
                    {order.keteranganPembayaran ? (
                      <div className="dash-info-row">
                        <span className="dash-info-icon">📝</span>
                        <div><div className="dash-info-lbl">Status Bayar</div><div className="dash-info-val">{order.keteranganPembayaran}</div></div>
                      </div>
                    ) : null}
                    {/* === Breakdown multi-metode (kalau ada paymentSplits) === */}
                    {(() => {
                      const splits = parsePaymentSplits(order.paymentSplits);
                      if (splits.length === 0) return null;
                      // Cuma tampilkan kalau >1 split atau ada DP (sisa>0)
                      const sisa = order.sisaPembayaran ?? 0;
                      if (splits.length === 1 && sisa === 0) return null;
                      return (
                        <div style={{
                          marginTop: 8, padding: "8px 10px", borderRadius: 6,
                          background: "#f9fafb", border: "1px dashed #d1d5db",
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6, letterSpacing: 0.3 }}>
                            RINCIAN PEMBAYARAN
                          </div>
                          {splits.filter(s => s.method !== "BelumBayar" && s.amount > 0).map((s, i) => {
                            const bankLabel = s.bankAccountId ? ` – ${BANK_LABELS[s.bankAccountId] ?? `ID ${s.bankAccountId}`}` : "";
                            return (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                                <span style={{ color: "#374151" }}>{s.method}{bankLabel}</span>
                                <strong style={{ color: "#059669" }}>{formatRupiah(s.amount)}</strong>
                              </div>
                            );
                          })}
                          {sisa > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4, paddingTop: 4, borderTop: "1px dashed #d1d5db" }}>
                              <span style={{ color: "#9a3412", fontWeight: 600 }}>⏳ Belum Bayar (sisa)</span>
                              <strong style={{ color: "#9a3412" }}>{formatRupiah(sisa)}</strong>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div className="dash-total-row">
                      <span>TOTAL</span>
                      <span className="dash-total-val">{formatRupiah(order.totalHarga)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (

          /* ── Tab: Kelola Pengiriman ── */
          <>
            <div className="dash-subtabs" role="tablist">
              {STATUS_LIST.map(s => {
                const count = scoped.filter(o => o.statusPengiriman === s).length;
                const active = pengirimanSub === s;
                return (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={active}
                    className={`dash-subtab${active ? " dash-subtab--active" : ""}`}
                    onClick={() => setPengirimanSub(s)}
                    style={active ? {
                      background: STATUS_BG[s],
                      color: STATUS_COLOR[s],
                      borderColor: STATUS_COLOR[s],
                    } : undefined}
                  >
                    <span>{s}</span>
                    <span className="dash-subtab-count" style={active ? { background: STATUS_COLOR[s], color: "#fff" } : undefined}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="dash-list">
              {filtered.filter(o => o.statusPengiriman === pengirimanSub).length === 0 && (
                <div className="dash-empty">Tidak ada pesanan dengan status <b>{pengirimanSub}</b></div>
              )}
              {filtered.filter(o => o.statusPengiriman === pengirimanSub).map(order => (
              <div key={order.id} className="dash-card" style={{ borderLeftColor: STATUS_COLOR[order.statusPengiriman] ?? "#d1d5db" }}>
                <div className="dash-card-top">
                  <div className="dash-card-top-left">
                    <span className="dash-order-id">#{order.orderId}</span>
                    <span className="dash-order-time"><User size={11}/> {order.namaKontak} · {order.nomorTelepon}</span>
                  </div>
                  <StatusBadge status={order.statusPengiriman} />
                </div>

                <div className="dash-delivery-addr">
                  <MapPin size={13} />
                  <span>{order.alamat}{order.patokanLokasi ? ` — ${order.patokanLokasi}` : ""}</span>
                </div>
                <div className="dash-delivery-product">
                  <ShoppingCart size={13} />
                  <span>{order.namaProduk} × {order.jumlahProduk}</span>
                  <span className="dash-delivery-total">{formatRupiah(order.totalHarga)}</span>
                </div>

                <div className="dash-delivery-controls">
                  <div className="dash-delivery-group">
                    <label className="dash-delivery-label">Status Pengiriman</label>
                    <div className="dash-delivery-select-wrap">
                      <select
                        className="dash-delivery-select"
                        value={order.statusPengiriman}
                        disabled={updatingId === order.id}
                        onChange={e => updateStatus(order.id, e.target.value, order.driverName ?? undefined)}
                      >
                        {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={13} className="dash-delivery-chevron" />
                    </div>
                  </div>
                  <div className="dash-delivery-group">
                    <label className="dash-delivery-label">Nama Driver</label>
                    <select
                      className="dash-delivery-input"
                      value={order.driverName ?? ""}
                      disabled={updatingId === order.id}
                      onChange={e => {
                        if (e.target.value !== (order.driverName ?? "")) {
                          updateStatus(order.id, order.statusPengiriman, e.target.value);
                        }
                      }}
                    >
                      <option value="">— Pilih driver —</option>
                      <option value="Yanto">Yanto</option>
                      <option value="Wawan">Wawan</option>
                      <option value="Chaidar">Chaidar</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
