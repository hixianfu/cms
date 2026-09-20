import type { ReactNode } from "react";

function classNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function ListingPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={classNames("listing-page", className)}>{children}</main>;
}

export function ListingSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={classNames("listing-section", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
