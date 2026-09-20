export function ListingPageSkeleton({
  variant,
  sidebar = false,
}: {
  variant: "immersive" | "compact";
  sidebar?: boolean;
}) {
  return (
    <main
      className="listing-page"
      data-testid="listing-page-skeleton"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className={`listing-hero-skeleton listing-hero-skeleton--${variant}`} />
      <div
        className={
          sidebar ? "listing-loading-grid listing-loading-grid--sidebar" : "listing-loading-grid"
        }
      >
        {sidebar ? <div className="listing-sidebar-skeleton" /> : null}
        <div className="listing-card-skeleton-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              data-testid="listing-card-skeleton"
              className="listing-card-skeleton"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
