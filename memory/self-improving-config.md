# Self Improving Agent 与三层记忆协调配置

**配置时间：** 2026-04-24 14:23
**配置人：** 星期五三世
**目的：** 遜免功能重复，统一记忆管理

---

## 1. 路径统一

**Self Improving Agent配置修改：**

```python
# 原路径
self.improvement_log = self.workspace / "improvement_log.md"

# 改为三层记忆暖层路径
self.improvement_log = self.workspace / "memory" / "improvements" / "log.md"
```

**原因：**
- 三层记忆autoCapture实时扫描 `memory/` 目录
- 统一路径确保改进记录被LanceDB抓取
- 去重机制自动生效

---

## 2. 功能分工

| 功能 | Self Improving | 三层记忆 |
|------|---------------|---------|
| 对话质量分析 | ✅ 执行 | - |
| 错误记录 | ✅ 写入log.md | autoCapture抓取 |
| 改进建议 | ✅ 生成 | Daily Wrapup摘要 |
| Weekly报告 | - | Weekly Compound整合 |
| 去重检测 | - | LanceDB执行（>0.85跳过） |
| 归档管理 | - | 暖层→冷层迁移 |

---

## 3. Scope隔离

**Self Improving记录统一scope：**

```
scope: agent:main:self-improvement
```

**三层记忆管理：**
- 所有Self Improving记录归入 `self-improvement` scope
- Weekly Compound审计时单独统计该scope

---

## 4. 周期协调

| 周期 | Self Improving | 三层记忆 |
|------|---------------|---------|
| **实时** | log_improvement() | autoCapture |
| **每天5次** | - | Micro Sync验证+标注 |
| **每天凌晨** | - | Daily Wrapup摘要 |
| **每周** | generate_weekly_report() | Weekly Compound整合 |

**整合方案：**
- Self Improving的weekly_report不单独生成文件
- 改为返回字符串，供Weekly Compound调用
- Weekly Compound统一输出到 `memory/archive/weekly_YYYY-MM-DD.md`

---

## 5. 安全稳妥配置

**防止重复记录：**
- LanceDB去重阈值 >0.85自动跳过
- Self Improving记录前检查memory_recall

**防止数据泄露：**
- improvement_log.md仅本地存储
- LanceDB数据库本地路径
- 不发送到外部API

**防止覆盖：**
- improvement_log.md使用APPEND模式
- Weekly Compound只读不写log.md

---

## 6. 执行纪律铁规整合

**Self Improving Agent记录铁规违反：**

```python
sia.log_improvement(
    "违反铁规一：跳步执行（未验证结果）",
    category="执行纪律"
)
```

**三层记忆暖层标注：**

```
scope: agent:main:self-improvement
category: 执行纪律
priority: P0
```

---

## 7. 配置文件修改

**修改self_improving.py：**

```python
# 第17行改为
self.improvement_log = self.workspace / "memory" / "improvements" / "log.md"

# 创建目录
(self.workspace / "memory" / "improvements").mkdir(parents=True, exist_ok=True)
```

---

*配置完成时间：2026-04-24 14:23*