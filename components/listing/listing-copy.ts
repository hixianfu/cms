export function formatListingCount(
  locale: string,
  count: number,
  singular: string,
  plural?: string,
) {
  const formattedCount = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale).format(
    count,
  );
  const label = count === 1 || !plural ? singular : plural;

  return locale.startsWith("zh")
    ? `${formattedCount}${label}`
    : `${formattedCount} ${label}`;
}
