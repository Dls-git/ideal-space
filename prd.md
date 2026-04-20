# SEO 优化改进 PRD

## 项目背景

Ideal Space Solutions 是一家位于墨尔本的商业石膏施工人力与项目支持服务公司，官网（ideal.space.au）基于 React 19 + Vite 8 + React Router v7 构建，采用纯客户端渲染（CSR）SPA 架构。当前网站 SEO 存在若干关键问题，影响搜索引擎收录和社交媒体分享效果。

---

## 现状问题总结

| 优先级 | 问题 | 影响 |
|--------|------|------|
| **P0** | 无 SSR/SSG，所有页面初始 HTML 为空壳 | 搜索引擎和社交爬虫对所有路由看到相同的静态 meta 标签，收录效果差 |
| **P0** | 域名不一致：sitemap 用 `idealspace.au`，canonical/meta 用 `ideal.space.au` | 搜索引擎混淆规范域名，可能产生重复内容问题 |
| **P1** | Services / Projects / Contact 页缺少 h1 标签 | 页面缺少主标题，搜索引擎难以理解页面主题 |
| **P1** | 无按路由动态设置 og:image / twitter:image | 社交分享始终显示同一张默认图片 |
| **P1** | 无路由级代码分割（React.lazy） | 首屏 JS 体积大，交互时间（TTI）慢 |
| **P2** | 图片无懒加载（loading="lazy"） | 浪费带宽，LCP 指标受影响 |
| **P2** | 仅有一组 LocalBusiness 结构化数据，无路由级 Schema | 错过富摘要展示机会 |
| **P2** | 无专用 404 页面，未知路由静默重定向首页 | 搜索引擎可能将其视为软 404 |
| **P2** | 无 Vercel 缓存头配置 | 重复访问性能不佳 |
| **P3** | 无 `<link rel="preconnect">` / `<link rel="preload">` | 关键资源加载速度可优化 |
| **P3** | Footer logo alt 与 Header 重复 | 辅助功能小问题 |

---

## 改进方案

### P0-1：引入预渲染（Prerender）解决 CSR 空壳问题

**目标**：让搜索引擎和社交爬虫获取到完整的、包含路由级 meta 标签的 HTML。

**方案**：使用 `vite-plugin-prerender` 在构建时为每个路由生成静态 HTML。

**需求细节**：

1. 安装 `vite-plugin-prerender` 并在 `vite.config.js` 中配置
2. 预渲染路由列表：`/`、`/services`、`/projects`、`/contact`
3. 每个预渲染页面应包含：
   - 完整的 DOM 内容（非空 `<div id="root">`）
   - 正确的 `<title>` 和 meta 标签
   - 正确的 canonical URL
   - 正确的 og:image 和 twitter:image
4. 构建产物中生成对应的 `index.html` 文件（如 `dist/services/index.html`）
5. 预渲染不应阻塞后续的客户端水合（hydration），JS 加载后 SPA 仍正常工作

**验收标准**：

- `curl https://ideal.space.au/services` 返回的 HTML 中包含 Services 页面的完整内容和专属 meta 标签
- Facebook Sharing Debugger / Twitter Card Validator 能正确抓取每个路由的 og 标签
- 各路由页面在浏览器中仍可正常交互

---

### P0-2：统一域名

**目标**：消除 sitemap 与 canonical/meta 之间的域名不一致。

**方案**：确认规范域名后，将所有引用统一为同一域名。

**需求细节**：

1. 确认规范域名为（`ideal.space.au`)
2. 更新 `public/sitemap.xml` 中所有 URL 为规范域名
3. 更新 `index.html` 中的 canonical、og:url
4. 更新 `src/App.jsx` 中 `SEO_BY_PATH` 的 URL 前缀和 `RouteSeo` 组件中的 canonical 生成逻辑
5. 更新 `public/robots.txt` 中的 Sitemap URL
6. 更新 `index.html` 中 JSON-LD 的 `url` 和 `image` 字段
7. 在 Vercel 配置中设置非规范域名 301 重定向到规范域名

**验收标准**：

- 所有页面 canonical URL 指向同一域名
- sitemap.xml 和 robots.txt 中域名一致
- 非规范域名访问时 301 重定向到规范域名
- Google Search Console 中只保留规范域名的资源

---

