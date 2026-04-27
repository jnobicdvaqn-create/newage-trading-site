# 📚 学习笔记 - Claude Code 安装教程

**学习时间：** 2026-04-25 01:48-02:00
**来源：** B站视频 BV号未知（抖音分享链接：v.douyin.com/rzD7oo00azU）
**UP主：** 慢炖AI
**获取方式：** 官方文档抓取（code.claude.com/docs）

> ⚠️ 抖音视频无法直接访问（需cookie），以下内容来自Claude Code官方文档

---

## 一、Claude Code 是什么

**定义：** Anthropic的AI编程代理工具（agentic coding tool）

**功能：**
- 读取代码库
- 编辑文件
- 运行命令
- 集成开发工具

**可用平台：**
- Terminal（终端）
- IDE（VS Code/JetBrains）
- Desktop App（桌面应用）
- Browser（浏览器）

---

## 二、安装方式

### 1. 终端安装（Linux/macOS）

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### 2. Windows安装

**PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**CMD:**
```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 3. Homebrew（macOS）

```bash
brew install --cask claude-code
```

### 4. WinGet（Windows）

```powershell
winget install Anthropic.ClaudeCode
```

### 5. VS Code扩展

```bash
code --install-extension anthropic.claude-code
```

### 6. JetBrains插件

JetBrains Marketplace搜索"Claude Code (Beta)"

### 7. 桌面应用

- **macOS：** 下载DMG（通用版，支持Intel和Apple Silicon）
- **Windows：** 下载x64或ARM64安装程序
- **Linux：** 不支持桌面应用

---

## 三、桌面应用功能

| 标签 | 功能 | 说明 |
|------|------|------|
| **Chat** | 通用对话 | 无文件访问权限，类似claude.ai |
| **Cowork** | 后台代理 | 自主运行任务，在云端VM中执行 |
| **Code** | 编程助手 | 直接访问本地文件，实时审查变更 |

### Code标签功能：
- 选择本地项目文件夹
- 选择模型
- 实时审查和批准文件变更
- 拖放布局
- 集成终端和文件编辑器
- 实时应用预览
- GitHub PR监控与自动合并

---

## 四、支持的AI提供商

| 提供商 | 说明 |
|--------|------|
| **Anthropic** | 官方API，直接可用 |
| **Amazon Bedrock** | 需先配置AWS控制台和IAM凭证 |
| **Microsoft Foundry** | 需Azure订阅和Foundry资源 |
| **Google Vertex AI** | 需GCP项目和Vertex API启用 |

---

## 五、定价要求

Claude Code 需要以下订阅之一：
- Pro
- Max
- Team
- Enterprise

免费版不可用。

---

## 六、Claude Code vs OpenClaw

| 对比项 | Claude Code | OpenClaw |
|--------|-------------|----------|
| **类型** | 编码代理 | AI自动化平台 |
| **核心功能** | 代码编写/调试 | 多通道消息+定时任务+技能 |
| **提供商** | Anthropic官方 | 开源社区 |
| **模型** | Claude系列 | 多模型支持 |
| **安装** | 一键脚本 | npm安装 |
| **价格** | 需要订阅 | 开源免费 |
| **本地化** | 支持 | ✅ 完全本地部署 |

---

## 七、对我们系统的借鉴价值

| 可借鉴点 | 说明 | 优先级 |
|---------|------|--------|
| Cowork后台代理 | 自主运行任务概念 | P1 - 可参考 |
| SSH远程会话 | 远程机器管理 | P1 - ClawSwarm类似 |
| 文件变更审查 | 实时diff审查 | P2 - 代码审计 |
| 多提供商支持 | Bedrock/Vertex/Foundry | P1 - 已部分实现 |
| 会话管理 | continue/resume/fork | P1 - OpenClaw已支持 |

---

## 八、与OpenClaw的协同

**可能的集成方式：**
1. 用Claude Code编写OpenClaw技能
2. 用OpenClaw管理Claude Code的定时任务
3. Claude Code作为OpenClaw的子代理运行

**当前限制：**
- Claude Code需要Anthropic订阅
- 我们的系统主要使用百炼模型
- 两者定位不同，互补而非替代

---

## 📌 总结

**视频核心内容（推测）：**
- Claude Code安装步骤详解
- 环境配置（API Key、Base URL）
- 第一次使用演示
- 常见问题排查

**对我们的价值：**
- 了解竞品功能
- 借鉴后台代理概念
- 提升OpenClaw技能开发能力

---

*学习笔记整理：2026-04-25 02:00*
*注：抖音视频无法直接访问，内容基于官方文档*