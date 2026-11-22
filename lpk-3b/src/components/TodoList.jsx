import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  totalCount,
  lastAddedId,
  onHapus,
  onToggle,
  onEdit,
  onResetFilter,
  onSeedDemo,
}) {
  if (totalCount === 0) {
    return (
      <div className="todo-surface">
        <div className="kosong empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h3>Belum ada tugas.</h3>
          <p>
            Ketik tugas baru pada kolom di atas, atau muat 3 contoh tugas praktikum untuk langsung
            mencoba.
          </p>
          <button type="button" className="btn btn-subtle" onClick={onSeedDemo}>
            Isi 3 Contoh Tugas
          </button>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-surface">
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3>Tidak ada tugas yang cocok</h3>
          <p>Coba ubah kata kunci pencarian, tab status, kategori, atau filter prioritas.</p>
          <button type="button" className="btn btn-subtle" onClick={onResetFilter}>
            Reset Semua Filter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-surface">
      <ul className="list todo-list" aria-live="polite">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isNew={todo.id === lastAddedId}
            onHapus={onHapus}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </div>
  );
}
