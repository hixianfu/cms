# Listing Pages UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the products, solutions, scenarios, cases, videos, blog, and FAQ listing pages into a coherent high-end minimal interface with restrained industrial-technology styling.

**Architecture:** Introduce a small `components/listing` presentation layer for shared page chrome, Heroes, result states, media fallbacks, and filter primitives. Keep data fetching and query construction in each route, evolve the existing marketing/case/video/FAQ components to consume the shared layer, and preserve page-specific card composition instead of forcing all content into one generic card.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-20-listing-pages-ui-redesign.md`

## Global Constraints

- Preserve existing Strapi schemas, content entries, data-fetching functions, SEO behavior, localized routes, and query-string filtering.
- Use deep navy for primary structure, teal for technology accents, and brand lime only for selected states, small highlights, and important actions.
- Products and solutions use immersive Heroes; scenarios, cases, videos, blog, and FAQ use compact Heroes.
- Products and blog retain desktop side category navigation; solutions, scenarios, cases, and videos use top filtering; FAQ uses search plus category chips.
- Mobile category navigation and multi-field filters use an accessible fixed-bottom drawer; desktop sidebars stop being sticky before they constrain content.
- Missing media must keep stable dimensions and render a shared branded placeholder.
- Respect `prefers-reduced-motion`, visible keyboard focus, semantic heading order, and practical 44px touch targets.
- Do not add a new UI, animation, state-management, or design-system dependency.
- Keep homepage Hero behavior unchanged and retain the sticky light header on every interior page.

## File Structure

Create these shared files:

- `components/listing/ListingPageShell.tsx`: shared background, content width, and vertical rhythm.
- `components/listing/ListingHero.tsx`: immersive/compact Hero variants and page motifs.
- `components/listing/ListingResultHeader.tsx`: section eyebrow, heading, and result count.
- `components/listing/ListingEmptyState.tsx`: standard empty-result message and reset link.
- `components/listing/ListingMediaPlaceholder.tsx`: stable brand fallback for missing media.
- `components/listing/ListingPageSkeleton.tsx`: stable Hero, filter, and card skeleton used by route loading states.
- `components/listing/ListingSidebar.tsx`: desktop sticky taxonomy navigation and mobile trigger.
- `components/listing/ListingFilterDrawer.tsx`: accessible client-side mobile bottom drawer.
- `components/listing/ListingFilterPanel.tsx`: shared search/select/filter-chip surface for top-filter pages.
- `components/listing/ListingSearchBar.tsx`: search surface used by products and blog.
- `components/listing/listing-copy.ts`: localized shared labels and item-count formatting.
- focused test files beside each shared component family.

Modify these existing files:

- `app/globals.css`: listing tokens, surfaces, grids, focus, placeholder, and reduced-motion styles.
- `app/[locale]/products/page.tsx`: immersive Hero, shared sidebar/search/results, sparse product grid.
- `app/[locale]/blog/page.tsx`: compact Hero, shared sidebar/search/results, editorial featured article.
- `components/marketing/MarketingListing.tsx`: shared shell/Hero/results and sparse grid behavior.
- `components/marketing/MarketingFilters.tsx`: shared top filter panel and active chips.
- `components/marketing/MarketingCard.tsx`: distinct solution/scenario compositions.
- `app/[locale]/cases/page.tsx`, `components/cases/CaseFilters.tsx`, `components/cases/CaseCard.tsx`: compact Hero, progressive filters, editorial card.
- `app/[locale]/videos/page.tsx`, `components/videos/VideoFilters.tsx`, `components/videos/VideoCard.tsx`: compact Hero, shared filters, stronger playback card.
- `app/[locale]/faq/page.tsx`, `components/faq/FaqFilters.tsx`, `components/faq/FaqList.tsx`: full-width shell, search/chips, accessible accordion.
- `components/layout/SiteHeader.test.tsx`: regression coverage for inner-page sticky header behavior.
- `app/[locale]/{products,solutions,scenarios,cases,videos,blog,faq}/loading.tsx`: shared stable loading treatment.

---

### Task 1: Shared visual foundation and page shell

**Files:**
- Create: `components/listing/ListingPageShell.tsx`
- Create: `components/listing/ListingResultHeader.tsx`
- Create: `components/listing/ListingEmptyState.tsx`
- Create: `components/listing/ListingMediaPlaceholder.tsx`
- Create: `components/listing/ListingPageSkeleton.tsx`
- Create: `components/listing/listing-copy.ts`
- Create: `components/listing/ListingFoundation.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `ListingPageShell({ children, className? })`, `ListingSection({ children, className? })`.
- Produces: `ListingResultHeader({ eyebrow, title, count, countLabel })`.
- Produces: `ListingEmptyState({ message, resetHref, resetLabel })`.
- Produces: `ListingMediaPlaceholder({ motif, label?, className? })`, where `motif` is `"product" | "solution" | "scenario" | "case" | "video" | "article"`.
- Produces: `ListingPageSkeleton({ variant, sidebar? })`, where `variant` is `"immersive" | "compact"`.
- Produces: `formatListingCount(locale, count, singular, plural?)`.

