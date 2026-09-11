export const cacheTags = {
  global: "global",
  homePage: "home-page",
  about: "about",
  contactPage: "contact-page",
  products: "products",
  product: (slug: string) => `product:${slug}`,
  articles: "articles",
  article: (slug: string) => `article:${slug}`,
} as const;
