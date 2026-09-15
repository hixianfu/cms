export const cacheTags = {
  global: (locale: string) => `global:${locale}`,
  homePage: (locale: string) => `home-page:${locale}`,
  about: (locale: string) => `about:${locale}`,
  contactPage: (locale: string) => `contact-page:${locale}`,
  products: (locale: string) => `products:${locale}`,
  product: (locale: string, slug: string) => `product:${locale}:${slug}`,
  articles: (locale: string) => `articles:${locale}`,
  article: (locale: string, slug: string) => `article:${locale}:${slug}`,
  cases: (locale: string) => `cases:${locale}`,
  caseStudy: (locale: string, slug: string) => `case-study:${locale}:${slug}`,
  videos: (locale: string) => `videos:${locale}`,
  video: (locale: string, slug: string) => `video:${locale}:${slug}`,
} as const;
