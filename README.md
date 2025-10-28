# 🐝 LarsBees - Complete Apiary Management System

A comprehensive, production-ready web-based apiary (beekeeping) management system built with Python Flask and Firebase. Track your hive sites, manage individual hives, log maintenance activities, schedule tasks, generate reports, and visualize your apiary on interactive maps with real-time data synchronization.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Features

### Core Functionality
- **🔐 Multi-Tenant Authentication** - Secure Firebase-based user authentication and tenant management
- **📍 Apiary Site Management** - Add, edit, and manage hive locations with GPS coordinates and site classifications
- **🗺️ Interactive Maps** - Google Maps integration with real-time site visualization and weather data
- **🐝 Individual Hive Tracking** - Detailed tracking for infection management and hive health monitoring
- **📝 Comprehensive Action Logging** - Record all hive management activities with automatic timestamps
- **✅ Quick Task Logging** - Checkbox-based system for logging multiple tasks at once
- **📅 Task Scheduling** - Schedule future tasks with automated reminders and tracking
- **📊 Advanced Reporting** - Generate detailed reports with charts, analytics, and data visualization
- **📦 Archive System** - Hide old records to keep your action list manageable
- **⚙️ Custom Settings** - Track harvest timelines, sugar requirements, and custom notes
- **🌐 Real-time Sync** - Firebase-powered real-time data synchronization across devices
- **📱 Mobile Responsive** - Fully responsive design optimized for mobile and desktop use

### Site Classifications
- **Functional Classification** - Production, Nucleus, Queen Rearing, Research, Education, Quarantine, Backup, Custom
- **Seasonal Classification** - Summer Site, Winter Site

### Task Categories
The system includes pre-configured tasks organized by category:
- **Inspection** - General inspection, queen checks, brood pattern, pest inspection
- **Feeding** - Sugar syrup, pollen patties, fondant feeding
- **Treatment** - Varroa, nosema, small hive beetle treatments
- **Harvest** - Honey, wax, propolis collection
- **Maintenance** - Adding/removing supers, frame replacement, repairs
- **Events** - Swarm collection, colony splits, requeening

### Advanced Features
- **📈 Performance Analytics** - Track hive strength, productivity, and growth over time
- **🏥 Health Monitoring** - Monitor disease outbreaks, mortality rates, and health trends
- **⚙️ Operations Analysis** - Analyze task completion, efficiency, and resource usage
- **🍯 Harvest Tracking** - Track honey production and harvest timelines
- **📊 Data Export** - Export all data to CSV for external analysis
- **🔍 Data Integrity** - Built-in data validation and integrity checking
- **🌤️ Weather Integration** - Real-time weather data for informed decision making

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Google Maps API key (for map functionality)
- Firebase project (for real-time data sync)
- OpenWeatherMap API key (for weather integration)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/LarsBees.git
cd LarsBees
```

2. **Create a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your configuration:
# - SECRET_KEY: Generate a secure random key
# - GOOGLE_MAPS_API_KEY: Your Google Maps API key
# - FIREBASE_CONFIG: Your Firebase configuration JSON
# - OPENWEATHER_API_KEY: Your OpenWeatherMap API key
```

5. **Run the application**
```bash
python app.py
```

6. **Open your browser**
```
http://localhost:5000
```

You'll see the beautiful landing page. Click "Login" or "Sign Up" to get started!

**Note:** The application now uses Firebase for real-time data synchronization. Make sure to configure your Firebase project and add the configuration to your environment variables.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-this
FLASK_APP=app.py
FLASK_ENV=development

# Database
DATABASE_URL=sqlite:///larsbees.db

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Firebase Configuration (JSON string)
FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"your-app-id"}

# OpenWeatherMap API
OPENWEATHER_API_KEY=your-openweather-api-key-here

# Debug Mode
DEBUG=True
```

### Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookup)
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

**Note:** For development, you can use the app without API keys, but maps and weather features won't display properly.

### Setting up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password)
4. Enable Realtime Database
5. Go to Project Settings > General > Your apps
6. Add a web app and copy the configuration
7. Add the configuration to your `.env` file as `FIREBASE_CONFIG`

### Getting an OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env` file as `OPENWEATHER_API_KEY`

