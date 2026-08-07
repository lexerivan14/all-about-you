# All About You — Lyric Player

A minimalist, single-page lyric-sync player built for "All About You" by
The 1975. It plays a local audio file you provide and pops each lyric line
onto the screen in time with the music, with a photo background that fades
in once playback starts.

## Files

| File               | Purpose                                                      |
|---------------------|---------------------------------------------------------------|
| `lyric-player.html`| Page structure/markup. Open this file in a browser to run it. |
| `styles.css`        | All visual styling — colors, layout, fonts, animations.       |
| `script.js`         | Playback logic, lyric sync engine, and the `LYRICS` data.     |
| `background.png`    | Background photo, fades in behind the lyrics once you hit play. |

All four files must stay together in the same folder — they reference each
other by relative path.

## Getting started

1. Open `lyric-player.html` directly in any modern browser (double-click it,
   or drag it into a browser window). No server or build step required.
2. Click **Load audio** and choose your own local copy of the track.
3. Click play (or press the space bar once a track is loaded).

## Finishing the lyric sync

Open `script.js` and find the `LYRICS` array near the top:

```js
const LYRICS = [
  { time: 0, text: "" },
  { time: 0, text: "" },
  { time: 0, text: "" },
  { time: 0, text: "" },
];
```

- `time` — the second in the track when that line should appear.
- `text` — the lyric line itself.

Fill this in yourself by listening: play the track in the page, and for
each line, add an entry with the timestamp (in seconds) it starts at and
the line's text. Add as many entries as you need, and keep them in
ascending time order. There's no shortcut here — going through it by ear
is the most reliable way to get the sync feeling right.

## Customizing

- **Colors, type, spacing** — all defined as CSS custom properties at the
  top of `styles.css` (`:root { ... }`), plus rule-by-rule styles below.
- **Background photo** — swap in a different image by replacing
  `background.png` (keep the filename, or update the `url(...)` reference
  in the `.bg-image` rule in `styles.css`).
- **Number of visible lyric lines / pop animation feel** — see the
  `.lyric-line[data-pos="..."]` rules in `styles.css` and the `pop`
  keyframe animation just below them.

## Notes

- Respects `prefers-reduced-motion` (animations soften automatically).
- Responsive down to mobile widths.
- No external dependencies beyond Google Fonts (Fraunces, IBM Plex Mono),
  loaded via CDN in `styles.css`.
