export function LaporanKledo() {
  const data = [
    { id: "177731", ref: "INV/49431", pelanggan: "Rini/toto", total: 3300000 },
    { id: "177729", ref: "INV/49430", pelanggan: "LUTFI 083836502985", total: 2900000 },
    { id: "177720", ref: "INV/49429", pelanggan: "NN.", total: 330000 },
    { id: "177717", ref: "INV/49428", pelanggan: "NN.", total: 125000 },
    { id: "177712", ref: "INV/49427", pelanggan: "Mas dias", total: 160000 },
    { id: "177710", ref: "INV/49426", pelanggan: "TB", total: 65000 },
    { id: "177706", ref: "INV/49425", pelanggan: "TB", total: 55000 },
    { id: "177694", ref: "INV/49424", pelanggan: "Faturohim Candiroto", total: 1400000 },
    { id: "177692", ref: "INV/49423", pelanggan: "Tofa 082328910001", total: 1150000 },
    { id: "177690", ref: "INV/49422", pelanggan: "TB", total: 140000 },
    { id: "177689", ref: "INV/49421", pelanggan: "Mas Wiwit (toko)", total: 2400000 },
    { id: "177687", ref: "INV/49420", pelanggan: "Mas Irfan..", total: 1950000 },
    { id: "177672", ref: "INV/49419", pelanggan: "Bapak Amir.", total: 1800000 },
    { id: "177671", ref: "INV/49418", pelanggan: "Ana Bakul", total: 1900000 },
    { id: "177669", ref: "INV/49417", pelanggan: "Layah", total: 950000 },
    { id: "177667", ref: "INV/49416", pelanggan: "NN.", total: 400000 },
    { id: "177665", ref: "INV/49415", pelanggan: "NN.", total: 280000 },
    { id: "177663", ref: "INV/49414", pelanggan: "Rahma Dewi Aza", total: 2700000 },
    { id: "177661", ref: "INV/49413", pelanggan: "NN.", total: 2000000 },
    { id: "177660", ref: "INV/49412", pelanggan: "RSK Ngesti Waluyo Parakan", total: 1850000 },
    { id: "177657", ref: "INV/49411", pelanggan: "TB", total: 6000 },
    { id: "177655", ref: "INV/49410", pelanggan: "PROYEK PAK MAMAT MBG (Tegalurung)", total: 2207000 },
    { id: "177653", ref: "INV/49409", pelanggan: "Bapak Pono", total: 1775000 },
    { id: "177651", ref: "INV/49408", pelanggan: "TB", total: 43000 },
    { id: "177650", ref: "INV/49407", pelanggan: "Apotek Gentong Handoy Shopee", total: 1225325 },
    { id: "177639", ref: "INV/49406", pelanggan: "Ibu Tyas", total: 2050000 },
    { id: "177637", ref: "INV/49405", pelanggan: "TB", total: 125000 },
    { id: "177636", ref: "INV/49404", pelanggan: "PROYEK PAK MAMAT MBG (Mindikan Bansari)", total: 3457000 },
    { id: "177634", ref: "INV/49403", pelanggan: "TB   .", total: 405000 },
    { id: "177632", ref: "INV/49402", pelanggan: "Bapak Toriq Bakul KT", total: 755000 },
    { id: "177630", ref: "INV/49401", pelanggan: "Bapak. AGUS (PT.Apollo Mitra Sukses)", total: 875000 },
    { id: "177628", ref: "INV/49400", pelanggan: "TB", total: 15000 },
    { id: "177626", ref: "INV/49399", pelanggan: "Ibu Muyanah", total: 30000 },
    { id: "177624", ref: "INV/49398", pelanggan: "Ibu Muyanah", total: 6000000 },
    { id: "177623", ref: "INV/49397", pelanggan: "MAS YOHAN Shope", total: 647111 },
    { id: "177622", ref: "INV/49396", pelanggan: "Winda / udin", total: 1600000 },
    { id: "177620", ref: "INV/49395", pelanggan: "Mbak Dewi.", total: 2500000 },
    { id: "177619", ref: "INV/49394", pelanggan: "ahmad latif Shopee", total: 1991749 },
    { id: "177617", ref: "INV/49393", pelanggan: "TB", total: 85000 },
    { id: "177615", ref: "INV/49392", pelanggan: "Mas Din Bakul", total: 679000 },
    { id: "177613", ref: "INV/49391", pelanggan: "Pak Maryono Jambon", total: 675000 },
    { id: "177611", ref: "INV/49389", pelanggan: "Tomi Shopee", total: 2264424 },
    { id: "177610", ref: "INV/49388", pelanggan: "Hanif Hermawanto Shopee", total: 3999867 },
    { id: "177609", ref: "INV/49387", pelanggan: "PROYEK DESA TLAHAP SENDERAN RT6", total: 980000 },
    { id: "177579", ref: "INV/49376", pelanggan: "PROYEK PAK MAMAT MBG (Tegalurung)", total: 1072000 },
  ];

  const grandTotal = data.reduce((s, r) => s + r.total, 0);
  const fmt = (n: number) =>
    "Rp " + n.toLocaleString("id-ID");

  const topItems = [...data].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ background: "#2563eb", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 18 }}>📊</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Laporan Penjualan Kledo</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Tanggal: 8 April 2026 · Sumber: Kledo ERP</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #2563eb" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>TOTAL INVOICE</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1e293b" }}>{data.length}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>transaksi</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #16a34a" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>TOTAL PENJUALAN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{fmt(grandTotal)}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>semua invoice</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>RATA-RATA / INVOICE</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#b45309" }}>{fmt(Math.round(grandTotal / data.length))}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>per transaksi</div>
        </div>
      </div>

      {/* Top 5 */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>🏆 5 Transaksi Terbesar</h2>
        {topItems.map((item, i) => {
          const pct = (item.total / grandTotal) * 100;
          const colors = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ef4444"];
          return (
            <div key={item.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                  <span style={{ color: "#94a3b8", marginRight: 6 }}>#{i + 1}</span>
                  {item.pelanggan}
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>{item.ref}</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors[i] }}>{fmt(item.total)}</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 4, height: 6 }}>
                <div style={{ background: colors[i], borderRadius: 4, height: 6, width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e293b" }}>📋 Detail Semua Invoice</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0", width: 36 }}>#</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>No. Invoice</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Pelanggan</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "9px 16px", color: "#94a3b8", borderBottom: "1px solid #f1f5f9" }}>{i + 1}</td>
                  <td style={{ padding: "9px 16px", color: "#2563eb", fontWeight: 500, borderBottom: "1px solid #f1f5f9" }}>{row.ref}</td>
                  <td style={{ padding: "9px 16px", color: "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.pelanggan}</td>
                  <td style={{ padding: "9px 16px", textAlign: "right", fontWeight: 600, color: "#16a34a", borderBottom: "1px solid #f1f5f9" }}>{fmt(row.total)}</td>
                </tr>
              ))}
              <tr style={{ background: "#eff6ff" }}>
                <td colSpan={3} style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b", fontSize: 14 }}>GRAND TOTAL</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: "#2563eb", fontSize: 15 }}>{fmt(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
