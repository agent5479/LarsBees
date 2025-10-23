# 🐝 BeeMarshall Documentation Index

Welcome to BeeMarshall - Your complete apiary management solution!

## 📚 Documentation Guide

### Getting Started
1. **[QUICK_START.md](QUICK_START.md)** - ⚡ 5-minute setup guide
   - Fast installation
   - First-time setup
   - Common issues & fixes

2. **[README.md](README.md)** - 📖 Complete documentation
   - Full feature list
   - Detailed setup instructions
   - Deployment guides
   - API documentation

3. **[LANDING_PAGE_GUIDE.md](LANDING_PAGE_GUIDE.md)** - 🎨 Landing page details
   - Design overview
   - Customization guide
   - SEO tips

### For Developers
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - 🏗️ Technical overview
   - Architecture details
   - Technology stack
   - Code statistics
   - Design decisions

4. **[CONTRIBUTING.md](CONTRIBUTING.md)** - 🤝 Contribution guide
   - How to contribute
   - Code style guidelines
   - Pull request process

### Quick Reference

#### Installation (Windows)
```batch
run.bat
```

#### Installation (macOS/Linux)
```bash
chmod +x run.sh
./run.sh
```

#### Manual Installation
```bash
pip install -r requirements.txt
python setup.py
python app.py
```

#### Access Application
```
http://localhost:5000
```

#### Test Login
- Username: `admin`
- Password: `admin123`

## 🎯 Feature Overview

### Core Capabilities
- ✅ **User Authentication** - Secure login system
- ✅ **Hive Clusters** - Manage multiple locations
- ✅ **Interactive Maps** - Visualize your apiaries
- ✅ **Individual Hives** - Detailed tracking
- ✅ **Action Logging** - Record all activities
- ✅ **Quick Tasks** - Checkbox-based logging
- ✅ **Archive System** - Hide old records
- ✅ **Mobile Ready** - Responsive design
- ✅ **API Ready** - Future mobile app support

### Predefined Tasks (25+)
- 🔍 Inspection tasks
- 🍯 Feeding schedules
- 💊 Treatment tracking
- 🌾 Harvest logging
- 🔧 Maintenance records
- 📋 Event tracking

## 🗂️ Project Structure

```
LarsBees/
├── 📄 Documentation
│   ├── README.md              - Full documentation
│   ├── QUICK_START.md         - Quick setup
│   ├── PROJECT_SUMMARY.md     - Technical details
│   ├── CONTRIBUTING.md        - How to contribute
│   └── INDEX.md               - This file
│
├── 🐍 Python Backend
│   ├── app.py                 - Main Flask app
│   ├── models.py              - Database models
│   ├── forms.py               - Form definitions
│   ├── config.py              - Configuration
│   └── setup.py               - Setup script
│
├── 🎨 Frontend
│   ├── templates/             - HTML templates (9 files)
│   └── static/
│       └── css/
│           └── style.css      - Custom styling
│
├── 🚀 Deployment
│   ├── requirements.txt       - Dependencies
│   ├── Procfile              - Heroku config
│   ├── runtime.txt           - Python version
│   ├── run.bat               - Windows launcher
│   └── run.sh                - Unix launcher
│
└── ⚙️ Configuration
    ├── .env.example          - Environment template
    ├── .gitignore           - Git ignore rules
    └── LICENSE              - MIT License
```

## 🎬 Quick Start Paths

### For Users (Just Want to Use It)
1. Read [QUICK_START.md](QUICK_START.md)
2. Run `run.bat` (Windows) or `./run.sh` (Unix)
3. Open http://localhost:5000
4. Start managing your hives! 🐝

### For Developers (Want to Contribute)
1. Read [README.md](README.md) - Full setup
2. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Architecture
3. Read [CONTRIBUTING.md](CONTRIBUTING.md) - Guidelines
4. Fork & start coding! 💻

### For Deployers (Want to Host)
1. Read [README.md](README.md) - Section "Deployment"
2. Choose your platform (Heroku/PythonAnywhere/VPS)
3. Follow deployment checklist
4. Deploy! 🚀

## 📞 Support & Resources

### Documentation
- 📖 Full docs: [README.md](README.md)
- ⚡ Quick start: [QUICK_START.md](QUICK_START.md)
- 🏗️ Technical: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### Getting Help
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/LarsBees/issues)
- 💡 Request features: [GitHub Issues](https://github.com/yourusername/LarsBees/issues)
- 🤝 Contribute: [CONTRIBUTING.md](CONTRIBUTING.md)

### External Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [Google Maps API](https://developers.google.com/maps)
- [SQLAlchemy Docs](https://www.sqlalchemy.org/)

## 🎯 Common Tasks

### First Time Setup
```bash
python setup.py
```

### Start Application
```bash
python app.py
```

### Create Sample Data (Debug Mode)
```
http://localhost:5000/debug/create-sample-data
```

### View Database Info (Debug Mode)
```
http://localhost:5000/debug/db-info
```

### Reset Database
```bash
# Delete database file
rm larsbees.db  # Unix/Linux/macOS
del larsbees.db # Windows

# Restart app (it will recreate)
python app.py
```

## 🌟 Feature Highlights

### Dashboard
- Overview statistics
- Interactive map
- Recent actions feed
- Quick navigation

### Hive Clusters
- GPS coordinates
- Multiple clusters
- Custom settings
- Map visualization

### Action Logging
- Quick log (multiple tasks)
- Detailed log (with notes)
- 25+ predefined tasks
- Custom tasks supported

### Individual Hives
- Optional detailed tracking
- Status monitoring
- Infection management
- Individual notes

## 🔧 Customization

### Change Colors
Edit `static/css/style.css` - Look for `:root` CSS variables

### Add Tasks
Edit `models.py` - Function `init_default_tasks()`

### Modify Port
Edit `app.py` - Last line: `app.run(port=5000)`

### Database Type
Edit `.env` - Change `DATABASE_URL` to PostgreSQL URL

## 📊 Project Stats

- **Lines of Code:** ~3,500
- **Python Files:** 4 core files
- **HTML Templates:** 9 templates
- **Predefined Tasks:** 25+
- **Database Tables:** 5 tables
- **Documentation Pages:** 5 files
- **Supported Browsers:** All modern browsers
- **Mobile Support:** ✅ Responsive design

## 🎓 Learning Resources

This project demonstrates:
- ✅ Flask web framework
- ✅ SQLAlchemy ORM
- ✅ User authentication
- ✅ Form handling
- ✅ RESTful API design
- ✅ Bootstrap integration
- ✅ Google Maps API
- ✅ Session management
- ✅ Database relationships
- ✅ Responsive web design

## 📝 License

MIT License - Free and open source

See [LICENSE](LICENSE) for full details

## 🙏 Acknowledgments

- Inspired by [myapiary.com](http://myapiary.com)
- Built with Flask, Bootstrap, and love for bees 🐝
- Made by beekeepers, for beekeepers

---

**Ready to get started?** 

👉 Go to [QUICK_START.md](QUICK_START.md) and be up and running in 5 minutes!

**Have questions?** 

👉 Check [README.md](README.md) for detailed information

**Want to contribute?** 

👉 Read [CONTRIBUTING.md](CONTRIBUTING.md) and join us!

---

🍯 Happy Beekeeping! 🐝

