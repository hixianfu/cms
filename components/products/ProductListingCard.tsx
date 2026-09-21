import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryLabel } from "@/lib/i18n/category-labels";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Product } from "@/types/content";
import { ListingMediaPlaceholder } from "@/components/listing/ListingMediaPlaceholder";

export function ProductListingCard({
  product,
  locale,
  featured = false,
}: {
  product: Product;
  locale: Locale;
  featured?: boolean;
}) {
  const image = resolveMediaUrl(product.cover);

  return (
    <article
      className="listing-card group h-full"
      data-featured={featured ? "true" : undefined}
    >
      <Link
        href={localizedHref(locale, `/products/${product.slug}`)}
        className={`block h-full ${featured ? "md:grid md:grid-cols-2" : ""}`}
      >
        <div className="listing-card-media aspect-[4/3]">
          {image ? (
            <Image
              src={image}
              alt={product.cover?.alternativeText ?? product.name}
              fill
              sizes={featured ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 640px) 40vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingMediaPlaceholder motif="product" />
          )}
        </div>
        <div className="flex min-h-48 flex-col p-6 sm:p-7">
          {product.category ? (
            <p className="listing-eyebrow">
              {categoryLabel(product.category.name, locale)}
            </p>
          ) : null}
          <h2 className={`${product.category ? "mt-3" : ""} text-xl font-semibold text-brand-ink`}>
            {product.name}
          </h2>
          {product.summary ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">
              {product.summary}
            </p>
          ) : null}
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">
            {locale === "zh" ? "查看详情" : "View details"}
            <ArrowRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
