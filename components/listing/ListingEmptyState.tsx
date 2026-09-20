export function ListingEmptyState({
  message,
  resetHref,
  resetLabel,
}: {
  message: string;
  resetHref: string;
  resetLabel: string;
}) {
  return (
    <section className="listing-empty">
      <p>{message}</p>
      <a className="brand-button-primary" href={resetHref}>
        {resetLabel}
      </a>
    </section>
  );
}
