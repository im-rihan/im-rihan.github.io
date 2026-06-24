# Rihan Mohammed — Portfolio

Personal portfolio website deployed via **GitHub Pages**.

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

---

## Repository structure

Only the `docs/` folder is published.

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
│       └── js/main.js
└── README.md
```

No GitHub Actions workflow is needed — Pages deploys directly from the `docs/` folder.

---

## Enable GitHub Pages (one-time)

1. Open **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Configure **exactly**:

| Setting | Value |
|---------|-------|
| **Source** | **Deploy from a branch** |
| **Branch** | `main` |
| **Folder** | **`/docs`** |

3. Click **Save**
4. Wait 5–10 minutes, then visit the live URL above

### Important

- Use **Deploy from a branch** — not **GitHub Actions**
- Do **not** enable Jekyll — `.nojekyll` in `docs/` handles this
- No CI workflow required — push to `main` and Pages updates automatically

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| **404 — no site here** | Pages source must be `main` → `/docs` (see above) |
| **Jekyll / style.scss error** | Switch source from GitHub Actions to **Deploy from a branch** |
| **Environment protection rules** | Disable GitHub Actions deploy — use branch deploy instead |
| **Failed Actions workflow** | Delete/disable any Pages workflow in the **Actions** tab — not needed |

---

## Edit the website

Change files inside **`docs/`** only:

| File | What to edit |
|------|----------------|
| `docs/index.html` | Portfolio content, sections, links |
| `docs/assets/css/style.css` | Colors, layout, styling |
| `docs/assets/js/main.js` | Menu, scroll animations |
| `docs/resume.html` | Resume layout |
| `docs/resume.pdf` / `.docx` | Replace when resume updates |

After editing, commit and push to `main`.

---

## Local preview

```powershell
cd docs
python -m http.server 8080
```

Open **http://localhost:8080**

---

## About

**Rihan Mohammed** — Full Stack Developer at [HomeAbroad Inc.](https://homeabroadinc.com) & [Ziffy.ai](https://ziffy.ai)

- [LinkedIn](https://linkedin.com/in/im-rihan)
- [GitHub](https://github.com/im-rihan)
- [Email](mailto:im.rihan.dev@gmail.com)
