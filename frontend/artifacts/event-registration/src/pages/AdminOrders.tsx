import { useEffect, useState } from "react";

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
  createdAt: string;
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Badge({ sent }: { sent: string }) {
  const ok = sent === "true";
  return (
    <span className={`adm-badge ${ok ? "adm-badge--ok" : "adm-badge--fail"}`}>
      {ok ? "✅ Terkirim" : "❌ Gagal"}
    </span>
  );
}

function PayBadge({ metode }: { metode: string }) {
  const map: Record<string, string> = { CASH: "adm-pay--cash", Debit: "adm-pay--debit", Transfer: "adm-pay--transfer", BelumBayar: "adm-pay--unpaid" };
  const label = metode === "BelumBayar" ? "Belum Bayar" : metode;
  return <span className={`adm-pay ${map[metode] ?? ""}`}>{label}</span>;
}

interface HealthResult { name: string; ok: boolean; detail: string }
interface HealthResponse { ok: boolean; results: HealthResult[]; group: string }

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [healthOpen, setHealthOpen] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [payFilter, setPayFilter] = useState<"ALL" | "CASH" | "Debit" | "Transfer" | "BelumBayar">("ALL");
  const [waFilter, setWaFilter] = useState<"ALL" | "OK" | "FAIL">("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  const runHealthCheck = async (sendTest: boolean) => {
    setHealthLoading(true);
    setHealthOpen(true);
    try {
      const res = await fetch(`${baseUrl}/api/system/health-check${sendTest ? "?sendTest=1" : ""}`);
      const data = await res.json() as HealthResponse;
      setHealth(data);
    } catch (e) {
      setHealth({
        ok: false,
        results: [{ name: "Permintaan", ok: false, detail: e instanceof Error ? e.message : "Gagal memanggil server" }],
        group: "",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/api/orders`);
      if (!res.ok) throw new Error("Gagal memuat data");
      setOrders(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const fromMs = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : null;
  const toMs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;

  const filtered = orders.filter(o => {
    const matchSearch = [o.namaKontak, o.nomorTelepon, o.namaProduk, o.salesPerson, o.orderId]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (payFilter !== "ALL" && o.metodePembayaran !== payFilter) return false;
    if (waFilter === "OK" && o.whatsappSent !== "true") return false;
    if (waFilter === "FAIL" && o.whatsappSent === "true") return false;
    if (fromMs || toMs) {
      const t = new Date(o.createdAt).getTime();
      if (fromMs && t < fromMs) return false;
      if (toMs && t > toMs) return false;
    }
    return true;
  });

  const filterActive =
    payFilter !== "ALL" || waFilter !== "ALL" || !!dateFrom || !!dateTo || !!search;

  const resetFilters = () => {
    setPayFilter("ALL"); setWaFilter("ALL"); setDateFrom(""); setDateTo(""); setSearch("");
  };

  const totalPendapatan = filtered.reduce((s, o) => s + o.totalHarga, 0);

  const countBy = (m: string) => orders.filter(o => o.metodePembayaran === m).length;

  const handleDelete = async (order: Order) => {
    const ok = window.confirm(
      `Hapus order #${order.orderId}?\n\nNama: ${order.namaKontak}\nProduk: ${order.namaProduk}\nTotal: ${formatRupiah(order.totalHarga)}\n\nTindakan ini tidak dapat dibatalkan.`,
    );
    if (!ok) return;
    setDeletingId(order.id);
    try {
      const res = await fetch(`${baseUrl}/api/orders/${order.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus order");
      }
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error tidak diketahui");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="adm-bg">
      <div className="adm-wrap">

        {/* Header */}
        <div className="adm-header">
          <div>
            <h1 className="adm-title">📋 Daftar Order Masuk</h1>
            <p className="adm-sub">Semua pesanan yang dikirim melalui form Purchase Order</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="adm-refresh" onClick={() => runHealthCheck(false)}>🩺 Test Koneksi</button>
            <button className="adm-refresh" onClick={fetchOrders}>🔄 Refresh</button>
          </div>
        </div>

        {healthOpen && (
          <div className="hc-modal-bg" onClick={() => setHealthOpen(false)}>
            <div className="hc-modal" onClick={e => e.stopPropagation()}>
              <div className="hc-modal-header">
                <div>
                  <div className="hc-modal-title">🩺 Test Koneksi WA & Kledo</div>
                  <div className="hc-modal-sub">Cek status integrasi WhatsApp (Fonnte) dan Kledo ERP</div>
                </div>
                <button className="hc-close" onClick={() => setHealthOpen(false)}>✕</button>
              </div>
              <div className="hc-modal-body">
                {healthLoading ? (
                  <div className="hc-loading">⏳ Sedang memeriksa…</div>
                ) : health ? (
                  <>
                    <div className={`hc-summary ${health.ok ? "ok" : "fail"}`}>
                      {health.ok ? "✅ Semua koneksi sehat" : "⚠️ Ada masalah pada koneksi"}
                    </div>
                    <ul className="hc-list">
                      {health.results.map((r, i) => (
                        <li key={i} className={`hc-item ${r.ok ? "ok" : "fail"}`}>
                          <div className="hc-item-icon">{r.ok ? "✅" : "❌"}</div>
                          <div className="hc-item-body">
                            <div className="hc-item-name">{r.name}</div>
                            <div className="hc-item-detail">{r.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="hc-actions">
                      <button
                        className="hc-btn-secondary"
                        onClick={() => runHealthCheck(false)}
                        disabled={healthLoading}
                      >🔄 Periksa Ulang</button>
                      <button
                        className="hc-btn-primary"
                        onClick={() => runHealthCheck(true)}
                        disabled={healthLoading}
                      >📨 Kirim Pesan Tes ke Grup</button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-val">{orders.length}</div>
            <div className="adm-stat-label">Total Order</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-val">{orders.filter(o => o.whatsappSent === "true").length}</div>
            <div className="adm-stat-label">WA Terkirim</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-val" style={{ fontSize: "15px" }}>{formatRupiah(totalPendapatan)}</div>
            <div className="adm-stat-label">{search ? "Total Filter" : "Total Pendapatan"}</div>
          </div>
        </div>

        {/* Search */}
        <div className="adm-search-wrap">
          <span className="adm-search-icon">🔍</span>
          <input
            className="adm-search"
            placeholder="Cari nama, nomor, produk, sales..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="adm-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        {/* Filters */}
        <div className="adm-filters">
          <div className="adm-filter-row">
            <span className="adm-filter-label">Pembayaran:</span>
            <div className="adm-chips">
              {([
                { v: "ALL", l: `Semua (${orders.length})` },
                { v: "CASH", l: `💵 CASH (${countBy("CASH")})` },
                { v: "Debit", l: `💳 Debit (${countBy("Debit")})` },
                { v: "Transfer", l: `🏦 Transfer (${countBy("Transfer")})` },
                { v: "BelumBayar", l: `⏳ Belum Bayar (${countBy("BelumBayar")})` },
              ] as const).map(c => (
                <button
                  key={c.v}
                  type="button"
                  className={`adm-chip${payFilter === c.v ? " active" : ""}`}
                  onClick={() => setPayFilter(c.v)}
                >{c.l}</button>
              ))}
            </div>
          </div>

          <div className="adm-filter-row">
            <span className="adm-filter-label">Status WA:</span>
            <div className="adm-chips">
              {([
                { v: "ALL", l: "Semua" },
                { v: "OK", l: "✅ Terkirim" },
                { v: "FAIL", l: "❌ Gagal" },
              ] as const).map(c => (
                <button
                  key={c.v}
                  type="button"
                  className={`adm-chip${waFilter === c.v ? " active" : ""}`}
                  onClick={() => setWaFilter(c.v)}
                >{c.l}</button>
              ))}
            </div>
          </div>

          <div className="adm-filter-row">
            <span className="adm-filter-label">Tanggal:</span>
            <div className="adm-date-range">
              <input
                type="date"
                className="adm-date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
              <span className="adm-date-sep">s/d</span>
              <input
                type="date"
                className="adm-date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
            {filterActive && (
              <button type="button" className="adm-reset" onClick={resetFilters}>
                ✕ Reset Filter
              </button>
            )}
          </div>

          <div className="adm-filter-summary">
            Menampilkan <strong>{filtered.length}</strong> dari {orders.length} order
            {filterActive && filtered.length > 0 && (
              <> • Total: <strong>{formatRupiah(totalPendapatan)}</strong></>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="adm-empty">⏳ Memuat data...</div>
        ) : error ? (
          <div className="adm-empty adm-error">⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">{search ? "Tidak ada hasil pencarian" : "Belum ada order masuk"}</div>
        ) : (
          <div className="adm-list">
            {filtered.map(order => (
              <div key={order.id} className="adm-card">
                {/* Card top row */}
                <div className="adm-card-top">
                  <div className="adm-card-id">#{order.orderId}</div>
                  <div className="adm-card-meta">
                    <PayBadge metode={order.metodePembayaran} />
                    <Badge sent={order.whatsappSent} />
                  </div>
                </div>

                <div className="adm-card-grid">
                  {/* Kolom kiri */}
                  <div>
                    <div className="adm-row">
                      <span className="adm-lbl">👤 Nama</span>
                      <span className="adm-val adm-bold">{order.namaKontak}</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">📱 Telepon</span>
                      <span className="adm-val">
                        <a href={`https://wa.me/${order.nomorTelepon.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="adm-walink">
                          {order.nomorTelepon}
                        </a>
                      </span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">📍 Alamat</span>
                      <span className="adm-val">{order.alamat}</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">🗺️ Patokan</span>
                      <span className="adm-val">{order.patokanLokasi}</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">🧑 Sales</span>
                      <span className="adm-val">{order.salesPerson}</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">🕐 Waktu</span>
                      <span className="adm-val adm-muted">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Kolom kanan */}
                  <div className="adm-price-col">
                    <div className="adm-row">
                      <span className="adm-lbl">🛒 Produk</span>
                      <span className="adm-val">{order.namaProduk}</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">📦 Jumlah</span>
                      <span className="adm-val">{order.jumlahProduk} unit</span>
                    </div>
                    <div className="adm-row">
                      <span className="adm-lbl">💰 Harga</span>
                      <span className="adm-val">{formatRupiah(order.hargaProduk)}</span>
                    </div>
                    {order.biayaPengiriman ? (
                      <div className="adm-row">
                        <span className="adm-lbl">🚚 Ongkir</span>
                        <span className="adm-val">{formatRupiah(order.biayaPengiriman)}</span>
                      </div>
                    ) : null}
                    {order.keteranganPembayaran ? (
                      <div className="adm-row">
                        <span className="adm-lbl">📝 Ket</span>
                        <span className="adm-val">{order.keteranganPembayaran}</span>
                      </div>
                    ) : null}
                    <div className="adm-total-row">
                      <span>TOTAL</span>
                      <span className="adm-total-val">{formatRupiah(order.totalHarga)}</span>
                    </div>
                  </div>
                </div>

                <div className="adm-card-actions">
                  <button
                    type="button"
                    className="adm-del-btn"
                    onClick={() => handleDelete(order)}
                    disabled={deletingId === order.id}
                  >
                    {deletingId === order.id ? "⏳ Menghapus..." : "🗑️ Hapus Order (Batal)"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
