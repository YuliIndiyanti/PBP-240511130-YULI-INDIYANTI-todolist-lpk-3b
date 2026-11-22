import { useState } from 'react';
import { CATEGORIES } from '../utils/storage';

const PRIORITIES = [
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'rendah', label: 'Rendah' },
];

export default function TodoForm({ onTambah, inputRef }) {
  const [teks, setTeks] = useState('');
  const [prioritas, setPrioritas] = useState('sedang');
  const [kategori, setKategori] = useState('Kuliah');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const clean = teks.trim();
    if (!clean) {
      setError('Tuliskan isi tugas terlebih dahulu sebelum menekan Tambah.');
      inputRef?.current?.focus();
      return;
    }
    setError('');
    onTambah(clean, prioritas, kategori);
    setTeks('');
  };

  return (
    <section id="ruang-kerja" className="composer-band" aria-label="Tambah tugas baru">
      <div className="container">
        <form onSubmit={submit} className="form composer-form" noValidate>
          <div className="composer-main-row">
            <div className="input-field-wrap">
              <label htmlFor="input-todo" className="sr-only">
                Tulis tugas baru
              </label>
              <input
                ref={inputRef}
                id="input-todo"
                type="text"
                className="composer-input"
                value={teks}
                onChange={(e) => {
                  setTeks(e.target.value);
                  if (error && e.target.value.trim()) setError('');
                }}
                placeholder="Tulis tugas baru, misalnya: Refactor state lifting di App.jsx..."
                maxLength={200}
                autoComplete="off"
                aria-invalid={error ? 'true' : undefined}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-submit">
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
              <span>Tambah</span>
            </button>
          </div>

          <div className="composer-options-row">
            <div className="option-group" role="group" aria-label="Pilih prioritas tugas">
              <span className="option-label">Prioritas</span>
              <div className="pill-group">
                {PRIORITIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`option-pill${prioritas === item.value ? ' is-active' : ''}`}
                    onClick={() => setPrioritas(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group" role="group" aria-label="Pilih kategori tugas">
              <span className="option-label">Kategori</span>
              <div className="pill-group">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`option-pill${kategori === cat ? ' is-active' : ''}`}
                    onClick={() => setKategori(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
