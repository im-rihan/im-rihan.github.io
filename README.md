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

This repo uses **GitHub Actions** to deploy automatically on every push to `main`.

### One-time setup (required — fixes "Get Pages site failed")

1. Open **[Settings → Pages](https://github.com/im-rihan/developer-portfolio/settings/pages)**
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from branch")
3. Open **[Settings → Actions → General](https://github.com/im-rihan/developer-portfolio/settings/actions)**
4. Under **Workflow permissions**, select **Read and write permissions** → Save
5. Go to **[Actions](https://github.com/im-rihan/developer-portfolio/actions)** → **Deploy Portfolio to GitHub Pages** → **Run workflow**

Your site will be live at:

```
https://im-rihan.github.io/developer-portfolio/
```

### If it still fails

| Problem | Fix |
|---------|-----|
| `Get Pages site failed` | Pages source is not set to **GitHub Actions** (step 2 above) |
| Repo is **private** | GitHub Pages is free only for **public** repos — change visibility in Settings → General → Danger zone |
| Workflow permission denied | Enable **Read and write permissions** for Actions (step 4 above) |
| 404 after deploy | Wait 2–5 minutes, then hard-refresh the browser |

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
