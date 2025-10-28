# 🏗️ LarsBees Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Clusters │  │ Actions  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Flask Application                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Routes (app.py)                     │  │
│  │  /login  /dashboard  /clusters  /actions  /api/*    │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │                                        │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │   - Authentication (Flask-Login)                     │  │
│  │   - Form Validation (WTForms)                        │  │
│  │   - Session Management                               │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │                                        │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │           Data Access Layer (models.py)              │  │
│  │   - SQLAlchemy ORM                                   │  │
│  │   - Model Definitions                                │  │
│  │   - Relationships                                    │  │
│  └─────────────────┬────────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ SQLAlchemy
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Database (SQLite)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ clusters │  │  hives   │  │ actions  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer
```
┌─────────────────────────────────────────┐
│         Templates (Jinja2)              │
├─────────────────────────────────────────┤
│  base.html (Master Template)            │
│    ├── login.html                       │
│    ├── register.html                    │
│    ├── dashboard.html                   │
│    │   └── Google Maps Integration      │
│    ├── clusters.html                    │
│    │   └── Interactive Map View         │
│    ├── cluster_form.html                │
│    ├── cluster_detail.html              │
│    ├── actions.html                     │
│    │   └── Pagination                   │
│    ├── action_form.html                 │
│    │   ├── Quick Log (Checkboxes)       │
│    │   └── Detailed Log (Forms)         │
│    └── hive_form.html                   │
├─────────────────────────────────────────┤
│         Static Assets                   │
│  └── css/style.css (Custom Styling)    │
│      └── Bootstrap 5 Override           │
└─────────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────────┐
│         Flask Application               │
├─────────────────────────────────────────┤
│  app.py                                 │
│    ├── Route Handlers                   │
│    ├── Authentication                   │
│    ├── API Endpoints                    │
│    └── Error Handlers                   │
├─────────────────────────────────────────┤
│  forms.py                               │
│    ├── LoginForm                        │
│    ├── RegistrationForm                 │
│    ├── HiveClusterForm                  │
│    ├── IndividualHiveForm               │
│    └── HiveActionForm                   │
├─────────────────────────────────────────┤
│  models.py                              │
│    ├── User (Authentication)            │
│    ├── HiveCluster (Locations)          │
│    ├── IndividualHive (Tracking)        │
│    ├── HiveAction (Logging)             │
│    └── TaskType (Task Templates)        │
├─────────────────────────────────────────┤
│  config.py                              │
│    ├── Development Config               │
│    ├── Production Config                │
│    └── Testing Config                   │
└─────────────────────────────────────────┘
```

## Data Flow

### User Authentication Flow
```
Login Page
    ┃
    ▼
Validate Credentials
    ┃
    ▼
Create Session (Flask-Login)
    ┃
    ▼
Redirect to Dashboard
```

### Cluster Creation Flow
```
Cluster Form
    ┃
    ▼
Validate Input (WTForms)
    ┃
    ▼
Create HiveCluster Object
    ┃
    ▼
Save to Database (SQLAlchemy)
    ┃
    ▼
Display on Map
```

### Action Logging Flow (Quick)
```
Select Cluster
    ┃
    ▼
Check Multiple Tasks
    ┃
    ▼
Submit via AJAX
    ┃
    ▼
Create Multiple HiveAction Objects
    ┃
    ▼
Save to Database
    ┃
    ▼
Return JSON Response
    ┃
    ▼
Redirect to Actions List
```

### Action Logging Flow (Detailed)
```
Select Cluster
    ┃
    ▼
Select Task Type
    ┃
    ▼
Add Description/Notes
    ┃
    ▼
Submit Form
    ┃
    ▼
Create HiveAction Object
    ┃
    ▼
Save to Database
    ┃
    ▼
Redirect to Actions List
```

## Database Schema

### Entity Relationship Diagram
```
┌──────────────┐           ┌──────────────────┐
│    users     │           │  task_types      │
├──────────────┤           ├──────────────────┤
│ id (PK)      │           │ id (PK)          │
│ username     │           │ name             │
│ email        │           │ description      │
│ password_hash│           │ category         │
│ created_at   │           │ order            │
└──────┬───────┘           └────────┬─────────┘
       │                            │
       │ 1:N                        │ 1:N
       │                            │
       ▼                            │
┌──────────────────┐                │
│  hive_clusters   │                │
├──────────────────┤                │
│ id (PK)          │                │
│ user_id (FK)     │                │
│ name             │                │
│ latitude         │                │
│ longitude        │                │
│ hive_count       │                │
│ harvest_timeline │                │
│ sugar_requirements│               │
└────────┬─────────┘                │
         │                          │
         │ 1:N                      │
         ├──────────────┐           │
         ▼              ▼           │
┌──────────────┐  ┌──────────────┐ │
│individual_hives│ │hive_actions  │◄┘
├──────────────┤  ├──────────────┤
│ id (PK)      │  │ id (PK)      │
│ cluster_id(FK)│ │ cluster_id(FK)│
│ hive_number  │  │ user_id (FK) │
│ status       │  │ task_type_id │
│ notes        │  │ task_name    │
└──────────────┘  │ description  │
                  │ action_date  │
                  │ is_archived  │
                  └──────────────┘
```

## Security Architecture

### Authentication Layer
```
┌─────────────────────────────────────┐
│      User Authentication            │
├─────────────────────────────────────┤
│  1. Password Hashing (Werkzeug)     │
│     - bcrypt algorithm              │
│     - Salt included                 │
│                                     │
│  2. Session Management (Flask-Login)│
│     - Secure cookies                │
│     - Session expiration            │
│     - Remember me functionality     │
│                                     │
│  3. CSRF Protection (Flask-WTF)     │
│     - Token generation              │
│     - Form validation               │
│                                     │
│  4. SQL Injection Prevention        │
│     - SQLAlchemy ORM                │
│     - Parameterized queries         │
│                                     │
│  5. XSS Prevention                  │
│     - Jinja2 auto-escaping          │
│     - HTML sanitization             │
└─────────────────────────────────────┘
```

## Deployment Architecture

### Development Setup
```
┌─────────────────────────────┐
│   Development Machine       │
│   ┌─────────────────────┐  │
│   │  Flask Dev Server   │  │
│   │  Port: 5000         │  │
│   │  Debug: True        │  │
│   └─────────┬───────────┘  │
│             │              │
│   ┌─────────▼───────────┐  │
│   │  SQLite Database    │  │
│   │  larsbees.db        │  │
│   └─────────────────────┘  │
└─────────────────────────────┘
```

### Production Setup (Example)
```
┌──────────────────────────────────────┐
│         Cloud Platform               │
│  (Heroku/PythonAnywhere/VPS)        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │      Load Balancer/Proxy       │ │
│  │      (Nginx/HAProxy)           │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │     WSGI Server (Gunicorn)     │ │
│  │     Multiple Workers           │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │     Flask Application          │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │  Database (PostgreSQL/SQLite)  │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## API Architecture (Future Mobile App)

### RESTful API Structure
```
/api/v1/
├── /auth
│   ├── POST   /login       (JWT token)
│   ├── POST   /register
│   └── POST   /logout
│
├── /clusters
│   ├── GET    /            (list all)
│   ├── GET    /:id         (get one)
│   ├── POST   /            (create)
│   ├── PUT    /:id         (update)
│   └── DELETE /:id         (delete)
│
├── /hives
│   ├── GET    /cluster/:id (list by cluster)
│   ├── GET    /:id         (get one)
│   ├── POST   /            (create)
│   ├── PUT    /:id         (update)
│   └── DELETE /:id         (delete)
│
└── /actions
    ├── GET    /            (list all)
    ├── GET    /:id         (get one)
    ├── POST   /            (create)
    ├── POST   /quick       (bulk create)
    ├── PUT    /:id         (update)
    ├── POST   /:id/archive (archive)
    └── DELETE /:id         (delete)
```

## Performance Considerations

### Optimization Strategies
```
┌────────────────────────────────────┐
│     Database Optimization          │
├────────────────────────────────────┤
│  - Indexed columns (user_id, etc.) │
│  - Lazy loading relationships      │
│  - Query optimization              │
│  - Pagination (50 items/page)      │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│     Frontend Optimization          │
├────────────────────────────────────┤
│  - CDN for Bootstrap/jQuery        │
│  - Minified CSS/JS                 │
│  - Lazy load Google Maps           │
│  - Browser caching                 │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│     Application Optimization       │
├────────────────────────────────────┤
│  - Session management              │
│  - Connection pooling              │
│  - Response compression            │
│  - Static file serving             │
└────────────────────────────────────┘
```

## Technology Stack Layers

```
┌──────────────────────────────────────┐
│         Presentation Layer           │
│  HTML5 + CSS3 + JavaScript           │
│  Bootstrap 5 + Bootstrap Icons       │
│  Google Maps API                     │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│         Application Layer            │
│  Flask 3.0.0 (Python)                │
│  Flask-Login (Auth)                  │
│  Flask-WTF (Forms)                   │
│  Jinja2 (Templating)                 │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│         Data Access Layer            │
│  SQLAlchemy 3.1.1 (ORM)              │
│  Flask-SQLAlchemy                    │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│         Database Layer               │
│  SQLite (Development)                │
│  PostgreSQL (Production-ready)       │
└──────────────────────────────────────┘
```

## Extension Points

### Future Enhancements Architecture
```
┌─────────────────────────────────────┐
│      Planned Extensions             │
├─────────────────────────────────────┤
│  1. Photo Upload System             │
│     - File storage service          │
│     - Image processing              │
│     - Thumbnail generation          │
│                                     │
│  2. Weather Integration             │
│     - External API calls            │
│     - Caching layer                 │
│     - Activity recommendations      │
│                                     │
│  3. Analytics Dashboard             │
│     - Data aggregation              │
│     - Chart generation              │
│     - Export functionality          │
│                                     │
│  4. Multi-user Collaboration        │
│     - Role-based access control     │
│     - Shared apiaries               │
│     - Activity notifications        │
│                                     │
│  5. Mobile Application              │
│     - RESTful API expansion         │
│     - JWT authentication            │
│     - Push notifications            │
└─────────────────────────────────────┘
```

---

**Note:** This architecture is designed to be scalable, maintainable, and easy to understand for both beginners and experienced developers.

