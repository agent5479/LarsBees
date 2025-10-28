# 🚀 Quick Start Guide - LarsBees

Get up and running with LarsBees in 5 minutes!

## ⚡ Fast Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Setup Script
```bash
python setup.py
```

This will:
- Create your `.env` file with a secure secret key
- Check all dependencies are installed
- Give you next steps

### 3. (Optional) Add Google Maps API Key
Edit `.env` file and add your Google Maps API key:
```env
GOOGLE_MAPS_API_KEY=your-api-key-here
```

Don't have one? The app works without it, but maps won't display.

### 4. Start the Application
```bash
python app.py
```

### 5. Open Your Browser
```
http://localhost:5000
```

### 6. Login
Use the test account:
- **Username:** `admin`
- **Password:** Contact administrator

## 🎯 First Steps

### Create Your First Hive Cluster
1. Click **"Add New Cluster"** on dashboard
2. Fill in:
   - Name: "My First Apiary"
   - Latitude: Your location (or use 40.7128)
   - Longitude: Your location (or use -74.0060)
   - Hive Count: 5
3. Click **"Save Cluster"**

### Log Your First Action
1. Click **"Log Action"** in navigation
2. Select your cluster
3. Check some tasks (e.g., "General Inspection")
4. Click **"Log Selected Tasks"**

### View Your Map
1. Go to **"Hive Clusters"**
2. See your cluster on the map
3. Click markers for details

## 🐛 Debug Features

### Test Endpoints (Debug Mode Only)
```bash
# View database info
http://localhost:5000/debug/db-info

# Create sample data
http://localhost:5000/debug/create-sample-data
```

### Sample Data
The `/debug/create-sample-data` endpoint creates:
- Test user (testuser / [Contact administrator])
- 3 sample clusters in New York area
- Ready to explore!

## 📱 Key Features to Try

1. **Dashboard** - Overview of your apiaries
2. **Interactive Maps** - Visualize hive locations
3. **Quick Logging** - Check multiple tasks at once
4. **Individual Hives** - Track specific hives for infection management
5. **Archive** - Hide old records to keep things tidy

## ❓ Common Issues

### "Port already in use"
```bash
# Use different port
# Edit app.py, change last line to:
app.run(host='0.0.0.0', port=5001, debug=app.config['DEBUG'])
```

### "Maps not loading"
- Add Google Maps API key to `.env`
- Or continue without maps (everything else works)

### "Module not found"
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### "Database error"
```bash
# Delete and recreate database
# Windows
del larsbees.db

# macOS/Linux
rm larsbees.db

# Then restart the app
python app.py
```

## 🎨 Customize

### Change Colors
Edit `static/css/style.css` - Look for `:root` variables

### Add Custom Tasks
Tasks are auto-created on first run. Check `models.py` function `init_default_tasks()`

### Change Port
Edit last line in `app.py`

## 📚 Need More Help?

- Read the full [README.md](README.md)
- Check [GitHub Issues](https://github.com/yourusername/LarsBees/issues)
- Review the code - it's well commented!

## 🎉 You're All Set!

Start managing your apiaries like a pro! 🐝🍯

---

**Pro Tip:** Create an account for each member of your beekeeping team. Each user gets their own dashboard and hive management.

