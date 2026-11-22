import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import TodoStats from './components/TodoStats';
import TodoForm from './components/TodoForm';
import TodoToolbar from './components/TodoToolbar';
import TodoList from './components/TodoList';
import Toast from './components/Toast';
import ShortcutModal from './components/ShortcutModal';
import HalftoneFooter from './components/HalftoneFooter';
import {
  PRIORITY_ORDER,
  SAMPLE_TODOS,
  createTodoId,
  loadTodos,
  saveTodos,
} from './utils/storage';
import './App.css';

export default function App() {
  // Lazy initialization ensures React StrictMode double-mount never clears saved localStorage
  const [todos, setTodos] = useState(() => loadTodos());
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterPriority, setFilterPriority] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [lastAddedId, setLastAddedId] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [toast, setToast] = useState(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const inputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const ok = saveTodos(todos);
    if (!ok) {
      setToast({
        id: Date.now(),
        message: 'Gagal menyimpan ke localStorage browser.',
        canUndo: false,
      });
    }
  }, [todos]);

  const showToast = useCallback((message, canUndo = false) => {
    setToast({ id: Date.now(), message, canUndo });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const tambah = useCallback(
    (teks, prioritas = 'sedang', kategori = 'Kuliah') => {
      const clean = teks.trim();
      if (!clean) return;
      const newTodo = {
        id: createTodoId(),
        teks: clean,
        selesai: false,
        prioritas,
        kategori,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      setLastAddedId(newTodo.id);
      showToast(`Tugas "${clean.slice(0, 36)}${clean.length > 36 ? '...' : ''}" ditambahkan.`);
    },
    [showToast]
  );

  const hapus = useCallback(
    (id) => {
      setTodos((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        if (index === -1) return prev;
        const removed = prev[index];
        setLastDeleted({ todo: removed, index });
        showToast(
          `Tugas "${removed.teks.slice(0, 30)}${removed.teks.length > 30 ? '...' : ''}" dihapus.`,
          true
        );
        return prev.filter((t) => t.id !== id);
      });
    },
    [showToast]
  );

  const urungkanHapus = useCallback(() => {
    if (!lastDeleted) return;
    const { todo, index } = lastDeleted;
    setLastDeleted(null);
    setTodos((prev) => {
      const next = [...prev];
      const insertAt = Math.min(index, next.length);
      next.splice(insertAt, 0, todo);
      return next;
    });
    setLastAddedId(todo.id);
    showToast('Tugas berhasil dikembalikan.');
  }, [lastDeleted, showToast]);

  const toggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t))
    );
  }, []);

  const edit = useCallback(
    (id, teksBaru) => {
      const clean = teksBaru.trim();
      if (!clean) return;
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, teks: clean } : t)));
      showToast('Perubahan tugas disimpan.');
    },
    [showToast]
  );

  const bersihkanSelesai = useCallback(() => {
    setTodos((prev) => {
      const doneCount = prev.filter((t) => t.selesai).length;
      if (doneCount === 0) return prev;
      setLastDeleted(null);
      showToast(`${doneCount} tugas selesai dibersihkan.`);
      return prev.filter((t) => !t.selesai);
    });
  }, [showToast]);

  const muatContoh = useCallback(() => {
    setTodos((prev) => {
      const existing = new Set(prev.map((t) => t.teks.toLowerCase()));
      const additions = SAMPLE_TODOS.filter(
        (s) => !existing.has(s.teks.toLowerCase())
      ).map((s) => ({
        id: createTodoId(),
        teks: s.teks,
        prioritas: s.prioritas,
        kategori: s.kategori,
        selesai: s.selesai,
        createdAt: Date.now(),
      }));

      if (additions.length === 0) {
        showToast('Semua contoh tugas sudah tersedia di daftar.');
        return prev;
      }
      showToast(`${additions.length} contoh tugas siap digunakan.`);
      return [...additions, ...prev];
    });
  }, [showToast]);

  const eksporJson = useCallback(() => {
    const payload = JSON.stringify(todos, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reactdo-lpk3b-yuli-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Daftar tugas diekspor sebagai JSON.');
  }, [todos, showToast]);

  const resetAllFilters = useCallback(() => {
    setFilterStatus('semua');
    setFilterCategory('Semua');
    setFilterPriority('semua');
    setSearchQuery('');
    setSortBy('terbaru');
  }, []);

  // Global keyboard shortcuts (instant, zero animation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        e.target.isContentEditable;

      if (isTyping || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const counts = useMemo(() => {
    const semua = todos.length;
    const selesai = todos.filter((t) => t.selesai).length;
    const aktif = semua - selesai;
    const highActive = todos.filter((t) => !t.selesai && t.prioritas === 'tinggi').length;
    const pct = semua ? Math.round((selesai / semua) * 100) : 0;
    return { semua, aktif, selesai, highActive, pct };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = todos.filter((t) => {
      if (filterStatus === 'aktif' && t.selesai) return false;
      if (filterStatus === 'selesai' && !t.selesai) return false;
      if (filterCategory !== 'Semua' && t.kategori !== filterCategory) return false;
      if (filterPriority !== 'semua' && t.prioritas !== filterPriority) return false;
      if (q) {
        const hay = `${t.teks} ${t.kategori} ${t.prioritas}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'prioritas') {
        const diff = (PRIORITY_ORDER[a.prioritas] ?? 1) - (PRIORITY_ORDER[b.prioritas] ?? 1);
        if (diff !== 0) return diff;
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'abjad') {
        return a.teks.localeCompare(b.teks, 'id');
      }
      return b.createdAt - a.createdAt;
    });
  }, [todos, filterStatus, filterCategory, filterPriority, searchQuery, sortBy]);

  const heroSummary = useMemo(() => {
    if (counts.semua === 0) {
      return 'Dibangun dengan arsitektur komponen React modular, state lifting, hooks, dan persistensi otomatis ke localStorage.';
    }
    if (counts.aktif === 0) {
      return `Hebat! Seluruh ${counts.semua} tugas sudah tuntas. Tambahkan tugas baru atau bersihkan tugas selesai kapan saja.`;
    }
    return `Saat ini ada ${counts.aktif} tugas aktif dari total ${counts.semua} tugas (${counts.pct}% selesai)${
      counts.highActive > 0 ? `, dengan ${counts.highActive} tugas berprioritas tinggi` : ''
    }.`;
  }, [counts]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#konten">
        Lewati ke konten utama
      </a>

      <Navbar
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onSeedDemo={muatContoh}
        onExportJson={eksporJson}
      />

      <main id="konten" className="app">
        <section id="ringkasan" className="hero-band">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>
                Kelola tugas harian
                <br />
                berbasis React.
              </h1>
              <p className="hero-lede">{heroSummary}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    inputRef.current?.focus();
                    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>Tulis Tugas Baru</span>
                </button>
                <span className="shortcut-hint">
                  Tekan <kbd>N</kbd> tambah, <kbd>/</kbd> cari, <kbd>?</kbd> bantuan
                </span>
              </div>
            </div>

            <TodoStats todos={todos} onBersihkanSelesai={bersihkanSelesai} />
          </div>
        </section>

        <TodoForm onTambah={tambah} inputRef={inputRef} />

        <TodoToolbar
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          counts={counts}
          searchRef={searchRef}
        />

        <section id="daftar-tugas" className="workspace-band" aria-label="Daftar tugas">
          <div className="container">
            <div className="list-header">
              <div>
                <h2>Daftar Tugas</h2>
                <p className="list-subtitle">
                  Klik kotak centang untuk menandai selesai, klik dua kali teks tugas untuk mengedit
                  langsung.
                </p>
              </div>
              <span className="visible-pill">
                Menampilkan <strong>{visibleTodos.length}</strong> dari{' '}
                <strong>{todos.length}</strong>
              </span>
            </div>

            <TodoList
              todos={visibleTodos}
              totalCount={todos.length}
              lastAddedId={lastAddedId}
              onHapus={hapus}
              onToggle={toggle}
              onEdit={edit}
              onResetFilter={resetAllFilters}
              onSeedDemo={muatContoh}
            />
          </div>
        </section>
      </main>

      <Toast toast={toast} onDismiss={dismissToast} onUndo={urungkanHapus} />

      <ShortcutModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <HalftoneFooter wordmark="reactdo" />
    </div>
  );
}
