import { useEffect, useState } from "react";

interface OrderInfo {
  orderId: string;
  namaKontak: string;
  alamat: string;
  alreadyShared: boolean;
}

type Status = "loading" | "ready" | "fetching-gps" | "submitting" | "done" | "error";

export default function LocationCapturePage({ token }: { token: string }) {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [status, setStatus] = useState<Status>("loading");
  const [info, setInfo] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);

  // Ambil info order saat halaman dibuka
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/orders/loc/${encodeURIComponent(token)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            setError(data.error || "Link tidak valid atau sudah kedaluwarsa");
            setStatus("error");
          }
          return;
        }
        const data = (await res.json()) as OrderInfo;
        if (!cancelled) {
          setInfo(data);
          setStatus(data.alreadyShared ? "done" : "ready");
        }
      } catch {
        if (!cancelled) {
          setError("Tidak dapat menghubungi server. Periksa koneksi internet Anda.");
          setStatus("error");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [baseUrl, token]);

  const handleShare = () => {
    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung GPS.");
      setStatus("error");
      return;
    }
    setStatus("fetching-gps");
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        setCoords({ lat, lng, accuracy });
        setStatus("submitting");
        try {
          const res = await fetch(`${baseUrl}/api/orders/loc/${encodeURIComponent(token)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(data.error || "Gagal menyimpan lokasi. Coba lagi.");
            setStatus("error");
            return;
          }
          setStatus("done");
        } catch {
          setError("Gagal mengirim lokasi. Periksa koneksi internet.");
          setStatus("error");
        }
      },
      (err) => {
        const msg =
          err.code === 1 ? "Anda menolak izin lokasi. Silakan izinkan akses GPS di pengaturan browser, lalu coba lagi."
          : err.code === 2 ? "Lokasi tidak dapat ditemukan. Pastikan GPS HP Anda aktif."
          : err.code === 3 ? "Pengambilan lokasi terlalu lama. Coba lagi di tempat dengan sinyal lebih baik."
          : "Gagal mengambil lokasi.";
        setError(msg);
        setStatus("ready");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0c1a2e 0%, #1e3a5f 50%, #0097e6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, fontFamily: "Poppins, system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 24px",
        width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        textAlign: "center",
      }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
            <h2 style={{ margin: "0 0 8px", color: "#1e293b" }}>Memuat...</h2>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ margin: "0 0 8px", color: "#dc2626" }}>Tidak dapat memuat</h2>
            <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>{error}</p>
          </>
        )}

        {status === "done" && info && (
          <>
            <div style={{ fontSize: 56, marginBottom: 8 }}>✅</div>
            <h2 style={{ margin: "0 0 6px", color: "#16a34a" }}>Lokasi Terkirim!</h2>
            <p style={{ color: "#475569", margin: "0 0 16px", fontSize: 14 }}>
              Terima kasih, <b>{info.namaKontak}</b>.<br />
              Driver kami akan menggunakan lokasi ini untuk pengiriman order
              <b style={{ color: "#0097e6" }}> #{info.orderId}</b>.
            </p>
            {coords && (
              <a
                href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block", marginTop: 6,
                  background: "#0097e6", color: "#fff", padding: "10px 20px",
                  borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 14,
                }}
              >
                🗺️ Lihat Lokasi di Google Maps
              </a>
            )}
            <p style={{ marginTop: 20, fontSize: 12, color: "#94a3b8" }}>
              Anda boleh menutup halaman ini.
            </p>
          </>
        )}

        {(status === "ready" || status === "fetching-gps" || status === "submitting") && info && (
          <>
            <div style={{ fontSize: 56, marginBottom: 8 }}>📍</div>
            <h2 style={{ margin: "0 0 6px", color: "#1e293b", fontSize: 22 }}>
              Bagikan Lokasi Anda
            </h2>
            <p style={{ color: "#475569", margin: "0 0 6px", fontSize: 14 }}>
              Halo <b>{info.namaKontak}</b> 👋
            </p>
            <p style={{ color: "#64748b", margin: "0 0 18px", fontSize: 13, lineHeight: 1.5 }}>
              Tekan tombol di bawah untuk membagikan titik GPS Anda. Ini akan
              sangat membantu driver kami menemukan rumah Anda untuk order
              <b style={{ color: "#0097e6" }}> #{info.orderId}</b>.
            </p>

            <div style={{
              background: "#f1f5f9", borderRadius: 10, padding: "10px 14px",
              fontSize: 12, color: "#475569", marginBottom: 18, textAlign: "left",
            }}>
              📮 <b>Alamat tertulis:</b><br />
              <span style={{ color: "#1e293b" }}>{info.alamat}</span>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#b91c1c", borderRadius: 8, padding: "8px 12px",
                fontSize: 13, marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleShare}
              disabled={status !== "ready"}
              style={{
                width: "100%", padding: "14px 20px",
                background: status === "ready" ? "#0097e6" : "#94a3b8",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: status === "ready" ? "pointer" : "default",
                boxShadow: status === "ready" ? "0 4px 12px rgba(0,151,230,.35)" : "none",
                transition: "all 150ms",
              }}
            >
              {status === "fetching-gps" ? "📡 Mengambil GPS..."
                : status === "submitting" ? "📤 Mengirim..."
                : "📍 Bagikan Lokasi Saya"}
            </button>

            <p style={{ marginTop: 14, fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              🔒 Lokasi Anda hanya dipakai oleh driver pengantar dan tidak akan
              dibagikan ke pihak lain.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
