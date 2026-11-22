export const STORAGE_KEY = 'todos';

export const PRIORITY_ORDER = {
  tinggi: 0,
  sedang: 1,
  rendah: 2,
};

export const CATEGORIES = ['Kuliah', 'Proyek', 'Pribadi'];

export const SAMPLE_TODOS = [
  {
    teks: 'Konversi komponen To-Do List ke React (TodoForm, TodoList, TodoItem, TodoStats)',
    prioritas: 'tinggi',
    kategori: 'Kuliah',
    selesai: false,
  },
  {
    teks: 'Pastikan useState lazy init & useEffect persist ke localStorage tanpa hilang saat StrictMode',
    prioritas: 'sedang',
    kategori: 'Proyek',
    selesai: false,
  },
  {
    teks: 'Rapikan dokumentasi komponen React & screenshot hasil uji coba Vite',
    prioritas: 'rendah',
    kategori: 'Pribadi',
    selesai: true,
  },
];

let lastGeneratedId = 0;

export function createTodoId() {
  const now = Date.now();
  lastGeneratedId = Math.max(now, lastGeneratedId + 1);
  return lastGeneratedId;
}

export function normalizeTodo(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const teks = typeof raw.teks === 'string' ? raw.teks.trim() : '';
  if (!teks) return null;

  const id = typeof raw.id === 'number' && Number.isFinite(raw.id) ? raw.id : createTodoId();
  lastGeneratedId = Math.max(lastGeneratedId, id);

  const prioritas = PRIORITY_ORDER[raw.prioritas] !== undefined ? raw.prioritas : 'sedang';
  const kategori = CATEGORIES.includes(raw.kategori) ? raw.kategori : 'Kuliah';
  const createdAt = typeof raw.createdAt === 'number' ? raw.createdAt : id;

  return {
    id,
    teks,
    selesai: Boolean(raw.selesai),
    prioritas,
    kategori,
    createdAt,
  };
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTodo).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}

export function formatTimestamp(ms) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return '';
  }
}

export function formatPriorityLabel(prio) {
  if (prio === 'tinggi') return 'Tinggi';
  if (prio === 'rendah') return 'Rendah';
  return 'Sedang';
}
