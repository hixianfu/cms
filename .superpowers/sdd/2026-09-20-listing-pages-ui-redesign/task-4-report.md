# Task 4 Report: Products and Blog Sidebar Listings

## Implementation

Added page-specific product and article listing cards and recomposed only the products and blog listing routes around the shared listing primitives from Tasks 1-3.

- `ProductListingCard` renders a stable 4:3 media region, localized product URL and CTA, translated product category when available, optional summary, shared missing-media placeholder, and responsive featured layout.
- `ArticleListingCard` renders a stable 16:9 media region, localized article URL and CTA, preserved article-category labels, localized publication date or fallback copy, optional description, shared missing-media placeholder, and responsive featured layout.
- Products now use the immersive product Hero, shared recursive sidebar, shared search, result header, empty state, and product cards. The first product is featured only when the result count is one or two.
- Blog now uses the compact article Hero, shared sidebar, shared search, result header, empty state, and article cards. The first article is featured only when neither `category` nor a non-empty `search` is active; remaining articles use a two-column grid.
- Existing metadata generation, Strapi fetches, filter query construction, `category`/`search` parameters, localized links, category filtering, labels, copy, and reset destinations remain route-owned and preserved.
- The original UTF-8 BOM on `app/[locale]/products/page.tsx` was retained; Chinese source copy was inspected for mojibake.

## Files Changed

- `app/[locale]/products/page.tsx`
- `app/[locale]/blog/page.tsx`
- `components/products/ProductListingCard.tsx`
- `components/products/ProductListingCard.test.tsx`
- `components/blog/ArticleListingCard.tsx`
- `components/blog/ArticleListingCard.test.tsx`
- `.superpowers/sdd/2026-09-20-listing-pages-ui-redesign/task-4-report.md`

## RED Evidence

Command:

```text
pnpm test -- components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx
```

The restricted sandbox first failed before Vitest because pnpm could not access its Windows short-path runtime (`C:\Users\ADMINI~1`). The approved elevated run then reached Vitest and failed for the expected feature-missing reason:

```text
FAIL components/blog/ArticleListingCard.test.tsx
Failed to resolve import "./ArticleListingCard"

FAIL components/products/ProductListingCard.test.tsx
Failed to resolve import "./ProductListingCard"

Test Files  2 failed (2)
Tests       no tests
```

## GREEN Evidence

Initial focused card verification after implementation:

```text
pnpm test -- components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx
Test Files  2 passed (2)
Tests       4 passed (4)
```

The first implementation run also exposed that this repository does not automatically clean Testing Library DOM between tests. Assertions were scoped to their render containers; production behavior was unchanged.

Focused regression verification:

```text
pnpm test -- components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx components/products/ProductImageGallery.test.tsx
Test Files  4 passed (4)
Tests       8 passed (8)
```

Task-scoped static checks:

```text
pnpm exec eslint components/products components/blog 'app/[locale]/products/page.tsx' 'app/[locale]/blog/page.tsx'
exit 0, no output

pnpm exec tsc --noEmit
exit 0, no output
```

## Full Suite

```text
pnpm test
Test Files  36 passed (36)
Tests       88 passed (88)
```

Vitest continues to print the existing warning that `vitest.config.ts` uses ESM syntax while loaded as CommonJS.

## Additional Verification

```text
pnpm exec eslint --ignore-pattern '.worktrees/**' .
exit 0, 0 errors, 7 pre-existing warnings outside Task 4

git diff --check
exit 0
```

The literal `pnpm run lint` command traverses `.worktrees/homepage-hero-media/.next` and fails on 48 generated Next.js type errors. That nested worktree and its generated output are unrelated to Task 4 and were not modified.

## Self-Review

- Confirmed only the two requested routes were recomposed and only the two requested card families were added.
- Confirmed product filters still combine descendant category slugs with the same name/summary search expression.
- Confirmed blog filters still use the selected article-category slug and title search expression.
- Confirmed search forms preserve `category`, and clear/reset URLs retain their previous behavior.
- Confirmed product sidebar children and article category allow-list behavior remain intact.
- Confirmed every card detail link is localized and media alt text prefers Strapi alternative text with title/name fallback.
- Confirmed absent covers render `ListingMediaPlaceholder` inside fixed-ratio media regions.
- Confirmed only the first product is featured for result counts of one or two; larger product sets have no featured card.
- Confirmed blog featuring requires both filters to be inactive and that the post-feature grid is two columns.
- Confirmed source copy contains no replacement-character or common mojibake sequences and the products route retains its original UTF-8 BOM.
- Mutation check: removing localized URL construction, cover fallback, featured flag/layout, category/date metadata, or placeholder rendering would fail focused tests.

## Concerns

- `pnpm run lint` is not clean because ESLint includes unrelated generated files under `.worktrees/homepage-hero-media/.next`. The active worktree passes ESLint with that nested worktree excluded; seven existing warnings remain outside Task 4.
- Pnpm commands require the approved elevated execution path in this environment because the restricted sandbox blocks pnpm's Windows short-path lookup.
- Browser QA and production build are deferred to Task 8 by the approved implementation plan.

## Fix Round 1

Added direct async route composition tests with Strapi queries mocked and the real listing/card components rendered.

- Product route coverage now asserts the immersive Hero and the sparse featured rule for result counts 1, 2, and 3.
- Blog route coverage now asserts the compact Hero, unfiltered first-article feature treatment, disabled featuring for active category and non-empty search filters, and a two-column grid containing only the post-feature articles.
- Featured card tests now require both `md:grid` and `md:grid-cols-2`.
- Missing-media tests now require the product 4:3 and article 16:9 wrapper classes.
- Added `data-testid="article-listing-grid"` to the real blog remainder grid as the minimal stable route-level observation point.

Files added or updated:

- `app/[locale]/products/page.test.tsx`
- `app/[locale]/blog/page.test.tsx`
- `app/[locale]/blog/page.tsx`
- `components/products/ProductListingCard.test.tsx`
- `components/blog/ArticleListingCard.test.tsx`

RED command:

```text
pnpm test -- 'app/[locale]/products/page.test.tsx' 'app/[locale]/blog/page.test.tsx' components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx
```

Result before the production observation hook was added:

```text
Test Files  1 failed | 3 passed (4)
Tests       3 failed | 7 passed (10)
```

All three failures were the expected inability to locate `article-listing-grid`; the new product count/Hero assertions and strengthened card assertions executed successfully.

GREEN command:

```text
pnpm test -- 'app/[locale]/products/page.test.tsx' 'app/[locale]/blog/page.test.tsx' components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx
Test Files  4 passed (4)
Tests       10 passed (10)
```

Static checks:

```text
pnpm exec eslint 'app/[locale]/products/page.tsx' 'app/[locale]/products/page.test.tsx' 'app/[locale]/blog/page.tsx' 'app/[locale]/blog/page.test.tsx' components/products/ProductListingCard.test.tsx components/blog/ArticleListingCard.test.tsx
exit 0, no output

pnpm exec tsc --noEmit
exit 0, no output
```

Fix-round self-review:

- Query functions are the only application dependencies mocked; Heroes, sidebars, cards, featured attributes, and layout classes are rendered from production components.
- The product test would fail if the `<= 2` threshold moved to include three items or if the first item stopped receiving `featured`.
- The blog tests would fail if category/search filtering no longer disabled featuring, if the featured article remained inside the remainder grid, or if the grid changed from two columns.
- Hero assertions would fail if products stopped using `immersive` or blog stopped using `compact`.
- Card assertions would fail if responsive grid display or fixed-ratio missing-media wrappers were removed.
