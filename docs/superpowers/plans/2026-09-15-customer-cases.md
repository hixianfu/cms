# Customer Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build localized customer case-study listing and detail pages with search, filters, relationships, media, and inquiry CTA.

**Architecture:** Reuse Strapi's existing `case-study` collection and `contentLocale` convention. Add typed query functions in the existing Strapi query layer, then compose server-rendered App Router pages and small presentational/filter components using the existing Tailwind and content utilities.

**Tech Stack:** Next.js App Router, TypeScript, Strapi REST API, Tailwind CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-15-customer-cases-design.md`

## Global Constraints

- Preserve existing product, solution, scenario, article, and inquiry behavior.
- Keep Chinese and English content selected by `contentLocale` and locale-aware UI copy.
- Use `apply_patch` for source edits and existing project patterns for media URLs, links, metadata, and cards.
- Do not delete or overwrite existing Strapi data.

---

### Task 1: Add Case Study Query Contracts

**Files:**
- Modify: `lib/strapi/queries.ts`
- Modify: `types/content.ts`
- Test: `lib/strapi/case-study-queries.test.ts`

**Interfaces:**
- Produces `getCaseStudies(locale?: Locale, query?: string): Promise<CaseStudy[]>`.
- Produces `getCaseStudyBySlug(slug: string, locale?: Locale): Promise<CaseStudy | null>`.

- [x] **Step 1: Write failing tests** for query URL construction and response unwrapping, asserting locale, search, relation filters, and explicit populate parameters.
- [x] **Step 2: Run the focused test** with `pnpm vitest run lib/strapi/case-study-queries.test.ts`; confirm it fails because the functions are absent.
- [x] **Step 3: Implement types and query functions** using the existing `collectionParams`, `unwrap`, `strapiFetch`, cache tags, and explicit media/relation populate.
- [x] **Step 4: Run the focused test** and confirm it passes.
- [x] **Step 5: Commit** with `git add types/content.ts lib/strapi/queries.ts lib/strapi/case-study-queries.test.ts && git commit -m "feat: add case study queries"`.

### Task 2: Build Case Cards and Filter Controls

**Files:**
- Create: `components/cases/CaseCard.tsx`
- Create: `components/cases/CaseFilters.tsx`
- Test: `components/cases/CaseCard.test.tsx`

**Interfaces:**
- `CaseCard` consumes `caseStudy: CaseStudy` and `locale: Locale`.
- `CaseFilters` consumes current `q`, `industry`, `product`, `scenario`, plus option arrays and locale; submits a GET form using those exact parameter names.

- [ ] **Step 1: Write the card test** asserting title, summary, industry, cover alt text, and localized detail href.
- [ ] **Step 2: Run the focused test** and confirm it fails because components do not exist.
- [ ] **Step 3: Implement the card and filter form** with existing brand classes, `resolveMediaUrl`, `next/image`, `Link`, and accessible labels.
- [ ] **Step 4: Run the focused test** and confirm it passes.
- [ ] **Step 5: Commit** with `git add components/cases && git commit -m "feat: add case study cards and filters"`.

### Task 3: Implement Localized Case List Page

**Files:**
- Create: `app/[locale]/cases/page.tsx`
- Modify: `lib/seo/metadata.ts` only if an existing helper needs a case-specific fallback

**Interfaces:**
- Reads `searchParams` `{ q?: string; industry?: string; product?: string; scenario?: string }`.
- Calls `getCaseStudies`, `getProducts`, and relationship option data as needed; renders `CaseFilters` and `CaseCard`.

- [ ] **Step 1: Add list-page tests** for localized heading, query propagation, empty state, and industry de-duplication.
- [ ] **Step 2: Run focused tests** and confirm the page behavior is not yet available.
- [x] **Step 3: Implement the server page** with encoded Strapi filters, stable sorting, option extraction, metadata, and localized copy.
- [ ] **Step 4: Run focused tests and TypeScript check** with `pnpm vitest run` and `pnpm exec tsc --noEmit`.
- [ ] **Step 5: Commit** with `git add 'app/[locale]/cases/page.tsx' lib/seo/metadata.ts && git commit -m "feat: add localized case study listing"`.

### Task 4: Implement Case Detail Page

**Files:**
- Create: `app/[locale]/cases/[slug]/page.tsx`
- Create: `components/cases/CaseMediaGallery.tsx` only if existing `MediaGallery` cannot render the case gallery

**Interfaces:**
- Calls `getCaseStudyBySlug(slug, locale)` and renders all populated case fields and related references.
- Uses `localizedHref(locale, "/contact")` for inquiry CTA and `createMetadata` for SEO.

- [ ] **Step 1: Add detail-page tests** for not-found behavior, localized labels, rich-text solution rendering, related links, and media rendering.
- [ ] **Step 2: Run focused tests** and confirm they fail before page implementation.
- [x] **Step 3: Implement the page** following the existing product/blog detail layout, reusing `RichTextRenderer`, `MediaGallery`, `resolveMediaUrl`, and brand components.
- [ ] **Step 4: Run focused tests, TypeScript check, and production build** with `pnpm vitest run`, `pnpm exec tsc --noEmit`, and `pnpm run build`.
- [ ] **Step 5: Commit** with `git add 'app/[locale]/cases/[slug]/page.tsx' components/cases && git commit -m "feat: add case study detail page"`.

### Task 5: End-to-End Verification

**Files:**
- Modify: `app/sitemap.ts` if case routes are not already included
- Test: existing test suite and build output

- [ ] **Step 1: Add case URLs to sitemap** using localized published case slugs if the current sitemap helper supports collection entries.
- [ ] **Step 2: Run `pnpm vitest run`** and record any pre-existing failures separately from case-study failures.
- [ ] **Step 3: Run `pnpm exec tsc --noEmit` and `pnpm run build`**.
- [ ] **Step 4: Inspect `git diff --check` and route files** for malformed encoding or accidental unrelated changes.
- [ ] **Step 5: Commit** any sitemap or verification fixes with `git commit -m "chore: verify customer case routes"`.
