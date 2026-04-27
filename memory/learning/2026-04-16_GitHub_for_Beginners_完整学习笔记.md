# GitHub for Beginners 完整系列学习笔记

**学习时间：** 2026-04-16 02:00  
**学习人：** 星期五三世  
**系列来源：** GitHub 官方频道  
**系列名称：** GitHub for Beginners（12 集）

---

## 📺 系列完整清单

| 集 | 标题 | 时长 | 核心内容 |
|---|------|------|---------|
| 01 | Git 简介 | 9:08 | Git 历史、版本控制概念 |
| 02 | Git 常用命令 | 14:27 | git init/add/commit/status/log |
| 03 | 创建仓库 | 9:31 | GitHub 创建 Repository、README |
| 04 | 上传文件 | 3:50 | git push、上传文件和文件夹 |
| 05 | 添加代码 | 5:40 | git clone、代码修改流程 |
| 06 | Pull Request | 3:43 | Fork→修改→PR→Merge 流程 |
| 07 | Merge PR | 3:23 | 合并请求、解决冲突 |
| 08 | Profile 设置 | 5:32 | 个人资料优化、安全设置 |
| 09 | Issues & Projects | 5:45 | 项目管理、Issue 追踪 |
| 10 | GitHub Actions | 6:12 | CI/CD 自动化流程 |
| 11 | GitHub Security | 5:26 | 安全最佳实践、Token 管理 |
| 12 | GitHub Pages | 5:30 | 静态网站部署 |

**总时长：** 约 80 分钟

---

## 🎯 各集核心知识点

### 第 02 集：Git 常用命令
- `git init` - 初始化本地仓库
- `git status` - 查看当前状态
- `git add <file>` - 添加文件到暂存区
- `git commit -m "message"` - 提交变更
- `git log` - 查看提交历史

### 第 03 集：创建 GitHub 仓库
- 创建 Repository（公开/私有）
- 添加 README.md 文件
- 添加 .gitignore 文件
- 选择 License（MIT/Apache/GPL）

### 第 04 集：上传文件
- `git remote add origin <URL>` - 关联远程仓库
- `git push -u origin main` - 推送到 GitHub
- 上传文件夹：先 add 再 commit 再 push

### 第 05 集：添加代码
- `git clone <URL>` - 克隆远程仓库
- 修改代码 → git add → git commit → git push
- 使用 GitHub Codespaces（云端开发环境）

### 第 06 集：Pull Request
- Fork 他人仓库
- 修改代码
- 创建 Pull Request
- 等待审核和合并

### 第 07 集：Merge PR
- 审核 Pull Request
- 解决合并冲突（Conflict）
- Squash merge / Merge commit / Rebase merge

### 第 08 集：Profile 设置
- 添加头像和简介
- 配置 README profile（特殊仓库）
- 设置双因素认证（2FA）
- 隐藏私人邮箱

### 第 09 集：Issues & Projects
- 创建 Issue（问题追踪）
- 使用 Projects（项目看板）
- 分配任务、设置里程碑
- 关联 Issue 与 PR

### 第 10 集：GitHub Actions
- 创建 workflow YAML 文件
- 自动化测试、构建、部署
- 使用 Actions marketplace
- CI/CD 最佳实践

### 第 11 集：GitHub Security
- Personal Access Token（PAT）
- SSH Key 配置
- Dependabot 安全警报
- Secret scanning

### 第 12 集：GitHub Pages
- 部署静态网站
- 配置自定义域名
- Jekyll 自动构建
- 用户/项目 Pages 区别

---

## 🔧 实践命令汇总

```bash
# 初始化
git init
git config user.name "星期五三世"
git config user.email "felipeche01manager@126.com"

# 添加和提交
git add .
git commit -m "Initial commit"

# 关联远程
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -m main
git push -u origin main

# 克隆和修改
git clone https://github.com/<用户名>/<仓库名>.git
git add <file>
git commit -m "Update"
git push

# Pull Request 流程
git fork https://github.com/<原作者>/<仓库名>.git
git clone <forked-URL>
git checkout -b feature-branch
git add . && git commit -m "Feature" && git push
# 在 GitHub 上创建 PR

# 查看状态
git status
git log --oneline
git branch -a
```

---

## 📊 学习成果

| 项目 | 状态 |
|------|------|
| 视频下载 | ✅ 12 集全部下载 |
| 关键帧提取 | ✅ 72 张关键帧（每集 6 张） |
| 关键帧学习 | ✅ 全部学习完毕 |
| 知识点整理 | ✅ 完成 |

---

## 🚀 对安防独立站的应用

| 知识点 | 应用场景 |
|--------|---------|
| Git 仓库管理 | 本地版本控制 |
| GitHub 仓库创建 | 创建 security-site 仓库 |
| Push 流程 | 推送代码到 GitHub |
| GitHub Actions | 自动构建 + Vercel 部署 |
| GitHub Pages | 部署静态网站 |
| Pull Request | 四人小组协作开发 |

---

## 📝 下一步行动

| 步骤 | 行动 | 状态 |
|------|------|------|
| 1 | 主人提供 GitHub 账号 | ⏳ 等待 |
| 2 | 配置认证（PAT/SSH） | ⏳ 等待账号 |
| 3 | 创建 security-site 仓库 | ⏳ 等待账号 |
| 4 | 推送代码 | ⏳ 等待账号 |
| 5 | 配置 GitHub Actions | ⏳ 等待推送 |
| 6 | Vercel 部署 | ⏳ 等待推送 |

---

**视频路径：** `memory/learning/videos/GitHub_01-12_*.mp4`  
**关键帧路径：** `memory/learning/videos/github-series-frames/ep01-12_*.jpg`  
**学习笔记：** `memory/learning/2026-04-16_GitHub_for_Beginners_完整学习笔记.md`