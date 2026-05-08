import { useState, useEffect } from "react";

interface PerSales {
  sales: string;
  jumlah_invoice: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  total: number;
  grand_total: number;
  per_sales: PerSales[];
}

const COLORS = [
  "#2563eb","#16a34a","#f59e0b","#8b5cf6","#ef4444",
  "#0891b2","#c2410c","#7c3aed","#be185d","#065f46","#92400e",
];

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function LaporanKledo() {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate]     = useState("2026-05-08");
  const [data, setData]           = useState<ApiResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [syncing, setSyncing]     = useState(false);
  const [syncMsg, setSyncMsg]     = useState("");

  const fetchData = async (sd: string, ed: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/kledo/sync/penjualan?start_date=${sd}&end_date=${ed}`);
      const json = await res.json();
      if (json.success) setData(json);
      else setError("Gagal memuat data");
    } catch {
      setError("Tidak dapat terhubung ke server");
    }
    setLoading(false);
  };

  const doSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/kledo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });
      const json = await res.json();
      if (json.success) {
        setSyncMsg(`✓ Sync selesai — ${json.total_fetched} invoice (${json.inserted} baru, ${json.updated} diperbarui)`);
        fetchData(startDate, endDate);
      }
    } catch {
      setSyncMsg("Sync gagal");
    }
    setSyncing(false);
  };

  useEffect(() => { fetchData(startDate, endDate); }, []);

  const salesData = data
    ? [...data.per_sales]
        .filter(s => s.sales !== "Tidak Diketahui")
        .sort((a, b) => b.total - a.total)
    : [];

  const totalIdentified = salesData.reduce((s, r) => s + r.total, 0);
  const grandTotal      = data?.grand_total ?? 0;
  const totalInvoice    = data?.total ?? 0;
  const tidakDiketahui  = data?.per_sales.find(s => s.sales === "Tidak Diketahui");
  const maxSalesTotal   = salesData[0]?.total ?? 1;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f0f4ff", minHeight: "100vh", padding: "28px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", borderRadius: 10, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}>
            <span style={{ color: "#fff", fontSize: 20 }}>📊</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b" }}>Laporan Penjualan per Sales</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Sumber: Kledo ERP · Gentong Mas</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", marginBottom: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>DARI TANGGAL</div>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>SAMPAI TANGGAL</div>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none" }} />
        </div>
        <button onClick={() => fetchData(startDate, endDate)} disabled={loading}
          style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Memuat…" : "Tampilkan"}
        </button>
        <button onClick={doSync} disabled={syncing || loading}
          style={{ padding: "8px 18px", borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: syncing ? 0.6 : 1 }}>
          {syncing ? "Sync…" : "⟳ Sync Kledo"}
        </button>
        {syncMsg && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 500 }}>{syncMsg}</span>}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 16px", color: "#dc2626", marginBottom: 18, fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>Memuat data…</div>
      )}

      {!loading && data && (
        <>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
            {[
              { label: "TOTAL INVOICE", value: totalInvoice.toLocaleString("id-ID"), sub: "transaksi", color: "#2563eb", icon: "📄" },
              { label: "GRAND TOTAL", value: fmt(grandTotal), sub: "semua invoice", color: "#16a34a", icon: "💰" },
              { label: "TERIDENTIFIKASI", value: fmt(totalIdentified), sub: `${salesData.length} sales aktif`, color: "#8b5cf6", icon: "✅" },
              { label: "TIDAK DIKETAHUI", value: fmt(tidakDiketahui?.total ?? 0), sub: `${tidakDiketahui?.jumlah_invoice ?? 0} invoice`, color: "#f59e0b", icon: "❓" },
            ].map(card => (
              <div key={card.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderTop: `3px solid ${card.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.05em" }}>{card.icon} {card.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", lineHeight: 1.2 }}>{card.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Bar chart per sales */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 18 }}>
            <h2 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>📈 Penjualan per Sales — {startDate} s/d {endDate}</h2>
            {salesData.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Tidak ada data dengan nama sales teridentifikasi.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {salesData.map((s, i) => {
                  const pct = (s.total / maxSalesTotal) * 100;
                  const pctGrand = ((s.total / grandTotal) * 100).toFixed(1);
                  const color = COLORS[i % COLORS.length];
                  return (
                    <div key={s.sales}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{s.sales}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.jumlah_invoice} inv</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color }}>{fmt(s.total)}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>{pctGrand}%</span>
                        </div>
                      </div>
                      <div style={{ background: "#f1f5f9", borderRadius: 6, height: 10, overflow: "hidden" }}>
                        <div style={{ background: color, borderRadius: 6, height: 10, width: `${pct}%`, transition: "width 0.4s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Table per sales */}
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e293b" }}>📋 Rekap per Sales</h2>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Nama Sales", "Jml Invoice", "Total Penjualan", "% dari Grand Total"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: h === "Total Penjualan" || h === "% dari Grand Total" ? "right" : h === "Jml Invoice" ? "center" : "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesData.map((s, i) => (
                  <tr key={s.sales} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "10px 16px", color: "#94a3b8", borderBottom: "1px solid #f1f5f9" }}>{i + 1}</td>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{s.sales}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#374151", borderBottom: "1px solid #f1f5f9" }}>{s.jumlah_invoice}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: COLORS[i % COLORS.length], borderBottom: "1px solid #f1f5f9" }}>{fmt(s.total)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{((s.total / grandTotal) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
                {tidakDiketahui && (
                  <tr style={{ background: "#fffbeb" }}>
                    <td style={{ padding: "10px 16px", color: "#94a3b8", borderBottom: "1px solid #fef3c7" }}>—</td>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid #fef3c7" }}>
                      <span style={{ color: "#92400e", fontWeight: 600 }}>❓ Tidak Diketahui</span>
                      <span style={{ fontSize: 11, color: "#b45309", marginLeft: 6 }}>memo kosong di Kledo</span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#92400e", borderBottom: "1px solid #fef3c7" }}>{tidakDiketahui.jumlah_invoice}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#b45309", borderBottom: "1px solid #fef3c7" }}>{fmt(tidakDiketahui.total)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: "#92400e", borderBottom: "1px solid #fef3c7" }}>{((tidakDiketahui.total / grandTotal) * 100).toFixed(2)}%</td>
                  </tr>
                )}
                <tr style={{ background: "#eff6ff" }}>
                  <td colSpan={2} style={{ padding: "12px 16px", fontWeight: 800, color: "#1e293b", fontSize: 13 }}>GRAND TOTAL</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#1e293b" }}>{totalInvoice}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: "#2563eb", fontSize: 14 }}>{fmt(grandTotal)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#2563eb" }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
