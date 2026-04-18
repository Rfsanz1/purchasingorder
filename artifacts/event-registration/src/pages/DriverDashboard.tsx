import { useEffect, useState } from "react";
import {
  Truck, CheckCircle, Clock, User, Phone,
  MapPin, ShoppingCart, RefreshCw, LogOut, Package,
} from "lucide-react";

interface Order {
  id: number;
  orderId: string;
  namaKontak: string;
  nomorTelepon: string;
  alamat: string;
  patokanLokasi: string;
  namaProduk: string;
  jumlahProduk: number;
  totalHarga: number;
  biayaPengiriman: number | null;
  statusPengiriman: string;
  driverName: string | null;
  createdAt: string;
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATUS_STEPS = ["Menunggu", "Diproses", "Dikirim", "Selesai"];
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
const NEXT_STATUS: Record<string, string | null> = {
  Menunggu:   "Diproses",
  Diproses:   "Dikirim",
  Dikirim:    "Selesai",
  Selesai:    null,
  Dibatalkan: null,
};
const NEXT_LABEL: Record<string, string> = {
  Menunggu: "Mulai Proses",
  Diproses: "Tandai Dikirim",
  Dikirim:  "Tandai Selesai",
};
const NEXT_COLOR: Record<string, { bg: string; color: string }> = {
  Menunggu: { bg: "#fef3c7", color: "#92400e" },
  Diproses: { bg: "#8b5cf6", color: "#fff" },
  Dikirim:  { bg: "#10b981", color: "#fff" },
};

function formatRupiah(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function StatusProgress({ status }: { status: string }) {
  if (status === "Dibatalkan") {
    return (
      <div className="drv-progress">
        <span className="drv-cancelled-badge">Dibatalkan</span>
      </div>
    );
  }
  const current = STATUS_STEPS.indexOf(status);
  return (
    <div className="drv-progress">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="drv-step-wrap">
          <div className={`drv-step-dot${i <= current ? " drv-step-dot--done" : ""}${i === current ? " drv-step-dot--current" : ""}`}
            style={i === current ? { background: STATUS_COLOR[status], boxShadow: `0 0 0 3px ${STATUS_COLOR[status]}33` } : {}}
          />
          <span className={`drv-step-label${i === current ? " drv-step-label--active" : ""}${i < current ? " drv-step-label--done" : ""}`}>
            {s}
          </span>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`drv-step-line${i < current ? " drv-step-line--done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function DriverDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"aktif" | "selesai">("aktif");

  const fetchOrders = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${baseUrl}/api/orders`);
      if (!res.ok) throw new Error("Gagal memuat data");
      setOrders(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`${baseUrl}/api/orders/${id}/pengiriman`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusPengiriman: status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, statusPengiriman: status } : o));
    } finally { setUpdatingId(null); }
  };

  const aktif  = orders.filter(o => !["Selesai", "Dibatalkan"].includes(o.statusPengiriman));
  const selesai = orders.filter(o => ["Selesai", "Dibatalkan"].includes(o.statusPengiriman));
  const displayed = filter === "aktif" ? aktif : selesai;

  return (
    <div className="dash-bg">
      <div className="dash-wrap">

        {/* ── Header ── */}
        <div className="dash-header dash-header--driver">
          <div className="dash-header-left">
            <div className="dash-header-icon-wrap">🚚</div>
            <div>
              <h1 className="dash-title">Dashboard Driver</h1>
              <p className="dash-sub">Daftar pengiriman yang perlu kamu tangani</p>
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
          <div className="dash-stat">
            <div className="dash-stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
              <Package size={18} />
            </div>
            <div className="dash-stat-body">
              <div className="dash-stat-val" style={{ color: "#d97706" }}>{aktif.length}</div>
              <div className="dash-stat-label">Perlu Ditangani</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
              <Truck size={18} />
            </div>
            <div className="dash-stat-body">
              <div className="dash-stat-val" style={{ color: "#7c3aed" }}>{orders.filter(o => o.statusPengiriman === "Dikirim").length}</div>
              <div className="dash-stat-label">Sedang Dikirim</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon" style={{ background: "#d1fae5", color: "#059669" }}>
              <CheckCircle size={18} />
            </div>
            <div className="dash-stat-body">
              <div className="dash-stat-val" style={{ color: "#059669" }}>{selesai.filter(o => o.statusPengiriman === "Selesai").length}</div>
              <div className="dash-stat-label">Selesai</div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="dash-tabs">
          <button className={`dash-tab${filter === "aktif" ? " dash-tab--active" : ""}`} onClick={() => setFilter("aktif")}>
            <Package size={14} /> Aktif ({aktif.length})
          </button>
          <button className={`dash-tab${filter === "selesai" ? " dash-tab--active" : ""}`} onClick={() => setFilter("selesai")}>
            <CheckCircle size={14} /> Selesai ({selesai.length})
          </button>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">⏳</div>
            <p>Memuat data pengiriman...</p>
          </div>
        ) : error ? (
          <div className="dash-empty dash-empty--error">
            <div className="dash-empty-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">{filter === "aktif" ? "🎉" : "📭"}</div>
            <p>{filter === "aktif" ? "Semua pengiriman sudah selesai!" : "Belum ada pengiriman selesai"}</p>
          </div>
        ) : (
          <div className="dash-list">
            {displayed.map(order => {
              const nextStatus = NEXT_STATUS[order.statusPengiriman];
              const nextStyle = NEXT_COLOR[order.statusPengiriman];
              const isUpdating = updatingId === order.id;

              return (
                <div key={order.id} className="drv-card" style={{ borderLeftColor: STATUS_COLOR[order.statusPengiriman] ?? "#d1d5db" }}>

                  {/* Top */}
                  <div className="drv-card-top">
                    <div>
                      <span className="dash-order-id">#{order.orderId}</span>
                      <span className="dash-order-time"><Clock size={11}/> {formatDate(order.createdAt)}</span>
                    </div>
                    <span className="dash-status-badge" style={{
                      background: STATUS_BG[order.statusPengiriman] ?? "#f3f4f6",
                      color: STATUS_COLOR[order.statusPengiriman] ?? "#6b7280",
                      border: `1.5px solid ${STATUS_COLOR[order.statusPengiriman] ?? "#d1d5db"}`,
                    }}>{order.statusPengiriman}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="drv-card-progress">
                    <StatusProgress status={order.statusPengiriman} />
                  </div>

                  {/* Customer row */}
                  <div className="drv-customer-row">
                    <div className="drv-customer-info">
                      <div className="drv-customer-name"><User size={13}/> {order.namaKontak}</div>
                      {order.driverName && <div className="drv-driver-tag"><Truck size={11}/> {order.driverName}</div>}
                    </div>
                    <a
                      href={`https://wa.me/${order.nomorTelepon.replace(/\D/g,"")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="drv-wa-btn"
                    >
                      <Phone size={13}/> {order.nomorTelepon}
                    </a>
                  </div>

                  {/* Address box */}
                  <div className="drv-address-box">
                    <div className="drv-address-main">
                      <MapPin size={14} className="drv-address-pin" />
                      <span>{order.alamat}</span>
                    </div>
                    {order.patokanLokasi && (
                      <div className="drv-address-patokan">
                        🗺️ {order.patokanLokasi}
                      </div>
                    )}
                  </div>

                  {/* Product + Total */}
                  <div className="drv-product-row">
                    <div className="drv-product-info">
                      <ShoppingCart size={13}/>
                      <span>{order.namaProduk}</span>
                      <span className="drv-qty-badge">× {order.jumlahProduk}</span>
                    </div>
                    <span className="drv-total">{formatRupiah(order.totalHarga)}</span>
                  </div>

                  {/* Action button */}
                  {nextStatus && (
                    <button
                      className="drv-action-btn"
                      disabled={isUpdating}
                      style={nextStyle ? { background: nextStyle.bg, color: nextStyle.color } : {}}
                      onClick={() => updateStatus(order.id, nextStatus)}
                    >
                      {isUpdating ? (
                        <><RefreshCw size={14} className="drv-spin" /> Memperbarui...</>
                      ) : (
                        <>{NEXT_LABEL[order.statusPengiriman] ?? "Update Status"}</>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
