# 客户案例阶段四设计

## 目标

复用 Strapi 现有 `case-study` 内容类型，完成中英文客户案例列表与详情页面，并提供行业、产品、应用场景筛选、标题搜索、推荐排序、关联内容展示和询盘入口。

## 架构决策

- 不新增或迁移 Strapi 内容模型。现有 `api::case-study.case-study` 已包含 `contentLocale`、标题、slug、summary、industry、customerProblem、originalPackaging、solution、results、cover、gallery，以及 products、solutions、scenarios、videos、articles 关系。
- 前端继续采用 App Router 的服务端页面和现有 `lib/strapi/queries.ts` 查询层。所有列表和详情请求按 `contentLocale` 过滤，并显式 populate 媒体与关系。
- 行业第一版沿用字符串字段，从返回案例中去重生成筛选项；产品和场景使用关系过滤。后续数据量扩大时可独立行业分类模型，不影响页面接口。
- URL 查询参数固定为 `q`、`industry`、`product`、`scenario`。筛选组合通过 Strapi `$containsi`、关系 slug `$eq` 和 `featured`/排序参数编码。

## 页面设计

### 案例列表

路径：`/[locale]/cases`。

页面包括品牌化页头、标题搜索框、行业/产品/场景筛选、清除筛选操作、案例卡片网格和无结果状态。案例卡片展示封面、行业、标题、摘要和详情链接。中文和英文文案由 locale 分支提供，数据由 Strapi 的 `contentLocale` 决定。

### 案例详情

路径：`/[locale]/cases/[slug]`。

页面展示面包屑、标题、行业、封面、客户问题、原包装方式、Ameson 解决方案、实施效果、图库/视频媒体、关联产品、关联解决方案、关联应用场景、相关文章，以及联系页面 CTA。不存在或语言不匹配时调用 `notFound()`。详情 metadata 使用案例 SEO 字段回退到标题和摘要。

## 查询接口

- `getCaseStudies(locale?, query?)`: 返回按 `sortOrder:asc,featured:desc,createdAt:desc` 排序的案例数组，显式 populate `cover`、`gallery`、`products`、`solutions`、`scenarios`。
- `getCaseStudyBySlug(slug, locale?)`: 以 slug 和 locale 精确查询，populate 所有详情关系与媒体，返回单项或 null。

## 验证

- 为查询参数和筛选 URL 编码添加单元测试。
- 为案例卡片/筛选状态添加组件测试。
- 运行相关 Vitest、TypeScript 检查和生产构建。
