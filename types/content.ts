export type Locale = "zh" | "en" | string;
export type Media = { url: string; alternativeText?: string | null; width?: number; height?: number; mime?: string };
export type Seo = { metaTitle?: string | null; metaDescription?: string | null; shareImage?: Media | null; canonicalUrl?: string | null };
export type NavigationItem = { label: string; href: string; external?: boolean };
export type HeaderContentItem = { id: number | string; title: string; slug: string; industry?: string | null; category?: ContentCategory | null };
export type HeaderMegaMenuData = {
  solutions: HeaderContentItem[];
  scenarios: HeaderContentItem[];
  cases: HeaderContentItem[];
  articles: HeaderContentItem[];
};
export type Global = { siteName: string; siteDescription?: string | null; favicon?: Media | null; logo?: Media | null; logoAlt?: string | null; defaultSeo?: Seo | null; navigation?: NavigationItem[]; footerText?: string | null; footerLinks?: NavigationItem[]; socialLinks?: NavigationItem[] };
export type HeroSlide = { eyebrow?: string | null; title: string; description?: string | null; image?: Media | null; imageAlt?: string | null; href?: string | null; linkUrl?: string | null; ctaLabel?: string | null; linkLabel?: string | null };
export type ProductVideo = { id?: number | string; title: string; kind?: "promotional" | "operation" | "maintenance" | "other"; description?: string | null; video?: Media | null };
export type Product = { id: number | string; contentLocale?: Locale; name: string; slug: string; summary?: string | null; details?: string | null; cover?: Media | null; gallery?: Media[]; videos?: Media[]; productVideos?: ProductVideo[]; specifications?: Array<{ label: string; value: string }>; documents?: Array<{ name: string; file?: Media | null }>; category?: { name: string; slug: string } | null; sortOrder?: number; featured?: boolean; blocks?: unknown[]; seo?: Seo | null };
export type ProductCategory = { id: number | string; contentLocale?: Locale; name: string; slug: string; description?: string | null; sortOrder?: number; parent?: ProductCategory | null; children?: ProductCategory[] };
export type ArticleCategory = { id: number | string; contentLocale?: Locale; name: string; slug: string; description?: string | null };
export type ContentCategory = { id: number | string; contentLocale?: Locale; name: string; slug: string; description?: string | null; sortOrder?: number };
export type ContentReference = { id?: number | string; name?: string; title?: string; slug: string };
export type Solution = { id: number | string; contentLocale?: Locale; title: string; slug: string; summary: string; category?: ContentCategory | null; industry?: string | null; customerPain?: string | null; packagingNeeds?: string | null; content?: string | null; cover?: Media | null; products?: ContentReference[]; scenarios?: ContentReference[]; cases?: ContentReference[]; videos?: ContentReference[]; articles?: ContentReference[]; sortOrder?: number; featured?: boolean; seo?: Seo | null };
export type Scenario = { id: number | string; contentLocale?: Locale; title: string; slug: string; summary: string; category?: ContentCategory | null; industry?: string | null; content?: string | null; cover?: Media | null; products?: ContentReference[]; solutions?: ContentReference[]; cases?: ContentReference[]; videos?: ContentReference[]; articles?: ContentReference[]; sortOrder?: number; featured?: boolean; seo?: Seo | null };
export type SearchResult = { kind: "product" | "solution" | "scenario" | "case" | "video" | "article" | "faq"; item: Product | Solution | Scenario | CaseStudy | Video | Article | Faq };
export type CaseStudy = { id: number | string; contentLocale?: Locale; title: string; slug: string; summary: string; category?: ContentCategory | null; industry?: string | null; customerProblem?: string | null; originalPackaging?: string | null; solution?: string | null; results?: string | null; cover?: Media | null; gallery?: Media[]; products?: ContentReference[]; solutions?: ContentReference[]; scenarios?: ContentReference[]; videos?: ContentReference[]; articles?: ContentReference[]; sortOrder?: number; featured?: boolean; seo?: Seo | null };
export type Video = { id: number | string; contentLocale?: Locale; title: string; slug: string; description?: string | null; category: string; cover?: Media | null; file?: Media | null; externalUrl?: string | null; products?: ContentReference[]; solutions?: ContentReference[]; scenarios?: ContentReference[]; cases?: ContentReference[]; articles?: ContentReference[]; sortOrder?: number; featured?: boolean; seo?: Seo | null };
export type Faq = { id: number | string; contentLocale?: Locale; question: string; slug: string; answer: string; category: string; products?: ContentReference[]; solutions?: ContentReference[]; sortOrder?: number; featured?: boolean; seo?: Seo | null };
export type Article = { id: number | string; contentLocale?: Locale; title: string; slug: string; description?: string | null; cover?: Media | null; publishedAt?: string | null; author?: { name: string } | null; category?: ArticleCategory | null; products?: ContentReference[] | null; solutions?: ContentReference[] | null; scenarios?: ContentReference[] | null; cases?: ContentReference[] | null; videos?: ContentReference[] | null; faqs?: Faq[] | null; blocks?: unknown[]; seo?: Seo | null };
export type Cta = { title: string; description?: string | null; label: string; url: string; image?: Media | null; imageAlt?: string | null };
export type HomeFeatureCard = { id?: number | string; title: string; description?: string | null; image?: Media | null; targetType: "product" | "article" | "solution" | "scenario" | "case"; product?: ContentReference | null; article?: ContentReference | null; solution?: ContentReference | null; scenario?: ContentReference | null; case?: ContentReference | null };
export type HomeShowcaseHighlight = { id?: number | string; text: string };
export type HomeCompanyShowcase = { title: string; subtitle?: string | null; description?: string | null; buttonLabel?: string | null; backgroundImage?: Media | null; imageAlt?: string | null; article?: ContentReference | null; highlights?: HomeShowcaseHighlight[] };
export type HomeSection =
  | { __component: "shared.home-hero"; slides?: HeroSlide[] }
  | { __component: "shared.home-products"; title?: string | null; products?: Product[] }
  | { __component: "shared.home-articles"; title?: string | null; articles?: Article[] }
  | { __component: "shared.home-solutions"; title?: string | null; solutions?: Solution[] }
  | { __component: "shared.home-scenarios"; title?: string | null; scenarios?: Scenario[] }
  | { __component: "shared.home-cases"; title?: string | null; cases?: CaseStudy[] }
  | { __component: "shared.home-videos"; title?: string | null; videos?: Video[] }
  | { __component: "shared.home-faqs"; title?: string | null; faqs?: Faq[] }
  | { __component: "shared.home-feature-cards"; title: string; description?: string | null; cards?: HomeFeatureCard[] }
  | ({ __component: "shared.home-company-showcase" } & HomeCompanyShowcase);
export type HomePage = { introTitle?: string | null; intro?: string | null; sections?: HomeSection[]; cta?: Cta | null; blocks?: unknown[]; seo?: Seo | null };
export type About = { title: string; cover?: Media | null; coverAlt?: string | null; blocks?: unknown[]; seo?: Seo | null };
export type ContactPage = { title?: string; intro?: string; address?: string; phone?: string; email?: string; mapEmbedUrl?: string; officeHours?: string; formTitle?: string; formIntro?: string; seo?: Seo | null };
