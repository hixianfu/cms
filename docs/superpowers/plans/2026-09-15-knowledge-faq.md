# Knowledge Center FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add localized FAQ pages and curated FAQ/content relationships to the knowledge center.

**Architecture:** Use Strapi REST queries with explicit populate parameters and locale filters. Render FAQ list/filter UI and blog related-content sections in Next.js server/client components following existing patterns.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind CSS, Strapi REST API, Vitest.

**Spec:** `cms/docs/superpowers/specs/2026-09-15-knowledge-faq-design.md`

## Global Constraints

- Preserve existing `/blog` URLs and current content behavior.
- Keep locale values `zh` and `en` aligned with Strapi `contentLocale`.
- Use explicit Strapi populate syntax for relations and media.
- Do not remove or overwrite existing content records.

---

### Task 1: Extend Strapi Article Relations

**Files:**
- Modify: `strapi-cms/src/api/article/content-types/article/schema.json`

- [ ] Add a `faqs` many-to-many relation targeting `api::faq.faq` after the existing `videos` relation.
- [ ] Validate the file as JSON and inspect the diff.

### Task 2: Add FAQ Query and Cache Support

**Files:**
- Modify: `cms/types/content.ts`
- Modify: `cms/lib/strapi/queries.ts`
- Modify: `cms/lib/strapi/revalidate.ts`

- [ ] Ensure `Faq` and `Article` types expose all related content fields.
- [ ] Add `getFaqs(locale?, query?)` with populated products, solutions, and SEO share image; sort featured, sortOrder, and createdAt.
- [ ] Add `getFaqBySlug(slug, locale?)` with the same populated fields.
- [ ] Expand `getArticles` and `getArticleBySlug` populate parameters to include products, solutions, scenarios, cases, videos, and faqs.
- [ ] Add `faqs(locale)` and `faq(locale, slug)` cache tags.

### Task 3: Build FAQ Filters and List Page

**Files:**
- Create: `cms/components/faq/FaqFilters.tsx`
- Create: `cms/components/faq/FaqList.tsx`
- Create: `cms/app/[locale]/faq/page.tsx`

- [ ] Implement URL-driven search and select filters for category, product, and solution.
- [ ] Render each FAQ as an accessible `<details>` item with localized labels and rich text answer rendering.
- [ ] Add localized metadata, empty state, and links to contact/products.

### Task 4: Enrich Blog Detail Related Content

**Files:**
- Modify: `cms/app/[locale]/blog/[slug]/page.tsx`

- [ ] Render grouped links for related products, solutions, scenarios, cases, and videos when present.
- [ ] Render related FAQs as accessible accordions using the existing rich text renderer.
- [ ] Keep the article body and existing metadata unchanged.

### Task 5: Sitemap and Verification

**Files:**
- Modify: `cms/app/sitemap.ts`

- [ ] Add localized FAQ listing URLs and FAQ detail URLs from `getFaqs`.
- [ ] Run TypeScript, Vitest, Next build, and `git diff --check`.
- [ ] Commit frontend and backend changes with focused messages.
