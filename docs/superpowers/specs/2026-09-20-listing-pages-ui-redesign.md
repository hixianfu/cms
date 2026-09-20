# Listing Pages UI Redesign

## Goal

Redesign the products, solutions, scenarios, cases, videos, blog, and FAQ pages into one coherent high-end minimal visual system with restrained industrial-technology details. The new experience should feel more premium, reduce unused whitespace when content is sparse, improve browsing and filtering, and preserve each content type's identity.

The affected localized routes are:

- `/[locale]/products`
- `/[locale]/solutions`
- `/[locale]/scenarios`
- `/[locale]/cases`
- `/[locale]/videos`
- `/[locale]/blog`
- `/[locale]/faq`

## Design Direction

The approved direction combines high-end minimalism with moderate industrial technology styling:

- warm white and pale blue-gray surfaces instead of large uninterrupted white areas;
- deep navy as the primary structural color;
- teal as the main technology accent;
- brand lime reserved for important actions, selected states, and small highlights;
- strong, compact typography with quieter body copy;
- thin borders, controlled shadows, and subtle surface elevation;
- low-opacity grid lines, technical traces, and soft glows used as supporting detail rather than decoration that competes with content;
- restrained motion, including small card lifts, slow media scaling, and smooth filter transitions.

Existing brand tokens in `app/globals.css` remain the foundation. New tokens and shared utility classes should extend that system rather than introducing page-specific colors and effects.

## Information Architecture

All seven pages use a shared listing-page rhythm:

1. site header;
2. page Hero;
3. category navigation or filter tools;
4. result heading and count;
5. page-specific content grid or accordion;
6. pagination, empty state, or related-content continuation.

The layout uses one shared maximum content width and spacing scale. Page-specific components may vary their internal presentation, but their outer alignment, section rhythm, loading treatment, and responsive breakpoints remain consistent.

## Hero System

### Immersive Heroes

Products and solutions use an immersive Hero approximately 55-65% of the first viewport height. It contains:

- breadcrumb navigation;
- a small section eyebrow;
- primary heading and short introduction;
- an optional content statistic or supporting line;
- subtle abstract industrial artwork built from lightweight CSS or SVG layers.

Products use device-inspired outlines and technical planes. Solutions use connected nodes and system-flow geometry. The artwork remains secondary to text and does not require large background image assets.

### Compact Heroes

Scenarios, cases, videos, blog, and FAQ use compact Heroes approximately 320-420px high on desktop. They retain the same typography and breadcrumb language but bring the page's useful content into view sooner.

Each compact Hero receives a restrained identifying motif:

- scenarios: spatial frames or application zones;
- cases: architectural grids and result markers;
- videos: a light-ring or playback motif;
- blog: editorial rules and content blocks;
- FAQ: question nodes or indexed lines.

### Header Relationship

These interior pages keep the normal sticky site header behavior. Homepage-only transparent overlay behavior must not leak into them. Hero spacing must account for the header without introducing a blank band or causing the sticky header to disappear while scrolling.

On mobile, Hero height and visual complexity are reduced. Headings remain readable without relying on decorative artwork.

## Navigation and Filters

The approved model is intentionally mixed because the content taxonomies have different browsing needs.

### Products and Blog

Products and blog retain side category navigation on desktop. The sidebar becomes a lightweight sticky index with:

- selected-state emphasis;
- optional item counts;
- compact spacing;
- a clear all-items entry;
- no heavy enclosing panel.

The content column owns the search field, result heading, and content grid. On smaller screens the category index becomes a compact trigger and opens in a filter drawer.

### Solutions, Scenarios, Cases, and Videos

These pages use a unified top filter toolbar. Search is the primary control. Frequently used filters remain visible, while secondary fields, especially on the cases page, move into a "more filters" disclosure.

The toolbar uses a white elevated surface, thin border, and compact controls instead of the current form-heavy panel. Active values appear below the primary row as removable chips with a clear-all action.

### FAQ

FAQ uses a prominent search field followed by horizontally scrollable category chips. Its search interaction and selected states reuse the same primitives as the listing toolbar even though the final content is an accordion.

### Shared Filter Behavior

- Result count and active-filter feedback use one consistent pattern.
- Filter updates should not unexpectedly jump the page position.
- Empty states explain that no content matches and offer a clear reset action.
- Mobile filter controls open in a bottom drawer with a clear title, reset action, and apply action.
- Keyboard focus and selected states must remain visible.

## Content Presentation

All card families share border radius, surface, hover motion, focus treatment, metadata typography, and CTA language. Each page then adapts that foundation to its content.

### Products

Product cards prioritize media, product family, concise value proposition, and a clear detail action. Featured products may span two columns or use a larger horizontal card so a small catalogue does not leave the page visually empty.

### Solutions

Solution cards communicate business challenge, solution approach, and applicable industries. A restrained node or connection graphic reinforces the system-level nature of the content.

### Scenarios

Scenario cards use a wider image ratio and emphasize usage environment, applicable conditions, and related products. Their composition should feel contextual rather than like another solution card.

### Cases

