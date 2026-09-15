import type { Locale } from "./config";

export const messages: Record<Locale, Record<string, string>> = {
  zh: { menu: "菜单", close: "关闭菜单", home: "首页", about: "关于我们", products: "产品", blog: "博客", contact: "联系我们", categories: "产品分类", allProducts: "全部产品", overview: "概览", responsibility: "社会责任", factory: "工厂展示", faq: "常见问题", video: "视频", recommends: "推荐", projects: "项目", explore: "查看详情" },
  en: { menu: "Menu", close: "Close menu", home: "Home", about: "About", products: "Products", blog: "Blog", contact: "Contact", categories: "Product categories", allProducts: "All products", overview: "Overview", responsibility: "Responsibility", factory: "Factory Display", faq: "FAQ", video: "Video", recommends: "Recommends", projects: "Projects", explore: "View details" },
};

export const categoryLabels: Record<string, string> = { "Air Cushion Machine": "气垫机", "Air Cushion Film": "气垫膜", "Paper Cushion": "纸垫", "Foam in Place": "现场发泡", "Padded Mailer": "缓冲信封", "Gummed Paper Tape": "湿水牛皮纸胶带", "Air Column Bag": "气柱袋", "Dunnage Bags": "集装箱充气袋" };
export function localizedCategoryName(name: string, locale: Locale) { return locale === "zh" ? categoryLabels[name] ?? name : name; }
