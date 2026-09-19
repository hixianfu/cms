# Homepage Hero Media and Overlay Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Support image or uploaded-video homepage hero slides and place a transparent homepage-only header over a full-viewport hero.

**Architecture:** Preserve the existing hero image field for backward compatibility and add an optional video field that takes rendering priority while using the image as its poster/fallback. Keep one shared `SiteHeader`; derive its homepage overlay theme from the localized pathname, while all non-home routes retain the current sticky white style.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Embla Carousel, Vitest, Testing Library, Strapi 5.

**Spec:** `docs/superpowers/specs/2026-09-19-homepage-hero-media-design.md`

## Global Constraints

- Existing image-only hero records must continue working without a migration.
- Uploaded hero videos use autoplay, muted, loop, and plays-inline background behavior without native controls.
- Only the active slide video may play; the carousel pause control also pauses video playback.
- `prefers-reduced-motion: reduce` prevents automatic video playback.
- The homepage hero height is `100svh`; it must not subtract the header height.
- Only `/zh` and `/en` receive the transparent absolute header; all other routes retain the current sticky white header.
- MegaMenu and MobileNav retain solid readable surfaces.
- Use test-first development for frontend behavior.
- Frontend repository: `C:\playground\workspace\cms`.
- Strapi repository: `C:\playground\workspace\strapi-cms`.

## File Structure

- Modify `strapi-cms/src/components/shared/hero-slide.json`: add optional uploaded video support and make the legacy image optional.
- Modify `strapi-cms/types/generated/components.d.ts`: synchronize generated Strapi component types.
- Modify `cms/types/content.ts`: expose optional `image` and `video` on `HeroSlide`.
- Modify `cms/lib/strapi/queries.ts`: populate both hero image and video media.
- Modify `cms/components/home/HeroCarousel.tsx`: select media, render video backgrounds, coordinate playback, honor reduced motion, and use full viewport height.
- Modify `cms/components/home/HeroCarousel.test.tsx`: protect image fallback, video rendering, media errors, playback, reduced motion, and existing controls.
- Modify `cms/lib/i18n/routing.ts`: add a pure localized-homepage path predicate.
- Create `cms/lib/i18n/routing.test.ts`: verify exact homepage matching without treating inner routes as home.
- Modify `cms/components/layout/SiteHeader.tsx`: apply route-aware overlay or standard header themes.
- Modify `cms/components/layout/LocaleSwitcher.tsx`: expose an inverse color variant for the transparent header.
- Create `cms/components/layout/SiteHeader.test.tsx`: verify homepage and inner-page header variants.

---

### Task 1: Extend the Strapi hero slide media model

**Files:**

- Modify: `C:\playground\workspace\strapi-cms\src\components\shared\hero-slide.json`
- Modify: `C:\playground\workspace\strapi-cms\types\generated\components.d.ts`

**Interfaces:**

- Produces: optional Strapi fields `image: Media<'images'>` and `video: Media<'videos'>` on `shared.hero-slide`.
- Preserves: existing hero copy and CTA fields without renaming.

- [ ] **Step 1: Change the component schema without renaming the existing image field**

Update the media attributes to this exact shape:

```json
"image": {
  "type": "media",
  "multiple": false,
  "allowedTypes": ["images"]
},
"video": {
  "type": "media",
  "multiple": false,
  "allowedTypes": ["videos"]
}
```

Keep `imageAlt` available but remove its `required` flag because video-only slides have no image requiring alternative text.

- [ ] **Step 2: Synchronize the generated component declaration**

In `SharedHeroSlide.attributes`, use:

```ts
image: Schema.Attribute.Media<'images'>;
imageAlt: Schema.Attribute.String &
  Schema.Attribute.SetMinMaxLength<{ maxLength: 160 }>;
video: Schema.Attribute.Media<'videos'>;
```

- [ ] **Step 3: Validate the schema and build the Strapi admin**

Run:

