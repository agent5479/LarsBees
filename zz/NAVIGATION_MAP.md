# 🗺️ BeeMarshall Navigation Map

## Complete Site Structure & User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LANDING PAGE (/)                            │
│  [Logo] LarsBees          Features | About | Contact  [Login] [Sign Up] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Hero Section:                                                   │
│    • "Manage Your Apiary Like a Pro"                            │
│    • [Get Started Free] [Learn More]                            │
│                                                                   │
│  ↓ Scroll Down ↓                                                │
│                                                                   │
│  Features Section (6 cards):                                     │
│    • Location Tracking    • Quick Logging    • Individual Hives │
│    • Activity History     • Analytics        • Custom Settings  │
│                                                                   │
│  Task Categories (6 types):                                      │
│    • Inspection  • Feeding  • Treatment                         │
│    • Harvest     • Maintenance  • Events                        │
│                                                                   │
│  About Section:                                                  │
│    • "Built by Beekeepers, for Beekeepers"                      │
│                                                                   │
│  CTA Section:                                                    │
│    • "Ready to Get Started?"                                    │
│    • [Create Free Account] [Sign In]                            │
│                                                                   │
│  Contact Section:                                                │
│    • GitHub  • Documentation  • Community                       │
│                                                                   │
│  Footer:                                                         │
│    • Quick Links  • Resources  • Copyright                      │
└─────────────────────────────────────────────────────────────────┘
          │                                    │
          │ Click "Sign Up"                    │ Click "Login"
          ↓                                    ↓
