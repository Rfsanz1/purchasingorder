import { useState } from "react";
import { Truck, ChevronDown, LogIn } from "lucide-react";

interface Props {
  driverUsernames: string[];
  onLogin: (username: string) => Promise<string | null>;
}

export default function LoginPage({ driverUsernames, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handle = async () => {
    if (!username) { setError("Pilih nama kamu dulu"); return; }
    setLoading(true); setError("");
    const err = await onLogin(username);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <div className="login-logo-ring" />
          <div className="login-logo-ring" />
          <div className="login-logo-badge">
            <Truck size={36} strokeWidth={1.8} />
          </div>
        </div>

        <h1 className="login-title">Driver App</h1>
        <p className="login-sub">Pilih nama kamu untuk mulai</p>

        {/* Select */}
        <div className="login-select-wrap">
          <select
            className={`login-select${error ? " login-select--err" : ""}`}
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
          >
            <option value="">— Pilih nama driver —</option>
            {driverUsernames.map(u => (
              <option key={u} value={u}>
                {u.replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="login-select-icon" />
        </div>

        {error && <p className="login-err">{error}</p>}

        <button
          className="login-btn"
          onClick={handle}
          disabled={loading}
        >
          {loading ? (
            "Memverifikasi..."
          ) : (
            <><LogIn size={16} /> Masuk sebagai Driver</>
          )}
        </button>

        <p className="login-note">
          Hanya driver yang terdaftar yang dapat mengakses aplikasi ini.
        </p>
      </div>
    </div>
  );
}
