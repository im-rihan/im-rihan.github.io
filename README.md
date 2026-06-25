# Rihan Mohammed — Portfolio

**Live site:** [im-rihan.github.io](https://im-rihan.github.io)

Next.js 15 static export with 3D UI, dark/light theme, and GitHub Pages deployment.

---

## Local development

```powershell
cd im-rihan.github.io
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Build

```powershell
npm run build
```

Output goes to `out/` — ready for static hosting.

---

## Deploy (GitHub Pages — user site)

This repo is **`im-rihan.github.io`** on GitHub — the site is served at the root URL.

1. **[Settings → Pages](https://github.com/im-rihan/im-rihan.github.io/settings/pages)**
2. Source: **Deploy from a branch** → **`gh-pages`** → **`/ (root)`**
3. **Settings → Actions → General** → **Read and write permissions**

Push to `main` — the workflow runs `npm ci`, `npm run build`, and publishes `out/` to `gh-pages`.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, skills, experience, projects, certifications |
| `/chat` | Rihan-only FAQ chat (client knowledge base) |
| `/github` | Contribution graph + suggestions |
| `/gallery` | Personal gallery (placeholder tiles) |
| `/status` | Portfolio stats + link health |

---

## Project structure

```
src/
├── app/           # App Router pages
├── components/    # UI, sections, effects
├── data/          # Profile, certs, chat knowledge
└── lib/           # Chat engine, GitHub API, status checks
public/            # Resume files, .nojekyll
```

---

## Resume sync

Regenerate resume exports from the sibling `resume/` project:

```powershell
cd ..\resume
python generate_resume.py
```

Outputs to `im-rihan.github.io/docs/` and `im-rihan.github.io/public/`.

---

## About

**Rihan Mohammed** — Full Stack Developer · [HomeAbroad Inc.](https://homeabroadinc.com) · [Ziffy.ai](https://ziffy.ai)

[LinkedIn](https://linkedin.com/in/im-rihan) · [GitHub](https://github.com/im-rihan) · [Email](mailto:im.rihan.dev@gmail.com)
