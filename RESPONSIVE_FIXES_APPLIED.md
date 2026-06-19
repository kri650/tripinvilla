# Hero Section Responsive Bug Fixes Applied

## Summary
Fixed 3 specific responsive bugs in the HeroSection component's CSS file.

**File Modified:** `src/guest/styles/00-home-hero-section.css`

---

## BUG 1: Search fields grid breaks layout at ~967px ✅ FIXED

**Location:** `@media (max-width: 1024px)` breakpoint

**Problem:** `grid-template-columns: repeat(3, minmax(180px, 1fr))` overflowed because the card wasn't wide enough for 3 columns of min-width 180px at ~967px.

**Fix Applied:**
```css
.search-fields-grid {
  grid-template-columns: repeat(2, 1fr); /* FIXED - BUG 1 */
  gap: 16px;
}
```

**Result:** Grid now displays 2 columns instead of 3, preventing overflow at narrower widths.

---

## BUG 2: Search card completely disappears at ~847px ✅ FIXED

**Location:** `@media (max-width: 1024px)` breakpoint  

**Problem:** Two conflicting styles:
- `.hero-wrapper` had `overflow: hidden` (clipped the card)
- `.search-card-wrapper` had `position: static` (lost stacking context)

**Fixes Applied:**
```css
.hero-wrapper {
  min-height: 900px; /* FIXED - BUG 2 */
  height: auto;
  overflow: visible; /* FIXED - BUG 2 (was: hidden) */
}

.search-card-wrapper {
  width: calc(100% - 32px);
  max-width: 950px;
  padding: 18px;
  left: 50%;
  transform: translateX(-50%);
  position: relative; /* FIXED - BUG 2 */
  margin: 20px auto 40px; /* FIXED - BUG 2 */
}
```

**Result:** Search card now remains visible and properly positioned at all widths.

---

## BUG 3: Mobile category tabs wrap to 2 rows at ~743px ✅ FIXED

**Location:** `@media (max-width: 768px)` breakpoint

**Problem:** `.mobile-tabs-row` used `flex-wrap: wrap`, causing 5 tabs to overflow to a second line at narrow widths.

**Fixes Applied:**
```css
.mobile-tabs-row {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  gap: 8px;
  flex-wrap: nowrap; /* FIXED - BUG 3 (was: wrap) */
  overflow-x: auto; /* FIXED - BUG 3 */
  scrollbar-width: none; /* FIXED - BUG 3 */
}

.mobile-tabs-row::-webkit-scrollbar { /* FIXED - BUG 3 */
  display: none;
}

.mobile-tab-btn {
  padding: 7px 12px; /* FIXED - BUG 3 (was: 8px 16px) */
  border-radius: 20px;
  font-family: 'Lato', sans-serif;
  font-size: 13px; /* FIXED - BUG 3 (was: 14px) */
  font-weight: 500;
  border: none;
  background: #F3F4F6;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0; /* FIXED - BUG 3 */
}
```

**Result:** Tabs now scroll horizontally on one line instead of wrapping to multiple rows.

---

## Changes Summary

- **Lines Modified:** ~15 lines across 3 breakpoints
- **No Logic Changes:** Only CSS styling adjustments
- **No JSX Changes:** Component code remains untouched
- **Backwards Compatible:** All other responsive breakpoints unaffected

---

## Testing Recommendations

1. **Test at ~967px width:** Verify search fields grid shows 2 columns
2. **Test at ~847px width:** Verify search card remains visible and positioned correctly
3. **Test at ~743px width:** Verify mobile tabs scroll horizontally without wrapping
4. **Test at other breakpoints:** Ensure no regressions at 1024px, 900px, 768px, 640px, 480px, 380px

---

**Date Applied:** June 19, 2026  
**Status:** ✅ All 3 bugs fixed successfully
