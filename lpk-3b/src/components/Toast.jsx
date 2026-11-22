import { useEffect, useState } from 'react';

export default function Toast({ toast, onDismiss, onUndo }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!toast || paused) return undefined;
    const ms = toast.canUndo ? 5000 : 3200;
    const timer = setTimeout(onDismiss, ms);
    return () => clearTimeout(timer);
  }, [toast, paused, onDismiss]);

  if (!toast) return null;

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <div
        className="toast"
        data-open="true"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="toast-content">
          <svg
            className="toast-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>{toast.message}</span>
        </div>

        <div className="toast-actions">
          {toast.canUndo ? (
            <button type="button" className="toast-undo" onClick={onUndo}>
              Urungkan
            </button>
          ) : null}
          <button
            type="button"
            className="toast-close"
            onClick={onDismiss}
            aria-label="Tutup notifikasi"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