### P1-1：为每个页面添加 h1 标签

**目标**：每个路由页面有且仅有一个 h1，清晰表达页面主题。

**方案**：在缺少 h1 的页面组件中添加合适的 h1。

**需求细节**：

| 路由 | 当前状态 | 改进 |
|------|----------|------|
| `/` | Hero 有 h1 | 保持不变 |
| `/services` | 无 h1，从 h2 开始 | 在 Services 组件顶部区域添加 h1，内容如 "Commercial Plastering Services" |
| `/projects` | 无 h1，从 h2 开始 | 在 Projects 组件顶部区域添加 h1，内容如 "Our Projects" |
| `/contact` | 无 h1，从 h2 开始 | 将现有首个 h2 改为 h1，或将联系表单区域标题提升为 h1 |

**注意事项**：

- h1 应在视觉上与当前设计协调，可通过 CSS 控制字号
- 确保现有 h2/h3 层级在添加 h1 后仍然合理
- 首页 Hero 的 h1 保持不变

**验收标准**：

- 每个路由页面有且仅有 1 个 h1
- h1 内容语义化，包含页面核心关键词
- 页面标题层级完整：h1 → h2 → h3，无跳级

---

### P1-2：为每个路由设置独立的 og:image 和 twitter:image

**目标**：不同页面在社交分享时展示不同的预览图。

**方案**：扩展 `SEO_BY_PATH` 配置，增加 `ogImage` 字段；在 `RouteSeo` 组件中动态更新 og:image 和 twitter:image。

**需求细节**：

1. 为每个路由设计/准备专属的社交分享图（建议尺寸 1200×630px）：
   - 首页：品牌宣传图
   - Services：服务概览图
   - Projects：项目案例图
   - Contact：联系咨询图
2. 图片放置在 `public/og/` 目录下（如 `public/og/home.jpg`）
3. 在 `SEO_BY_PATH` 中为每个路由添加 `ogImage` 字段
4. 在 `RouteSeo` 组件中添加 og:image 和 twitter:image 的动态更新逻辑
5. 确保图片 URL 使用绝对路径

**验收标准**：

- 分享 `/services` 链接到 Facebook/Twitter 时展示 Services 专属图片
- 分享 `/projects` 链接展示 Projects 专属图片
- 各路由的 og:image URL 正确且图片可访问

---

### P1-3：路由级代码分割

**目标**：减少首屏 JS 体积，加快首屏加载速度。

**方案**：使用 `React.lazy()` + `Suspense` 实现路由级懒加载。

**需求细节**：

1. 在 `App.jsx` 中将页面组件改为 `React.lazy()` 动态导入：
   ```
   const HomePage = lazy(() => import('./pages/HomePage'));
   const ServicesPage = lazy(() => import('./pages/ServicesPage'));
   ...
   ```
2. 使用 `<Suspense fallback={...}>` 包裹路由组件，fallback 为简单的 loading 状态（如品牌色 spinner）
3. 保持 `RouteSeo` 和 `ScrollToTop` 等非页面组件为同步导入
4. Vite 会自动将懒加载组件拆分为独立 chunk

**验收标准**：

- 首屏只加载首页所需的 JS chunk
- 切换到其他路由时动态加载对应 chunk
- Lighthouse Performance 分数提升
- 页面切换时有合理的 loading 状态，无白屏闪烁

---

### P2-1：图片懒加载

**目标**：减少首屏图片请求量，改善 LCP。

**需求细节**：

1. 首屏可视区域内的图片保持即时加载
2. 非首屏图片添加 `loading="lazy"` 属性
3. 特别处理项目案例图片（Visuals 组件），均为懒加载
4. 为所有图片添加 `decoding="async"` 属性

**验收标准**：

- 首屏图片立即加载
- 非首屏图片在滚动到可视区域附近时才加载
- Network 面板中图片请求与滚动行为一致

---

### P2-2：丰富结构化数据

**目标**：增加 Google 富摘要展示机会。

**方案**：为每个路由添加对应的 JSON-LD 结构化数据。

**需求细节**：

1. **首页**：完善现有 `LocalBusiness` Schema，补充字段：
   - `address`（结构化地址：streetAddress, addressLocality, addressRegion, postalCode, addressCountry）
   - `geo`（经纬度坐标）
   - `openingHours`
   - `priceRange`
   - `sameAs`（社交媒体链接）
