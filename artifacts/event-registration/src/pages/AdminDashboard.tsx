import { useEffect, useState } from "react";
import {
  Package, Truck, CheckCircle, DollarSign,
  Search, RefreshCw, LogOut, User, Phone,
  MapPin, ShoppingCart, Clock, ChevronDown, Map,
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
  createdAt: string;
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const STATUS_LIST = ["Menunggu", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
const STATUS_COLOR: Record<string, string> = {
  Menunggu:   "#f59e0b",
  Diproses:   "#3b82f6",
  Dikirim:    "#8b5cf6",
  Selesai:    "#10b981",
  Dibatalkan: "#ef4444",
};
const STATUS_BG: Record<string, string> = {
  Menunggu:   "#fef3c7",
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

function PayBadge({ metode }: { metode: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    CASH: { bg: "#fef9c3", color: "#854d0e" },
    Debit: { bg: "#dbeafe", color: "#1d4ed8" },
    Transfer: { bg: "#f3e8ff", color: "#7c3aed" },
    BelumBayar: { bg: "#fee2e2", color: "#b91c1c" },
  };
  const s = styles[metode] ?? { bg: "#f3f4f6", color: "#6b7280" };
  const label = metode === "BelumBayar" ? "Belum Bayar" : metode;
  return (
    <span className="dash-status-badge" style={{ background: s.bg, color: s.color, border: `1.5px solid ${s.color}33` }}>
      {label}
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
    <div className="dash-stat">
      <div className="dash-stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="dash-stat-body">
        <div className="dash-stat-val" style={{ color }}>{value}</div>
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
  const [tab, setTab] = useState<"pesanan" | "pengiriman" | "wilayah">("pesanan");
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

  const filtered = scoped.filter(o =>
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
        </div>

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
        {tab === "wilayah" ? (
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
                    <PayBadge metode={order.metodePembayaran} />
                    <span className={`dash-status-badge ${order.whatsappSent === "true" ? "dash-badge--ok" : "dash-badge--fail"}`}>
                      {order.whatsappSent === "true" ? "✅ WA" : "❌ WA"}
                    </span>
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
          <div className="dash-list">
            {filtered.map(order => (
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
        )}
      </div>
    </div>
  );
}
