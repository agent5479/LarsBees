# BeeMarshall File Cleanup Plan

## Status: Analysis Phase - Ready for Review

This document outlines files that may be redundant or archived and should be reviewed for removal. **Each file will be verified for references before deletion.**

---

## File Categories & Analysis

### ✅ **CORE APPLICATION FILES** (KEEP - Required for operation)
These files are actively used and MUST remain:

- `docs/beemarshall-full.html` - Main application
- `docs/index.html` - Landing page  
- `docs/reports.html` - Reports page (referenced in index.html)
- `docs/css/brand.css` - Branding stylesheet (referenced in beemarshall-full.html)
- `docs/js/*.js` - All JavaScript modules (12+ files, all referenced)

---

### 🔴 **PYTHON BACKEND FILES** (CANDIDATE FOR REMOVAL)
These appear to be from an old Flask backend. **Current app is pure frontend using Firebase.**

**Files to verify:**
- `app.py` - Flask application (1546+ lines)
- `forms.py` - Flask forms
- `models.py` - Database models
- `config.py` - Flask configuration
- `setup.py` - Package setup

**Verification needed:** 
- ✅ Check if referenced anywhere in docs/
- ✅ Check if used by GitHub Pages deployment
- ✅ Check if needed for any server-side functionality

**Decision:** If app is purely frontend/Firebase, these can be removed.

---

### 🔴 **TEMPLATES FOLDER** (CANDIDATE FOR REMOVAL)
If `beemarshall-full.html` is standalone, these Flask templates are redundant.

**Files in `templates/` folder:**
- `base.html`, `login.html`, `register.html`, `dashboard.html`
- `actions.html`, `action_form.html`, `scheduler.html`
- `clusters.html`, `cluster_form.html`, `cluster_detail.html`
- `hive_form.html`, `task_templates.html`
- `landing.html`, `quick_schedule.html`
- `disease_report.html`, `field_report.html`, `export_management.html`

**Verification needed:**
- ✅ Check if `beemarshall-full.html` imports any templates
- ✅ Check if any deployment scripts use templates
- ✅ Confirm app is 100% frontend

**Decision:** Likely safe to remove if app is standalone.

---

### 🔴 **STATIC FOLDER** (CANDIDATE FOR REMOVAL)
If CSS is embedded in `beemarshall-full.html`, external CSS files may be redundant.

**Files in `static/` folder:**
- `static/css/style.css`
- `static/css/larsbees-enhanced.css`
- `static/css/landing.css`

**Verification needed:**
- ✅ Check if referenced in `beemarshall-full.html` or `index.html`
- ✅ Check if referenced in any templates
- ✅ Confirm all styles are in HTML file

**Decision:** If not referenced, safe to remove.

---

### 🔴 **DATABASE FILE** (CANDIDATE FOR REMOVAL)
If using Firebase, SQLite database is redundant.

**File:**
- `larsbees.db` - SQLite database file

**Verification needed:**
- ✅ Confirm Firebase is the primary database
- ✅ Check if SQLite is used for any local caching
- ✅ Verify no scripts reference this file

**Decision:** Likely safe to remove if fully on Firebase.

---

### 🟡 **TEST FILES** (REVIEW)
Test files may be useful for debugging but could be archived.

**Files:**
- `docs/test-firebase-rules.html` - Firebase rules testing
- `docs/test-secrets.html` - Secrets testing
- `test-secrets.html` (root) - Duplicate?

**Verification needed:**
- ✅ Check if referenced in documentation
- ✅ Determine if still useful for debugging
- ✅ Consider moving to separate test folder if keeping

**Decision:** Keep if useful for debugging, remove if outdated.

---

### 🟡 **DOCUMENTATION FILES** (CONSOLIDATE)
Multiple documentation files that may overlap or be outdated.

