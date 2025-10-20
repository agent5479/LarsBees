# 🌐 Deploying LarsBees to GitHub Pages

## ⚠️ **IMPORTANT: GitHub Pages Limitation**

GitHub Pages **ONLY** hosts static HTML files. It **CANNOT** run:
- ❌ Python code
- ❌ Flask applications
- ❌ Databases
- ❌ Server-side processing

## What You'll Get

### Static Landing Page (GitHub Pages)
**URL:** https://agent5479.github.io/LarsBees/

**Features:**
- ✅ Beautiful marketing page
- ✅ Feature descriptions
- ✅ Links to repository
- ✅ Download instructions
- ❌ No login
- ❌ No database
- ❌ No dynamic features

This is perfect for:
- Showcasing your project
- Providing documentation
- Letting people download the code
- Marketing your application

---

## 🚀 Quick Deployment

### Option 1: Use the Automated Script (Windows)

```bash
deploy-to-github.bat
```

This will:
1. Initialize git (if needed)
2. Add all files
3. Commit changes
4. Push to GitHub

### Option 2: Manual Commands

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Deploy LarsBees to GitHub Pages"

# 4. Add remote
git remote add origin https://github.com/agent5479/LarsBees.git

# 5. Push
git branch -M main
git push -u origin main
```

---

## ⚙️ Enable GitHub Pages

After pushing to GitHub:

1. **Go to your repository:**
   ```
   https://github.com/agent5479/LarsBees
   ```

2. **Click the "Settings" tab** (⚙️ icon at top)

3. **Click "Pages"** in the left sidebar

4. **Under "Build and deployment":**
   - **Source:** Select "Deploy from a branch"
   - **Branch:** Select "main"
   - **Folder:** Select "/docs" ← IMPORTANT!
   - Click **"Save"**

5. **Wait 1-2 minutes** for GitHub to build your site

6. **Visit your live site:**
   ```
   https://agent5479.github.io/LarsBees/
   ```

---

## 📁 What Gets Deployed

The `/docs` folder contains:
- `index.html` - Static landing page
- All CSS/JS from CDNs (Bootstrap, Bootstrap Icons)
- No server-side code

The main Flask application files (app.py, models.py, etc.) are NOT deployed to GitHub Pages because they require a Python server.

---

## 🔄 Updating Your Site

To update the landing page:

```bash
# 1. Make changes to docs/index.html

# 2. Commit and push
git add .
git commit -m "Update landing page"
git push

# 3. Wait 1-2 minutes for GitHub to rebuild
```

---

## 🚀 Want the Full App Working?

To get the **complete LarsBees application** (with login, database, maps) working online, you need Python hosting:

### Recommended Services:

1. **Heroku** (Easy, free tier)
   - https://www.heroku.com/
   - Good for Flask apps
   - Free PostgreSQL database

2. **PythonAnywhere** (Good for beginners)
   - https://www.pythonanywhere.com/
   - Free tier available
   - Easy Python setup

3. **Render** (Modern alternative)
   - https://render.com/
   - Free tier for web services
   - Auto-deploys from GitHub

See `GITHUB_PAGES_SETUP.md` for full deployment instructions.

---

## 📋 Current Repository Structure

```
LarsBees/
├── docs/
│   └── index.html          ← GitHub Pages serves this
│
├── templates/              ← Flask templates (not on GitHub Pages)
├── static/                 ← Flask static files (not on GitHub Pages)
├── app.py                  ← Flask app (not on GitHub Pages)
├── models.py               ← Database models (not on GitHub Pages)
└── ... (other Python files)
```

---

## ✅ Verification Checklist

After deployment, check:

- [ ] Repository is public on GitHub
- [ ] Pushed all code successfully
- [ ] GitHub Pages is enabled
- [ ] Selected "main" branch
- [ ] Selected "/docs" folder ← MUST BE THIS
- [ ] Waited 2-3 minutes
- [ ] Can access: https://agent5479.github.io/LarsBees/
- [ ] Landing page displays correctly
- [ ] Links work (GitHub repo, download, etc.)

---

## 🐛 Troubleshooting

### "Site not found" or 404 Error
- Wait 2-3 minutes after enabling GitHub Pages
- Verify `/docs` folder is selected, not `/` (root)
- Check repository is public
- Clear browser cache

### "Application doesn't work"
- **Expected!** GitHub Pages only shows the static landing page
- The Flask app needs Python hosting (Heroku, etc.)
- The landing page is just for marketing

### Changes not showing
- Wait 2-3 minutes after pushing
- Clear browser cache (Ctrl+F5)
- Check GitHub Actions for build status

---

## 🎯 Summary

**What GitHub Pages Does:**
- ✅ Hosts your static landing page
- ✅ Shows project information
- ✅ Provides download links
- ✅ Free and fast

**What GitHub Pages Does NOT Do:**
- ❌ Run Python/Flask code
- ❌ Provide login functionality
- ❌ Store data in database
- ❌ Execute server-side logic

**For Full Application:**
Use Heroku, PythonAnywhere, or Render (see GITHUB_PAGES_SETUP.md)

---

## 📞 Need Help?

1. **GitHub Pages Issues:**
   - https://docs.github.com/en/pages

2. **Full App Deployment:**
   - See `GITHUB_PAGES_SETUP.md`

3. **Repository Issues:**
   - Create issue: https://github.com/agent5479/LarsBees/issues

---

## 🎉 Ready to Deploy!

Run this command:
```bash
deploy-to-github.bat
```

Then follow the on-screen instructions!

Your landing page will be live at:
```
https://agent5479.github.io/LarsBees/
```

---

**Made with 🐝 and 🍯 by the LarsBees team**