## 🧪 Debug Features

The application includes several debug features when `DEBUG=True`:

### 1. Test User Account
When running in debug mode, a test account is automatically created:
- **Username:** `admin`
- **Password:** Contact administrator for password

### 2. Debug Endpoints

Access these endpoints to test and debug:

```bash
# View database statistics
http://localhost:5000/debug/db-info

# Create sample data (test clusters and actions)
http://localhost:5000/debug/create-sample-data
```

### 3. Sample Data Generator
Visit `/debug/create-sample-data` to populate your database with:
- Test user account
- 3 sample hive clusters in New York area
- Sample GPS coordinates

### 4. Database Inspection
The database file `larsbees.db` is created in the project root. You can inspect it using:
```bash
# Install SQLite browser
# Windows: Download from https://sqlitebrowser.org/
# macOS: brew install --cask db-browser-for-sqlite
# Linux: sudo apt-get install sqlitebrowser

# Open the database
sqlitebrowser larsbees.db
```

## 📱 Usage Guide

### Adding Your First Apiary Site

1. **Login** to your account
2. Click **"Add Site"** on the dashboard
3. Fill in the details:
   - **Site Name**: e.g., "North Field Apiary"
   - **Description**: Brief description of the location
   - **Coordinates**: Enter GPS coordinates or click "Use My Current Location"
   - **Functional Classification**: Production, Nucleus, Queen Rearing, etc.
   - **Seasonal Classification**: Summer Site or Winter Site
   - **Hive Count**: Number of hives at this location
   - **Harvest Timeline**: When you expect to harvest (optional)
   - **Sugar Requirements**: Feeding schedule (optional)
4. Click **"Save Site"**

### Logging Actions

#### Quick Log (Multiple Tasks)
1. Go to **"Log Action"**
2. Select your site from dropdown
3. Check all tasks you completed
4. Click **"Log Selected Tasks"**

#### Detailed Log (Single Task with Notes)
1. Go to **"Log Action"**
2. Scroll to "Detailed Log" section
3. Select site, task type, and add notes
4. Click **"Log Action"**

#### Scheduling Tasks
1. Go to **"Scheduler"** tab
2. Click **"Schedule New Task"**
3. Select site, task type, and due date
4. Set priority and add notes
5. Click **"Schedule Task"**

### Managing Individual Hives

For infection management or detailed tracking:
1. Open a site detail page
2. Click **"Add Individual Hive"**
3. Give it a unique number/ID
4. Set status (healthy, infected, quarantine, etc.)
5. Add notes as needed

### Generating Reports

1. Go to **"Reports"** tab
2. View automatically generated reports:
   - **Hive Performance**: Track hive strength and productivity
   - **Health & Mortality**: Monitor disease outbreaks and health trends
   - **Operations**: Analyze task completion and efficiency
   - **Harvest History**: Track honey production over time
3. Export data to CSV for external analysis

### Archiving Old Records

Keep your action list clean:
1. Go to **"Actions"** page
2. Click the **archive** button next to any action
3. Toggle **"Show Archived Actions"** to view archived items
4. Click **unarchive** to restore an action

## 🗂️ Project Structure

```
LarsBees/
├── app.py                 # Main Flask application
├── models.py              # Database models
├── forms.py               # WTForms form definitions
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── docs/                 # Documentation and standalone HTML files
│   ├── beemarshall-full.html  # Main application interface
│   ├── reports.html           # Reports and analytics
│   ├── js/                    # JavaScript modules
│   │   ├── sites.js           # Site management
│   │   ├── actions.js         # Action logging
│   │   ├── scheduling.js      # Task scheduling
│   │   ├── reports.js         # Report generation
│   │   └── ...                # Other modules
│   └── css/                   # Custom stylesheets
├── templates/            # Flask HTML templates
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── sites.html
│   ├── site_form.html
│   ├── site_detail.html
│   ├── actions.html
│   ├── action_form.html
│   └── hive_form.html
├── static/               # Static files
│   └── css/
│       └── style.css
└── larsbees.db          # SQLite database (auto-created)
```

## 🎨 Design Philosophy

