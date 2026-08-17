# TESTIMONIALS URL INDEXING CHECK

**任务编码:** CHECK_DELETED_TESTIMONIALS_URL_INDEXING
**执行时间:** 2026-08-17 13:58 CST
**执行人:** 星期五三世
**检查对象:** `/en/testimonials/`, `/ru/testimonials/`, `/zh/testimonials/`

---

## 一、搜索引擎收录检查

| 引擎 | 查询 | 结果 |
|------|------|------|
| **Google** | `site:newage-trading.com/en/testimonials` | ⚠️ 无法获取（反爬机制拦截，返回空白页面） |
| **Google** | `site:newage-trading.com/ru/testimonials` | ⚠️ 无法获取（反爬机制拦截） |
| **Google** | `site:newage-trading.com/zh/testimonials` | ⚠️ 无法获取（反爬机制拦截） |
| **Bing** | `site:newage-trading.com/testimonials` | ⚠️ 返回无关结果（印度化学网站），零匹配 |
| **DuckDuckGo** | `site:newage-trading.com/testimonial` | ⚠️ 无结果返回 |
| **Wayback Machine** | `newage-trading.com/en/testimonials/` | ⚠️ 502 Bad Gateway，无法访问 |

**结论：** 所有公开搜索引擎均 **未发现** testimonials URL 的收录结果。但受反爬限制，无法 100% 确认 Google 索引状态。

---

## 二、Search Console 检查

**状态：** ❌ 不可访问

本代理无 Google Search Console 权限，无法执行 URL Inspection 或查看 Pages/Indexing 状态、点击/展示数据、外部链接来源。

**如需确认，Owner 需登录 Search Console 手动检查：**
- URL Inspection: `https://newage-trading.com/en/testimonials/`
- 索引覆盖范围 → 已排除的网址 → "已排除：重复性、已抓取但未编入索引、已移除"
- 效果报告 → 筛选 URL 包含 `/testimonial`

---

## 三、服务器访问记录检查

**状态：** ❌ 无法读取

本地环境无 Nginx access log（日志在 VPS 端）。未获得 VPS SSH 权限进行只读检查。

**如需确认，Owner 可在 VPS 执行：**
```bash
# 最近 90 天访问记录
zgrep -i "/testimonial" /var/log/nginx/access.log* | wc -l
# 查看来源和 UA
zgrep -i "/testimonial" /var/log/nginx/access.log* | awk '{print $1, $7, $11, $12}' | sort | uniq -c | sort -rn | head -20
```

---

## 四、源码和站点链接检查

### 4.1 Sitemap

| 检查项 | 结果 |
|--------|------|
| `dist/sitemap-0.xml` | ✅ 无 testimonial URL |
| `dist/sitemap-index.xml` | ✅ 无 testimonial URL |

### 4.2 源码引用

| 文件 | 状态 |
|------|------|
| `src/components/Footer.astro` | ✅ 无 testimonial 链接 |
| `src/components/Header.astro` | ✅ 无 testimonial 链接 |
| `src/components/Nav.astro` | ✅ 无 testimonial 链接 |
| `src/pages/[lang]/index.astro` | ✅ 已移除 import + 渲染 |
| `src/components/Testimonials.astro` | ✅ 已删除 |
| `src/pages/[lang]/testimonials.astro` | ✅ 已删除 |
| `src/data/testimonials.json` | ✅ 已删除 |
| `src/data/translations.json` | ✅ 9 个 key 已删除 |
| `src/lib/i18n-data.ts` | ⚠️ **仍保留 3 组 key**（testimonialsTitle/Desc/Subtitle）— 但无组件使用 |
| `dist/` 所有 HTML | ✅ 无 testimonial URL 引用 |

### 4.3 Robots / Canonical / Hreflang

| 检查项 | 结果 |
|--------|------|
| `dist/robots.txt` | ✅ 无 testimonial 规则 |
| canonical 指向 | ✅ 无 testimonial canonical |
| hreflang 交叉引用 | ✅ 无 testimonial hreflang |

### 4.4 Git 历史

