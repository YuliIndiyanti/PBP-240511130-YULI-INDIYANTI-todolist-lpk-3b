import { CATEGORIES } from '../utils/storage';

const STATUS_TABS = [
  { id: 'semua', label: 'Semua' },
  { id: 'aktif', label: 'Aktif' },
  { id: 'selesai', label: 'Selesai' },
];

export default function TodoToolbar({
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  filterPriority,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
  searchRef,
}) {
  return (
    <section className="toolbar-band" aria-label="Filter dan pencarian tugas">
      <div className="container toolbar-inner">
        <div className="toolbar-filters">
          <div className="segmented-tabs" role="tablist" aria-label="Filter status tugas">
            {STATUS_TABS.map((tab) => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`seg-tab${active ? ' is-active' : ''}`}
                  onClick={() => onStatusChange(tab.id)}
                >
                  {tab.label} <span className="tab-count">{counts[tab.id] ?? 0}</span>
                </button>
              );
            })}
          </div>

          <div className="category-chips" role="group" aria-label="Filter kategori">
            {['Semua', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip-btn${filterCategory === cat ? ' is-active' : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat === 'Semua' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-controls">
          <div className="search-box">
            <label htmlFor="search-input" className="sr-only">
              Cari tugas
            </label>
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              id="search-input"
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tugas atau kategori..."
              autoComplete="off"
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-clear"
                aria-label="Hapus pencarian"
                onClick={() => {
                  onSearchChange('');
                  searchRef?.current?.focus();
                }}
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
            ) : null}
          </div>

          <div className="select-wrap">
            <label htmlFor="priority-filter" className="sr-only">
              Filter prioritas
            </label>
            <select
              id="priority-filter"
              className="control-select"
              value={filterPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              aria-label="Filter prioritas"
            >
              <option value="semua">Prioritas: Semua</option>
              <option value="tinggi">Prioritas: Tinggi</option>
              <option value="sedang">Prioritas: Sedang</option>
              <option value="rendah">Prioritas: Rendah</option>
            </select>
          </div>

          <div className="select-wrap">
            <label htmlFor="sort-select" className="sr-only">
              Urutkan tugas
            </label>
            <select
              id="sort-select"
              className="control-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Urutkan tugas"
            >
              <option value="terbaru">Urut: Terbaru</option>
              <option value="prioritas">Urut: Prioritas</option>
              <option value="abjad">Urut: A – Z</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