The interface is inspired by [myapiary.com](http://myapiary.com) with:
- Clean, modern design using Bootstrap 5
- Intuitive navigation
- Mobile-responsive layout
- Color-coded status indicators
- Visual feedback for all actions

**Color Scheme:**
- 🟡 Warning/Primary: #FFC107 (Honeycomb yellow)
- 🟢 Success: #28a745 (Healthy hive green)
- 🔵 Info: #17a2b8 (Sky blue)
- 🔴 Danger: #dc3545 (Alert red)

## 🚢 Deployment

### Hosting Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create larsbees
heroku config:set SECRET_KEY=your-secret-key
heroku config:set GOOGLE_MAPS_API_KEY=your-api-key
git push heroku main
```

#### Option 2: PythonAnywhere
1. Upload your code
2. Create a virtual environment
3. Configure WSGI file
4. Set environment variables in web app settings

#### Option 3: Local Network
```bash
# Run on local network
python app.py
# Access from other devices: http://YOUR-IP:5000
```

### Production Checklist

Before deploying to production:
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False` in production
- [ ] Use PostgreSQL instead of SQLite for better performance
- [ ] Set up proper database backups
- [ ] Enable HTTPS
- [ ] Configure proper session security
- [ ] Add rate limiting
- [ ] Set up logging and monitoring

## 🔒 Security Notes

This application is designed for personal/small-scale use and includes:
- ✅ Password hashing (Werkzeug)
- ✅ CSRF protection (Flask-WTF)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Session management (Flask-Login)

**Data Privacy:**
- No sensitive personal data is stored
- Database can be stored locally
- No external data transmission (except Google Maps)
- No encryption required for the use case (as per requirements)

## 📊 Database Schema

### Users
- id, username, email, password_hash, created_at

### HiveSite (formerly HiveCluster)
- id, user_id, name, description, latitude, longitude, hive_count
- functional_classification, seasonal_classification
- harvest_timeline, sugar_requirements, notes, created_at, updated_at

### IndividualHive
- id, site_id, hive_number, status, notes, created_at, updated_at

### HiveAction
- id, site_id, individual_hive_id, user_id, task_type_id
- task_name, description, action_date, is_archived, created_at

### ScheduledTask
- id, site_id, task_id, individual_hive_id, due_date, priority, status
- notes, created_by, completed_by, created_at, completed_at

### TaskType
- id, name, description, category, order

**Note:** The application now uses Firebase Realtime Database for primary data storage with SQLite as a local backup. The schema above represents the local SQLite structure.

## 🔄 Future Mobile App Integration

The application is designed with a RESTful API structure for future mobile app development:

**Available API Endpoints:**
- `GET /api/clusters` - Get all user's clusters
- `GET /api/cluster/<id>/hives` - Get individual hives for a cluster
- `POST /action/log-quick` - Quick action logging (JSON)

To extend for mobile:
1. Add JWT authentication
2. Expand API endpoints
3. Add API documentation (Swagger/OpenAPI)
4. Implement proper API versioning

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Maps not loading?
- Check if your Google Maps API key is set correctly
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for errors

### Database errors?
- Delete `larsbees.db` and restart the app to recreate
- Check file permissions in the project directory

### Import errors?
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Port already in use?
- Change port in `app.py`: `app.run(port=5001)`
- Or kill the process using port 5000

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions

## 🎯 Roadmap

### ✅ Completed Features
- [x] Export data to CSV/Excel
- [x] Weather integration for activity planning
- [x] Honey production tracking and analytics
- [x] Advanced reporting and analytics
- [x] Task scheduling and management
- [x] Real-time data synchronization
- [x] Multi-tenant architecture
- [x] Site classification system
- [x] Data integrity checking

### 🔄 Future Features
- [ ] Equipment inventory management
- [ ] Mobile app (iOS/Android)
- [ ] Email notifications for scheduled tasks
- [ ] Photo uploads for hives
- [ ] Queen tracking and lineage
- [ ] Financial tracking (expenses/revenue)
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Offline mode support
- [ ] Multi-language support

---

**Made with 🐝 for beekeepers, by beekeepers**

Happy Beekeeping! 🍯

