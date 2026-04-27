# Hermes + OpenClaw 智能体架构对比学习笔记

**学习时间：** 2026-04-27 10:41
**学习来源：** https://zzyong24.github.io/hermes-openclaw-book/
**学习时长：** 约30分钟
**关键词：** `#架构对比` `#Skills系统` `#SubAgent` `#Memory系统` `#OpenClaw实战`

---

## 📋 核心对比总结

| 维度 | Hermes | OpenClaw | 结论 |
|------|--------|----------|------|
| **Skills创建** | ✅ 自动（Nudge+背景审查，默认10次触发） | ❌ 无自动创建 | Hermes激进但有污染风险 |
| **Skills维护** | ❌ 无负熵/无追踪/无冲突检测 | ✅ 显式安装，snapshot机制 | OpenClaw更稳定 |
| **SubAgent隔离** | ⚠️ delegate_task有，claude-code Skill无 | ✅ ACP完整session隔离 | OpenClaw架构更完整 |
| **SubAgent流式** | ❌ 无 | ✅ stream relay实时转发 | OpenClaw体验更好 |
| **Memory搜索** | ❌ FTS5关键词 | ✅ LanceDB语义 | OpenClaw更精准 |
| **Memory隔离** | ⚠️ 两套Provider并行无同步 | ✅ 单一系统 | OpenClaw更一致 |
| **Memory延迟** | ✅ 快（SQLite直连） | ⚠️ 慢（CLI冷启动3-8秒） | Hermes响应更快 |

---

## 📌 第一章：Skills系统对比

### Hermes Skills 5个系统性问题

| 问题 | 描述 | 根因 |
|------|------|------|
| **经验≠技能** | 一次成功就创建Skill，无验证机制 | Nudge+背景审查双重触发，默认10次 |
| **无负熵机制** | Skill只增不减，永久存活 | 无自动清理机制 |
| **无关系机制** | related_skills被解析但从未消费 | 源码只解析不使用 |
| **无冲突检测** | 只检测名字冲突，不检测语义冲突 | 缺少语义分析 |
| **无使用追踪** | skill_view()调用次数无记录 | 源码无计数器 |

### OpenClaw Skills解决/未解决

| 问题 | 解决状态 | 说明 |
|------|---------|------|
| 阻塞问题 | ✅ 解决 | `<available_skills>`一次性注入 |
| 缓存失效 | ✅ 解决 | snapshot版本校验+mtime检查 |
| 无关系系统 | ❌ 未解决 | 扁平化注入，靠description匹配 |
| Agent自主创建 | ❌ 未解决 | 依赖CLI手动安装 |

### 实战建议

```yaml
# Hermes关闭自动创建Skill
# ~/.hermes/config.yaml
skills:
  creation_nudge_interval: 0  # 完全关闭自动创建
```

```bash
# 定期review Skill（用修改时间判断）
find ~/.hermes/skills/ -name "SKILL.md" -mtime +30
```

---

## 📌 第二章：SubAgent机制对比

### Hermes SubAgent真实架构

| 机制 | 形态 | 隔离性 |
|------|------|--------|
| **Profile** | 独立进程+独立gateway | ✅ 完全隔离（进程级） |
| **delegate_task** | 同进程内子session | ✅ 有隔离（parent_session_id） |
| **claude-code Skill** | 外部CLI进程 | ❌ 无session关联 |

### 关键澄清

- **claude-code和codex是Skill，不是内置tool**
- **Profile之间无法通信**，不存在"团队协作"
- **真正的SubAgent是delegate_task**，有session隔离

### OpenClaw ACP完整spawn链

```
Parent → sessions_spawn → ACP Runtime → Child Session
         ↓
         startAcpSpawnParentStreamRelay() → 实时转发assistant delta
         ↓
         sessions_yield → 等待完成 → 收集结果
```

### 已知坑位

| 坑 | 描述 | 解决办法 |
|----|------|---------|
| **Child超时不自杀** | 有监控无强制kill | 定期清理孤儿进程 |
| **Stream relay数据丢失** | relayBuffer在内存，崩溃即丢 | 重要任务持久化 |
| **spawn后没有yield** | 不知道任务结果 | 必须调用sessions_yield |
| **飞书并发Spawn冲突** | <100ms内两次spawn共享thread_id | 加间隔或降低并发 |

