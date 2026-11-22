import { useEffect, useRef } from 'react';

export default function HalftoneFooter({ wordmark = 'reactdo' }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return undefined;

    const o = {
      wordmark,
      dotGap: 6,
      radius: 85,
      crop: 0.2,
      grain: 0.5,
      fontFamily: '"Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif',
      fontWeight: 800,
      bg: '#0C0806',
      inkHex: '#F7EFE6',
      ink: [247, 239, 230],
      warm: [243, 220, 141],
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    let dots = new Float32Array(0);
    let count = 0;
    let grainTile = null;
    let disposed = false;

    const layout = () => {
      if (disposed) return;
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const mask = document.createElement('canvas');
      mask.width = w;
      mask.height = h;
      const m = mask.getContext('2d', { willReadFrequently: true });
      if (!m) return;

      m.font = `${o.fontWeight} 100px ${o.fontFamily}`;
      const measured = m.measureText(o.wordmark).width;
      const fit = measured > 0 ? ((w * 0.96) / measured) * 100 : 0;
      m.font = `${o.fontWeight} ${fit}px ${o.fontFamily}`;
      const box = m.measureText(o.wordmark);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      m.fillStyle = '#000';
      m.textBaseline = 'alphabetic';
      m.fillText(o.wordmark, (w - box.width) / 2, h + cap * o.crop);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = o.dotGap;
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, Math.sqrt(Math.min(1, cov)) * gap * 0.56);
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      grainTile = document.createElement('canvas');
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext('2d');
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      awake = true;
    };

    const draw = (now) => {
      if (disposed) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.bg;
      ctx.fillRect(0, 0, w, h);

      const r = reduced ? 0 : o.radius;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.9;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];

        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (r > 0 && d2 < r * r) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / r) * 2.6;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
          vx = (vx + (hx - x) * 0.05) * 0.84;
          vy = (vy + (hy - y) * 0.05) * 0.84;
          x += vx;
          y += vy;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }

        const k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        ctx.fillStyle =
          k > 0.02
            ? `rgb(${Math.round(o.ink[0] + (o.warm[0] - o.ink[0]) * k)},${Math.round(o.ink[1] + (o.warm[1] - o.ink[1]) * k)},${Math.round(o.ink[2] + (o.warm[2] - o.ink[2]) * k)})`
            : o.inkHex;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = o.grain * 0.08;
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(grainTile, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      awake = moving || ringAge < 900 || px > -1e4;
    };

    const loop = (now) => {
      raf = 0;
      if (!visible || disposed) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible && !disposed) raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e) => {
      const b = canvas.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      wake();
    };

    const onPointerLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onPointerDown = (e) => {
      if (reduced || e.target.closest('a,button')) return;
      const b = canvas.getBoundingClientRect();
      ring = { x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now() };
      wake();
    };

    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);
    root.addEventListener('pointerdown', onPointerDown);

    layout();
    draw(performance.now());
    wake();

    const resizeObs = new ResizeObserver(() => {
      layout();
      wake();
    });
    resizeObs.observe(root);

    const interObs = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    interObs.observe(root);

    document.fonts?.ready?.then(() => {
      layout();
      wake();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerdown', onPointerDown);
      resizeObs.disconnect();
      interObs.disconnect();
    };
  }, [wordmark]);

  return (
    <footer id="hwf-footer" className="hwf-root" ref={rootRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>

      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>ReactDo · LKP 3B</strong>
          <span>Yuli Indiyanti · 240511130 · TI24D</span>
        </div>

        <nav className="hwf-col" aria-label="Navigasi Footer">
          <h3>Navigasi</h3>
          <ul>
            <li>
              <a href="#ringkasan">Ringkasan</a>
            </li>
            <li>
              <a href="#ruang-kerja">Tambah Tugas</a>
            </li>
            <li>
              <a href="#daftar-tugas">Daftar Tugas</a>
            </li>
          </ul>
        </nav>

        <div className="hwf-col">
          <h3>Praktikum</h3>
          <ul>
            <li>
              <span>Pertemuan 5 · React Fundamentals</span>
            </li>
            <li>
              <span>S1 Teknik Informatika UMC</span>
            </li>
          </ul>
        </div>

        <div className="hwf-col">
          <h3>Penyimpanan</h3>
          <ul>
            <li>
              <span>localStorage Key: todos</span>
            </li>
            <li>
              <span>Tema: Cocoa &amp; Butter Yellow</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hwf-rule">
        <span className="hwf-hint">Arahkan kursor atau klik area partikel di bawah</span>
        <button
          type="button"
          className="hwf-up"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
