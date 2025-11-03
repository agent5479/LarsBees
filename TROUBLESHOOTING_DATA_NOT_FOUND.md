# Troubleshooting: Data Not Found

## Issue
Sites data is not appearing or not being found.

## Quick Checks

### 1. Browser Console
Open Developer Tools (F12) and check the Console tab for:
- Any red error messages
- Messages starting with `⚠️` or `❌`
- Look for messages about `window.sites`

### 2. Verify Data Loading
In the browser console, type:
```javascript
window.sites
```
This should show an array of sites. If it shows `undefined` or `[]`, the data hasn't loaded yet.

### 3. Check Firebase Connection
In the console, check for:
- `✅ Firebase initialized successfully`
- `📊 Sites loaded for [tenant]: [number]`

### 4. Hard Refresh
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`
- This clears cached JavaScript files

### 5. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for `sites.js` - make sure it loads successfully (status 200)
5. Check if there are any failed requests

## Code Changes Made

All changes have been implemented in `docs/js/sites.js`:

1. ✅ **Safety check added** - `renderSites()` now checks if `window.sites` exists before rendering
2. ✅ **Contact Before Visit badge** - Shows when `contactBeforeVisit: true`
3. ✅ **Description display** - Shows when `description` field exists
4. ✅ **Notes section** - Always visible with edit capability
5. ✅ **Hive box reordering** - Order: doubles, singles, nucs, top splits, empty
6. ✅ **Scroll to card after edit** - Implemented
7. ✅ **Map popup scroll** - New `scrollToSiteCard()` function
8. ✅ **Allow 0 values** - Validation updated

## If Data Still Not Showing

1. **Check Firebase Console:**
   - Go to Firebase Console
   - Navigate to Realtime Database
   - Check `tenants/[your-tenant-id]/sites`
   - Verify sites exist and have data

2. **Check Authentication:**
   - Make sure you're logged in
   - Check that `currentTenantId` is set correctly
   - In console, type: `currentTenantId`

3. **Check Data Structure:**
   - Sites should be in: `tenants/[tenant-id]/sites/[site-id]`
   - Each site should have: `id`, `name`, `latitude`, `longitude`, etc.

4. **Reload Data:**
   - In console, type: `loadAllData()` or `loadDataFromFirebase()`
   - This will force reload from Firebase

## Debugging Steps

1. Open browser console (F12)
2. Check if sites are loaded:
   ```javascript
   console.log('Sites:', window.sites);
   console.log('Sites count:', window.sites?.length);
   ```
3. Check if renderSites is being called:
   - Look for any errors when navigating to Sites view
4. Manually trigger render:
   ```javascript
   renderSites();
   ```

## Expected Behavior

- Sites should render immediately if data is loaded
- If no data, shows "Loading sites..." message
- Console should show warning if `window.sites` is not available

