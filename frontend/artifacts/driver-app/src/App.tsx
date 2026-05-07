import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DriverDashboard from "./pages/DriverDashboard";

const DRIVER_USERNAMES = ["yanto", "wawan", "chaidar"];
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

type View = "login" | "dashboard";

interface Session {
  view: View;
  username: string;
}

function getStoredSession(): Session {
  const username = sessionStorage.getItem("driverUsername");
  const loginAt  = sessionStorage.getItem("loginAt");
  if (username && loginAt) {
    const elapsed = Date.now() - Number(loginAt);
    if (elapsed < 8 * 60 * 60 * 1000) return { view: "dashboard", username };
    sessionStorage.clear();
  }
  return { view: "login", username: "" };
}

export default function App() {
  const [session, setSession] = useState<Session>(getStoredSession);

  const handleLogin = async (username: string): Promise<string | null> => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "driver", username }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem("driverUsername", username);
      sessionStorage.setItem("loginAt", Date.now().toString());
      setSession({ view: "dashboard", username });
      return null;
    }
    return data.error || "Login gagal";
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setSession({ view: "login", username: "" });
  };

  if (session.view === "dashboard") {
    return (
      <DriverDashboard
        driverUsername={session.username}
        onLogout={handleLogout}
      />
    );
  }

  return <LoginPage driverUsernames={DRIVER_USERNAMES} onLogin={handleLogin} />;
}
