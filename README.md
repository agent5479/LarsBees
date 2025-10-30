# 🐝 BeeMarshall - Complete Apiary Management System

A comprehensive, production-ready web-based apiary (beekeeping) management system built with modern web technologies. Features real-time data synchronization, multi-tenant architecture, role-based access control, and comprehensive reporting capabilities.

![Version](https://img.shields.io/badge/version-1.3-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Security](https://img.shields.io/badge/security-enhanced-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Python Flask (minimal), Firebase Realtime Database
- **Authentication**: Firebase Auth with multi-tenant support
- **Maps**: Google Maps JavaScript API
- **Weather**: OpenWeatherMap API
- **Security**: GitHub Secrets, bcrypt password hashing, role-based access control

### Core Architecture Principles
- **Offline-First**: Changes persist locally and sync when connection is restored
- **Multi-Tenant**: Complete data isolation between organizations
- **Role-Based Access**: Admin and Employee roles with appropriate permissions
- **Real-Time Sync**: Firebase-powered live data synchronization
- **Mobile-Responsive**: Optimized for all device sizes
- **Security-First**: No hardcoded credentials, secure password management

## 🚀 Current Version: v1.3

### System Capabilities
- **🔐 Enterprise Authentication** - Multi-tenant Firebase authentication with secure password management
- **👥 Team Management** - Admin-controlled employee accounts with temporary password system
- **📍 Advanced Site Management** - GPS coordinates, functional/seasonal classifications, harvest tracking
- **🗺️ Interactive Mapping** - Real-time site visualization with weather integration
- **🐝 Individual Hive Tracking** - Detailed hive management with health status monitoring
- **📝 Comprehensive Action Logging** - Task-based activity logging with automatic categorization
- **📅 Intelligent Scheduling** - Task scheduling with overdue detection and rescheduling
- **📊 Advanced Analytics** - Performance metrics, health monitoring, operations analysis
- **🔍 Data Integrity Checking** - Built-in validation and consistency checking
- **📱 Mobile-Optimized** - Responsive design with touch-friendly interfaces
- **🌐 Real-Time Sync** - Live data synchronization with offline change queuing
- **📦 Data Export** - CSV export for all data types with tenant isolation
- **🛡️ Security Hardened** - No hardcoded credentials, secure tenant isolation

## 🏷️ Site Classification System

### Functional Classifications
- **Production** - Primary honey production sites
- **Nucleus** - Small colonies for breeding
- **Queen Rearing** - Specialized queen production
- **Research** - Experimental and study sites
- **Education** - Training and demonstration sites
- **Quarantine** - Isolated health management
- **Backup** - Emergency/overflow sites
- **Custom** - User-defined classifications

### Seasonal Classifications
- **Summer Site** - Active during summer months
- **Winter Site** - Active during winter months
- **All Year Round** - Year-round active sites

## 👥 User Roles & Permissions

### Administrator (Admin)
- Full system access
- Employee management (add, activate, deactivate)
- Site editing and management
- Task management and scheduling
- Data export and reporting
- System configuration

### Employee
- Limited site editing (summary cards only)
- Action logging and task completion
- View-only access to most system features
- Cannot access admin functions
- Cannot edit site details directly

## 🔧 System Configuration

### Environment Variables (GitHub Secrets)
The system uses GitHub Secrets for secure configuration:

**Required Secrets:**
- `GBTECH_USERNAME` - Admin username
- `GBTECH_PASSWORD` - Admin password (hashed)
- `FIREBASE_API_KEY` - Firebase API key
- `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `FIREBASE_APP_ID` - Firebase app ID
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key

### Firebase Security Rules
```javascript
{
  "rules": {
    "tenants": {
      "$tenantId": {
        ".read": "auth != null && (auth.uid == $tenantId || root.child('tenants').child($tenantId).child('employees').child(auth.uid).exists())",
        ".write": "auth != null && (auth.uid == $tenantId || root.child('tenants').child($tenantId).child('employees').child(auth.uid).exists())"
      }
    }
  }
}
```

## 📱 User Interface

### Main Application (`beemarshall-full.html`)
- **Dashboard** - Overview with key metrics and quick actions
- **Sites** - Apiary site management with interactive map
- **Actions** - Task logging and activity tracking
- **Schedule** - Task scheduling and calendar view
- **Tasks** - Task management (admin only)
- **Reports** - Analytics and reporting (external page)
- **Compliance** - NZ regulatory compliance tracking
- **Data Integrity** - Data validation and consistency checking
- **Team** - Employee management (admin only)

### Reports Dashboard (`reports.html`)
- **Performance Analytics** - Hive strength and productivity metrics
- **Health Monitoring** - Disease tracking and mortality analysis
- **Operations Analysis** - Task completion and efficiency metrics
- **Harvest Tracking** - Honey production and timeline analysis
- **Data Export** - CSV export functionality

## 🗂️ File Structure

```
LarsBees/
├── docs/                          # Main application files
│   ├── beemarshall-full.html     # Primary application interface
│   ├── reports.html              # Reports and analytics dashboard
│   ├── index.html                # Landing page
│   ├── test-secrets.html         # Debug and testing console
│   ├── js/                       # JavaScript modules
│   │   ├── core.js              # Core application logic
│   │   ├── sites.js             # Site management
│   │   ├── actions.js           # Action logging
│   │   ├── scheduling.js        # Task scheduling
│   │   ├── dashboard.js         # Dashboard functionality
│   │   ├── tasks.js             # Task management
│   │   ├── employees.js         # Employee management
│   │   ├── compliance.js        # Compliance tracking
│   │   ├── navigation.js        # Navigation management
│   │   ├── sync-status.js       # Sync status management
│   │   └── config.js            # Configuration management
│   └── css/                     # Stylesheets
├── templates/                    # Flask templates (legacy)
├── static/                       # Static assets
├── app.py                       # Flask application (minimal)
├── models.py                    # Database models
├── forms.py                     # Form definitions
├── config.py                    # Configuration
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## 🔒 Security Features

### Authentication & Authorization
- **Firebase Authentication** - Secure user authentication
- **Multi-Tenant Isolation** - Complete data separation between organizations
- **Role-Based Access Control** - Granular permissions for different user types
- **Password Security** - bcrypt hashing with strength validation
- **Session Management** - Secure session handling with device remembering

### Data Protection
- **No Hardcoded Credentials** - All sensitive data in GitHub Secrets
- **Tenant Isolation** - Firebase rules prevent cross-tenant data access
- **Input Validation** - Comprehensive data validation and sanitization
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Prevention** - Cross-site scripting protection

### Operational Security
- **Temporary Passwords** - Time-limited employee passwords
- **Device Remembering** - Secure device authentication
- **Audit Logging** - Comprehensive action logging
- **Data Integrity** - Built-in validation and consistency checking

## 📊 Data Management

### Firebase Database Structure
```
tenants/
├── {tenantId}/
│   ├── sites/
│   │   └── {siteId}/
│   ├── actions/
│   │   └── {actionId}/
│   ├── scheduledTasks/
│   │   └── {taskId}/
│   ├── individualHives/
│   │   └── {hiveId}/
│   ├── tasks/
│   │   └── {taskId}/
│   ├── employees/
│   │   └── {employeeId}/
│   └── users/
│       └── {userId}/
```

### Data Synchronization
- **Real-Time Updates** - Live data synchronization across devices
- **Offline Support** - Changes queued locally when offline
- **Conflict Resolution** - Automatic conflict resolution on reconnection
- **Data Validation** - Comprehensive validation before sync

## 🚀 Deployment

### GitHub Pages Deployment
The system is designed for GitHub Pages deployment with GitHub Secrets:

1. **Set up GitHub Secrets** (see Environment Variables section)
2. **Enable GitHub Pages** in repository settings
3. **Deploy automatically** on push to main branch
4. **Access via** `https://{username}.github.io/LarsBees/docs/beemarshall-full.html`

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/LarsBees.git
cd LarsBees

# Install dependencies
pip install -r requirements.txt

# Run Flask app (minimal backend)
python app.py

# Access main application
open docs/beemarshall-full.html
```

## 🧪 Testing & Debugging

### Debug Console (`test-secrets.html`)
- **Environment Variable Testing** - Verify GitHub Secrets injection
- **Authentication Testing** - Test login functionality
- **Firebase Testing** - Verify database connectivity
- **Security Testing** - Validate security implementations
- **Performance Testing** - Monitor system performance

### Production Monitoring
- **Sync Status Overlay** - Real-time sync status indicator
- **Error Logging** - Comprehensive error tracking
- **Performance Metrics** - System performance monitoring
- **Data Integrity Checks** - Automated consistency validation

## 📈 Performance Characteristics

### Current Performance
- **Load Time** - < 3 seconds initial load
- **Sync Speed** - < 1 second for data updates
- **Offline Support** - Unlimited offline changes queued
- **Mobile Performance** - Optimized for mobile devices
- **Browser Support** - Modern browsers (Chrome, Firefox, Safari, Edge)

### Scalability
- **Multi-Tenant** - Supports unlimited organizations
- **Data Volume** - Handles thousands of sites and actions
- **Concurrent Users** - Supports multiple users per tenant
- **Real-Time Updates** - Efficient Firebase real-time sync

## 🔄 Future Development

### Planned Optimizations
- **Code Cleanup** - Remove debug code and unused files
- **Performance Tuning** - Optimize JavaScript and CSS
- **Bundle Optimization** - Minimize and compress assets
- **Caching Strategy** - Implement intelligent caching
- **Progressive Web App** - Add PWA capabilities

### Feature Roadmap
- **Mobile App** - Native iOS/Android applications
- **Advanced Analytics** - Machine learning insights
- **API Integration** - Third-party service integrations
- **Multi-Language** - Internationalization support
- **Advanced Reporting** - Custom report builder

## 🤝 Contributing

### Development Guidelines
- **Code Style** - Follow existing patterns and conventions
- **Security First** - Never hardcode credentials or sensitive data
- **Testing** - Test all changes thoroughly
- **Documentation** - Update documentation for any changes
- **Performance** - Consider performance impact of changes

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with detailed description

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

### Documentation
- **User Guide** - `docs/USER_GUIDE.md`
- **Technical Documentation** - `docs/TENANT_STRUCTURE_AND_LOGS_README.md`
- **Reports Documentation** - `docs/REPORTS_README.md`
- **Setup Guide** - `docs/SETUP_GUIDE_LARS.md`

### Troubleshooting
- **Common Issues** - Check debug console (`test-secrets.html`)
- **Performance Issues** - Monitor sync status overlay
- **Data Issues** - Use Data Integrity Check feature
- **Login Issues** - Verify GitHub Secrets configuration

---

**BeeMarshall v1.3 - Production Ready Apiary Management System**

*Built with modern web technologies for professional beekeeping operations* 🐝