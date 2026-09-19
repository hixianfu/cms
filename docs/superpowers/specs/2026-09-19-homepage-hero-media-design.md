# Homepage Hero Media and Overlay Header Design

## Goal

Upgrade the homepage hero so each slide can use either an image or an uploaded video, while making the hero fill the first viewport and displaying the site header over the hero. Existing image-based hero content must continue to work without migration.

## Scope

This change covers:

- the Strapi `shared.hero-slide` component;
- homepage hero data population and frontend types;
- image and video rendering in `HeroCarousel`;
- video playback and carousel coordination;
- homepage-only transparent header styling;
- automated tests for media selection, playback attributes, header variants, and existing carousel controls.

It does not change hero copy fields, CTA behavior, navigation data, MegaMenu content, or the appearance of the header on non-homepage routes.

## Content Model

Keep the existing `image` media field so existing homepage records remain valid. Change it from required to optional and add an optional `video` media field limited to video uploads.

The rendering priority is:

1. If `video` is configured, render it as the slide background.
2. If both `video` and `image` are configured, use the image URL as the video poster and visual fallback.
3. If only `image` is configured, render the existing responsive Next.js image.
4. If neither is configured, retain the brand-colored hero background so text remains readable.

Strapi cannot conveniently enforce “at least one of image or video” across two media fields in the schema. The admin model therefore allows both fields to be empty, while the frontend handles that state safely. Operational guidance should tell editors to configure at least one background media field.

## Hero Layout

The hero occupies the complete first viewport using `min-height: 100svh`. It no longer subtracts the header height because the header is taken out of normal flow on the homepage.

Hero content keeps sufficient top padding to clear the overlaid header. Background images and videos use cover sizing and fill the slide. The existing overlay gradient remains responsible for text contrast. Carousel controls remain inside the bottom safe area.

## Video Behavior

Hero videos behave as decorative background media:

- autoplay;
- muted;
- looped;
- inline playback on mobile;
- no native controls;
- cover sizing;
- poster image when an image is also configured.

Only the currently selected slide's video should play. Videos on inactive slides are paused. When the carousel pause control is active, the selected video is paused as well; resuming the carousel resumes the active video.

When the user has enabled `prefers-reduced-motion: reduce`, videos do not autoplay. If a poster image exists, it remains visible. The video element may remain mounted so the slide structure stays stable, but playback is not started automatically.

If video playback or loading fails and an image is configured, the poster remains the visible fallback. If no image exists, the brand background remains visible.

## Header Behavior

`SiteHeader` uses the current pathname to distinguish the localized homepage (`/zh` or `/en`) from other routes.

On the homepage:

- the header is positioned absolutely at the top of the page;
- it overlays the hero and does not consume layout height;
- the background is transparent with a subtle light bottom border;
- desktop navigation, search, language controls, and mobile controls use white foreground colors;
- the header remains above hero media and below modal-style navigation layers.

On all other routes:

- the existing sticky white header, dark text, border, shadow, and backdrop blur remain unchanged.

MegaMenu and MobileNav retain their solid light surfaces. Their readability must not depend on the transparent homepage header theme.

The initial implementation will not add scroll-triggered header color changes. The homepage header scrolls away with the hero because it is absolute rather than sticky or fixed.

## Data Flow

The homepage query explicitly populates both `image` and `video` for every hero slide. The frontend `HeroSlide` type gains an optional `video` media field and makes `image` optional, matching the backend schema.

`LocaleLayout` continues to render one shared `SiteHeader`. Route-specific presentation is handled inside the client header using the current pathname, avoiding a duplicate homepage header and preserving the existing navigation-fetching flow.

## Accessibility

- Background videos are muted and decorative, so they are hidden from assistive technology.
- Hero headings and CTA links remain semantic content above the media.
- Existing carousel labels, keyboard navigation, pause/play control, and inactive-slide tab handling remain intact.
- Reduced-motion preferences prevent automatic video motion.
- Image alternative text continues to come from `imageAlt`, media alternative text, or an empty decorative fallback as appropriate.

## Testing

Frontend tests will verify:

- an image-only slide renders an image;
- a video slide renders a muted, looping, inline video with no controls;
- a configured image is used as the video poster;
- image-only existing records remain supported;
- changing the selected slide pauses the previous video and plays the active video;
- the carousel pause control also pauses active video playback;
- the localized homepage receives the overlay header variant;
- non-homepage routes retain the standard header variant;
- Hero remains a complete viewport-height section;
- existing button and keyboard carousel controls continue to work.

Verification will include the complete Vitest suite, TypeScript compilation, frontend production build, Strapi schema parsing, Strapi production build, and Git diff checks in both repositories.

## Files Expected to Change

Frontend repository:

- `components/home/HeroCarousel.tsx`
- `components/home/HeroCarousel.test.tsx`
- `components/layout/SiteHeader.tsx`
- header tests or a new route-theme helper test
- `lib/strapi/queries.ts`
- `types/content.ts`

Strapi repository:

- `src/components/shared/hero-slide.json`
- generated component types

No content migration script is required because the existing `image` field is preserved.
