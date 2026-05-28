import React from "react";
import { useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import DSATracker from "./DSATracker";

export default function App() {
  const { user, loading, logout } = useAuth();

  /* ── Loading spinner while Firebase checks auth state ── */
  if (loading) {
    return (
      <div className="app-loader">
        <div className="app-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  /* ── Not logged in → show auth page ── */
  if (!user) {
    return <Auth />;
  }

  /* ── Logged in → show tracker with header ── */
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-header-brand">
            <span className="app-header-logo">⚡</span>
            DSA Tracker
          </span>
          <div className="app-header-right">
            <span className="app-header-email" title={user.email || user.displayName || ""}>
              {user.email || user.displayName || "User"}
            </span>
            <button id="logout-btn" className="app-logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DSATracker />
      </main>
    </div>
  );
}
