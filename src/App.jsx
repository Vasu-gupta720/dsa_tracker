import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import Auth from "./components/Auth";
import DSATracker from "./DSATracker";

export default function App() {
  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
            <button
              id="theme-toggle-btn"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={`ti ti-${isDark ? "sun" : "moon"}`} aria-hidden="true" />
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
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
