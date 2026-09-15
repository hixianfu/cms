# Video Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add localized video center listing and detail pages backed by the existing Strapi Video model.

**Architecture:** Reuse `api::video.video`, its category enum, internal file/external URL fields, and relations. Add typed query functions, presentational card/filter components, server-rendered App Router routes, and sitemap entries.

**Tech Stack:** Next.js, TypeScript, Strapi REST, Tailwind CSS, Vitest.

**Spec:** Chat-approved phase-five video-center design.

## Global Constraints

- Preserve existing product video behavior.
- Filter all content by `contentLocale`.
- Support internal uploaded videos and external URLs.
- Use existing media URL, metadata, localization, and brand styling utilities.

---

### Task 1: Video Queries and Types

**Files:** `lib/strapi/queries.ts`, `lib/strapi/revalidate.ts`, `types/content.ts`

- [ ] Add `getVideos(locale?, query?)` and `getVideoBySlug(slug, locale?)` with explicit populate for cover, file, and all relations.
- [ ] Add cache tags and ensure `Video` media fields are typed.
- [ ] Run `tsc --noEmit`.

### Task 2: Video Card and Filters

**Files:** `components/videos/VideoCard.tsx`, `components/videos/VideoFilters.tsx`

- [ ] Render cover, category label, title, description, and localized detail link.
- [ ] Build GET filter form for `q`, `category`, and `product`.
- [ ] Support category labels in Chinese and English.

### Task 3: Video List Page

**Files:** `app/[locale]/videos/page.tsx`

- [ ] Load videos and product filter options.
- [ ] Apply title, category, and product relation filters.
- [ ] Render localized hero, filters, cards, result count, and empty state.

### Task 4: Video Detail Page

**Files:** `app/[locale]/videos/[slug]/page.tsx`

- [ ] Render internal `<video>` source or external link/embed fallback.
- [ ] Render metadata, related products, solutions, scenarios, cases, and articles.
- [ ] Add localized inquiry CTA and SEO metadata.

### Task 5: Sitemap and Verification

**Files:** `app/sitemap.ts`

- [ ] Add localized video list and detail URLs.
- [ ] Run full Vitest, TypeScript, build, and `git diff --check`.
- [ ] Commit the implementation.
