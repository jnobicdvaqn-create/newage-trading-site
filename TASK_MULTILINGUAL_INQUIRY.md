# 三语产品展示与结构化询盘改版任务

## 约束
- **不部署、不合并、不修改生产目录**
- **功能分支**: `feat/multilingual-product-inquiry-v1`
- **不删除现有页面**,旧 URL 保留或 301 映射
- **不提交真实询盘**,本地测试用 mock/stub
- **不修改** `/var/www/newage-trading.com/`

## 执行进度

### Phase 1: 信息架构与导航 ✅
- [x] 1.1 更新 Header.astro 导航为 6 项主导航 + More 下拉
- [x] 1.2 添加翻译键 nav.vehicles, nav.textiles, nav.supplyChain, nav.insights, nav.more
- [x] 1.3 Security 降为 More > Specialized Products
- [x] 1.4 Footer 链接同步更新
- [x] 1.5 保留 /en/, /ru/, /zh/ 三语路由

### Phase 2: 首页改版 ✅
- [x] 2.1 Hero 聚焦三业务: Vehicle Export, Textiles & OEM, Supply Chain Services
- [x] 2.2 每个业务独立入口+流程说明+代表产品+询盘按钮
- [x] 2.3 合并重复 Factory Direct 模块
- [x] 2.4 固定价格改为 Request Current Quote
- [x] 2.5 数据/认证/评价/承诺增加内容核验标记

### Phase 3: 产品展示系统 ✅
- [x] 3.1 可复用三语产品卡片模板 ProductCardV2.astro
- [x] 3.2 产品详情模板字段完整
- [x] 3.3 汽车筛选组件 VehicleFilters.astro
- [x] 3.4 纺织品筛选组件 TextileFilters.astro
- [x] 3.5 供应链服务卡片 SupplyChainCard.astro

### Phase 4: 询盘构建器 ✅
- [x] 4.1 三步询盘组件 InquiryBuilder.astro
- [x] 4.2 复用现有联系表单后端
- [x] 4.3 本地测试 mock/stub

### Phase 5: 多语言质量 ✅
- [x] 5.1 三语共用数据结构和组件
- [x] 5.2 检查翻译键/英文残留/语言混入
- [x] 5.3 修正"三大业务/四大业务"不一致
- [x] 5.4 生成内容审计清单

### Phase 6: SEO 审计 ✅
- [x] 6.1-6.8 全部完成，见 SEO_AUDIT.md

### Phase 7: 验收 ✅
- [x] 7.1-7.7 全部完成

## 详细步骤

### Phase 1: 信息架构与导航
1. 调整一级导航: Vehicles, Textiles, Supply Chain, Insights, About, Contact
2. Security Equipment 降为 More/Specialized Products
3. 保留 /en/, /ru/, /zh/ 三语路由

### Phase 2: 首页改版
1. Hero 聚焦三业务: Vehicle Export, Textiles & OEM, Supply Chain Services
2. 每个业务独立入口+流程说明+代表产品+询盘按钮
3. 合并重复 Factory Direct 模块
4. 固定价格改为 Request Current Quote
5. 数据/认证/评价/承诺增加内容核验标记

### Phase 3: 产品展示系统
1. 可复用三语产品卡片模板
2. 产品详情模板字段: category, title, images, short_description, specifications, MOQ, destination_availability, locale, verification_status, inquiry_reference
3. 汽车筛选: 新车/二手车/能源类型
4. 纺织品筛选: 品类/材质/OEM-ODM/MOQ
5. 供应链服务卡片(不伪装成实体产品)

### Phase 4: 询盘构建器
1. 三步询盘: 业务选择→需求详情→联系信息+预览
2. 复用现有联系表单后端
3. 本地测试用 mock/stub,禁止真实邮件

### Phase 5: 多语言质量
1. 三语共用数据结构和组件
2. 检查翻译键/英文残留/语言混入
3. 修正"三大业务/四大业务"不一致
4. 生成内容审计清单

### Phase 6: SEO 审计
1. 三语可索引状态
2. Title/Description/H1
3. canonical 与 hreflang
4. sitemap/robots.txt
5. 状态码/404/重定向
6. 结构化数据
7. Core Web Vitals 风险
8. 关键词与页面映射

### Phase 7: 验收
- 三语首页可构建浏览
- 桌面/移动端导航正常
- 分类切换/筛选/详情/询盘摘要可操作
- 旧 URL 无计划外 404
- 无真实外部提交
- 输出构建结果/测试报告/变更清单/内容核验清单
