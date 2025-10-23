# 🌐 GitHub Pages Setup Guide

## ⚠️ Important Limitation

**GitHub Pages only hosts static HTML/CSS/JavaScript files.** It **cannot** run Python/Flask applications.

## Two Deployment Options

### Option 1: Static Landing Page on GitHub Pages ✅
**What it does:** Marketing page showing features (no login, no database)
**URL:** https://agent5479.github.io/BeeMarshall/

### Option 2: Full Flask Application on Python Hosting 🚀
**What it does:** Complete working application with all features
**Recommended services:** Heroku, PythonAnywhere, Render

---

## 📄 Option 1: Deploy Static Landing Page to GitHub Pages

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - BeeMarshall Apiary Management"

# Add remote repository
git remote add origin https://github.com/agent5479/BeeMarshall.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository: https://github.com/agent5479/BeeMarshall
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch
6. Select **/ (root)** folder
7. Click **Save**

### Step 3: Configure for `docs` folder

Since I created `docs/index.html`:

1. In GitHub Pages settings
2. Change folder from **/ (root)** to **/docs**
3. Click **Save**

Your static landing page will be live at:
```
https://agent5479.github.io/BeeMarshall/
```

**What visitors will see:**
- ✅ Beautiful landing page
- ✅ Feature descriptions
- ✅ Links to GitHub repository
- ✅ Download instructions
- ❌ No login functionality
- ❌ No database
- ❌ No dynamic features

---

## 🚀 Option 2: Deploy Full Flask Application

For the complete working application with all features, use one of these services:

### A. Heroku (Recommended - Easy)

#### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Login and Create App
```bash
heroku login
heroku create larsbees-apiary
```

#### Step 3: Configure Environment Variables
```bash
heroku config:set SECRET_KEY=your-random-secret-key
heroku config:set GOOGLE_MAPS_API_KEY=your-google-maps-key
heroku config:set FLASK_ENV=production
```

#### Step 4: Deploy
```bash
git push heroku main
```

#### Step 5: Initialize Database
```bash
heroku run python -c "from app import create_app, db; app = create_app('production'); app.app_context().push(); db.create_all()"
```

**Your app will be live at:**
```
https://larsbees-apiary.herokuapp.com/
```

---

### B. PythonAnywhere (Free Tier Available)

#### Step 1: Sign Up
Go to: https://www.pythonanywhere.com/

#### Step 2: Upload Code
1. Click **"Upload a file"** or use Git
2. Clone your repository:
   ```bash
   git clone https://github.com/agent5479/LarsBees.git
   ```

#### Step 3: Create Virtual Environment
```bash
cd LarsBees
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Step 4: Configure Web App
1. Go to **Web** tab
2. Click **"Add a new web app"**
3. Choose **Flask**
4. Point to your `app.py`
5. Set virtual environment path

#### Step 5: Configure WSGI
Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
```python
import sys
path = '/home/yourusername/LarsBees'
if path not in sys.path:
    sys.path.append(path)

from app import create_app
application = create_app('production')
```

**Your app will be live at:**
```
https://yourusername.pythonanywhere.com/
```

---

### C. Render (Modern Alternative)

#### Step 1: Sign Up
Go to: https://render.com/

#### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select **LarsBees**

#### Step 3: Configure
- **Name:** larsbees
- **Environment:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`

#### Step 4: Add Environment Variables
- `SECRET_KEY`: your-secret-key
- `GOOGLE_MAPS_API_KEY`: your-api-key
- `FLASK_ENV`: production

**Your app will be live at:**
```
https://larsbees.onrender.com/
```

---

## 📋 Comparison

| Feature | GitHub Pages | Python Hosting |
|---------|-------------|----------------|
| **Cost** | Free | Free tiers available |
| **Setup** | Very easy | Medium difficulty |
| **Features** | Static HTML only | Full application |
| **Login** | ❌ No | ✅ Yes |
| **Database** | ❌ No | ✅ Yes |
| **Maps** | ✅ Yes (static) | ✅ Yes (interactive) |
| **Action Logging** | ❌ No | ✅ Yes |
| **URL** | agent5479.github.io/LarsBees | Custom domain available |
| **Best For** | Marketing page | Production use |

---

## 🎯 Recommended Approach

### Best Strategy: Use Both!

1. **GitHub Pages** - Marketing/landing page
   - URL: https://agent5479.github.io/BeeMarshall/
   - Shows features and encourages downloads
   - Links to full app

2. **Python Hosting** - Full application
   - URL: https://larsbees.herokuapp.com/ (or similar)
   - Complete working system
   - All features functional

### Landing Page Should Link To:
```html
<!-- In docs/index.html -->
<a href="https://your-app-url.herokuapp.com" class="btn btn-warning">
    Launch Application
</a>
```

---

## 🔧 Quick GitHub Pages Deployment

### If you want it live RIGHT NOW:

```bash
# Navigate to your project
cd C:\Users\i_los\OneDrive\Documents\GitHub\LarsBees

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Add LarsBees Apiary Management System"

# Add remote (replace with your actual repo)
git remote add origin https://github.com/agent5479/BeeMarshall.git

# Push
git push -u origin main
```

Then:
1. Go to https://github.com/agent5479/LarsBees/settings/pages
2. Select "Deploy from a branch"
3. Choose "main" branch and "/docs" folder
4. Click Save

Wait 1-2 minutes, then visit:
```
https://agent5479.github.io/BeeMarshall/
```

---

## ❓ Which Should You Use?

### Use GitHub Pages If:
- ✅ You just want a marketing page
- ✅ You don't need login functionality
- ✅ You want free, simple hosting
- ✅ You want to showcase the project

### Use Python Hosting If:
- ✅ You need the full application to work
- ✅ Users need to log in
- ✅ You need database functionality
- ✅ You want all features operational

---

## 🆘 Need Help?

### GitHub Pages Issues
- Check: https://github.com/agent5479/LarsBees/settings/pages
- Ensure `/docs` folder is selected
- Wait 2-3 minutes for deployment

### Full App Deployment Issues
- Read the hosting service docs
- Check environment variables
- Verify database configuration
- Test locally first

---

## 📝 Summary

**Created for you:**
- ✅ `docs/index.html` - Static landing page for GitHub Pages
- ✅ All links point to GitHub repository
- ✅ Download and documentation links included
- ✅ Professional, mobile-responsive design

**To get it live:**
1. Push to GitHub
2. Enable GitHub Pages with `/docs` folder
3. Visit https://agent5479.github.io/BeeMarshall/

**For full app:**
1. Deploy to Heroku/PythonAnywhere/Render
2. Configure environment variables
3. Initialize database
4. Share the full app URL

---

🎉 **Your static landing page is ready for GitHub Pages!**

The full Flask application needs a Python-capable hosting service to run properly.