```powershell
node -e "JSON.parse(require('fs').readFileSync('src/components/shared/hero-slide.json','utf8')); console.log('hero schema valid')"
pnpm run build
git diff --check
```

Expected: JSON validation prints `hero schema valid`, Strapi compilation and admin build exit successfully, and `git diff --check` reports no errors.

- [ ] **Step 4: Commit the backend model**

```powershell
git add src/components/shared/hero-slide.json types/generated/components.d.ts
git commit -m "feat: support video hero slides"
```

---

### Task 2: Add the frontend hero media contract and rendering fallback

**Files:**

- Modify: `C:\playground\workspace\cms\types\content.ts`
- Modify: `C:\playground\workspace\cms\lib\strapi\queries.ts`
- Modify: `C:\playground\workspace\cms\components\home\HeroCarousel.test.tsx`
- Modify: `C:\playground\workspace\cms\components\home\HeroCarousel.tsx`

**Interfaces:**

- Consumes: Strapi hero slide fields `image?: Media | null` and `video?: Media | null`.
- Produces: video-first media rendering, with `image` as poster and fallback.

- [ ] **Step 1: Write failing tests for image-only and video-first slides**

Add these fixtures and tests:

```tsx
const image = { url: "/uploads/hero.jpg", alternativeText: "Packaging line" };
const video = { url: "/uploads/hero.mp4", mime: "video/mp4" };

it("keeps rendering existing image-only slides", () => {
  render(<HeroCarousel locale="en" slides={[{ title: "Image hero", image }]} />);
  expect(screen.getByRole("img", { name: "Packaging line" })).toHaveClass("object-cover");
  expect(screen.queryByTestId("hero-video-0")).not.toBeInTheDocument();
});

it("renders an uploaded video before its image poster", () => {
  render(<HeroCarousel locale="en" slides={[{ title: "Video hero", image, video }]} />);
  const element = screen.getByTestId("hero-video-0") as HTMLVideoElement;
  expect(element).toHaveAttribute("poster", "http://localhost:1337/uploads/hero.jpg");
  expect(element).toHaveAttribute("playsinline");
  expect(element).toHaveProperty("muted", true);
  expect(element).toHaveProperty("loop", true);
  expect(element).not.toHaveAttribute("controls");
});

it("falls back to the poster image when video loading fails", () => {
  render(<HeroCarousel locale="en" slides={[{ title: "Fallback hero", image, video }]} />);
  fireEvent.error(screen.getByTestId("hero-video-0"));
  expect(screen.queryByTestId("hero-video-0")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Packaging line" })).toBeInTheDocument();
});
```

Import `cleanup` and `afterEach`, then isolate every render with:

```ts
afterEach(() => cleanup());
```

- [ ] **Step 2: Run the media tests and verify the expected failures**

Run:

```powershell
.\node_modules\.bin\vitest.cmd run components/home/HeroCarousel.test.tsx
```

Expected: the video tests fail because `HeroSlide.video` and video rendering do not exist yet; the existing image and control test remains green.

- [ ] **Step 3: Update the frontend type and homepage population query**

Change `HeroSlide` to include:

```ts
image?: Media | null;
video?: Media | null;
imageAlt?: string | null;
```

Replace the hero population fragment with explicit nested media fields:

```text
populate[sections][on][shared.home-hero][populate][slides][populate][image]=true
populate[sections][on][shared.home-hero][populate][slides][populate][video]=true
```

Keep all other homepage populate fragments unchanged.

- [ ] **Step 4: Implement video-first rendering with an image fallback**

Resolve both media URLs for each slide:

```ts
const imageUrl = resolveMediaUrl(slide.image);
const videoUrl = resolveMediaUrl(slide.video);
const showVideo = Boolean(videoUrl && !failedVideos.has(index));
```

Maintain failed video indexes in component state:

```ts
const [failedVideos, setFailedVideos] = useState<Set<number>>(() => new Set());
const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
```

