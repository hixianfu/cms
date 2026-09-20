export function ListingResultHeader({
  eyebrow,
  title,
  count,
  countLabel,
}: {
  eyebrow: string;
  title: string;
  count: number;
  countLabel: string;
}) {
  return (
    <div className="listing-result-header">
      <div>
        <p className="listing-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p className="listing-count" aria-live="polite">
        {count} {countLabel}
      </p>
    </div>
  );
}
