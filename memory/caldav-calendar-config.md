# Caldav Calendar工作时间表配置

**配置时间：** 2026-04-24 14:37
**负责人：** 星期五三世
**用途：** 任务安排统一时间表

---

## 1. Vdirsyncer配置模板

**路径：** `~/.config/vdirsyncer/config`

```ini
[general]
status_path = "~/.local/share/vdirsyncer/status/"

# Google日历示例（需主人提供账号）
[storage google_calendar]
type = "google_calendar"
token_secret_path = "~/.config/vdirsyncer/google_token"
client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"

# iCloud日历示例（需主人提供Apple ID）
[storage icloud_calendar]
type = "caldav"
url = "https://caldav.icloud.com/"
username = "YOUR_ICLOUD_EMAIL"
password = "YOUR_APP_SPECIFIC_PASSWORD"

# 本地存储（任务安排）
[storage local_calendar]
type = "filesystem"
path = "~/.local/share/calendars/work/"
fileext = ".ics"

# 同步配对
[pair work_calendar]
a = "google_calendar"  # 或 icloud_calendar
b = "local_calendar"
collections = ["from a"]
```

---

## 2. 任务时间表接入流程

| 来源 | 接入方式 | 存储 |
|------|---------|------|
| TODO.md任务 | 自动生成ics | local_calendar |
| 主人时间安排 | 手动添加 | google_calendar |
| 四人小组研讨 | 研讨决议写入 | local_calendar |
| cron定时任务 | 定期同步 | google_calendar |

---

## 3. Khal命令（查询/添加）

```bash
# 查询今日任务
khal list today

# 查询本周任务
khal list today 7d

# 添加任务
khal new 2026-04-25 09:00 10:00 "晨会三问"

# 搜索任务
khal search "格鲁吉亚"
```

---

## 4. 任务时间化转换

**TODO.md任务自动转ics：**

| 任务编码 | 时间安排 | Calendar事件 |
|---------|---------|-------------|
| T-G-001-I | 待主人决策 | [待决策]格鲁吉亚邮件联系启动 |
| T-W-001-I | 待主人决策 | [待决策]独立站方案确认 |
| T-S-021-P | 进行中 | [进行中]修复11个失败cron任务 |

---

## 5. 同步频率

```bash
# cron配置
*/30 * * * * vdirsyncer sync >> ~/.openclaw/logs/calendar-sync.log 2>&1
```

---

## 6. 待主人提供

- [ ] Google日历账号（OAuth授权）
- [ ] 或iCloud日历账号（应用专用密码）
- [ ] 或NextCloud服务器URL+账号

**授权方式：**
- Google：需在Google Cloud Console创建OAuth应用
- iCloud：需在appleid.apple.com生成应用专用密码

---

*配置完成，等待主人提供日历账号或时间安排*