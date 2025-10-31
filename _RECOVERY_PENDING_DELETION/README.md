# Recovery Folder - Files Pending Deletion

**Date Created:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

This folder contains files moved from the main project directory pending final deletion. All files have been verified as not referenced in the active application codebase.

## Restoration Instructions

If you need to restore any file:
1. Copy the file/folder from this recovery directory back to its original location
2. Maintain the original folder structure (if restoring folders)

## Files Moved

### Python Backend Files
**Original Location:** Root directory  
**Moved Files:**
- `app.py` - Flask backend application
- `forms.py` - Flask form definitions
- `models.py` - Database models
- `config.py` - Flask configuration
- `setup.py` - Package setup
- `requirements.txt` - Python dependencies
- `runtime.txt` - Python runtime version
- `Procfile` - Heroku deployment config

**Reason:** Application is pure frontend using Firebase. No Python backend needed.

---

### Templates Folder
**Original Location:** `templates/` folder  
**Moved Folder:** Entire `templates/` folder with 17 HTML templates

**Reason:** Application uses standalone `beemarshall-full.html`. No Flask templates needed.

---

### Static Assets Folder
**Original Location:** `static/` folder  
**Moved Folder:** Entire `static/` folder containing CSS files

**Files:**
- `static/css/style.css`
- `static/css/larsbees-enhanced.css`
- `static/css/landing.css`

**Reason:** All styles embedded in `beemarshall-full.html`. External CSS files not referenced.

---

### Database File
**Original Location:** Root directory  
**Moved File:** `larsbees.db`

**Reason:** Application uses Firebase Realtime Database. SQLite database not needed.

---

### Python Cache
**Original Location:** Root directory  
**Moved Folder:** `__pycache__/`

**Reason:** Python bytecode cache. Can regenerate if needed.

---

### Documentation - Historical Summaries
**Original Location:** Root and `docs/` directories  
**Moved Files:**
- `FINAL_SUMMARY.md` - Historical summary
- `PERFORMANCE_OPTIMIZATION_PLAN.md` - Completed plan
- `PRODUCTION_CLEANUP_GUIDE.md` - Redundant guide
- `PRODUCTION_CLEANUP_PLAN.md` - Completed plan
- `PROJECT_CLEANUP_SUMMARY.md` - Historical summary
- `docs/IMPLEMENTATION_SUMMARY.md` - Historical summary

**Reason:** Historical/outdated documentation. User-facing guides remain in project.

---

### Test Files
**Original Location:** Root and `docs/` directories  
**Moved Files:**
- `test-secrets.html` (root) - Small test file
- `docs/test-firebase-rules.html` - Firebase rules testing
- `docs/test-secrets.html` - Secrets testing

**Reason:** Test files not referenced in production code. Keep for debugging or remove.

---

## Verification Performed

All files were verified before moving:
- ✅ Grep search: No references in `docs/` folder
- ✅ HTML files: No imports or references to these files
- ✅ Application: Pure frontend, no backend dependencies
- ✅ Database: Using Firebase, not SQLite

## Final Deletion

After confirming the application works correctly without these files, you can:
1. Test the application thoroughly
2. If everything works, delete this recovery folder
3. Or keep it as an archive for reference

---

**Note:** Files in this folder are safe to delete if the application continues to function correctly after their removal. Keep this folder until you're confident everything works without them.

