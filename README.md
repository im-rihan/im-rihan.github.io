# Rihan Mohammed — Portfolio

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

---

## Fastest deploy (recommended — ~1–3 min, no Actions queue)

**Stop using GitHub Actions as Pages source.** That causes slow `deploy-pages` / `deployment_queued` loops.

1. **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Source: **Deploy from a branch**
3. Branch: **`main`** → Folder: **`/docs`**
4. Save

Push to `main` → site updates in **1–3 minutes**. No workflow runs.

---

## Alternative: gh-pages branch (~2–4 min)

If you prefer a separate publish branch:

1. **Settings → Pages** → **Deploy from a branch** → **`gh-pages`** → **`/ (root)`**
2. **Settings → Actions → General** → **Read and write permissions**
3. Push to `main` — workflow copies `docs/` → `gh-pages` automatically

Uses `peaceiris/actions-gh-pages` — **not** `deploy-pages` (no queue).

---

## Do NOT use

| Method | Problem |
|--------|---------|
| **GitHub Actions** as Pages source | Triggers `deploy-pages`, `deployment_queued`, slow |
| **Jekyll** build | Breaks plain HTML/CSS site |
| **`main` → `/docs`** AND **gh-pages** at same time | Pick one source only |

---

## Structure

```
docs/          ← edit website here
├── index.html
├── resume.*
├── .nojekyll
└── assets/
```

---

## Local preview

```powershell
cd docs
python -m http.server 8080
```

---

## About

**Rihan Mohammed** — Full Stack Developer · [HomeAbroad Inc.](https://homeabroadinc.com) · [Ziffy.ai](https://ziffy.ai)

[LinkedIn](https://linkedin.com/in/im-rihan) · [GitHub](https://github.com/im-rihan) · [Email](mailto:im.rihan.dev@gmail.com)