---

## 📌 第三章：Memory系统对比

### Hermes三层记忆架构

| 层次 | 内容 | Mid-session写入同步 |
|------|------|-------------------|
| **Layer 1** | SOUL.md（System Prompt） | 不适用（全新） |
| **Layer 2** | MEMORY.md/USER.md快照 | ❌ frozen snapshot |
| **Layer 3** | hermes_state.db（SQLite） | ✅ 实时持久化 |

### 记忆紊乱根因

| 根因 | 源码位置 | 影响 |
|------|---------|------|
| **snapshot frozen** | memory_tool.py:110-122 | 新记忆在当前session不可见 |
| **Provider简单拼接** | memory_manager.py:157-174 | 同一事实出现多次 |
| **BuiltinProvider无法移除** | 源码设计约束 | 两套系统并行无同步 |
| **agent_context隔离不严格** | memory_provider.py | subagent污染用户记忆 |

### OpenClaw Memory架构

```
queryMemory() → QMD CLI subprocess → LanceDB Vector Store → mergeContext()
```

### OpenClaw Memory坑位

| 坑 | 描述 | 解决办法 |
|----|------|---------|
| **QMD冷启动延迟** | 3-8秒等待 | gateway启动后预热，或启用mcporter常驻 |
| **memory.db并发lock** | 高并发写入lock timeout | 降低写入频率，延长timeout |
| **scope参数失效** | 参数解析出错时全局搜索 | 定期验证scope是否生效 |
| **Dreaming session残留** | gateway重启后不恢复 | 定期清理（find -mtime +12h） |

---

## 📌 第四章：选型建议

### Hermes适合场景

- 需要Agent自主学习工作流
- 需要多消息平台（18个平台）
- 需要外部Memory Provider（Honcho/Mem0）
- 能投入时间手动维护Skills

### OpenClaw适合场景

- 需要Skills稳定、不乱增长
- 需要语义搜索能力
- 需要飞书深度集成
- 需要减少维护负担
- 需要完整的SubAgent协作

---

## 📌 第五章：OpenClaw实战配置要点

### ACP Spawn标准调用

```javascript
sessions_spawn({
  runtime: "acp",
  agentId: "coder",
  mode: "session",
  thread: true,
  task: "帮我写一个排序算法",
  streamTo: "parent"
})
// 必须调用
sessions_yield({ message: "等待子任务完成" })
```

### Memory QMD配置（推荐）

```yaml
# ~/.openclaw/config.yaml
memory:
  provider: qmd
  qmd:
    embedding:
      type: local
      model: ~/.openclaw/models/embedding-model.gguf
    mcporter:
      enabled: true
      startDaemon: true  # 保持常驻，秒级响应
```

### 定期清理Sessions

```bash
# 每天凌晨清理dreaming session
0 3 * * * find ~/.openclaw/sessions/ -name "*dreaming*" -mmin +720 -delete
```

---

## 🎯 应用到当前环境

### 当前OpenClaw环境检查

| 检查项 | 当前状态 | 建议 |
|--------|---------|------|
| Skills安装 | 已有多个skill | ✅ 定期review description |
| Memory配置 | qmd + LanceDB | ⚠️ 检查冷启动延迟 |
| SubAgent使用 | ClawSwarm四人小组 | ✅ 已有session隔离 |
| Sessions清理 | 未定期清理 | ⏳ 设置cron任务 |

### 立即可改进项

1. **Skills**: 检查description是否有歧义/重叠
2. **Memory**: gateway启动后预热embedding模型
3. **Sessions**: 设置cron定期清理dreaming session

---

## 📚 参考链接

- 教程主页：https://zzyong24.github.io/hermes-openclaw-book/
- GitHub源码：https://github.com/zzyong24/hermes-openclaw-book
- darwin-skill（Hermes Skill优化）：https://github.com/alchaincyf/darwin-skill

---

*学习笔记完成时间：2026-04-27 10:45*