- [ ] **Step 1: Write the shared-foundation tests**

Create `components/listing/ListingFoundation.test.tsx` with explicit checks for semantic regions, count text, reset links, and decorative fallback behavior:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingEmptyState } from "./ListingEmptyState";
import { ListingMediaPlaceholder } from "./ListingMediaPlaceholder";
import { ListingPageShell } from "./ListingPageShell";
import { ListingPageSkeleton } from "./ListingPageSkeleton";
import { ListingResultHeader } from "./ListingResultHeader";

describe("listing foundations", () => {
  it("renders a shared page shell and result heading", () => {
    render(<ListingPageShell><ListingResultHeader eyebrow="All products" title="Explore products" count={2} countLabel="products" /></ListingPageShell>);
    expect(screen.getByRole("main")).toHaveClass("listing-page");
    expect(screen.getByRole("heading", { level: 2, name: "Explore products" })).toBeInTheDocument();
    expect(screen.getByText("2 products")).toBeInTheDocument();
  });

  it("renders a reset action and hides decorative media from assistive technology", () => {
    render(<><ListingEmptyState message="No matches" resetHref="/en/products" resetLabel="View all" /><ListingMediaPlaceholder motif="product" /></>);
    expect(screen.getByRole("link", { name: "View all" })).toHaveAttribute("href", "/en/products");
    expect(screen.getByTestId("listing-media-placeholder")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps loading layout dimensions stable", () => {
    render(<ListingPageSkeleton variant="compact" sidebar />);
    expect(screen.getByTestId("listing-page-skeleton")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByTestId("listing-card-skeleton")).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run: `pnpm test -- components/listing/ListingFoundation.test.tsx`

Expected: FAIL because the shared listing modules do not exist.

- [ ] **Step 3: Implement the shared foundations**

Implement the components with these exact public shapes. `ListingPageShell` owns `<main className="listing-page">`; `ListingSection` owns the shared `max-w-7xl` inner width. `ListingResultHeader` uses an `h2`, `ListingMediaPlaceholder` is decorative, and `ListingPageSkeleton` uses fixed aspect ratios rather than content-dependent heights:

```tsx
export function ListingResultHeader({ eyebrow, title, count, countLabel }: { eyebrow: string; title: string; count: number; countLabel: string }) {
  return <div className="listing-result-header"><div><p className="listing-eyebrow">{eyebrow}</p><h2>{title}</h2></div><p className="listing-count" aria-live="polite">{count} {countLabel}</p></div>;
}

export function ListingPageSkeleton({ variant, sidebar = false }: { variant: "immersive" | "compact"; sidebar?: boolean }) {
  return <main className="listing-page" data-testid="listing-page-skeleton" aria-busy="true" aria-label="Loading content"><div className={`listing-hero-skeleton listing-hero-skeleton--${variant}`} /><div className={sidebar ? "listing-loading-grid listing-loading-grid--sidebar" : "listing-loading-grid"}>{sidebar ? <div className="listing-sidebar-skeleton" /> : null}<div className="listing-card-skeleton-grid">{Array.from({ length: 4 }, (_, index) => <div key={index} data-testid="listing-card-skeleton" className="listing-card-skeleton" />)}</div></div></main>;
}
```

Add CSS component classes for `.listing-page`, `.listing-section`, `.listing-result-header`, `.listing-eyebrow`, `.listing-count`, `.listing-empty`, `.listing-media-placeholder`, `.listing-card`, and `.listing-card-media`. Use the approved brand variables, pale blue-gray section gradients, thin borders, restrained shadows, and `focus-visible` rings. Add hover transforms only inside `@media (hover: hover)` and rely on the existing reduced-motion media query to suppress transitions.

- [ ] **Step 4: Run foundation tests, lint, and type checking**

Run: `pnpm test -- components/listing/ListingFoundation.test.tsx`

Run: `pnpm exec eslint components/listing app/globals.css`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit the visual foundation**

```bash
git add app/globals.css components/listing
git commit -m "feat: add shared listing page foundation"
```

### Task 2: Hybrid listing Hero system

**Files:**
- Create: `components/listing/ListingHero.tsx`
- Create: `components/listing/ListingHero.test.tsx`

**Interfaces:**
- Consumes: `ListingSection` from Task 1.
- Produces: `ListingHero({ locale, variant, motif, eyebrow, title, description, stat? })`.
- `variant`: `"immersive" | "compact"`.
- `motif`: `"product" | "solution" | "scenario" | "case" | "video" | "article" | "faq"`.
- `stat`: optional `{ value: string | number; label: string }`.

- [ ] **Step 1: Write Hero variant tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingHero } from "./ListingHero";

describe("ListingHero", () => {
  it("renders an immersive product hero with localized breadcrumb", () => {
    render(<ListingHero locale="en" variant="immersive" motif="product" eyebrow="Catalogue" title="Products" description="Built for the real world" stat={{ value: 2, label: "products" }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("Home");
    expect(screen.getByTestId("listing-hero")).toHaveAttribute("data-variant", "immersive");
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("marks the compact decorative motif as hidden", () => {
    render(<ListingHero locale="zh" variant="compact" motif="faq" eyebrow="FAQ" title="常见问题" description="快速找到答案" />);
    expect(screen.getByTestId("listing-hero-motif")).toHaveAttribute("aria-hidden", "true");
  });
});
```

- [ ] **Step 2: Run the Hero test and verify it fails**

Run: `pnpm test -- components/listing/ListingHero.test.tsx`

Expected: FAIL because `ListingHero` does not exist.

- [ ] **Step 3: Implement the Hero component**

Render a semantic breadcrumb link to `localizedHref(locale, "/")`, an `h1`, description, optional statistic, and a decorative motif. Use `data-variant` and `data-motif` attributes to keep styling explicit. Immersive layout uses `min-h-[clamp(30rem,58svh,44rem)]`; compact layout uses `min-h-[clamp(19rem,36vw,26rem)]`. Keep decoration as CSS spans/SVG paths with `aria-hidden="true"` and no remote assets.

- [ ] **Step 4: Run Hero tests and static checks**

Run: `pnpm test -- components/listing/ListingHero.test.tsx components/listing/ListingFoundation.test.tsx`

Run: `pnpm exec eslint components/listing`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit the Hero system**

```bash
git add components/listing
git commit -m "feat: add hybrid listing hero system"
```

### Task 3: Shared sidebar, search, filter panel, and mobile drawer

**Files:**
- Create: `components/listing/ListingFilterDrawer.tsx`
- Create: `components/listing/ListingFilterPanel.tsx`
- Create: `components/listing/ListingSearchBar.tsx`
- Create: `components/listing/ListingSidebar.tsx`
- Create: `components/listing/ListingFilters.test.tsx`

**Interfaces:**
- Produces: `FilterOption = { value: string; label: string }`.
- Produces: `FilterField = { name: string; label: string; value?: string; allLabel: string; options: FilterOption[] }`.
- Produces: `ActiveFilter = { name: string; label: string; clearHref: string }`.
- Produces: `ListingFilterPanel({ locale, search, primaryFields, secondaryFields?, activeFilters, resetHref })`.
- Produces: `ListingSearchBar({ locale, name, value, label, placeholder, preserved?, clearHref? })`.
- Produces: `ListingSidebar({ locale, label, allItem, items })`, with items `{ href, label, active, children? }`.
- Produces: `ListingFilterDrawer({ locale, title, children })` client component with dialog semantics.

- [ ] **Step 1: Write interaction and accessibility tests**

Use Testing Library and `userEvent` to verify that the mobile trigger opens the drawer, moves focus to its close button, Escape closes it and restores focus to the trigger, selected chips link to their exact clear URL, and sidebar links expose `aria-current="page"`:

```tsx
it("opens and closes the mobile filter drawer", async () => {
  const user = userEvent.setup();
  render(<ListingFilterDrawer locale="en" title="Filters"><label>Category<select><option>All</option></select></label></ListingFilterDrawer>);
  const trigger = screen.getByRole("button", { name: "Open filters" });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Close filters" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: Run the filter tests and verify they fail**

Run: `pnpm test -- components/listing/ListingFilters.test.tsx`

Expected: FAIL because the filter components do not exist.

- [ ] **Step 3: Implement the filter primitives**

`ListingFilterDrawer` must use `"use client"`, internal boolean state, trigger and close-button refs, an Escape key listener active only while open, initial focus on the close button, focus restoration to the trigger, a fixed backdrop, `role="dialog"`, `aria-modal="true"`, and a fixed bottom sheet. Locking body scroll is not required; the backdrop and sheet must remain inside the viewport.

`ListingFilterPanel` renders search and primary fields on the first row, secondary fields in a native `<details>` block on desktop, active filters as removable link chips, and the same complete form inside `ListingFilterDrawer` below the desktop breakpoint. Preserve the current GET parameter names and use submit buttons rather than client-side query mutation.

`ListingSidebar` renders the full taxonomy on desktop and the same links inside `ListingFilterDrawer` on mobile. Active links use `aria-current="page"`.

- [ ] **Step 4: Run filter tests and regression checks**

Run: `pnpm test -- components/listing/ListingFilters.test.tsx`

Run: `pnpm exec eslint components/listing`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit the filter system**

```bash
git add components/listing
git commit -m "feat: add responsive listing filters"
```

### Task 4: Products and blog sidebar listings

**Files:**
- Create: `components/products/ProductListingCard.tsx`
- Create: `components/products/ProductListingCard.test.tsx`
- Create: `components/blog/ArticleListingCard.tsx`
- Create: `components/blog/ArticleListingCard.test.tsx`
- Modify: `app/[locale]/products/page.tsx`
- Modify: `app/[locale]/blog/page.tsx`

**Interfaces:**
- Consumes: all shared listing primitives from Tasks 1-3.
- Produces: `ProductListingCard({ product, locale, featured? })`.
- Produces: `ArticleListingCard({ article, locale, featured? })`.
- Route query parameters remain `category` and `search`.

- [ ] **Step 1: Write product and article card tests**

Verify media alt text, localized URLs, featured styling, metadata, and placeholder behavior:

```tsx
it("renders a featured product and a stable missing-media fallback", () => {
  const { rerender } = render(<ProductListingCard locale="en" featured product={{ id: 1, slug: "air", name: "Air system", summary: "Protective packaging", cover: { url: "/air.jpg", alternativeText: "Air system" } }} />);
  expect(screen.getByRole("link", { name: /Air system/ })).toHaveAttribute("href", "/en/products/air");
  expect(screen.getByRole("article")).toHaveAttribute("data-featured", "true");
  rerender(<ProductListingCard locale="en" product={{ id: 2, slug: "paper", name: "Paper system" }} />);
  expect(screen.getByTestId("listing-media-placeholder")).toBeInTheDocument();
});
```

For articles, verify formatted date, category, localized detail URL, and `featured` treatment.

- [ ] **Step 2: Run card tests and verify they fail**

Run: `pnpm test -- components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx`

Expected: FAIL because the new card components do not exist.

- [ ] **Step 3: Implement the two card families**

Product cards use a 4:3 media area, category when available, summary, and detail CTA. Article cards use 16:9 media, category, date, description, and read CTA. A featured item uses `data-featured="true"` and responsive horizontal layout. Both use `ListingMediaPlaceholder` when cover media is absent.

- [ ] **Step 4: Recompose products and blog pages**

Replace page-local Hero, sidebar, search, result header, empty state, and card markup with shared components. Products use `ListingHero variant="immersive" motif="product"`; blog uses `variant="compact" motif="article"`. Preserve existing query construction and category-label behavior.

For sparse results, set the first card as featured only when `items.length <= 2`; for blog, set the first article as featured whenever no search or category filter is active. Use a two-column content grid after the featured article so two records do not leave a three-column gap.

- [ ] **Step 5: Run focused and existing tests**

Run: `pnpm test -- components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx components/products/ProductImageGallery.test.tsx`

Run: `pnpm exec eslint components/products components/blog 'app/[locale]/products/page.tsx' 'app/[locale]/blog/page.tsx'`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 6: Commit products and blog**

```bash
git add app/[locale]/products/page.tsx app/[locale]/blog/page.tsx components/products/ProductListingCard.tsx components/products/ProductListingCard.test.tsx components/blog
git commit -m "feat: redesign product and blog listings"
```

### Task 5: Solutions and scenarios shared marketing listing

**Files:**
- Modify: `components/marketing/MarketingListing.tsx`
- Modify: `components/marketing/MarketingFilters.tsx`
- Modify: `components/marketing/MarketingCard.tsx`
- Create: `components/marketing/MarketingListing.test.tsx`
- Create: `components/marketing/MarketingFilters.test.tsx`
- Create: `components/marketing/MarketingCard.test.tsx`

**Interfaces:**
- Consumes: `ListingHero`, `ListingFilterPanel`, `ListingResultHeader`, `ListingEmptyState`, `ListingMediaPlaceholder`.
- Keeps existing public `MarketingListing`, `MarketingFilters`, and `MarketingCard` props so route files do not require data-flow changes.

- [ ] **Step 1: Write marketing listing tests**

Cover these exact behaviors:

- solutions render an immersive Hero and solution-specific CTA;
- scenarios render a compact Hero and scenario-specific CTA;
- category and industry values appear as active clearable chips;
- absent covers render `ListingMediaPlaceholder`;
- one or two results use `data-sparse="true"` on the grid;
- empty results link back to the localized unfiltered route.

- [ ] **Step 2: Run marketing tests and verify the new expectations fail**

Run: `pnpm test -- components/marketing/MarketingListing.test.tsx components/marketing/MarketingFilters.test.tsx components/marketing/MarketingCard.test.tsx`

Expected: FAIL because current markup has one Hero treatment, no active chips, and no shared placeholder.

- [ ] **Step 3: Migrate marketing filters**

Map existing `q`, `category`, and `industry` values into `ListingFilterPanel`. Generate clear links by rebuilding the query string without the selected key while preserving the other two keys. Put category and industry in `primaryFields`; do not create unused secondary controls.

- [ ] **Step 4: Differentiate solution and scenario cards**

Solutions show category/industry, title, summary, and up to two short labels derived from `customerPain` and `packagingNeeds` when present. Scenarios show category/industry, title, summary, and up to two related product names. Never render an empty metadata row.

- [ ] **Step 5: Recompose MarketingListing**

Use the shared page shell and result components. Set solution Hero to immersive and scenario Hero to compact. Add the item count as Hero stat for solutions only. Preserve existing copy and localized detail paths.

- [ ] **Step 6: Run marketing tests and static checks**

Run: `pnpm test -- components/marketing/MarketingListing.test.tsx components/marketing/MarketingFilters.test.tsx components/marketing/MarketingCard.test.tsx`

Run: `pnpm exec eslint components/marketing`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 7: Commit marketing listings**

```bash
git add components/marketing
git commit -m "feat: redesign solution and scenario listings"
```

### Task 6: Cases and videos with progressive filtering

**Files:**
- Modify: `app/[locale]/cases/page.tsx`
- Modify: `components/cases/CaseFilters.tsx`
- Modify: `components/cases/CaseCard.tsx`
- Create: `components/cases/CaseListing.test.tsx`
- Modify: `app/[locale]/videos/page.tsx`
- Modify: `components/videos/VideoFilters.tsx`
- Modify: `components/videos/VideoCard.tsx`
- Create: `components/videos/VideoListing.test.tsx`

**Interfaces:**
- Consumes: shared compact Hero, filter panel, result heading, empty state, and media placeholder.
- Keeps existing page query parameters: cases use `q`, `category`, `industry`, `product`, `scenario`; videos use `q`, `category`, `product`.
- Keeps current `CaseCard`, `CaseFilters`, `VideoCard`, and `VideoFilters` public props.

- [ ] **Step 1: Write case and video tests**

Case tests verify industry/category metadata, optional result excerpt, localized route, missing-media fallback, and product/scenario fields inside the secondary filter disclosure. Video tests verify the 16:9 media region, centered accessible play label, category badge, localized route, and missing-media fallback.

- [ ] **Step 2: Run the listing tests and verify they fail**

Run: `pnpm test -- components/cases/CaseListing.test.tsx components/videos/VideoListing.test.tsx`

Expected: FAIL because current cards and filters do not expose the redesigned semantics.

- [ ] **Step 3: Redesign cases**

Move category and industry into primary fields; move product and scenario into `secondaryFields`. Map every active value to a clear chip with a URL that preserves the remaining values. Case cards use `results` as a short outcome excerpt when present, otherwise omit that block. The first card receives featured styling only when the unfiltered result set has one item.

Recompose the route with `ListingHero variant="compact" motif="case"`, shared results, and shared empty state. Preserve the existing Promise-based data fetch and query string.

- [ ] **Step 4: Redesign videos**

Use category as the primary filter and product as the secondary filter. Add a visually centered play circle with an `aria-label` equivalent to "Watch video" or its Chinese translation. Keep the category and description, omit nonexistent duration because the current content type has no duration field, and render the shared media placeholder when no cover exists.

Recompose the route with `ListingHero variant="compact" motif="video"`, shared results, and shared empty state.

- [ ] **Step 5: Run case/video tests and static checks**

Run: `pnpm test -- components/cases/CaseListing.test.tsx components/videos/VideoListing.test.tsx`

Run: `pnpm exec eslint components/cases components/videos 'app/[locale]/cases/page.tsx' 'app/[locale]/videos/page.tsx'`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 6: Commit cases and videos**

```bash
git add app/[locale]/cases/page.tsx app/[locale]/videos/page.tsx components/cases components/videos
git commit -m "feat: redesign case and video listings"
```

### Task 7: FAQ search, category chips, and accordion

**Files:**
- Modify: `app/[locale]/faq/page.tsx`
- Modify: `components/faq/FaqFilters.tsx`
- Modify: `components/faq/FaqList.tsx`
- Create: `components/faq/FaqListing.test.tsx`

**Interfaces:**
- Consumes: compact Hero, filter drawer, search field, result heading, and empty state.
- Keeps existing `FaqFilters` and `FaqList` input props.
- Keeps query parameters `q`, `category`, `product`, and `solution`.

- [ ] **Step 1: Write FAQ behavior tests**

Render `FaqFilters` with two categories and assert that category links include the preserved search query. Render `FaqList` and verify each question is a native button-like summary, opening one item exposes the answer, category text remains visible, and Markdown links remain usable. Verify the page-level content width no longer uses `max-w-5xl` by testing the shared shell rather than matching generated CSS.

- [ ] **Step 2: Run the FAQ test and verify it fails**

Run: `pnpm test -- components/faq/FaqListing.test.tsx`

Expected: FAIL because current filters use select-only category navigation and current list lacks the redesigned structure.

- [ ] **Step 3: Redesign FAQ filters**

Render the search field first, followed by category chip links. Each category chip URL preserves `q`, `product`, and `solution`; the all-category chip omits only `category`. Put product and solution selects inside `ListingFilterDrawer` and expose an active filter count on the trigger. Keep the filter method as GET.

- [ ] **Step 4: Redesign the FAQ accordion**

Keep native `<details>`/`<summary>` semantics. Add a numbered question marker, clear plus-to-close icon transition, category badge, Markdown content container, and optional related product/solution links only when the references contain valid slugs. Do not force single-item-open behavior because native independent disclosure is accessible and does not require additional state.

- [ ] **Step 5: Recompose the FAQ route**

Use `ListingPageShell`, `ListingHero variant="compact" motif="faq"`, full shared content width, `ListingResultHeader`, and `ListingEmptyState`. Preserve all existing fetches and filter query generation.

- [ ] **Step 6: Run FAQ tests and static checks**

Run: `pnpm test -- components/faq/FaqListing.test.tsx components/content/RichTextRenderer.test.tsx`

Run: `pnpm exec eslint components/faq 'app/[locale]/faq/page.tsx'`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 7: Commit FAQ**

```bash
git add app/[locale]/faq/page.tsx components/faq
git commit -m "feat: redesign faq listing"
```

### Task 8: Header regression, full verification, and browser QA

**Files:**
- Modify: `components/layout/SiteHeader.test.tsx`
- Create: `app/[locale]/products/loading.tsx`
- Create: `app/[locale]/solutions/loading.tsx`
- Create: `app/[locale]/scenarios/loading.tsx`
- Create: `app/[locale]/cases/loading.tsx`
- Create: `app/[locale]/videos/loading.tsx`
- Create: `app/[locale]/blog/loading.tsx`
- Create: `app/[locale]/faq/loading.tsx`
- Modify only if verification exposes a defect: files already listed in Tasks 1-7.

**Interfaces:**
- Verifies all shared and page-specific interfaces produced by Tasks 1-7.

- [ ] **Step 1: Strengthen the interior-header regression test**

Parameterize the existing inner-page test across all seven localized paths:

```tsx
it.each(["/zh/products", "/zh/solutions", "/zh/scenarios", "/zh/cases", "/zh/videos", "/zh/blog", "/zh/faq"])("keeps the sticky light header on %s", (route) => {
  pathname = route;
  render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);
  expect(screen.getByRole("banner")).toHaveClass("sticky", "bg-white/95");
  expect(screen.getByRole("banner")).not.toHaveClass("absolute");
  cleanup();
});
```

- [ ] **Step 2: Add stable route loading states**

Add route loading files that delegate to the shared skeleton. Products and solutions use the immersive variant; products and blog pass `sidebar`; all others use compact. Each file remains intentionally small:

```tsx
import { ListingPageSkeleton } from "@/components/listing/ListingPageSkeleton";

export default function Loading() {
  return <ListingPageSkeleton variant="compact" />;
}
```

Use the corresponding approved variant and sidebar flag for each route, then run the shared foundation test once more.

- [ ] **Step 3: Run the complete automated suite**

Run: `pnpm test`

Run: `pnpm run lint`

Run: `pnpm exec tsc --noEmit`

Run: `pnpm run build`

Expected: all commands exit 0. Do not treat warnings as acceptable if they identify accessibility errors, invalid React markup, missing keys, or image sizing issues.

- [ ] **Step 4: Perform desktop browser QA**

At a viewport near 1440x1000, inspect all seven Chinese URLs. Verify:

- sticky header remains visible after scrolling;
- products and solutions use immersive Heroes;
- the other five pages use compact Heroes;
- products/blog sidebars align with their content and remain sticky without covering the footer;
- top filters, active chips, clear links, result counts, cards, and empty states align to one grid;
- sparse grids use intentional wide compositions;
- no horizontal overflow or broken Chinese text appears.

- [ ] **Step 5: Perform tablet and mobile browser QA**

At 768x1024 and 390x844, inspect all seven Chinese routes and `/en/products`. Verify one/two-column transitions, compact mobile Heroes, scrollable chips, fixed-bottom filter drawers, 44px touch targets, drawer Escape/close behavior, long English labels, and no background content obstruction.

- [ ] **Step 6: Check reduced motion and missing-media states**

Emulate `prefers-reduced-motion: reduce` and verify card/media transforms no longer animate. Use current entries without covers, or temporarily disable an image URL in browser developer tools, and verify placeholder dimensions remain stable. Do not change repository content to manufacture this state.

- [ ] **Step 7: Review final diff and commit verification fixes**

Run: `git diff --check`

Run: `git status --short`

If verification required code corrections, commit only those corrections:

```bash
git add app components
git commit -m "fix: polish responsive listing layouts"
```

If no corrections were needed, leave the existing task commits unchanged.