┌──────────────────────┐            ┌──────────────────────┐
│ REGISTRATION PAGE    │            │   LOGIN PAGE         │
│   /register          │            │   /login             │
├──────────────────────┤            ├──────────────────────┤
│ • Username           │            │ • Username           │
│ • Email              │            │ • Password           │
│ • Password           │            │ • Remember Me        │
│ • Confirm Password   │            │                      │
│ [Register]           │            │ [Login]              │
│                      │            │                      │
│ Already have account?│            │ Don't have account?  │
│ → Login              │            │ → Register           │
└──────────────────────┘            └──────────────────────┘
          │                                    │
          └────────────┬───────────────────────┘
                       │ Successful Login/Registration
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (/dashboard)                      │
│  [Logo] LarsBees  Dashboard | Clusters | Actions | Log  [Username ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Statistics Cards:                                               │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│    │ Clusters │  │  Hives   │  │ Actions  │                   │
│    │    5     │  │   23     │  │   142    │                   │
│    └──────────┘  └──────────┘  └──────────┘                   │
│                                                                   │
│  Hive Cluster Locations Map:                                    │
│    ┌─────────────────────────────────────────┐                 │
│    │  🗺️ Interactive Google Map               │                 │
│    │  • Markers for each cluster              │                 │
│    │  • Click for details                     │                 │
│    └─────────────────────────────────────────┘                 │
│    [Add New Cluster] [View All Clusters]                        │
│                                                                   │
│  Recent Actions Table:                                          │
│    Date       | Cluster      | Task           | Description    │
│    2025-01-15 | North Field  | Inspection    | Queen spotted  │
│    2025-01-14 | South Meadow | Sugar Feeding | 10kg added     │
│    [View All Actions]                                           │
└─────────────────────────────────────────────────────────────────┘
          │           │            │              │
          │           │            │              └─→ Log Action
          │           │            └─→ View All Actions
          │           └─→ View Clusters
          └─→ Add New Cluster
          
┌─────────────────────────────────────────────────────────────────┐
│                    CLUSTERS PAGE (/clusters)                     │
├─────────────────────────────────────────────────────────────────┤
│  [Add New Cluster]                                              │
│                                                                   │
│  Cluster Map:                                                    │
│    🗺️ Map showing all cluster locations                          │
│                                                                   │
│  All Clusters (Grid):                                           │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│    │ North Field │  │South Meadow │  │ East Garden │         │
│    │ 8 hives     │  │ 5 hives     │  │ 10 hives    │         │
│    │ [View][Edit]│  │ [View][Edit]│  │ [View][Edit]│         │
│    └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
          │                    │
          │ Click "Add"        │ Click "View"
          ↓                    ↓
┌──────────────────────┐  ┌──────────────────────────────────────┐
│ ADD/EDIT CLUSTER     │  │  CLUSTER DETAIL (/cluster/1)         │
│ /cluster/add         │  ├──────────────────────────────────────┤
├──────────────────────┤  │ Cluster Information:                  │
│ • Name               │  │  • North Field Apiary                │
│ • Description        │  │  • 8 hives                           │
│ • Latitude           │  │  • GPS: 40.7128, -74.0060           │
│ • Longitude          │  │  [Edit] [Delete]                     │
│ • Hive Count         │  │                                      │
│ • Harvest Timeline   │  │ Location Map:                        │
│ • Sugar Requirements │  │  🗺️ Single cluster marker             │
│ • Notes              │  │                                      │
│ [Use Current Loc]    │  │ Individual Hives:                    │
│ [Save]               │  │  • Hive-1 (Healthy)                  │
│                      │  │  • Hive-2 (Infected)                 │
└──────────────────────┘  │  [Add Individual Hive]               │
                          │                                      │
                          │ Recent Actions:                      │
                          │  Table of cluster-specific actions   │
                          │  [Archive] buttons                   │
                          └──────────────────────────────────────┘
                                    │
                                    │ Click "Add Individual Hive"
                                    ↓
                          ┌──────────────────────────────────────┐
                          │ ADD INDIVIDUAL HIVE                   │
                          │ /cluster/1/hive/add                  │
                          ├──────────────────────────────────────┤
                          │ • Hive Number/ID                     │
                          │ • Status (dropdown)                  │
                          │ • Notes                              │
                          │ [Save]                               │
                          └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    LOG ACTION (/action/log)                      │
├─────────────────────────────────────────────────────────────────┤
│  Quick Log (Multiple Tasks):                                    │
│    • Select Cluster: [Dropdown]                                │
│    • Action Date: [Date Picker]                                │
│    • Select Tasks: [Checkboxes]                                │
│      □ General Inspection    □ Queen Check                     │
│      □ Sugar Feeding         □ Varroa Treatment                │
│      □ Honey Harvest         □ Add Super                       │
│    [Log Selected Tasks]                                         │
│                                                                   │
│  ────── OR ──────                                               │
│                                                                   │
│  Detailed Log (Single Task with Notes):                         │
│    • Select Cluster: [Dropdown]                                │
│    • Individual Hive: [Dropdown] (optional)                    │
│    • Task Type: [Dropdown]                                     │
│    • Custom Task Name: [Text] (if custom)                      │
│    • Description: [Textarea]                                   │
│    • Action Date: [Date Picker]                                │
│    [Log Action]                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ACTIONS PAGE (/actions)                       │
├─────────────────────────────────────────────────────────────────┤
│  [Log New Action]                                               │
│  [✓] Show Archived Actions                                      │
│                                                                   │
│  Action History Table:                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Date | Cluster | Hive | Task | Description | [Archive]  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 2025-01-15 | North | All | Inspection | ... | [Archive] │ │
│  │ 2025-01-14 | South | H-1 | Treatment  | ... | [Archive] │ │
│  │ ... (50 per page)                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Pagination: [1] [2] [3] ... [Next]                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  USER MENU DROPDOWN (Top Right)                  │
├─────────────────────────────────────────────────────────────────┤
│  👤 Username ▼                                                  │
│    └─ [Logout]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Navigation Flow Chart

```
PUBLIC AREA (Not Logged In)
    Landing Page (/)
         ├─→ Features (scroll)
         ├─→ About (scroll)
         ├─→ Contact (scroll)
         ├─→ Login (/login)
         └─→ Register (/register)

AUTHENTICATED AREA (Logged In)
    Dashboard (/dashboard)
         ├─→ Clusters (/clusters)
         │      ├─→ Add Cluster (/cluster/add)
         │      ├─→ View Cluster (/cluster/:id)
         │      │      ├─→ Edit Cluster (/cluster/:id/edit)
         │      │      ├─→ Delete Cluster (POST)
         │      │      └─→ Add Individual Hive (/cluster/:id/hive/add)
         │      │             └─→ Edit Hive (/hive/:id/edit)
         │      └─→ Map View (embedded in clusters page)
         │
         ├─→ Actions (/actions)
         │      ├─→ Log Action (/action/log)
         │      ├─→ Archive Action (AJAX POST)
         │      └─→ Unarchive Action (AJAX POST)
         │
         ├─→ Log Action (/action/log)
         │      ├─→ Quick Log (submit via AJAX)
         │      └─→ Detailed Log (form submission)
         │
         └─→ Logout (/logout)

API ENDPOINTS (AJAX/Mobile)
    GET  /api/clusters
    GET  /api/cluster/:id/hives
    POST /action/log-quick

DEBUG ENDPOINTS (Development Only)
    GET /debug/db-info
    GET /debug/create-sample-data
```

## Page Hierarchy

```
Level 0: Public
    └─ Landing Page

Level 1: Authentication
    ├─ Login
    └─ Register

Level 2: Main Dashboard
    └─ Dashboard (authenticated home)

Level 3: Primary Features
    ├─ Clusters (list)
    ├─ Actions (list)
    └─ Log Action (form)

Level 4: Detail Pages
    ├─ Cluster Detail
    │   └─ Individual Hive Management
    ├─ Cluster Form (add/edit)
    └─ Action Log (detailed)

Level 5: Sub-features
    └─ Individual Hive Form (add/edit)
```

## Breadcrumb Navigation Examples

```
Dashboard

Dashboard → Clusters

Dashboard → Clusters → North Field Apiary

Dashboard → Clusters → North Field Apiary → Add Individual Hive

Dashboard → Clusters → North Field Apiary → Edit Hive-1

Dashboard → Actions

Dashboard → Log Action
```

## Quick Access Shortcuts

### From Dashboard:
- Add New Cluster (button)
- View All Clusters (button)
- View All Actions (button)
- Log Action (navbar)

### From Clusters Page:
- Add New Cluster (button)
- Edit Cluster (card button)
- View Cluster (card button)

### From Cluster Detail:
- Edit Cluster (button)
- Delete Cluster (button)
- Add Individual Hive (button)
- Log Action (button)

### From Any Page:
- Dashboard (navbar)
- Clusters (navbar)
- Actions (navbar)
- Log Action (navbar)
- Logout (dropdown menu)

## Mobile Navigation

On screens < 768px:
- Hamburger menu (☰) replaces full navbar
- All main links collapse into dropdown
- Buttons remain full width
- Maps become scrollable

## Search & Filter (Future Enhancement)

Potential additions:
- Search actions by cluster
- Filter by date range
- Filter by task type
- Sort actions (date, cluster, type)
- Search clusters by name

---

**Navigation is intuitive and follows standard web app patterns!** 🗺️🐝

