import { useEffect, useRef } from 'react';

export default function ShortcutModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="shortcuts-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <h2 id="shortcuts-title">Pintasan Keyboard</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Tutup dialog"
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

        <ul className="shortcut-list">
          <li>
            <span>Fokus ke input tugas baru</span>
            <kbd>N</kbd>
          </li>
          <li>
            <span>Fokus ke kolom pencarian</span>
            <kbd>/</kbd>
          </li>
          <li>
            <span>Simpan saat mengedit inline</span>
            <kbd>Enter</kbd>
          </li>
          <li>
            <span>Batal edit / tutup menu</span>
            <kbd>Esc</kbd>
          </li>
          <li>
            <span>Buka daftar pintasan ini</span>
            <kbd>?</kbd>
          </li>
        </ul>
      </div>
    </dialog>
  );
}
