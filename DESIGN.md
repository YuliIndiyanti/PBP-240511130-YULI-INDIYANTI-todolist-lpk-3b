# DESIGN.md — Dark Chocolate × Butter Yellow (Pertemuan 4 & 5)

**Identitas Proyek**
- **Mahasiswa:** Yuli Indiyanti (`240511130` · Kelas `TI24D`)
- **Program Studi:** S1 Teknik Informatika — Universitas Muhammadiyah Cirebon (UMC)
- **Mata Kuliah:** Pemrograman Berbasis Platform (Pertemuan 4: LKP 3A Vanilla JS & Pertemuan 5: LKP 3B React + Vite)
- **Referensi Tipografi & Interaksi:** `PPL-MODUL3` (`Bricolage Grotesque` + `Plus Jakarta Sans`, grid 1px hairline editorial, serta Halftone Particle Canvas Footer)

---

## 1. Surface Mode & Konsep Visual

- **Surface Mode:** `Operate` (fokus produktivitas harian: scanability tinggi, kontras tegas, kontrol 1-klik, feedback taktil) berpadu dengan `Experience` pada footer partikel halftone interaktif (`todolist` pada LKP 3A & `reactdo` pada LKP 3B).
- **Tema:** **Espresso Noir & Butter Yellow (Dark Chocolate × Butter Yellow)**. Mengambil materialitas biji kopi sangrai gelap, permukaan dark cocoa yang tenang, tinta toasted cream hangat, serta aksen kuning mentega (*butter yellow*) yang cerah namun lembut sebagai fokus aksi utama.
- **Prinsip Anti-Slop & Craft Floor (`taste-skill`, `impeccable`, `emil-design-eng`):**
  - Tanpa gradasi mencolok di latar belakang atau teks; pemisahan permukaan menggunakan step tone + garis hairline 1px halus (`--line`).
  - Tanpa kartu bersarang, tanpa kicker/eyebrow di atas heading, dan tanpa emoji sistem sebagai ikon UI (seluruh ikon memakai inline SVG dengan ketebalan garis `stroke-width="1.75"`, ujung bulat).
  - Permukaan browser bawaan ikut di-theme (`::selection`, `caret-color`, scrollbar cocoa hangat, `:focus-visible`, dan `tabular-nums` pada seluruh metrik angka).

---

## 2. Three-Layer Design Tokens

### Layer 1: Primitive Palette

| Token CSS | Hex / Value | Peran |
|---|---|---|
| `--espresso-950` | `#0C0806` | Dasar terdalam & kanvas footer halftone |
| `--espresso-900` | `#100B08` | Latar utama halaman (`ground`) |
| `--cocoa-850` | `#16100C` | Permukaan cekung (`sunk`) untuk toolbar & input |
| `--cocoa-800` | `#1B130E` | Permukaan panel & kartu utama (`surface`) |
| `--cocoa-700` | `#251A13` | Permukaan hover & dialog terangkat |
| `--cocoa-600` | `#33241B` | Border kuat & tombol sekunder hover |
| `--cream-100` | `#F7EFE6` | Teks utama toasted cream (kontras > 15:1 vs `#100B08`) |
| `--latte-300` | `#C6B19E` | Teks sekunder hangat (kontras > 8.6:1 vs `#100B08`) |
| `--latte-400` | `#9C8470` | Teks metadata, placeholder, & label tersier (kontras > 4.9:1) |
| `--butter-200` | `#FAF0BD` | Aksen highlight hover & teks pill terang |
| `--butter-300` | `#F3DC8D` | Aksen utama tombol, avatar, fokus, & shift warna partikel |
| `--butter-400` | `#DFC164` | Aksen butter yellow lebih pekat |
| `--sage-400` | `#6FC293` | Status sukses & progres selesai |
| `--amber-400` | `#EBD27B` | Prioritas sedang & peringatan lembut |
| `--terracotta-400` | `#E57A63` | Prioritas tinggi & aksi hapus |

### Layer 2: Semantic Tokens

