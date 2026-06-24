# developer-portfolio

Personal portfolio website, resume, and GitHub profile README for **Rihan Mohammed**.

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

## What's included

| File / Folder | Description |
|---------------|-------------|
| `index.html` | Portfolio website (GitHub Pages) |
| `assets/` | CSS & JavaScript |
| `resume.html` | Printable resume |
| `resume.pdf` / `resume.docx` | Downloadable resume |
| `github-profile-README.md` | GitHub profile README |
| `generate_resume.py` | Regenerate PDF + Word |

## GitHub Pages deployment

This repo deploys automatically on every push to `main` using the **`gh-pages`** branch.

### One-time setup (fixes "Get Pages site failed")

1. Open **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Set **Branch** to **`gh-pages`** and folder to **`/ (root)`**
4. Save
5. Push to `main` (or run the workflow manually from **Actions**)

The workflow creates/updates the `gh-pages` branch automatically — you do **not** need "GitHub Actions" as the Pages source.

Your site will be live at:

```
https://im-rihan.github.io/developer-portfolio/
```

### If it still fails

| Problem | Fix |
|---------|-----|
| `Get Pages site failed` / `Not Found` | Use **Deploy from a branch → gh-pages**, not GitHub Actions (see steps above) |
| Repo is **private** | GitHub Pages is free only for **public** repos — change visibility in Settings → General |
| Workflow permission denied | **[Settings → Actions → General](https://github.com/im-rihan/developer-portfolio/settings/actions)** → **Read and write permissions** → Save |
| 404 after deploy | Wait 2–5 minutes after the workflow succeeds, then hard-refresh |

> **Note:** The Node 20 deprecation warning comes from GitHub runner updates and does not cause this failure.

### Custom URL (optional)

For `https://im-rihan.github.io` (no `/developer-portfolio` path):

1. Create a **public** repo named `im-rihan.github.io`
2. Copy `index.html`, `assets/`, and resume files into it
3. Enable GitHub Pages from the `main` branch

> **Note:** Free GitHub Pages requires a **public** repo. Private repos need GitHub Pro for Pages.

## Local preview

Open `index.html` in your browser, or use a local server:

```powershell
cd "d:\HomeAbroad Main\code\developer-portfolio"
python -m http.server 8080
```

Then visit `http://localhost:8080`

## Regenerate resume

```powershell
pip install python-docx playwright
python -m playwright install chromium
python generate_resume.py
```

## Edit portfolio content

- **Website:** edit `index.html`
- **Styles:** edit `assets/css/style.css`
- **Resume data:** edit `generate_resume.py` and `resume.html`