Add `useRef` to the existing React import. Task 3 will use this ref array to coordinate playback.

Render the image first as the visual fallback, then render the video above it when available:

```tsx
{imageUrl ? (
  <Image
    src={imageUrl}
    alt={slide.imageAlt ?? slide.image?.alternativeText ?? ""}
    fill
    priority={index === 0}
    sizes="100vw"
    className="object-cover"
  />
) : null}
{showVideo ? (
  <video
    ref={(element) => { videoRefs.current[index] = element; }}
    data-testid={`hero-video-${index}`}
    src={videoUrl ?? undefined}
    poster={imageUrl ?? undefined}
    muted
    loop
    playsInline
    preload={index === 0 ? "auto" : "metadata"}
    aria-hidden="true"
    className="absolute inset-0 h-full w-full object-cover"
    onError={() => setFailedVideos((current) => new Set(current).add(index))}
  />
) : null}
```

- [ ] **Step 5: Change every hero height expression to full viewport height**

Replace all occurrences of:

```text
min-h-[calc(100svh-5rem)]
```

with:

```text
min-h-svh
```

Increase the content top padding to at least `pt-28 lg:pt-32` so headings remain clear of the overlaid header.

- [ ] **Step 6: Run the Hero tests and TypeScript compiler**

```powershell
.\node_modules\.bin\vitest.cmd run components/home/HeroCarousel.test.tsx
.\node_modules\.bin\tsc.cmd --noEmit
```

Expected: all Hero tests pass and TypeScript exits with code 0.

- [ ] **Step 7: Commit the media rendering slice**

```powershell
git add types/content.ts lib/strapi/queries.ts components/home/HeroCarousel.tsx components/home/HeroCarousel.test.tsx
git commit -m "feat: render image or video hero media"
```

---

### Task 3: Coordinate video playback with carousel state and reduced motion

**Files:**

- Modify: `C:\playground\workspace\cms\components\home\HeroCarousel.test.tsx`
- Modify: `C:\playground\workspace\cms\components\home\HeroCarousel.tsx`

**Interfaces:**

- Consumes: `selectedIndex`, `isPlaying`, and the current set of video element refs.
- Produces: exactly one eligible playing video, paused inactive videos, and no automatic playback under reduced motion.

- [ ] **Step 1: Write failing playback tests**

Stub media methods before rendering:

```tsx
const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
```

Add tests that:

```tsx
it("plays only the active video and pauses it with the carousel control", async () => {
  const user = userEvent.setup();
  render(<HeroCarousel locale="en" slides={videoSlides} />);

  expect(play).toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Pause carousel" }));
  expect(pause).toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "Play carousel" }));
  expect(play.mock.calls.length).toBeGreaterThan(1);
});

it("does not autoplay video when reduced motion is requested", () => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(<HeroCarousel locale="en" slides={[videoSlides[0]]} />);
  expect(play).not.toHaveBeenCalled();
  expect(pause).toHaveBeenCalled();
});
```

Restore media spies and global stubs after each test.

Use this exact cleanup so later tests cannot inherit media calls or motion settings:

```ts
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
```

- [ ] **Step 2: Run playback tests and confirm they fail for missing coordination**

```powershell
.\node_modules\.bin\vitest.cmd run components/home/HeroCarousel.test.tsx
```

Expected: playback assertions fail while existing rendering assertions pass.

- [ ] **Step 3: Track reduced-motion preference**

Initialize the preference before the playback effect, then subscribe to changes:

```ts
const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false,
);

useEffect(() => {
  if (typeof window.matchMedia !== "function") return;
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => setPrefersReducedMotion(query.matches);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}, []);
```

The initializer prevents an initial `play()` call when reduced motion is already enabled. The guard leaves the preference `false` in older environments without `matchMedia`.

- [ ] **Step 4: Coordinate the video refs**

