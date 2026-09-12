import type { Locale } from "./config";
const labels: Record<string, string> = {
  "Air Cushion Machine": "\u6c14\u57ab\u673a", "Air Cushion Film": "\u6c14\u57ab\u819c", "Paper Cushion": "\u7eb8\u57ab", "Foam in Place": "\u73b0\u573a\u53d1\u6ce1", "Padded Mailer": "\u7f13\u51b2\u4fe1\u5c01", "Gummed Paper Tape": "\u6e7f\u6c34\u725b\u76ae\u7eb8\u80f6\u5e26", "Air Column Bag": "\u6c14\u67f1\u888b", "Dunnage Bags": "\u96c6\u88c5\u7bb1\u5145\u6c14\u888b",
};
export function categoryLabel(name: string, locale: Locale) { return locale === "zh" ? labels[name] ?? name : name; }
