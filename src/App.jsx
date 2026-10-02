import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import Auth from "./components/Auth";
import DSATracker from "./DSATracker";
import MasterTopic from "./components/MasterTopic";

/* ── User avatar: first letter of display name or email ── */
function UserAvatar({ user }) {
  const raw = user.displayName || user.email || "U";
  const letter = raw.charAt(0).toUpperCase();
  return (
    <div className="user-avatar" title={user.email || user.displayName || ""}>
      {letter}
    </div>
  );
}

export default function App() {
  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState("sheet"); // "sheet" | "master"

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

          {/* Brand */}
          <span className="app-header-brand">
            <span className="app-header-logo">⚡</span>
            <span className="app-header-brand-text">DSA Tracker</span>
          </span>

          {/* Navigation Tabs */}
          <nav className="nav-tabs" aria-label="Main navigation">
            <button
              id="nav-tab-sheet"
              className={`nav-tab${activePage === "sheet" ? " nav-tab--active" : ""}`}
              onClick={() => setActivePage("sheet")}
              aria-current={activePage === "sheet" ? "page" : undefined}
            >
              📋 DSA Sheet
            </button>
            <button
              id="nav-tab-master"
              className={`nav-tab nav-tab--master${activePage === "master" ? " nav-tab--active-master" : ""}`}
              onClick={() => setActivePage("master")}
              aria-current={activePage === "master" ? "page" : undefined}
            >
              🎯 Master Topic
            </button>
          </nav>

          {/* Right side controls */}
          <div className="app-header-right">
            {/* Icon-only theme toggle */}
            <button
              id="theme-toggle-btn"
              className="theme-toggle-btn theme-toggle-btn--icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={`ti ti-${isDark ? "sun" : "moon"}`} aria-hidden="true" />
            </button>

            {/* User avatar */}
            <UserAvatar user={user} />

            {/* Sign Out */}
            <button id="logout-btn" className="app-logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>

        </div>
      </header>

      <main className="app-main">
        {activePage === "sheet" && <DSATracker />}
        {activePage === "master" && (
          <MasterTopic onSelectTopic={(key) => console.log("Selected topic:", key)} />
        )}
      </main>
    </div>
  );
}