Use the `videoRefs` array created in Task 2 and add the playback effect:

```ts
useEffect(() => {
  videoRefs.current.forEach((video, index) => {
    if (!video) return;
    if (index === selectedIndex && isPlaying && !prefersReducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  });
}, [failedVideos, isPlaying, prefersReducedMotion, selectedIndex]);
```

Do not add native controls or audio playback.

- [ ] **Step 5: Run the Hero tests and complete suite**

```powershell
.\node_modules\.bin\vitest.cmd run components/home/HeroCarousel.test.tsx
.\node_modules\.bin\vitest.cmd run
```

Expected: Hero tests and all project tests pass with zero failures.

- [ ] **Step 6: Commit the playback behavior**

```powershell
git add components/home/HeroCarousel.tsx components/home/HeroCarousel.test.tsx
git commit -m "feat: coordinate hero video playback"
```

---

### Task 4: Add the homepage-only overlay header theme

**Files:**

- Modify: `C:\playground\workspace\cms\lib\i18n\routing.ts`
- Create: `C:\playground\workspace\cms\lib\i18n\routing.test.ts`
- Modify: `C:\playground\workspace\cms\components\layout\SiteHeader.tsx`
- Modify: `C:\playground\workspace\cms\components\layout\LocaleSwitcher.tsx`
- Create: `C:\playground\workspace\cms\components\layout\SiteHeader.test.tsx`

**Interfaces:**

- Produces: `isLocalizedHomePath(pathname: string, locale: Locale | string): boolean`.
- Consumes: `usePathname()` in `SiteHeader` and the pure route predicate.
- Produces: `LocaleSwitcher({ locale, inverse?: boolean })` so the homepage can use white text without affecting inner pages.
- Preserves: current navigation, MegaMenu, MobileNav, search, locale switching, logo, and inner-page sticky header behavior.

- [ ] **Step 1: Write failing route predicate tests**

Add to `lib/i18n/routing.test.ts`:

```ts
describe("isLocalizedHomePath", () => {
  it.each([
    ["/zh", "zh", true],
    ["/zh/", "zh", true],
    ["/en", "en", true],
    ["/zh/products", "zh", false],
    ["/en/blog/article", "en", false],
  ])("matches only the localized homepage", (pathname, locale, expected) => {
    expect(isLocalizedHomePath(pathname, locale)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run the route test and verify it fails because the export is missing**

```powershell
.\node_modules\.bin\vitest.cmd run lib/i18n/routing.test.ts
```

Expected: failure reports that `isLocalizedHomePath` is not exported or defined.

- [ ] **Step 3: Implement the route predicate**

```ts
export function isLocalizedHomePath(pathname: string, locale: Locale | string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return normalized === `/${locale}`;
}
```

- [ ] **Step 4: Write failing SiteHeader theme tests**

Mock `next/navigation` so `usePathname` returns a mutable pathname:

```tsx
let pathname = "/zh";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const megaMenu = { solutions: [], scenarios: [], cases: [], articles: [] };

afterEach(() => cleanup());
```

Render the homepage variant and assert:

```tsx
pathname = "/zh";
render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);
expect(screen.getByRole("banner")).toHaveClass("absolute", "text-white");
expect(screen.getByRole("link", { name: "EN" })).toHaveClass("text-white");
```

Render the inner-page variant in a separate test and assert:

```tsx
pathname = "/zh/products";
render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);
expect(screen.getByRole("banner")).toHaveClass("sticky", "bg-white/95");
expect(screen.getByRole("banner")).not.toHaveClass("absolute");
expect(screen.getByRole("link", { name: "EN" })).toHaveClass("text-slate-600");
```

Import `cleanup`, `afterEach`, and `vi` as shown so separate pathname renders remain isolated.

- [ ] **Step 5: Run the SiteHeader test and verify the homepage assertion fails**

```powershell
.\node_modules\.bin\vitest.cmd run components/layout/SiteHeader.test.tsx
```

Expected: inner-page style assertion passes and homepage overlay assertion fails because the header is still always sticky and white.

- [ ] **Step 6: Apply route-aware classes in SiteHeader**

Import `usePathname` and `isLocalizedHomePath`, then compute:

```ts
const pathname = usePathname();
const overlayHero = isLocalizedHomePath(pathname, locale);
```

Use an exact theme split for the header:

```ts
const headerClass = overlayHero
  ? "absolute inset-x-0 top-0 z-40 border-b border-white/20 bg-transparent text-white"
  : "sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 text-brand-ink shadow-sm backdrop-blur";
