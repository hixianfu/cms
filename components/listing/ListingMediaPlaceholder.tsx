type ListingMediaMotif =
  | "product"
  | "solution"
  | "scenario"
  | "case"
  | "video"
  | "article";

export function ListingMediaPlaceholder({
  motif,
  label,
  className,
}: {
  motif: ListingMediaMotif;
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={["listing-media-placeholder", className].filter(Boolean).join(" ")}
      data-motif={motif}
      data-testid="listing-media-placeholder"
    >
      <span className="listing-media-placeholder__motif" />
      {label ? <span className="listing-media-placeholder__label">{label}</span> : null}
    </div>
  );
}
