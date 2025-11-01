# Rendering Timing Analysis: Sites vs Actions

## Key Finding: DOM Modification Before Content Render

### Sites (Working Correctly)
1. `showSites()` shows view
2. `renderSites()` immediately sets `innerHTML` on `sitesList` (which already has placeholder content)
3. `renderSiteTypeFilter()` populates filter (after main content)

**Timing:** View shown → Content rendered immediately → Filter populated

### Actions (Blank Space Issue)
1. `showActions()` shows view
2. `populateActionFilters()` modifies visible filter dropdowns (`filterSite`, `filterCategory`, `filterEmployee`)
3. `renderActions()` then populates main content (`actionsList`)

**Timing:** View shown → Filters modified (triggers reflow) → Content rendered (gap appears)

## Root Cause Hypothesis

When `populateActionFilters()` runs, it:
- Replaces `innerHTML` on 3 visible dropdown elements
- These elements are in the visible view (not hidden)
- Browser triggers layout recalculation/reflow
- This creates a moment where filters are populated but main content isn't yet
- Browser calculates scroll position during this intermediate state
- Creates blank space because content hasn't rendered yet

## The Difference

**Sites:** Content renders FIRST, then filter (which is separate and doesn't affect main content area)

**Actions:** Filters render FIRST (visible elements in the view), causing layout shift, THEN content renders

## Solution Options

1. **Render content first, then filters** (match Sites pattern)
2. **Populate filters while view is hidden** (before showing view)
3. **Use requestAnimationFrame to batch DOM updates**
4. **Add a small delay between filter population and content render**


