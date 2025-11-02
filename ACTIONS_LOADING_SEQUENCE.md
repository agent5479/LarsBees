# Precise Loading Sequence: Clicking Actions Navbar Button

## Step-by-Step Execution Order

### 1. **User clicks navbar link**
   - HTML: `<a class="nav-link" href="#" onclick="showActions(); return false;">`
   - Triggers: `showActions()` function call

### 2. **showActions() executes (synchronously)**
   ```
   Line 100: function showActions() {
   Line 101:   hideAllViews();
   Line 102:   scrollToTop();
   Line 103-105: populateActionFilters();
   Line 106:   setTimeout(() => { ... }, 10);
   ```
   
   **2a. hideAllViews() called (synchronous)**
   - Iterates through all view IDs
   - For `actionsView`:
     - Adds `hidden` class
     - Sets `display = 'none'`
     - Forces reflow: `void view.offsetHeight`
   - Console: `🔄 All views hidden`
   
   **2b. scrollToTop() called (synchronous)**
   - `window.scrollTo(0, 0)`
   - `document.documentElement.scrollTop = 0`
   - `document.body.scrollTop = 0`
   - `mainApp.scrollTop = 0` (if exists)
   - `container.scrollTop = 0` (if exists)
   
   **2c. populateActionFilters() called (synchronous, view still hidden)**
   - Gets `filterSite` element
   - Sets `innerHTML` with site options (DOM write)
   - Gets `filterCategory` element
   - Sets `innerHTML` with category options (DOM write)
   - Gets `filterEmployee` element
   - Sets `innerHTML` with employee options (DOM write)
   - Sets `filterSite.value = ''` (DOM read + write)
   - Sets `filterCategory.value = ''` (DOM read + write)
   - Sets `filterEmployee.value = ''` (DOM read + write)
   - ⚠️ **CRITICAL**: All DOM writes happen while `actionsView` has `display: none`
   - ⚠️ **CRITICAL**: Browser may batch these DOM updates since element is hidden
   
   **2d. setTimeout scheduled (10ms delay)**
   - Callback queued for ~10ms later
   - Execution continues (function returns)

### 3. **Browser Event Loop (10ms later)**
   - setTimeout callback executes

### 4. **setTimeout callback executes (synchronous within callback)**
   ```
   Line 107: const view = document.getElementById('actionsView');
   Line 108-111: if (view) { view.classList.remove('hidden'); view.style.display = ''; }
   Line 112: updateActiveNav('Actions');
   Line 114: renderActions();
   Line 117-123: requestAnimationFrame(() => { requestAnimationFrame(() => { ... }); });
   ```
   
   **4a. Get and show view (synchronous)**
   - `view.classList.remove('hidden')` - removes hidden class
   - `view.style.display = ''` - sets display to default (block/empty)
   - ⚠️ **CRITICAL**: View becomes visible here
   - ⚠️ **CRITICAL**: Browser must recalculate layout NOW
   - ⚠️ **CRITICAL**: Filters already populated but were hidden - browser renders them now
   - ⚠️ **CRITICAL**: `actionsList` still has placeholder content
   
   **4b. updateActiveNav('Actions') called (synchronous)**
   - Removes `active` class from all nav links
   - Finds nav link with `onclick="showActions()"`
   - Adds `active` class to that link
   - Console logs: `🎯 Updating navigation to: Actions`
   
   **4c. renderActions() called (synchronous)**
   - **Reads filter values** (lines 191-202):
     - `filterSite.value`
     - `filterCategory.value`
     - `filterEmployee.value`
     - `sortOrder.value`
     - `filterDateFrom.value`
     - `filterDateTo.value`
     - `hideDeletes.checked`
     - `hideMoves.checked`
     - `hideStackUpdates.checked`
     - `hideStrengthUpdates.checked`
   - Processes `window.actions` array
   - Filters, sorts, limits actions
   - Generates HTML string
   - **Sets `actionsList.innerHTML = html`** (line 325)
   - ⚠️ **CRITICAL**: This is a large DOM write (potentially 100 action items)
   - ⚠️ **CRITICAL**: Browser must recalculate layout after this
   - Console: `🔍 Actions list updated`
   
   **4d. requestAnimationFrame scheduled (next frame)**
   - First RAF callback queued for next paint
   - Execution continues (setTimeout callback completes)

### 5. **Browser Paint Cycle (next animation frame)**
   - Browser recalculates layout
   - Browser paints page
   - **First RAF callback executes**

### 6. **First requestAnimationFrame callback (synchronous)**
   - Schedules **second RAF** callback
   - Execution completes

### 7. **Browser Paint Cycle (next animation frame)**
   - **Second RAF callback executes**
   
   **7a. Scroll reset (synchronous)**
   - `window.scrollTo(0, 0)`
   - `document.documentElement.scrollTop = 0`
   - `document.body.scrollTop = 0`

## Potential Issues Identified

### Issue 1: Layout Calculation Timing
- When view becomes visible (step 4a), browser calculates layout
- At this moment:
  - Filters are populated (take up space)
  - `actionsList` still has placeholder content (short)
- Browser may calculate scroll position based on short content height
- Then `renderActions()` adds full content (step 4c)
- Scroll position might be calculated too early

### Issue 2: Hidden DOM Updates
- Filters populated while `display: none` (step 2c)
- Browser may defer layout calculation until element becomes visible
- When view shown (step 4a), browser calculates layout with:
  - Filters (tall)
  - Placeholder content (short)
- Then content rendered (step 4c)
- Gap between steps 4a and 4c where layout is wrong

### Issue 3: Double RAF Delay
- Content rendered (step 4c) synchronously
- Scroll reset happens 2 frames later (step 7)
- In those 2 frames, browser may have already calculated/rendered with wrong scroll position

## Comparison: Sites View

### Sites View Sequence:
1. `hideAllViews()` - hides all
2. `scrollToTop()` - scrolls
3. `setTimeout(() => { ... }, 10)`
4. Show view (remove hidden, display = '')
5. `renderSites()` - **renders main content FIRST**
6. `renderSiteTypeFilter()` - renders filter AFTER

**Key Difference**: Sites renders CONTENT before any filter elements are populated/modified. Actions populates FILTERS (which are visible form elements) before content.

