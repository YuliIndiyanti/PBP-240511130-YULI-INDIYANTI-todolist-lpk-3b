import { useState, useEffect, useRef } from 'react';

export default function Navbar({ onOpenShortcuts, onSeedDemo, onExportJson }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#konten">
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <path d="M8.5 12.5l2.5 2.5 4.8-5.2" />
          </svg>
          <span className="brand-title">ReactDo</span>
          <span className="brand-tag">LKP 3B · React + Vite</span>
        </a>

        <nav className="nav-tabs" aria-label="Navigasi bagian">
          <a className="nav-tab" href="#ringkasan">
            Ringkasan
          </a>
          <a className="nav-tab" href="#ruang-kerja">
            Daftar Tugas
          </a>
          <button
            type="button"
            className="nav-tab nav-tab-btn"
            onClick={onOpenShortcuts}
          >
            <span>Pintasan</span>
            <kbd>?</kbd>
          </button>
        </nav>

        <div className="menu-wrap" ref={wrapRef}>
          <button
            type="button"
            className="user-avatar-btn"
            aria-label="Menu profil Yuli Indiyanti"
            aria-expanded={menuOpen}
            aria-controls="user-popover"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Y
          </button>

          {menuOpen ? (
            <div className="popover-menu" id="user-popover">
              <div className="popover-head">
                <span className="popover-avatar" aria-hidden="true">
                  Y
                </span>
                <div className="popover-meta">
                  <strong>Yuli Indiyanti</strong>
                  <span>240511130 · TI24D · UMC</span>
                </div>
              </div>
              <div className="popover-row">
                <span>Pertemuan 5</span>
                <span>React Components &amp; Hooks</span>
              </div>
              <div className="popover-divider" role="separator" />
              <button
                type="button"
                className="popover-action"
                onClick={() => {
                  setMenuOpen(false);
                  onSeedDemo();
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Muat 3 Contoh Tugas</span>
              </button>
              <button
                type="button"
                className="popover-action"
                onClick={() => {
                  setMenuOpen(false);
                  onExportJson();
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                <span>Ekspor Tugas (.json)</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
