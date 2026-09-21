# Task 3 Report: Shared Listing Filters and Sidebar

## Implementation

Added shared listing search, filter, sidebar, and mobile drawer primitives without migrating any route or existing domain filter component.

- `ListingFilterDrawer` is the only Client Component. It owns open state, focuses the close button on open, listens for Escape only while open, restores focus to the trigger on close, and renders an `aria-modal` fixed-bottom dialog over a fixed viewport backdrop. It does not lock body scrolling.
- `ListingFilterPanel` exports `FilterOption`, `FilterField`, `ActiveFilter`, and `ListingFilterSearch`; it renders native GET forms, a desktop primary row, desktop native `<details>` for secondary fields, active-filter clear links, a reset link, and the complete form in the mobile drawer.
- `ListingSearchBar` renders a native GET search form and accepts route-owned preserved parameter names and values.
- `ListingSidebar` renders recursive taxonomy links in a desktop sticky index and the same navigation in the mobile drawer. Active entries expose `aria-current="page"`.
- All internal links pass through `localizedHref`; parameter names and clear/reset URL construction remain caller-owned.

## Files Changed

- `components/listing/ListingFilterDrawer.tsx`
- `components/listing/ListingFilterPanel.tsx`
- `components/listing/ListingFilters.test.tsx`
- `components/listing/ListingSearchBar.tsx`
- `components/listing/ListingSidebar.tsx`

## RED Evidence

Command:

```text
pnpm test -- components/listing/ListingFilters.test.tsx
```

Before implementation, the suite failed as expected:

```text
Failed to resolve import "./ListingFilterPanel" from "components/listing/ListingFilters.test.tsx"
Test Files  1 failed (1)
Tests  no tests
```

The same command inside the restricted sandbox could not start because pnpm was denied access to its protected Windows short-path runtime (`C:\Users\ADMINI~1`). Verification therefore used the approved elevated command path.

## GREEN Evidence

Focused test:

```text
pnpm test -- components/listing/ListingFilters.test.tsx
Test Files  1 passed (1)
Tests  4 passed (4)
```

Static checks:

```text
pnpm exec eslint components/listing
pnpm exec tsc --noEmit
```

Both exited 0 with no output.

## Full Suite

```text
pnpm test
Test Files  34 passed (34)
Tests  84 passed (84)
```

## Self-Review

- Confirmed the Task 1 and Task 2 files and APIs are untouched.
- Confirmed route-owned GET field names and literal clear/reset URLs are preserved instead of being rebuilt in shared client code.
- Confirmed focus moves to the close button, Escape closes the dialog, and focus returns to the trigger.
- Confirmed the drawer uses fixed viewport geometry, stays scrollable within the viewport, and does not mutate `document.body` styles.
- Confirmed the interactive client boundary is limited to the drawer; search, panel, and sidebar composition remain server-renderable with serializable props.
- Confirmed active chip URLs and localized recursive sidebar URLs are covered by behavior tests.
- Confirmed no route page or existing domain filter component was changed.

## Concerns

- Vitest prints the existing warning that `vitest.config.ts` uses ESM syntax while loading as CommonJS. It does not affect test success.
- Pnpm commands require the approved elevated execution path in this environment because the restricted sandbox blocks its Windows short-path lookup.

## Fix Round 1

Updated `components/listing/ListingFilterPanel.tsx` so removable active-filter chips and the “Clear all” link use `min-h-11`, meeting the 44px minimum touch target while preserving their existing styling. Added focused assertions in `components/listing/ListingFilters.test.tsx` that both links expose the `min-h-11` class.

RED command (before the implementation change):

```text
pnpm test -- components/listing/ListingFilters.test.tsx
```

Result: failed as expected; 1 test failed because the removable chip still had `min-h-9`.

GREEN and static checks:

```text
pnpm test -- components/listing/ListingFilters.test.tsx
Test Files  1 passed (1)
Tests  4 passed (4)

pnpm exec eslint components/listing
 exited 0 (no output)

pnpm exec tsc --noEmit
 exited 0 (no output)
```
