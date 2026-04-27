# sessions_yield规范流程（子代理管理）

**制定时间：** 2026-04-27 14:00
**制定人：** 星期五三世
**优先级：** P2
**关键词：** `#子代理管理 #sessions_yield #spawn规范 #OpenClaw`

---

## 🔴 问题诊断

根据降虾十八招第07招"异步任务管理"和第02招"创建子Agent"：

| 问题 | 表现 | 根因 |
|------|------|------|
| **spawn后未yield** | 不知道任务结果 | 没有调用sessions_yield |
| **子代理状态不跟进** | spawn后1小时无产出 | 没有检查subagents状态 |
| **方案失败未切换** | 反爬网站继续spawn | 没有切换browser工具 |

---

## ✅ 规范流程

### 标准spawn流程

```
1. 判断是否需要spawn → 确认场景
2. spawn子代理 → sessions_spawn
3. 【必须】sessions_yield → 等待结果
4. 检查状态 → subagents list
5. 收集结果 → 处理产出
```

### 代码规范

```javascript
// ❌ 错误示例（spawn后不yield）
sessions_spawn({
  runtime: "acp",
  agentId: "coder",
  task: "写代码"
})
// 缺少yield，不知道结果

// ✅ 正确示例（spawn后必须yield）
sessions_spawn({
  runtime: "acp",
  agentId: "coder",
  task: "写代码",
  streamTo: "parent",
  thread: true,
  mode: "session"
})
// 【必须】调用yield等待结果
sessions_yield({ message: "等待子任务完成" })
```

---

## 📋 场景判断

| 场景 | 方法 | 说明 |
|------|------|------|
| **反爬网站** | ❌ 不spawn | Google Maps/Alibaba/海关数据 → 用browser工具 |
| **复杂任务** | ✅ spawn + yield | 需要独立session的任务 |
| **实时转发** | ✅ spawn + streamTo:parent | 需要实时看到进度 |
| **团队协作** | ✅ ClawSwarm | 四人小组研讨 |

---

## 🔧 状态跟进机制

### spawn后检查规则

| 时间 | 动作 | 告警条件 |
|------|------|---------|
| spawn后立即 | sessions_yield | - |
| 30分钟后 | subagents list | 无响应 |
| 1小时后 | 飞书告警主人 | 无产出 |
| 方案失败 | 切换browser工具 | spawn失败 |

---

## 📊 验证检查清单

每次spawn后必须检查：

- [ ] sessions_yield已调用
- [ ] subagents状态已检查
- [ ] 产出已收集
- [ ] 失败时已切换方案

---

## 💡 改进措施

### 1. HEARTBEAT.md增加检查项

已在HEARTBEAT.md第7项增加：
```
7. **子代理跟进检查**（2026-04-22教训）
   - spawn子代理后每30分钟检查状态（subagents list）
   - spawn后>1小时无产出→飞书告警主人
   - 方案失败→立即切换browser工具
   - 反爬网站必须用browser工具，不spawn子代理
```

### 2. 每次spawn时提醒

在spawn前自动检查：
- 是否是反爬网站？→ 用browser工具
- 是否需要实时转发？→ streamTo:parent
- spawn后是否yield？→ 提醒调用sessions_yield

---

## 📝 检查脚本（可选）

```python
# scripts/subagent_status_check.py
# 每30分钟检查spawn子代理状态
import subprocess
import json

def check_subagents():
    result = subprocess.run(['openclaw', 'sessions', 'list', '--json'],
                           capture_output=True, text=True)
    sessions = json.loads(result.stdout)
    
    # 检查是否有超过1小时未完成的子代理
    for s in sessions:
        if s['kind'] == 'subagent' and s['age_minutes'] > 60:
            # 飞书告警
            print(f"告警：子代理 {s['id']} 运行超过1小时")
```

---

*规范制定时间：2026-04-27 14:00*