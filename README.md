# Rihan Mohammed — Portfolio

Personal portfolio website deployed via **GitHub Pages**.

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

---

## Repository structure

Only the `docs/` folder is published. Everything else supports deployment.

```
developer-portfolio/
├── docs/                    ← website (GitHub Pages)
│   ├── index.html           ← portfolio homepage
│   ├── resume.html          ← printable resume
│   ├── resume.pdf           ← download
│   ├── resume.docx          ← download
│   ├── .nojekyll            ← disables Jekyll (required)
│   └── assets/
│       ├── css/style.css
│       ├── js/main.js
│       └── imgs/avtar.jpg
├── .github/workflows/
│   └── static-pages.yml     ← optional CI deploy
└── README.md
```

---

## Enable GitHub Pages (one-time)

1. Open **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Configure:

| Setting | Value |
|---------|-------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | **`/docs`** |

3. Click **Save**
4. Wait 5–10 minutes, then visit the live URL above

> Do **not** use the default Jekyll workflow. This is a plain HTML site — branch deploy + `.nojekyll` is all you need.

---

## Edit the website

Change files inside **`docs/`** only:

| File | What to edit |
|------|----------------|
| `docs/index.html` | Portfolio content, sections, links |
| `docs/assets/css/style.css` | Colors, layout, styling |
| `docs/assets/js/main.js` | Menu, scroll animations |
| `docs/assets/imgs/avtar.jpg` | Profile photo |
| `docs/resume.html` | Resume layout |
| `docs/resume.pdf` / `.docx` | Replace when resume updates |

After editing, commit and push to `main`. GitHub Pages updates automatically.

---

## Local preview

```powershell
cd docs
python -m http.server 8080
```

Open **http://localhost:8080**

---

## Optional: GitHub Actions deploy

If you prefer **GitHub Actions** instead of branch deploy:

1. **Settings → Pages** → Source: **GitHub Actions**
2. Disable any workflow using `jekyll-build-pages`
3. Use only **Deploy static site to GitHub Pages** (`static-pages.yml`)

---

## About

**Rihan Mohammed** — Full Stack Developer at [HomeAbroad Inc.](https://homeabroadinc.com) & [Ziffy.ai](https://ziffy.ai)

- [LinkedIn](https://linkedin.com/in/im-rihan)
- [GitHub](https://github.com/im-rihan)
- [Email](mailto:im.rihan.dev@gmail.com)
