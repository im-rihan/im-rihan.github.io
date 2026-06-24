# Fix GitHub Pages 404 — READ THIS

## Root cause

Your files are on GitHub, but **Pages is pointing at the wrong folder** OR you are opening the wrong URL.

---

## Fix for `developer-portfolio` (5 minutes)

### Step 1 — Open Pages settings

**https://github.com/im-rihan/developer-portfolio/settings/pages**

### Step 2 — Set EXACTLY this

| Setting | Value |
|---------|-------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | **`/docs`** ← important |

Click **Save**.

### Step 3 — Wait and open

Wait **5–10 minutes**, then open:

**https://im-rihan.github.io/developer-portfolio/**

---

## Fix for `https://im-rihan.github.io` (root URL)

That URL needs a **separate repo** named **`im-rihan.github.io`**.

1. Create repo: **https://github.com/new** → name: `im-rihan.github.io` → Public
2. Run in terminal:

```powershell
cd "d:\HomeAbroad Main\code\im-rihan.github.io"
git remote add origin https://github.com/im-rihan/im-rihan.github.io.git
git push -u origin main
```

3. **Settings → Pages** → Branch: **`main`** → Folder: **`/ (root)`** → Save
4. Open: **https://im-rihan.github.io**

---

## Which URL should you use?

| URL | Repo | Pages setting |
|-----|------|---------------|
| `im-rihan.github.io/developer-portfolio/` | `developer-portfolio` | `main` → **`/docs`** |
| `im-rihan.github.io` | `im-rihan.github.io` | `main` → **`/ (root)`** |

---

## Still 404?

1. Confirm **Settings → Pages** shows: *"Your site is live at https://..."*
2. Do **not** use "GitHub Actions" as source — use **Deploy from a branch**
3. Hard refresh: `Ctrl + Shift + R`
4. Check repo is **Public**
