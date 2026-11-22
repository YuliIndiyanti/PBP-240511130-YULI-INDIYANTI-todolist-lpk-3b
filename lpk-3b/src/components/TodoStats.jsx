export default function TodoStats({ todos, onBersihkanSelesai }) {
  const total = todos.length;
  const selesai = todos.filter((t) => t.selesai).length;
  const belum = total - selesai;
  const pct = total ? Math.round((selesai / total) * 100) : 0;
  const highActive = todos.filter((t) => !t.selesai && t.prioritas === 'tinggi').length;

  const countsByCat = { Kuliah: 0, Proyek: 0, Pribadi: 0 };
  for (const t of todos) {
    if (countsByCat[t.kategori] !== undefined) {
      countsByCat[t.kategori] += 1;
    }
  }

  return (
    <div className="telemetry-panel" aria-label="Statistik tugas">
      <div className="telemetry-cell">
        <span className="cell-label">Status Saat Ini</span>
        <div className="cell-value-group">
          <strong className="cell-big">{belum}</strong>
          <p className="stats cell-caption">{belum} tugas belum selesai</p>
        </div>
      </div>

      <div className="telemetry-cell">
        <span className="cell-label">Progres Penyelesaian</span>
        <div className="cell-value-group">
          <div className="cell-split">
            <strong className="cell-med">
              {selesai} dari {total}
            </strong>
            <span className="cell-pct">{pct}%</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="cell-caption">
            {total === 0
              ? 'Belum ada tugas tercatat'
              : belum === 0
                ? 'Seluruh tugas sudah dituntaskan'
                : `${selesai} selesai · ${belum} menunggu aksi`}
          </span>
        </div>
      </div>

      <div className="telemetry-cell">
        <span className="cell-label">Prioritas Tinggi</span>
        <div className="cell-value-group">
          <strong className="cell-med">{highActive} aktif</strong>
          <span className="cell-caption">
            {highActive === 0 ? 'Tidak ada tugas mendesak' : 'Perlu segera diselesaikan'}
          </span>
        </div>
      </div>

      <div className="telemetry-cell">
        <span className="cell-label">Sebaran Kategori</span>
        <div className="cell-value-group">
          <p className="cell-meta-line">
            Kuliah {countsByCat.Kuliah} · Proyek {countsByCat.Proyek} · Pribadi {countsByCat.Pribadi}
          </p>
          <button
            type="button"
            className="btn btn-subtle btn-xs"
            disabled={selesai === 0}
            onClick={onBersihkanSelesai}
          >
            Bersihkan Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
