# developer-portfolio

Private portfolio kit + public site for **Rihan Mohammed**.

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

> **404 fix:** [PAGES_SETUP.md](./PAGES_SETUP.md) — set Pages to **`main`** branch, **`/docs`** folder.

## GitHub Pages setup

1. **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Source: **Deploy from a branch**
3. Branch: **`main`** → Folder: **`/docs`**
4. Save → wait 5–10 min

Site files live in the **`docs/`** folder (not repo root).

## For `https://im-rihan.github.io` (no subpath)

Use the separate **`im-rihan.github.io`** repo — see `PAGES_SETUP.md`.

## Local preview

```powershell
cd docs
python -m http.server 8080
```

## Regenerate resume

```powershell
python generate_resume.py
# Then copy resume files into docs/ if updated
```