Case cards follow an editorial layout with industry, customer or project label, short summary, and measurable outcome when available. The first important case can use a wide featured treatment. Missing metrics should not leave awkward placeholders.

### Videos

Video cards use a consistent 16:9 thumbnail, visible play control, duration, and content type. Hover may gently scale the thumbnail or emphasize the play control; video should not autoplay in the grid.

### Blog

Blog uses a magazine-inspired composition. The leading article receives a stronger featured treatment, followed by consistent article cards with image, category, date, title, and excerpt. The sidebar remains useful for taxonomy browsing but visually subordinate to editorial content.

### FAQ

FAQ uses a spacious but compact accordion with clear question hierarchy, visible expanded state, keyboard operation, and optional related-content links. Only the interactive header toggles an item; focus behavior must be explicit.

## Sparse, Loading, and Empty States

Current content counts are low on several pages, so the design cannot assume a dense catalogue.

- One or two entries should use intentional wider card proportions instead of narrow cards followed by empty columns.
- Featured layouts should be driven by available content, not hard-coded placeholders.
- Empty results display a branded but lightweight message, reset action, and optional route back to all content.
- Loading states use stable skeleton dimensions to prevent layout shift.
- Missing images use a shared branded placeholder generated from gradients and page-specific line motifs.

## Responsive Behavior

- Desktop uses the shared content width and page-appropriate three- or two-column grids.
- Tablet typically reduces grids to two columns and moves oversized filter sets behind disclosure.
- Mobile uses one content column, compact Heroes, scrollable chips, and drawer-based filters.
- Sticky sidebars are disabled before they constrain the main content column.
- Touch targets are at least 44px where practical.
- Long translated labels wrap or truncate safely without changing control height unexpectedly.

Although the requested URLs are Chinese, shared components must be checked with other supported locales because title and filter lengths differ.

## Motion and Accessibility

- Motion is decorative and subtle; no essential state is communicated by animation alone.
- `prefers-reduced-motion` disables card lifts, image scaling, and nonessential Hero animation.
- Text and controls meet appropriate contrast requirements on both dark and light surfaces.
- Cards and accordion triggers expose visible keyboard focus.
- Filters have associated labels even when the visual treatment is compact.
- Decorative Hero graphics are ignored by assistive technology.
- Heading order remains semantic across Hero, result section, and card titles.

## Technical Structure

The display layer should be consolidated around shared primitives, likely including:

- `ListingPageShell` for page width, section rhythm, and surface background;
- immersive and compact variants of a shared listing Hero;
- a shared result heading and count component;
- shared search, filter-chip, toolbar, and mobile drawer primitives;
- a shared empty state and media placeholder;
- a common card surface with page-specific card compositions.

The existing `MarketingListing`, `MarketingFilters`, and `MarketingCard` implementation should be reused or evolved where it remains a good abstraction. Products, cases, videos, blog, and FAQ should migrate only the duplicated presentation logic that can be shared without forcing unlike content into one oversized component.

Data fetching, SEO metadata, route behavior, localization, and business-specific fields remain page-owned. This redesign does not require changes to Strapi content types or existing entries.

## Error Handling and Resilience

- Missing optional media, summary, counts, metrics, or taxonomy values must degrade without empty visual slots.
- Filter parsing should tolerate absent or stale query values and return to a valid all-content state.
- A failed image shows the branded placeholder without changing card dimensions.
- Empty API results render the standard empty state, not an incomplete grid shell.
- Shared components accept safe defaults so one page cannot break the full listing family through missing optional props.

## Testing and Verification

Automated coverage should focus on shared behavior rather than snapshots of decorative styling:

- Hero variant and semantic heading rendering;
- sidebar and top-toolbar variants;
- active filter chips, clear actions, and result counts;
- mobile filter disclosure behavior;
- sparse-content, empty-content, and missing-media states;
- FAQ accordion keyboard behavior;
- preservation of localized route links and labels;
- header visibility and sticky behavior while scrolling interior pages.

Verification includes linting, TypeScript checking, relevant component tests, the frontend production build, and browser review at desktop, tablet, and mobile sizes for all seven routes. Browser review should include at least one non-Chinese locale to catch layout regressions.

## Alternatives Considered

### One Identical Layout for Every Page

This would maximize consistency but flatten important differences between catalogues, editorial content, videos, and FAQs. It was rejected in favor of shared outer structure with page-specific content composition.

### Full-Height Immersive Hero Everywhere

This would create a strong campaign feel but delay access to content and reproduce the current problem of oversized, repetitive introductory blocks. The approved hybrid Hero system reserves immersion for products and solutions.

### Top Filters or Sidebars Everywhere

A single navigation pattern would be easier to document but less effective for the actual taxonomies. The approved mixed pattern retains side browsing for products and blog while standardizing task-oriented filtering elsewhere.

## Out of Scope

- Strapi schema changes or content migration;
- rewriting page copy or translating missing content;
- adding new products, cases, articles, videos, or FAQ entries;
- autoplaying video previews in content grids;
- changing homepage Hero behavior;
- redesigning global navigation beyond ensuring the interior-page sticky header remains visible;
- introducing a new external design system or animation library.
