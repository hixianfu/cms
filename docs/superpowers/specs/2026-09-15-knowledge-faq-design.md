# Knowledge Center and FAQ Design

## Goal

Extend the localized marketing site with a searchable FAQ center and richer blog knowledge links, while keeping the existing `/blog` routes stable.

## Architecture

Strapi remains the content source. FAQ entries use the existing `faq` collection with explicit locale filtering and populated product/solution relations. Articles gain a many-to-many `faqs` relation so editors can curate FAQ links directly in the admin panel. Next.js adds localized FAQ list pages and renders related content using the existing server-side query and Tailwind patterns.

## Scope

- Add `/[locale]/faq` list pages for Chinese and English.
- Support FAQ search, category, product, and solution filters.
- Populate and render article relations: products, solutions, scenarios, cases, videos, and faqs.
- Add FAQ metadata and sitemap entries.
- Add cache tags and typed query helpers.
- Do not rename or remove `/blog` routes.

## Data Model

Add `faqs` to `api::article.article` as a many-to-many relation targeting `api::faq.faq`. FAQ fields remain `contentLocale`, `question`, `slug`, `answer`, `category`, `products`, `solutions`, `sortOrder`, `featured`, and `seo`.

## UX

FAQ pages use a compact hero, filter controls, and native accessible `<details>` accordions. Empty and loading/error states follow existing content pages. Related article content appears below the article body as grouped links/cards, with FAQ accordions in the same section.

## Verification

Run TypeScript, Vitest, Next production build, and `git diff --check` in `cms`; validate Strapi schema JSON and inspect the final diff before committing.
