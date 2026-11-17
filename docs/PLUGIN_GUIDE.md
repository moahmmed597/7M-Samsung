# Stremio 7M — Plugin guide (manga, comics, books, audiobooks)

How a source repository for Stremio 7M must look, so the app can read and play it. One format for every tab; the tab is chosen by the user when adding the repository (Manga / Comics / Books → My sources).

## 1. Repository

`repo.json` at a raw URL (e.g. `https://raw.githubusercontent.com/<user>/<repo>/main/repo.json`):

```json
{
  "name": "Books for 7M",
  "plugins": [
    { "id": "mybooks", "name": "My Books (عربي)", "version": "1.0.0", "lang": "ar", "nsfw": false,
      "icon": "https://example.com/icon.png", "entry": "mybooks.plugin.js" }
  ]
}
```

- `id`: unique, stable (it keys saved places and links).
- `version`: **raise it on every change** — the app updates plugins by itself once a day when the version grows ("Update all" forces it).
- `lang`: `ar` makes the reader and the audiobook page turn right-to-left; `en` left-to-right.
- `entry`: the plugin file, relative to `repo.json`.

## 2. Plugin file

Plain JavaScript (modern syntax is fine). It runs in a sandboxed worker: no DOM, no `fetch`; use the `harbor` object. End the file with `return plugin;` (or call `harbor.register(plugin)`).

```js
const plugin = {
  id: "mybooks",
  name: "My Books (عربي)",
  async popular(offset) { /* → [{ id, title, cover }] */ },
  async search(query, offset) { /* → [{ id, title, cover }] */ },
  async detail(id) { /* → { id, title, cover, description, author, status } */ },
  async chapters(id) { /* → [{ id, chapter, title }]   (reading chapters; [] if the book is audio only) */ },
  async pageUrls(chapterId) { /* → [url | data:image/... , ...]   (the pages of one chapter) */ },
  async audioTracks(id) { /* OPTIONAL → [{ id, title, url, duration, chapter }] */ },
};
return plugin;
```

### Tools (`harbor`)
- `await harbor.http(url, { method, headers, body, responseType: 'text' | 'json' | 'base64' })` → `{ status, ok, headers, body, url }` (with `responseType: 'json'` it returns the parsed JSON directly). Requests go through the TV, any http(s) site.
- `harbor.parseHtml(html)` → a document with `querySelector`, `querySelectorAll`; elements have `.text()`, `.attr(name)`. Works with or without `await`.
- `harbor.log(...)` → shows in the in-app 🩺 plugin test.

### Rules that matter
- `offset` counts items already shown (0, 20, 40...). Return `[]` when there is no more.
- `chapter` is the number shown (string, e.g. `"12"` or `"12.5"`); it is also used to match reading ↔ listening.
- `cover` / page URLs: absolute `https://` links. A page can also be a picture the plugin draws itself: `data:image/svg+xml;charset=utf-8,...` (16:9, e.g. 1280×720, text 25 px+, dark background) — that is how text books are shown.
- Keep each call under ~25 s.

## 3. Books (text)

`pageUrls(chapterId)` returns the chapter split into pages, each page an SVG `data:` URI (title line, the text, "page x of y"). Arabic: `direction: rtl` in the SVG and `"lang": "ar"` in repo.json.

## 4. Audiobooks — 🎧 Listen

Add `audioTracks(bookId)` to a book plugin. When it returns tracks, the book page shows **📖 Read** and **🎧 Listen**.

```js
async audioTracks(bookId) {
  return [
    { id: "ch1", title: "الفصل الأول", url: "https://.../ch1.mp3", duration: 1540, chapter: "1" },
    { id: "ch2", title: "الفصل الثاني", url: "https://.../ch2.mp3", duration: 1872, chapter: "2" },
  ];
}
```

- `url`: a **direct** audio file (mp3 / m4a / ogg) the TV can play; the host must allow seeking (HTTP range requests — archive.org and LibriVox do). No pages that need a browser.
- `duration`: seconds (number) or `"25:40"`; optional (the player reads it from the file).
- `chapter`: the same number as in `chapters()` — this links Read and Listen ("continue from ch. N where you listened" and back) and shows the matching page while listening. If omitted, tracks and chapters are matched by position when their counts are equal.
- Audio-only book (no text): `chapters(id)` returns `[]` and `audioTracks(id)` returns the tracks — the book still works (Listen only).
- The same plugin may serve text, audio, or both.

### What the app does with it
- Player: book page of the chapter in front (or the cover), progress bar, time, speed (0.75×–2×).
- Remote: OK play/pause · ◀ ▶ 30 s · ▲ ▼ previous / next chapter · CH + / − turn the shown page · hold OK = menu (speed, chapters, bookmark this moment, my bookmarks).
- Saves the place (track + second) every 5 s and when you leave; pauses when the app is hidden.

## 5. Testing
- In the app: (tab) → My sources → 🩺 Test plugins: starts each plugin, lists, chapters, pages, with times and the exact error.
- A plugin that fails returns `[]` or throws; the app shows "Nothing here" or the error, never crashes.
