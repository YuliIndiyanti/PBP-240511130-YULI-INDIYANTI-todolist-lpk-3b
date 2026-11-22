import { useState, useRef, useEffect } from 'react';
import { formatTimestamp, formatPriorityLabel } from '../utils/storage';
import { burstCelebration } from '../utils/celebrate';

export default function TodoItem({ todo, isNew, onHapus, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.teks);
  const editInputRef = useRef(null);
  const checkVisualRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      const len = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const startEdit = () => {
    setDraft(todo.teks);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(todo.teks);
    setIsEditing(false);
  };

  const commitEdit = (e) => {
    e.preventDefault();
    const clean = draft.trim();
    if (clean && clean !== todo.teks) {
      onEdit(todo.id, clean);
    }
    setIsEditing(false);
  };

  const handleToggle = () => {
    if (!todo.selesai) {
      burstCelebration(checkVisualRef.current);
    }
    onToggle(todo.id);
  };

  return (
    <li className={`todo-item${todo.selesai ? ' selesai' : ''}${isNew ? ' is-entering' : ''}`}>
      <div className="todo-main">
        <label className="todo-check-label" aria-label={`Tandai ${todo.teks} selesai`}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.selesai}
            onChange={handleToggle}
          />
          <span ref={checkVisualRef} className="todo-check-visual" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </label>

        <div className="todo-body">
          <div className="todo-text-wrap">
            {isEditing ? (
              <form className="inline-edit-form" onSubmit={commitEdit}>
                <input
                  ref={editInputRef}
                  type="text"
                  className="inline-edit-input"
                  value={draft}
                  maxLength={200}
                  aria-label="Edit teks tugas"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <button type="submit" className="btn-action">
                  Simpan
                </button>
                <button type="button" className="btn-action" onClick={cancelEdit}>
                  Batal
                </button>
              </form>
            ) : (
              <span
                className="teks"
                title="Klik dua kali untuk mengedit"
                onDoubleClick={startEdit}
              >
                {todo.teks}
              </span>
            )}
          </div>

          <div className="todo-meta">
            <span className={`badge badge-prio-${todo.prioritas}`}>
              {formatPriorityLabel(todo.prioritas)}
            </span>
            <span className="badge badge-cat">{todo.kategori}</span>
            <span className="todo-time">{formatTimestamp(todo.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="todo-actions">
        {!isEditing ? (
          <button
            type="button"
            className="btn-action"
            onClick={startEdit}
            aria-label={`Edit ${todo.teks}`}
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
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Edit</span>
          </button>
        ) : null}

        <button
          type="button"
          className="btn-action hapus"
          onClick={() => onHapus(todo.id)}
          aria-label={`Hapus ${todo.teks}`}
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
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
          <span>Hapus</span>
        </button>
      </div>
    </li>
  );
}
