import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { ListingSection } from "./ListingPageShell";

export type ListingHeroVariant = "immersive" | "compact";

export type ListingHeroMotif =
  | "product"
  | "solution"
  | "scenario"
  | "case"
  | "video"
  | "article"
  | "faq";

const motifClasses: Record<ListingHeroMotif, string> = {
  product: "border-brand-teal",
  solution: "border-brand-lime",
  scenario: "border-brand-teal",
  case: "border-brand-lime",
  video: "rounded-full border-brand-teal",
  article: "border-brand-lime",
  faq: "rounded-full border-brand-teal",
};

export function ListingHero({
  locale,
  variant,
  motif,
  eyebrow,
  title,
  description,
  stat,
}: {
  locale: Locale;
  variant: ListingHeroVariant;
  motif: ListingHeroMotif;
  eyebrow: string;
  title: string;
  description: string;
  stat?: { value: string | number; label: string };
}) {
  const isChinese = locale === "zh";
  const minHeightClass =
    variant === "immersive"
      ? "min-h-[clamp(30rem,58svh,44rem)]"
      : "min-h-[clamp(19rem,36vw,26rem)]";

  return (
    <header
      className="listing-hero relative isolate overflow-hidden bg-brand-ink text-white"
      data-motif={motif}
      data-testid="listing-hero"
      data-variant={variant}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-testid="listing-hero-motif"
      >
        <span className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rotate-45 border border-white/15" />
        <span
          className={`absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 rotate-45 border-2 ${motifClasses[motif]}`}
        />
        <span className="absolute right-[18%] top-1/4 h-px w-32 bg-white/35" />
      </div>

      <ListingSection className={`relative grid content-center ${minHeightClass}`}>
        <div className="max-w-3xl">
          <nav
            aria-label={isChinese ? "\u9762\u5305\u5c51" : "Breadcrumb"}
            className="flex items-center gap-2 text-sm text-slate-200"
          >
            <a
              className="inline-flex min-h-11 items-center px-3 font-semibold hover:text-brand-lime"
              href={localizedHref(locale, "/")}
            >
              {isChinese ? "\u9996\u9875" : "Home"}
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-brand-lime">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            {description}
          </p>
          {stat ? (
            <dl className="mt-8 flex items-baseline gap-3 border-l-2 border-brand-teal pl-4">
              <dd className="text-3xl font-semibold text-white">{stat.value}</dd>
              <dt className="text-sm font-semibold text-slate-200">{stat.label}</dt>
            </dl>
          ) : null}
        </div>
      </ListingSection>
    </header>
  );
}
