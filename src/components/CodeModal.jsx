import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getSavedCode, saveCode } from "../services/codeService";

// Lazy-load Monaco Editor — only loaded when the modal is first opened
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

// ─── Starter templates ───────────────────────────────────────────────────────
const STARTER = {
  cpp: `class Solution {\npublic:\n    \n};\n`,
  java: `class Solution {\n    \n}\n`,
  python: `class Solution:\n    pass\n`,
};

const LANG_OPTIONS = [
  { value: "cpp",    label: "C++",    monacoLang: "cpp"    },
  { value: "java",   label: "Java",   monacoLang: "java"   },
  { value: "python", label: "Python", monacoLang: "python" },
];

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebouncedCallback(fn, delay) {
  const timerRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        opacity: visible ? 1 : 0,
        transition: "all 0.25s ease",
        background: "#1e293b",
        color: "#e2e8f0",
        padding: "8px 20px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        border: "1px solid #334155",
      }}
    >
      {message}
    </div>
  );
}

// ─── Save Status ──────────────────────────────────────────────────────────────
function SaveStatus({ status }) {
  const map = {
    idle:   { text: "",             color: "transparent" },
    saving: { text: "Saving…",      color: "#94a3b8"     },
    saved:  { text: "✓ Saved",      color: "#4ade80"     },
    error:  { text: "✗ Save failed — Retry", color: "#f87171" },
  };
  const { text, color } = map[status] || map.idle;
  return (
    <span style={{ fontSize: 12, color, transition: "color 0.2s", minWidth: 140 }}>
      {text}
    </span>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CodeModal({ question, onClose }) {
  const { user }  = useAuth();
  const { isDark } = useTheme();

  const [language, setLanguage]     = useState("cpp");
  const [code, setCode]             = useState(STARTER.cpp);
  const [fetchStatus, setFetchStatus] = useState("loading"); // loading | ready | error
  const [saveStatus, setSaveStatus] = useState("idle");      // idle | saving | saved | error
  const [toast, setToast]           = useState({ message: "", visible: false });

  // Cache fetched codes per language so we don't refetch on switch
  const cachedRef = useRef({});       // { cpp: string|null, java: string|null, python: string|null }
  const lastSavedRef = useRef({});    // last code we successfully saved per language
  const editorRef = useRef(null);

  // ── Show toast helper ──
  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message, visible: false }), 2000);
  };

  // ── Fetch code for current language ──
  const fetchCode = useCallback(
    async (lang) => {
      if (!user) return;
      if (cachedRef.current[lang] !== undefined) {
        // Already fetched — use cache
        const cached = cachedRef.current[lang];
        setCode(cached !== null ? cached : STARTER[lang]);
        setFetchStatus("ready");
        return;
      }
      setFetchStatus("loading");
      try {
        const saved = await getSavedCode(user.uid, question.id, lang);
        cachedRef.current[lang] = saved;           // cache result (null = no saved code)
        lastSavedRef.current[lang] = saved ?? STARTER[lang];
        setCode(saved !== null ? saved : STARTER[lang]);
        setFetchStatus("ready");
      } catch (err) {
        console.error("Failed to fetch code:", err);
        setFetchStatus("error");
      }
    },
    [user, question.id]
  );

  // Fetch on mount + on language switch
  useEffect(() => {
    fetchCode(language);
  }, [language, fetchCode]);

  // ── Persist code ──
  const persistCode = useCallback(
    async (lang, value) => {
      if (!user) return;
      if (value === lastSavedRef.current[lang]) return; // no change
      setSaveStatus("saving");
      try {
        await saveCode(user.uid, question.id, lang, value);
        cachedRef.current[lang] = value;
        lastSavedRef.current[lang] = value;
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2200);
      } catch (err) {
        console.error("Save failed:", err);
        setSaveStatus("error");
      }
    },
    [user, question.id]
  );

  // ── Autosave with 2s debounce ──
  const debouncedSave = useDebouncedCallback(persistCode, 2000);

  const handleCodeChange = (value) => {
    setCode(value ?? "");
    debouncedSave(language, value ?? "");
  };

  // ── Language switch — save current code first (debounced timer may not have fired) ──
  const handleLanguageChange = async (newLang) => {
    // Flush pending changes for the current language
    if (code !== lastSavedRef.current[language]) {
      await persistCode(language, code);
    }
    setLanguage(newLang);
  };

  // ── Manual save ──
  const handleManualSave = () => persistCode(language, code);

  // ── Copy code ──
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => showToast("✓ Copied!"));
  };

  // ── Keyboard: Esc to close ──
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Styles ──
  const surface   = isDark ? "#0f172a" : "#ffffff";
  const surfaceEl = isDark ? "#1e293b" : "#f8fafc";
  const border    = isDark ? "#334155" : "#e2e8f0";
  const text      = isDark ? "#e2e8f0" : "#1e293b";
  const subtext   = isDark ? "#94a3b8" : "#64748b";
  const accent    = isDark ? "#818cf8" : "#4f46e5";
  const accentBg  = isDark ? "#1e1b4b" : "#eef2ff";
  const accentBor = isDark ? "#3730a3" : "#c7d2fe";

  const monacoLang = LANG_OPTIONS.find(l => l.value === language)?.monacoLang ?? "cpp";

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* ── Modal ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Code editor for ${question.title}`}
        style={{
          position: "fixed", inset: 0, zIndex: 201,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 800,
            maxHeight: "calc(100vh - 32px)",
            display: "flex", flexDirection: "column",
            background: surface,
            borderRadius: 14,
            border: `1px solid ${border}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* ── Header ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: `1px solid ${border}`,
            background: surfaceEl,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: 8,
                background: accentBg, border: `1.5px solid ${accentBor}`,
                fontSize: 16,
              }}>💻</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: text, lineHeight: 1.3 }}>
                  Save Solution
                </div>
                <div style={{
                  fontSize: 11.5, color: subtext,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: "min(360px, 45vw)",
                }}>
                  {question.title}
                </div>
              </div>
            </div>

            {/* Language selector + close */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <select
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value)}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 28px 5px 10px",
                    borderRadius: 7, cursor: "pointer", appearance: "none",
                    border: `1.5px solid ${accentBor}`,
                    background: accentBg,
                    color: accent,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                >
                  {LANG_OPTIONS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <span style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  fontSize: 10, color: accent, pointerEvents: "none",
                }}>▼</span>
              </div>
              <button
                onClick={onClose}
                title="Close (Esc)"
                style={{
                  width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${border}`,
                  background: "transparent",
                  color: subtext,
                  fontSize: 16,
                }}
              >✕</button>
            </div>
          </div>

          {/* ── Editor area ── */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}>
            {fetchStatus === "loading" && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 10,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: isDark ? "#0d1117" : "#f6f8fa",
                gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `3px solid ${accentBor}`,
                  borderTopColor: accent,
                  animation: "spin 0.7s linear infinite",
                }} />
                <span style={{ fontSize: 13, color: subtext }}>Loading saved code…</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {fetchStatus === "error" && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 10,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: isDark ? "#0d1117" : "#f6f8fa",
                gap: 10,
              }}>
                <span style={{ fontSize: 28 }}>⚠️</span>
                <span style={{ fontSize: 13, color: "#f87171" }}>Failed to load code</span>
                <button
                  onClick={() => fetchCode(language)}
                  style={{
                    fontSize: 12, padding: "5px 16px", borderRadius: 6, cursor: "pointer",
                    background: accentBg, color: accent, border: `1.5px solid ${accentBor}`,
                  }}
                >Retry</button>
              </div>
            )}

            {/* Monaco — lazy loaded */}
            <Suspense fallback={null}>
              <MonacoEditor
                height="100%"
                language={monacoLang}
                value={code}
                theme={isDark ? "vs-dark" : "light"}
                onChange={handleCodeChange}
                onMount={(editor) => { editorRef.current = editor; }}
                options={{
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  tabSize: 4,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: "full",
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                  fontLigatures: true,
                  renderLineHighlight: "all",
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  readOnly: fetchStatus !== "ready",
                }}
              />
            </Suspense>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px",
            borderTop: `1px solid ${border}`,
            background: surfaceEl,
            flexShrink: 0,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <SaveStatus status={saveStatus} />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleCopy}
                disabled={fetchStatus !== "ready"}
                style={{
                  fontSize: 12, padding: "6px 14px", borderRadius: 7, cursor: "pointer",
                  border: `1.5px solid ${border}`,
                  background: "transparent",
                  color: text,
                  fontFamily: "inherit",
                  opacity: fetchStatus !== "ready" ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleManualSave}
                disabled={fetchStatus !== "ready" || saveStatus === "saving"}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "6px 18px", borderRadius: 7, cursor: "pointer",
                  border: `1.5px solid ${accentBor}`,
                  background: accentBg,
                  color: accent,
                  fontFamily: "inherit",
                  opacity: (fetchStatus !== "ready" || saveStatus === "saving") ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.15s",
                }}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast notification ── */}
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