```

Change desktop links, search, language controls, and mobile controls to white hover/focus colors when `overlayHero` is true. Keep existing brand colors otherwise. Pass no transparent theme into `MegaMenu` or `MobileNav`; they retain their current solid surfaces.

Extend `LocaleSwitcher` without changing its default API behavior:

```tsx
export function LocaleSwitcher({ locale, inverse = false }: { locale: Locale; inverse?: boolean }) {
  const other = locale === "zh" ? "en" : "zh";
  const className = inverse
    ? "rounded px-2 py-1 text-sm font-medium text-white underline-offset-4 hover:text-white/80 hover:underline focus-visible:outline-2 focus-visible:outline-white"
    : "rounded px-2 py-1 text-sm font-medium text-slate-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600";
  return <Link className={className} href={localizedHref(other, "/")}>{other === "en" ? "EN" : "中文"}</Link>;
}
```

Pass `inverse={overlayHero}` from both desktop and mobile placements in `SiteHeader`.

- [ ] **Step 7: Run header, routing, and complete tests**

```powershell
.\node_modules\.bin\vitest.cmd run lib/i18n/routing.test.ts components/layout/SiteHeader.test.tsx
.\node_modules\.bin\vitest.cmd run
.\node_modules\.bin\tsc.cmd --noEmit
```

Expected: all tests pass and TypeScript exits successfully.

- [ ] **Step 8: Commit the overlay header slice**

```powershell
git add lib/i18n/routing.ts lib/i18n/routing.test.ts components/layout/SiteHeader.tsx components/layout/SiteHeader.test.tsx components/layout/LocaleSwitcher.tsx
git commit -m "feat: overlay header on homepage hero"
```

---

### Task 5: Verify the integrated production behavior

**Files:**

- Verify only; modify implementation files only if a verification failure identifies a defect.

**Interfaces:**

- Consumes: all deliverables from Tasks 1–4.
- Produces: build and test evidence for the completed feature.

- [ ] **Step 1: Run complete frontend verification**

```powershell
.\node_modules\.bin\vitest.cmd run
.\node_modules\.bin\tsc.cmd --noEmit
pnpm run build
git diff --check
```

Expected: all tests pass, TypeScript exits with code 0, Next.js production build succeeds, and no whitespace errors are reported.

- [ ] **Step 2: Run complete Strapi verification**

```powershell
node -e "JSON.parse(require('fs').readFileSync('src/components/shared/hero-slide.json','utf8')); console.log('hero schema valid')"
pnpm run build
git diff --check
```

Expected: schema validation and Strapi production build succeed with no diff errors.

- [ ] **Step 3: Review requirement coverage in the browser**

With both local services running, verify `/zh` and `/en` at desktop and mobile widths:

- image-only slides fill the viewport;
- video slides autoplay silently and loop;
- image posters remain visible while video loads;
- carousel controls switch slides and pause/resume video;
- header overlays the hero with white controls;
- mobile navigation opens on a solid readable panel;
- `/zh/products` and `/en/blog` retain the white sticky header.

- [ ] **Step 4: Confirm clean repository state and record final commits**

```powershell
git status --short
git log -4 --oneline
```

Expected: both repositories have no uncommitted implementation changes. If verification required a correction, commit the narrowly scoped fix before final status reporting.
