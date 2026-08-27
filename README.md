# RAKSHA BANDHAN.EXE — Harshit Bafila

A personal, interactive Raksha Bandhan microsite: password gate → cinematic
boot sequence → a rigged "sister verification" quiz → confetti → a gift box
→ a final page with your message and photos.

Vanilla HTML/CSS/JS. No build step, no backend, no dependencies to install.

## 1. Edit your content

Open **[script.js](script.js)** and look at the `CONFIG` block at the very
top of the file. That's the only place you should need to touch:

- `password` — the word she has to type on the login screen (case-insensitive).
- `nickname` — shown for your own reference.
- `message` — your final personal message. Leave a blank line between
  paragraphs to start a new one.
- `photos` — the list of photos shown in the memory gallery at the end.

To change the quiz questions/answers, edit the `QUIZ` array just below
`CONFIG` in the same file.

## 2. Add your photos

Put your image files inside the **[images/](images/)** folder, then list
them in `CONFIG.photos` in `script.js`, e.g.:

```js
photos: [
  { src: "images/photo1.jpg", title: "", caption: "" },
  { src: "images/photo2.jpg", title: "Diwali, 2019", caption: "you cried over the sparklers" },
],
```

`title` and `caption` are optional — leave them as `""` to omit. Until you
add real files, the gallery shows a clearly-labelled placeholder instead of
a broken image, so you can preview everything before your photos are ready.

## 3. Preview it locally

Just open [index.html](index.html) in a browser — no server required.

If you'd rather serve it locally (recommended, avoids any file:// quirks
with some browsers):

```bash
# Python 3
python -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## 4. Deploy (GitHub Pages)

1. Push this folder to a new GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
4. GitHub gives you a stable URL like:
   `https://<your-username>.github.io/<repo-name>/`

Any other static host works too (Netlify, Vercel, Cloudflare Pages, plain
file hosting) — it's just static files.

## 5. Generate the QR code

The site itself doesn't generate a QR code. Once you have the deployed
URL, paste it into any QR generator (e.g. https://www.qr-code-generator.com)
and print/screenshot the result for your sister.

## Files

```
index.html   — markup / screen structure
style.css    — all visual design
script.js    — CONFIG, quiz data, and all interaction logic
images/      — put your photos here
```

Everything you'd want to personalize (password, message, photos, quiz
questions) lives in the top of **script.js**. Nothing else needs editing.