2. **Services 页**：添加 `Service` Schema，包含：
   - 服务名称、描述
   - 提供者（引用 LocalBusiness）
   - 服务区域（Melbourne）
3. **Projects 页**：添加 `ItemList` Schema，列出项目案例
4. **所有页面**：添加 `BreadcrumbList` Schema，展示导航路径
5. 结构化数据在预渲染时需写入 HTML

**验收标准**：

- Google Rich Results Test 中每个路由均能识别对应的结构化数据
- 无结构化数据错误或警告
- BreadcrumbList 与实际面包屑导航一致

---

### P2-3：创建专用 404 页面

**目标**：正确处理不存在路由，避免软 404 问题。

**需求细节**：

1. 创建 `NotFoundPage` 组件，包含：
   - 404 状态码/文案提示
   - 返回首页的链接/按钮
   - 与网站整体设计风格一致
2. 在路由配置中将 `*` 路由指向 `NotFoundPage`（而非 `Navigate to="/"`)
3. 404 页面的 meta 标签：`<meta name="robots" content="noindex, follow">`
4. 预渲染时也生成 404 页面的静态 HTML

**验收标准**：

- 访问不存在的路径（如 `/abc`）显示 404 页面而非重定向到首页
- 404 页面 meta robots 为 noindex
- 404 页面提供返回首页的明确入口

---

### P2-4：配置 Vercel 缓存头

**目标**：优化静态资源缓存策略，提升重复访问速度。

**需求细节**：

1. 在 `vercel.json` 的 `headers` 配置中添加：
   - 静态资源（`/_assets/*`）：`Cache-Control: public, max-age=31536000, immutable`
   - HTML 页面：`Cache-Control: public, max-age=0, must-revalidate`
   - 图片资源（`/*.webp`, `/*.jpg`, `/*.png`）：`Cache-Control: public, max-age=86400, s-maxage=604800`
2. 确保缓存策略不影响内容更新后的即时生效

**验收标准**：

- 静态 JS/CSS 资源返回 `immutable` 缓存头
- HTML 页面每次访问都检查更新
- Lighthouse 缓存策略审计通过

---

### P3-1：添加资源预连接和预加载

**目标**：加速关键资源的加载速度。

**需求细节**：

1. 在 `index.html` 中添加 `<link rel="preconnect">`：
   - 对 Google Fonts 域名（如使用了 Google Fonts）
   - 对 Vercel CDN 域名
2. 在 `index.html` 中添加 `<link rel="preload">`：
   - 首屏关键图片（hero 背景）
   - 关键字体文件（如有）

**验收标准**：

- 关键外部域名的 DNS/TLS 握手提前完成
- Hero 图片加载时间缩短

---

### P3-2：Footer Logo Alt 文本优化

**目标**：提升辅助功能体验。

**需求细节**：

- 将 Footer 中 logo 图片的 alt 从 "Ideal Space Solutions" 改为 `alt=""`（装饰性图片），因为公司名称已在 Footer 文本中展示

**验收标准**：

- 屏幕阅读器不会重复朗读公司名称

---

## 实施优先级建议

```
第一阶段（P0）：域名统一 + 预渲染引入
  └─ 这两项是基础，解决后其他优化才有意义

第二阶段（P1）：h1 修复 + og:image + 代码分割
  └─ 提升搜索引擎理解和社交分享效果

第三阶段（P2）：图片懒加载 + 结构化数据 + 404 页面 + 缓存头
  └─ 进一步提升 SEO 效果和用户体验

第四阶段（P3）：预连接/预加载 + alt 优化
  └─ 细节打磨
```

---

## 效果衡量

改进完成后，通过以下指标评估效果：

| 指标 | 当前预估 | 目标 |
|------|----------|------|
| Google 索引页面数 | 1（仅首页可能被正确索引） | 4+ |
| Lighthouse SEO 分数 | ~70 | 90+ |
| Lighthouse Performance 分数 | ~60 | 80+ |
| 社交分享预览 | 所有页面同一图片 | 每页独立预览图 |
| Google Rich Results | 仅 LocalBusiness | LocalBusiness + Service + BreadcrumbList |
| 首屏 JS 体积 | 全量 bundle | 仅首页 chunk |
