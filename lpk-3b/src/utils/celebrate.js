const BURST_COLORS = ['#F3DC8D', '#FAF0BD', '#6FC293', '#F7EFE6'];

export function burstCelebration(originEl) {
  if (!originEl || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('span');
    dot.className = 'burst-dot';
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    dot.style.background = BURST_COLORS[i % BURST_COLORS.length];
    document.body.appendChild(dot);

    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.35;
    const dist = 18 + Math.random() * 18;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    const anim = dot.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`,
          opacity: 0,
        },
      ],
      {
        duration: 380,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'forwards',
      }
    );
    anim.onfinish = () => dot.remove();
  }
}
