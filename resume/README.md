# Resume generator

Source of truth: **`resume.html`** in this folder. Exports sync to the portfolio root at `../docs/` and `../public/`.

| File | Role |
|------|------|
| `resume.html` | Edit content here (contact, skills, experience, projects) |
| `generate_resume.py` | Builds HTML, PDF, and Word exports |
| `requirements.txt` | Python dependencies |

## Setup (once)

```powershell
npm run setup:resume
```

Or manually:

```powershell
cd resume
pip install -r requirements.txt
python -m playwright install chromium
```

The generator auto-downloads Chromium on first run if it is missing.

## Regenerate

From the repo root:

```powershell
npm run generate:resume
```

Or from this folder:

```powershell
python generate_resume.py
```

| Flag | Effect |
|------|--------|
| `--docx-only` | Word only (uses existing PDF, or generates PDF first) |
| `--skip-pdf` | Sync HTML + Word, skip PDF |

## Outputs

| Path | Use |
|------|-----|
| `../docs/resume.{html,pdf,docx}` | GitHub Pages / docs mirror |
| `../public/resume.{html,pdf,docx}` | Copied into `out/` on Next.js build |

Word (`.docx`) embeds a high-DPI raster of the PDF — a pixel-identical mirror of the HTML/PDF on one A4 page.
