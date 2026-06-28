# BarzzLy DeluxeMenu Editor

Web editor untuk membuat, mengedit, mengimpor, dan mengekspor konfigurasi YAML DeluxeMenus secara visual.

## Fitur

- Visual inventory grid untuk konfigurasi item per slot.
- Import file `.yml` atau `.yaml` DeluxeMenus.
- Export hasil konfigurasi ke file YAML.
- Preview YAML langsung dari state editor.
- Editor item dengan tab General, Actions, Requirements, Enchants, Flags, NBT / Model, dan Advanced.
- Dukungan priority variant untuk beberapa item di slot yang sama.
- Dukungan beberapa inventory type, termasuk chest dan layout custom Minecraft seperti furnace, anvil, brewing, enchanting, beacon, loom, cartography, grindstone, dan player inventory.
- Undo dan redo untuk perubahan editor.
- Tema light dan dark.
- Logo BarzzLy transparan yang menyesuaikan tema.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- Zustand
- js-yaml
- lucide-react
- Oxlint

## Struktur Project

```text
public/
  images/              Logo dan aset publik
src/
  components/          Komponen UI, layout, menu, item editor, dan YAML preview
  constants/           Data material, enchantment, flags, action type, potion effect
  store/               Zustand store dan default state
  utils/               YAML generator, layout inventory, dan preview warna Minecraft
```

## Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Workflow Dasar

1. Atur menu title, open command, inventory type, slots, dan opsi lain di sidebar.
2. Klik slot pada visual grid untuk membuat atau mengedit item.
3. Isi data item melalui tab editor.
4. Gunakan tab YAML Output untuk melihat hasil konfigurasi.
5. Klik Download untuk menyimpan file `.yml`.

## Import YAML

Gunakan tombol Import untuk memilih file `.yml` atau `.yaml`, atau paste isi konfigurasi langsung ke modal import. Proses import akan mengganti state editor yang sedang aktif.

## Export YAML

Tombol Download menghasilkan file YAML berdasarkan state editor saat ini. Nama file mengikuti menu name yang sedang aktif.

## Theme

Theme dapat diganti dari tombol light/dark di topbar. Pilihan theme disimpan di `localStorage` dengan key `barzzly-theme`.

## Shortcut

- `Escape`: batal pilih slot atau blur input aktif.
- `Delete` / `Backspace`: hapus konfigurasi slot yang sedang dipilih.
- `Ctrl + Z`: undo.
- `Ctrl + Shift + Z`: redo.
- `Ctrl + Y`: redo.

## Catatan Development

- Jangan edit output di `dist/` secara manual.
- Logo publik berada di `public/images/`.
- Konversi state ke YAML utama ada di `src/utils/yamlGenerator.js`.
- Layout inventory utama ada di `src/utils/inventoryLayout.js`.