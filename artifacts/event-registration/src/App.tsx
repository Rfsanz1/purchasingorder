import { useState, useEffect } from "react";
import { Router as WouterRouter } from "wouter";
import PurchaseOrderForm from "@/pages/PurchaseOrderForm";
import AdminDashboard from "@/pages/AdminDashboard";
import DriverDashboard from "@/pages/DriverDashboard";
import LandingPage from "@/pages/LandingPage";

type View = "landing" | "form" | "admin" | "sales" | "driver";

interface StoredSession {
  view: View;
  salesUsername?: string;
}

function getStoredSession(): StoredSession {
  const role = sessionStorage.getItem("role");
  const loginAt = sessionStorage.getItem("loginAt");
  const salesUsername = sessionStorage.getItem("salesUsername") || undefined;
  if (role && loginAt) {
    const elapsed = Date.now() - Number(loginAt);
    if (elapsed < 8 * 60 * 60 * 1000) {
      return { view: role as View, salesUsername };
    }
    sessionStorage.clear();
  }
  return { view: "landing" };
}

function logout() {
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("loginAt");
  sessionStorage.removeItem("salesUsername");
}

function App() {
  const [session, setSession] = useState<StoredSession>(getStoredSession);

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    logout();
    setSession({ view: "landing" });
  };

  const setView = (view: View, salesUsername?: string) =>
    setSession({ view, salesUsername });

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      {session.view === "landing" && (
        <LandingPage
          onForm={() => setView("form")}
          onAdmin={() => setView("admin")}
          onDriver={() => setView("driver")}
          onSales={(u) => setView("sales", u)}
        />
      )}
      {session.view === "form" && (
        <div>
          <button className="lp-back-btn" onClick={() => setView("landing")}>← Kembali</button>
          <PurchaseOrderForm />
        </div>
      )}
      {session.view === "admin" && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {session.view === "sales" && (
        <AdminDashboard onLogout={handleLogout} salesUsername={session.salesUsername} />
      )}
      {session.view === "driver" && (
        <DriverDashboard onLogout={handleLogout} />
      )}
    </WouterRouter>
  );
}

export default App;
