import { defaultLocale, isLocale, type Locale } from "./config";
export function localizedHref(locale: Locale, href: string) {
  if (/^https?:\/\//.test(href)) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  if (path === "/" || path === `/${locale}`) return `/${locale}`;
  const withoutLocale = /^\/(zh|en)(?=\/|$)/.test(path) ? path.replace(/^\/(zh|en)/, "") || "/" : path;
  return `/${locale}${withoutLocale}`;
}
export function parseLocale(value: string): Locale { return isLocale(value) ? value : defaultLocale; }
