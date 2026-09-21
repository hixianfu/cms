# Task 5 Report: Solutions and Scenarios Shared Marketing Listing

## Implementation

Recomposed the existing shared marketing listing around the stable listing primitives from Tasks 1-4 without changing the public `MarketingListing`, `MarketingFilters`, or `MarketingCard` prop contracts.

- Solutions now render the immersive `ListingHero` with the filtered item count as a Hero stat.
- Scenarios now render the compact `ListingHero` without a Hero stat.
- Both listing kinds use `ListingPageShell`, `ListingSection`, `ListingResultHeader`, and `ListingEmptyState` while preserving the existing bilingual copy.
- `MarketingFilters` now adapts the existing `q`, `category`, and `industry` values to `ListingFilterPanel`; category and industry remain primary fields with no unused secondary controls.
- Active category and industry chips clear only their own key and preserve the other query values. Unknown category slugs remain visible as clearable chips instead of disappearing.
- Solution cards show available category and industry taxonomy plus up to two compact labels sourced from `customerPain` and `packagingNeeds`.
- Scenario cards show available category and industry taxonomy plus up to two named related products.
- Empty taxonomy and metadata rows are omitted, and missing covers use `ListingMediaPlaceholder` with the correct solution or scenario motif.
- Grids with one or two results expose `data-sparse="true"` and use two columns at wide breakpoints; larger sets retain the three-column layout.
- Empty results reset to the localized unfiltered route. Existing localized card detail paths are unchanged.
- No route, Strapi query, schema, or content changes were made.

## Files Changed

- `components/marketing/MarketingListing.tsx`
- `components/marketing/MarketingListing.test.tsx`
- `components/marketing/MarketingFilters.tsx`
- `components/marketing/MarketingFilters.test.tsx`
- `components/marketing/MarketingCard.tsx`
- `components/marketing/MarketingCard.test.tsx`
- `.superpowers/sdd/2026-09-20-listing-pages-ui-redesign/task-5-report.md`

## RED Evidence

Command:

```text
pnpm test -- components/marketing/MarketingListing.test.tsx components/marketing/MarketingFilters.test.tsx components/marketing/MarketingCard.test.tsx
```

The restricted sandbox first failed before Vitest because pnpm could not access its Windows short-path runtime (`C:\Users\ADMINI~1`). The approved elevated run reached Vitest. After adding explicit Testing Library cleanup required by this repository, the clean RED result was:

```text
Test Files  3 failed (3)
Tests       7 failed | 1 passed (8)
```

The seven failures were the expected missing behaviors:

- no shared immersive/compact Hero variants;
- no shared listing page shell;
- no active category or industry chips;
- no query-preserving chip clear URLs;
- no type-specific card metadata;
- no shared missing-media placeholder;
- no sparse-grid marker.

The one passing test confirmed the existing empty result already linked to the localized unfiltered route.

## GREEN Evidence

Focused verification after implementation:

```text
pnpm test -- components/marketing/MarketingListing.test.tsx components/marketing/MarketingFilters.test.tsx components/marketing/MarketingCard.test.tsx
Test Files  3 passed (3)
Tests       8 passed (8)
```

One intermediate run had seven passing tests and one assertion failure because `ListingHero` renders its stat as adjacent semantic `dd` and `dt` elements, making combined DOM text `1items`. The test was corrected to assert the visible value and label independently; production code was unchanged for that correction.

## Full Suite

```text
pnpm test
Test Files  41 passed (41)
Tests       102 passed (102)
```

Vitest continues to print the existing warning that `vitest.config.ts` uses ESM syntax while loaded as CommonJS.

## Static Checks

```text
pnpm exec eslint components/marketing
exit 0, no output

pnpm exec tsc --noEmit
exit 0, no output

git diff --check
exit 0
```

The first TypeScript run identified that the historical public marketing props use the wider content `Locale` type while shared listing primitives accept the validated `"zh" | "en"` type. The implementation now normalizes locale only at the internal shared-component boundary, preserving the public prop contract and route data flow. The next TypeScript run exited 0.

## Self-Review

- Confirmed all three exported component prop shapes remain unchanged.
- Confirmed routes still own Strapi fetching and pass the same `q`, `category`, and `industry` values.
- Confirmed category-chip clear URLs preserve `q` and `industry`; industry-chip clear URLs preserve `q` and `category`.
- Confirmed `URLSearchParams` safely encodes spaces and non-ASCII query values.
- Confirmed category and industry are the only primary select controls and no secondary filter disclosure is created.
- Confirmed solution Hero uses `immersive`/`solution`, scenario Hero uses `compact`/`scenario`, and only solutions receive a stat.
- Confirmed bilingual Hero, result, empty-state, filter, and CTA copy remains unchanged.
- Confirmed card detail and reset URLs remain localized.
- Confirmed solution metadata is limited to the two requested fields and scenario metadata is limited to two named products.
- Confirmed whitespace-only and unnamed metadata values do not create empty rows.
- Confirmed missing covers retain a stable 16:9 media region and render the shared placeholder.
- Confirmed one- and two-result grids use `data-sparse="true"`; empty results render no grid.
- Confirmed the modified marketing sources contain valid UTF-8 Chinese text and no replacement characters or common mojibake sequences.
- Mutation check: removing Hero variants/stat logic, shared placeholder rendering, query preservation, metadata limits, localized links, or sparse-grid attributes would fail the focused tests.

## Concerns

- Pnpm commands require the approved elevated execution path in this environment because the restricted sandbox blocks pnpm's Windows short-path lookup.
- The existing Vitest config-loader warning remains unchanged and is outside Task 5.
- Browser QA and production build remain deferred to the later integration/visual verification task in the approved implementation plan.