**Root level docs:**
- `README.md` - Main readme (KEEP)
- `LICENSE` - License file (KEEP)
- `EMPLOYEE_ACTIVATION_GUIDE.md`
- `EMPLOYEE_LOGIN_DELIVERY_GUIDE.md`
- `FINAL_SUMMARY.md`
- `FIREBASE_SECRETS_SETUP.md`
- `FIREBASE_SECURITY_VERIFICATION.md`
- `FUNCTIONAL_SETTINGS_README.md`
- `LOCAL_DEVELOPMENT_SETUP.md`
- `PERFORMANCE_OPTIMIZATION_PLAN.md`
- `PRODUCTION_CLEANUP_GUIDE.md`
- `PRODUCTION_CLEANUP_PLAN.md`
- `PROJECT_CLEANUP_SUMMARY.md`
- `SECURITY_AUDIT_REPORT.md`
- `SECURITY_SETUP.md`
- `TENANT_STRUCTURE_AND_LOGS_README.md`

**Docs folder docs:**
- `docs/README.md` - (KEEP if different from root)
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/LOGIN_TROUBLESHOOTING.md` - Referenced in index.html (KEEP)
- `docs/PROJECT_SCHEMA.md`
- `docs/REPORTS_README.md`
- `docs/SETUP_GUIDE_LARS.md`
- `docs/TASK_ID_DISPLAY_SYSTEM.md`
- `docs/TESTING_GUIDE.md`
- `docs/USER_GUIDE.md` - Referenced in index.html (KEEP)

**Verification needed:**
- ✅ Check for duplication across root and docs/
- ✅ Identify outdated guides vs. current documentation
- ✅ Consolidate overlapping content
- ✅ Keep user-facing docs (USER_GUIDE, TROUBLESHOOTING)
- ✅ Archive historical summaries if not needed

**Decision:** Consolidate and remove outdated summaries.

---

### 🟡 **MISSING FILE** (ACTION NEEDED)
Referenced but doesn't exist:

- `docs/js/env-config.js` - Referenced in beemarshall-full.html line 2848

**Verification needed:**
- ✅ Check if this file should exist
- ✅ Create placeholder if needed
- ✅ Or remove reference if not needed

**Decision:** Create placeholder or fix reference.

---

### 🟡 **DEPLOYMENT FILES** (REVIEW)
Deployment-related files to review:

- `deploy-to-github.bat` - GitHub deployment script (may be useful)
- `run.bat` / `run.sh` - Local run scripts (may be useful if testing locally)
- `Procfile` - Heroku deployment (may not be needed if using GitHub Pages)
- `requirements.txt` - Python dependencies (needed if Python files exist)
- `runtime.txt` - Python runtime (needed if Python files exist)

**Verification needed:**
- ✅ Determine deployment method (GitHub Pages vs. Heroku)
- ✅ Keep only files relevant to current deployment
- ✅ Remove if not using Python backend

**Decision:** Keep only deployment files relevant to current setup.

---

### 🟡 **PYCACHE** (CLEANUP)
Python cache files - always safe to remove.

**Folder:**
- `__pycache__/` - Python bytecode cache

**Decision:** Safe to remove (can regenerate if needed).

---

## Removal Verification Process

For each candidate file/folder:

1. ✅ **Search codebase** for references (grep for filename)
2. ✅ **Check HTML files** for links/imports
3. ✅ **Verify deployment** scripts don't use them
4. ✅ **Confirm backup** exists (user confirmed)
5. ✅ **Get user approval** before deletion

---

## Recommended Removal Order

### Phase 1: Safe Removals (Low Risk)
1. `__pycache__/` folder - Python cache (always safe)
2. Duplicate `test-secrets.html` if confirmed duplicate

### Phase 2: Backend Files (Medium Risk - Verify First)
3. Python files (`app.py`, `forms.py`, `models.py`, `config.py`, `setup.py`)
4. `templates/` folder (if not referenced)
5. `static/` folder (if not referenced)
6. `larsbees.db` (if using Firebase only)
7. `requirements.txt`, `runtime.txt`, `Procfile` (if not using Python backend)

### Phase 3: Documentation Consolidation (Low Risk)
8. Consolidate duplicate/redundant documentation
9. Remove outdated summaries and guides

### Phase 4: Test Files (Low Risk - Archive Option)
10. Review and archive test files if not actively used

---

## Next Steps

1. ✅ Review this plan
2. ✅ Run verification for each category
3. ✅ Get approval for each removal
4. ✅ Execute removals conservatively, one category at a time
5. ✅ Test application after each removal phase

---

**Last Updated:** Initial analysis complete
**Status:** Ready for verification and approval phase

