# 部署与运维说明

## 环境变量

复制 `.env.example` 为 `.env.local`（生产环境使用平台的 secret 配置），并设置：

- `STRAPI_URL`：Strapi 公网地址
- `STRAPI_API_TOKEN`：只读 API token，不要提交到 Git
- `STRAPI_MEDIA_HOST` / `STRAPI_MEDIA_PORT`：媒体域名配置
- `NEXT_PUBLIC_SITE_URL`：站点的 canonical URL
- `REVALIDATE_WEBHOOK_SECRET`：与 Strapi webhook 相同的随机密钥

## 本地启动

```bash
pnpm install
pnpm dev
```

Strapi 与 Next.js 应分别启动。生产构建使用 `pnpm build`，启动使用 `pnpm start`。

## Strapi 缓存刷新 webhook

将 Strapi 的发布、更新和删除事件 POST 到 `/api/revalidate`，请求头设置：

```text
x-strapi-signature: sha256=<HMAC-SHA256(raw request body, REVALIDATE_WEBHOOK_SECRET)>
```

请求体至少包含 `model`，可选 `entry.slug` 与 `entry.locale`（或 `entry.contentLocale`）。接口会按语言刷新产品、文章、方案、场景、案例、视频、FAQ 及页面缓存。签名错误返回 401，非法 JSON 返回 400。

## 上线检查

- 确认 Strapi 只对公开读取开放权限，写入权限仅供服务端使用。
- 确认媒体域名已加入 Next.js 图片远程来源配置。
- 验证 `/robots.txt` 与 `/sitemap.xml` 返回 200。
- 首次上线前备份数据库和媒体文件；Strapi schema 变更后先在测试环境执行迁移。
- 不要把 `.env.local`、API token 或 webhook secret 提交到仓库。