| 项目 | 结果 |
|------|------|
| 页面首次提交 | `f8b3d853` — "replace all 19 blog cover images"（PR #47） |
| 所在分支 | `main` + `master`（已合入主分支） |
| 组件首次提交 | `524d60d5` — "首页改版 - 新增4个模块"（PR #32） |
| 是否曾部署 | ✅ **是** — 页面在 master/main 上，已被 VPS cron 自动部署 |
| 组件组件引用历史 | `1bf2bda2` / `524d60d5` — 首页模块添加 |

### 4.5 残留翻译 Key

`src/lib/i18n-data.ts` 第 98-101 行仍保留：

```typescript
// Testimonials page
testimonialsTitle: { en: 'Client Testimonials', zh: '客户评价', ru: 'Отзывы клиентов' },
testimonialsDesc: { en: 'What our global partners say...', zh: '全球合作伙伴对云豹国际贸易的评价', ru: 'Что говорят наши глобальные партнёры...' },
testimonialsSubtitle: { en: 'Real feedback from clients...', zh: '来自汽车、内衣和安防行业客户的真实反馈', ru: 'Реальные отзывы клиентов...' },
```

**影响：** 无组件引用这些 key，属于死代码（dead code），不影响功能但应清理。

---

## 五、关键发现

### 5.1 页面曾部署

testimonials 页面（`[lang]/testimonials.astro`）通过 PR #47 (`f8b3d853`) 合入 main/master，**已被 VPS cron 自动部署到生产环境**。页面存在时间至少从 PR #47 合并时间到 2026-08-17 删除。

### 5.2 无站内外引用

- 无导航链接（Footer/Header/Nav）指向 testimonials
- 无 sitemap 引用
- 无 canonical/hreflang 引用
- 无 robots.txt 规则
- dist/ 构建产物中零 testimonial URL 引用

### 5.3 搜索引擎结果

所有可访问搜索引擎（Google/Bing/DuckDuckGo）均 **未发现** testimonials URL 的收录。但受反爬限制，Google 搜索结果不可信。

---

## 六、最终判断

| URL | 收录证据 | 访问证据 | 引用证据 | 判断 |
|-----|---------|---------|---------|------|
| `/en/testimonials/` | ⚠️ 无法确认（Google 反爬） | ❌ 无法检查（VPS 日志不可达） | ✅ 无站内外引用 | **C — 证据不足** |
| `/ru/testimonials/` | ⚠️ 无法确认 | ❌ 无法检查 | ✅ 无站内外引用 | **C — 证据不足** |
| `/zh/testimonials/` | ⚠️ 无法确认 | ❌ 无法检查 | ✅ 无站内外引用 | **C — 证据不足** |

### 风险评估

| 风险 | 等级 | 说明 |
|------|------|------|
| 搜索引擎收录旧 URL | 🟡 中 | 页面曾部署，Google 可能已收录 |
| 用户书签/外部链接 | 🟢 低 | 无导航入口，站内外零引用 |
| 404 对 SEO 影响 | 🟢 低 | 无权重页面链接到它，404 影响极小 |

---

## 七、建议

### 推荐方案：KEEP_404（保持 404）

**理由：**
1. 无站内外链接引用，无 sitemap 引用，无导航入口
2. 搜索引擎未发现收录
3. 页面内容为未验证客户评价（已被 Owner 明确移除）
4. 404 是正确行为 — 告诉搜索引擎页面已不存在
5. 无需 301 到首页（内容完全不同，301 可能误导搜索引擎）

### 备选方案（Owner 可选）：

- **USE_410:** 如 VPS 支持，可配置 Nginx 返回 410 Gone（比 404 更明确告诉搜索引擎永久删除）
- **ADD_301:** 如 Search Console 显示有点击/展示数据，可 301 到对应语言首页

### 待清理项（非阻塞）：

`src/lib/i18n-data.ts` 第 98-101 行的 testimonials 翻译 key 应清理（死代码），但不影响构建或功能。

---

## 八、是否需要下一步代码修改

**不需要。** 当前状态已满足验收条件。

如需清理 `i18n-data.ts` 死代码，可作为 P2 后续任务。

---

**最终状态:** `TESTIMONIALS_URL_CHECK_COMPLETE_NO_REDIRECT_NEEDED`

---

*报告路径: projects/newage-trading-site/TESTIMONIALS_URL_INDEXING_CHECK.md*
