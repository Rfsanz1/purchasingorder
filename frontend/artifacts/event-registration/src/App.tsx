import { useState, useEffect, lazy, Suspense } from "react";
import { Router as WouterRouter } from "wouter";
import LandingPage from "@/pages/LandingPage";

const PurchaseOrderForm   = lazy(() => import("@/pages/PurchaseOrderForm"));
const AdminDashboard      = lazy(() => import("@/pages/AdminDashboard"));
const DriverDashboard     = lazy(() => import("@/pages/DriverDashboard"));
const LocationCapturePage = lazy(() => import("@/pages/LocationCapturePage"));

function prefetchAll() {
  import("@/pages/PurchaseOrderForm");
  import("@/pages/AdminDashboard");
  import("@/pages/DriverDashboard");
  import("@/pages/LocationCapturePage");
}

function getLocationToken(): string | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = window.location.pathname;
  const stripped = base && path.startsWith(base) ? path.slice(base.length) : path;
  const m = stripped.match(/^\/loc\/([A-Za-z0-9_-]+)\/?$/);
  return m ? m[1] : null;
}

type View = "landing" | "form" | "admin" | "sales" | "driver";
interface StoredSession { view: View; username?: string; }

function getStoredSession(): StoredSession {
  const role    = sessionStorage.getItem("role");
  const loginAt = sessionStorage.getItem("loginAt");
  const username =
    sessionStorage.getItem("salesUsername") ||
    sessionStorage.getItem("driverUsername") ||
    undefined;
  if (role && loginAt) {
    const elapsed = Date.now() - Number(loginAt);
    if (elapsed < 8 * 60 * 60 * 1000) return { view: role as View, username };
    sessionStorage.clear();
  }
  return { view: "landing" };
}

function logout() {
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("loginAt");
  sessionStorage.removeItem("salesUsername");
  sessionStorage.removeItem("driverUsername");
}

function App() {
  const [locToken] = useState<string | null>(() => getLocationToken());
  const [session, setSession] = useState<StoredSession>(getStoredSession);

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (session.view !== "landing") return;
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void })
        .requestIdleCallback(prefetchAll);
    } else {
      setTimeout(prefetchAll, 1500);
    }
  }, [session.view]);

  const handleLogout = () => { logout(); setSession({ view: "landing" }); };
  const setView = (view: View, username?: string) => setSession({ view, username });

  if (locToken) {
    return (
      <Suspense fallback={null}>
        <LocationCapturePage token={locToken} />
      </Suspense>
    );
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      {session.view === "landing" && (
        <LandingPage
          onForm={()    => setView("form")}
          onAdmin={()   => setView("admin")}
          onDriver={(u) => setView("driver", u)}
          onSales={(u)  => setView("sales", u)}
        />
      )}
      <Suspense fallback={null}>
        {session.view === "form" && (
          <div>
            <div className="lp-topbar">
              <button className="lp-topbar-icon lp-topbar-back" onClick={() => setView("landing")} aria-label="Kembali">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div className="lp-topbar-logo">
                <span className="lp-topbar-logo-text">Purchase</span>
                <span className="lp-topbar-logo-dot">Order</span>
              </div>
              <div style={{ width: 36 }} />
            </div>
            <PurchaseOrderForm />
          </div>
        )}
        {session.view === "admin"  && <AdminDashboard onLogout={handleLogout} />}
        {session.view === "sales"  && <AdminDashboard onLogout={handleLogout} salesUsername={session.username} />}
        {session.view === "driver" && <DriverDashboard onLogout={handleLogout} driverUsername={session.username} />}
      </Suspense>
    </WouterRouter>
  );
}

export default App;
