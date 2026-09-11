import type { Locale } from "./config";
export const messages: Record<Locale, Record<string, string>> = {
  zh: { menu: "菜单", close: "关闭菜单", home: "首页", about: "关于我们", products: "产品", blog: "博客", contact: "联系我们", missing: "内容暂不可用" },
  en: { menu: "Menu", close: "Close menu", home: "Home", about: "About", products: "Products", blog: "Blog", contact: "Contact", missing: "Content unavailable" },
};
