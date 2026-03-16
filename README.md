# CK eMobility · Portfolio Strategy — Deployment Guide

## What this is

A two-file web application:
- **`public/index.html`** — The portfolio dashboard (read-only, rendered from `data.json`)
- **`public/admin.html`** — The PM content editor (reads and writes `data.json` via GitHub API)
- **`public/data.json`** — All editable content (the single source of truth)

Hosted on Netlify (free tier), deployed automatically from this GitHub repo.  
Access-controlled with a site password set in Netlify dashboard.

---

## Setup (one time, ~20 minutes)

### Step 1 — Push to a private GitHub repo

```bash
git init
git add .
git commit -m "Initial portfolio setup"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

### Step 2 — Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Connect to GitHub and select this repo
3. Build settings:
   - **Base directory**: *(leave empty)*
   - **Build command**: *(leave empty)*
   - **Publish directory**: `public`
4. Click **Deploy site**

### Step 3 — Enable password protection

1. In Netlify: **Site configuration → Access control → Site protection**
2. Enable **Password protection**
3. Set a shared password and share it with your PM team
4. Save — your site is now private

### Step 4 — Note your site URL

Your dashboard will be at: `https://your-site-name.netlify.app`  
Your admin panel will be at: `https://your-site-name.netlify.app/admin.html`

---

## How PMs update content

1. Go to `https://your-site-name.netlify.app/admin.html`
2. Enter password when prompted by Netlify
3. In the **GitHub Connection** panel, fill in:
   - **Owner**: your GitHub username or org (e.g. `circlek-emobility`)
   - **Repo**: repository name (e.g. `portfolio-strategy`)
   - **Branch**: `main`
   - **Token**: a GitHub Personal Access Token (PAT) with `repo` scope
   - **Path**: `public/data.json` (default)
4. Click **Connect & Load Data**
5. Edit any section using the tabs (Meta, Domains, Solutions, Risks, Executive)
6. Click **💾 Save to GitHub** — this commits `data.json` directly to the repo
7. Netlify detects the commit and redeploys automatically (~30 seconds)
8. The live dashboard at `/index.html` reflects the changes

### Generating a GitHub PAT (token)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token**
3. Select scope: **repo** only
4. Copy the token — you will only see it once
5. Paste it into the admin panel each session (it is not stored on the server)

> **Note**: The token is used only in your browser to call the GitHub API directly. It is never sent to Netlify's servers. Owner/Repo/Branch/Path are saved in your browser's localStorage; the token is not.

---

## What PMs can edit (all content)

| Section | Editable fields |
|---|---|
| Meta & KPIs | Page title, subtitle, last updated date, outcome statement, KPI labels/values/targets/colours |
| Journey Domains | Name, PM owner, status, confidence level, Now/Next/Later, notes, description |
| Solutions Pipeline | Title, domain, status (Live/Dev/Eval/Discovery), markets, description |
| Risk Register | Opportunity, domain, risk type, severity, description, mitigation |
| Executive — Top Risks | Title, severity, description |
| Executive — Strategic Opportunities | Title, icon, colour, description |
| Executive — FY27 Priorities | Title, icon, colour, description |

## What is locked (CSS / design)

The visual design — colours, typography, layout, tab structure, charts — lives in `index.html` and is not editable through the admin panel. Changes to design require editing `index.html` directly and pushing to GitHub.

---

## Deployment architecture

```
GitHub (private repo)
  └── public/
        ├── index.html    ← dashboard (reads data.json at runtime)
        ├── admin.html    ← PM editor (calls GitHub API directly)
        └── data.json     ← content source of truth

Netlify (free tier)
  ├── Auto-deploys on every push to main
  ├── Serves public/ as static files
  └── Site password protection (Netlify Access Control)
```

Every save from admin.html creates a Git commit — giving you a full audit trail of who changed what and when.

---

## Troubleshooting

**"GitHub API 401"** — Token is invalid or expired. Generate a new one.  
**"GitHub API 404"** — Owner, repo, or path is wrong. Check your settings.  
**"GitHub API 409"** — Conflict. Someone else saved at the same time. Click Reload and re-apply your changes.  
**Dashboard not updating** — Check Netlify → Deploys to see if the deploy triggered. It should auto-deploy within 60 seconds of a commit.  
**Netlify password prompt not appearing** — Ensure Site Protection is enabled in Netlify dashboard under Site configuration → Access control.
# ck-b2c-portfolio-product-strategy