- `--bg-ground`: `var(--espresso-900)`
- `--bg-surface`: `var(--cocoa-800)`
- `--bg-sunk`: `var(--cocoa-850)`
- `--bg-hover`: `var(--cocoa-700)`
- `--ink-primary`: `var(--cream-100)`
- `--ink-secondary`: `var(--latte-300)`
- `--ink-muted`: `var(--latte-400)`
- `--accent`: `var(--butter-300)`
- `--accent-hover`: `var(--butter-200)`
- `--accent-ink`: `var(--espresso-900)`
- `--accent-wash`: `rgba(243, 220, 141, 0.16)`
- `--ok`: `var(--sage-400)` / `--ok-wash`: `rgba(111, 194, 147, 0.16)`
- `--warn`: `var(--amber-400)` / `--warn-wash`: `rgba(235, 210, 123, 0.16)`
- `--danger`: `var(--terracotta-400)` / `--danger-wash`: `rgba(229, 122, 99, 0.16)`
- `--line`: `rgba(247, 239, 230, 0.09)`
- `--line-strong`: `rgba(247, 239, 230, 0.18)`

### Layer 3: Motion & Component Tokens

- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (untuk enter/exit dan umpan balik taktil cepat)
- `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` (untuk pergeseran elemen di layar)
- `--dur-press`: `140ms` (`button:active { transform: scale(0.97); }`)
- `--dur-ui`: `200ms` (popover, chip, hover, dan progress bar)
- `--dur-toast`: `260ms` (toast Undo Hapus masuk & keluar dari bawah)
- **Aturan Ketat Animasi:**
  - Tidak menggunakan `transition: all` dan tidak menggunakan `ease-in`.
  - Tidak pernah menganimasikan shortcut keyboard (`N`, `/`, `?`).
  - Hover transform digated ke `@media (hover: hover) and (pointer: fine)` dan penuh dukungan `@media (prefers-reduced-motion: reduce)`.

---

## 3. Tipografi & Hirarki Teks

| Peran | Font Family | Karakteristik |
|---|---|---|
| **Display & Heading** | `Bricolage Grotesque` (`600`, `700`, `800`) | Tracking `-0.025em`, `line-height: 1.08`, angka panel pakai `tabular-nums` |
| **Body & Kontrol UI** | `Plus Jakarta Sans` (`400`, `500`, `600`, `700`) | Optimal keterbacaan pada `14px–16px`, `line-height: 1.55` |
| **Fungsional & Kolofon** | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Eksklusif untuk `<kbd>` shortcut, cap waktu tugas, dan kolofon footer ala `PPL-MODUL3` |

---

## 4. Spesifikasi Interactive Halftone Particle Canvas (`PPL-MODUL3`)

Diadaptasi langsung dari `welcome.blade.php` pada folder referensi `PPL-MODUL3`:
- **Wordmark:** `'todolist'` (LKP 3A) dan `'reactdo'` (LKP 3B), dirender menggunakan `Bricolage Grotesque` bobot `800` ke mask canvas lalu disampling menjadi grid titik-titik halftone (`dotGap: 6`, `crop: 0.2`, `radius: 85`).
- **Palet Partikel:**
  - Latar kanvas: `#0C0806` (`--espresso-950`)
  - Titik diam: `[247, 239, 230]` (`#F7EFE6` Toasted Cream)
  - Pergeseran warna saat terdorong kursor: `[243, 220, 141]` (`#F3DC8D` Butter Yellow)
- **Fisika Interaktif:**
  - Kursor mendekat mendorong titik menjauh secara radial (`radius: 85`).
  - Klik area kanvas memancarkan gelombang riak (*shockwave ring*, `ringAge < 900ms`).
  - Spring return (`(vx + (hx - x) * 0.05) * 0.84`) + tekstur *film grain* halus (`grain: 0.5`).
  - Mematuhi `document.fonts.ready`, `ResizeObserver`, `IntersectionObserver`, dan `prefers-reduced-motion`.
