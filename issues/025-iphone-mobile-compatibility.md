# FE-025: iPhone / Mobile Compatibility

**Type:** Improvement | **Priority:** High | **Effort:** Medium
**Related:** None

## TL;DR

The demo is not usable on iPhone (375px). The sidebar renders at full width on small screens, fixed-width panels overflow the viewport, and tables are unreadable. Make every page clean and functional on iPhone without touching the desktop UI.

## Current State

- **Sidebar** responsive classes are inverted: `w-56` (224px) on mobile, `md:w-14` on tablet, `lg:w-56` on desktop. Takes 60% of an iPhone screen
- **Layout** main content has `ml-14` which mismatches the 224px sidebar on mobile
- **ClientQuickView** uses `w-96` (384px) - wider than a 375px iPhone
- **KnowledgePanel** uses `w-[400px]` - exceeds 375px viewport
- **Templates table** uses `grid-cols-12` layout - extreme horizontal overflow on mobile
- **PatternGrid heatmap** has 180px fixed left padding - eats 48% of viewport
- **Multiple tables** (Playbook, ConstraintMap, Overview) have 4+ columns that compress to unreadable widths
- **ClientDetail** has 6 horizontal tabs that overflow without clear scrollability
- **Templates dialog** uses `max-w-2xl` (672px) - exceeds mobile viewport

## Expected Outcome

Every page renders cleanly on iPhone (375px) with no horizontal overflow, no content bleeding, no blocked elements. Desktop UI remains pixel-identical.

## Strict Guidelines - Zero Risk to Desktop UI

These rules are non-negotiable for every change in this issue:

### Rule 1: Mobile-first additions only
- ONLY add base (unprefixed) Tailwind classes or use the existing `useIsMobile()` hook for conditional renders
- NEVER remove or modify an existing `sm:`, `md:`, `lg:`, `xl:` class
- Desktop styles are defined by breakpoint-prefixed classes. If you don't touch them, desktop cannot change

### Rule 2: One component at a time
- Each file is a separate commit
- After each file change, visually verify at BOTH 375px AND 1440px in browser devtools
- If desktop looks different at all, revert immediately

### Rule 3: No cascading CSS changes
- Do not modify `index.css`, `tailwind.config.ts`, or any shared utility
- Do not add global styles or media queries
- All changes are scoped to individual component files

### Rule 4: No structural refactors
- Do not change component hierarchy, props, or data flow
- Do not rename files or move components
- Do not extract new components unless absolutely necessary for a mobile conditional render

### Rule 5: Preserve all existing functionality
- All click handlers, navigation, data fetching, and state management remain untouched
- All existing Tailwind classes on elements stay in place (you add alongside, never replace)
- No changes to any non-UI file (API, hooks other than use-mobile, contexts, types, data)

### Rule 6: Test checklist per component
Before marking any component done, confirm:
- [ ] No horizontal scroll on 375px viewport
- [ ] No text is cut off or unreadable
- [ ] All interactive elements are tappable (min 44px touch target)
- [ ] No overlap between elements
- [ ] Desktop 1440px is pixel-identical to before the change

## Files

### Must change
- `frontend/src/components/AppSidebar.tsx` - flip responsive classes, add hamburger toggle for mobile
- `frontend/src/components/Layout.tsx` - fix main content margin for mobile sidebar
- `frontend/src/components/ClientQuickView.tsx` - `w-96` to `w-full sm:w-96` or use sheet on mobile
- `frontend/src/components/knowledge/KnowledgePanel.tsx` - `w-[400px]` to responsive width
- `frontend/src/pages/Templates.tsx` - mobile card layout below `sm:` instead of grid-cols-12
- `frontend/src/components/PatternGrid.tsx` - reduce/hide 180px label column on mobile
- `frontend/src/pages/Playbook.tsx` - stack table rows into cards on mobile
- `frontend/src/pages/ClientDetail.tsx` - improve tab scrollability on mobile
- `frontend/src/components/client/ClientConstraintMapTab.tsx` - stack table rows on mobile
- `frontend/src/components/client/ClientOverviewTab.tsx` - fix `max-w-[250px]` and table layout on mobile

### May change
- `frontend/src/pages/Overview.tsx` - deployment table may need mobile card view
- `frontend/src/pages/ClientList.tsx` - metric cards `grid-cols-3` may need adjustment
- `frontend/src/pages/Knowledge.tsx` - gap spacing adjustment for mobile

### Must NOT change
- `frontend/src/index.css`
- `frontend/tailwind.config.ts`
- `frontend/src/App.tsx`
- Any file in `api/`, `data/`, `frontend/src/contexts/`, `frontend/src/hooks/` (except use-mobile if needed)
- Any file in `frontend/src/components/ui/` (shadcn primitives)

## Approach per component

1. **Sidebar + Layout** - hide sidebar on mobile, add fixed bottom nav or hamburger. Main content gets `ml-0` on mobile
2. **Panels (QuickView, KnowledgePanel)** - change fixed widths to `w-full max-w-[400px]` or full-screen sheet on mobile
3. **Tables (Templates, Playbook, ConstraintMap, Overview)** - use `useIsMobile()` to conditionally render stacked card layout below 768px. Keep table code intact, render cards alongside
4. **PatternGrid** - wrap in `overflow-x-auto` with reduced left padding on mobile
5. **ClientDetail tabs** - add scroll indicators or reduce padding on mobile
6. **Dialogs** - add `max-w-[calc(100vw-2rem)]` constraint

## Notes

- The existing `useIsMobile()` hook (768px breakpoint) is the right tool for conditional renders
- The shadcn `sidebar.tsx` has a built-in Sheet-based mobile sidebar, but AppSidebar doesn't use it. Easiest path is the custom hamburger approach rather than rewiring to shadcn's sidebar system
- PatternGrid heatmap is inherently wide data - horizontal scroll is acceptable here per user confirmation
- Every change must be verified at 375px AND 1440px before commit
