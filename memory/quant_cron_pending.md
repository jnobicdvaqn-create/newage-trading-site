# 量化交易自动更新 - 待配置cron

**脚本位置：** `tools/quant_daily_update.py`

**配置参数：**
- 时间：每日15:30（收盘后）
- 执行：工作日（1-5）
- 任务：更新数据+计算信号+生成日报

**命令（待Gateway启动后执行）：**
```bash
openclaw cron add \
  --name "📈 量化交易每日更新" \
  --cron "30 15 * * 1-5" \
  --agent "main" \
  --channel "feishu" \
  --to "user:ou_04cc8303b6e3a4783fa178e46986cbd6" \
  --message "运行量化交易更新脚本：python3 ~/openclaw/workspace/tools/quant_daily_update.py" \
  --announce \
  --tz "Asia/Shanghai"
```

**当前状态：**
- ✅ 数据已更新至04-19
- ✅ 脚本已创建并测试
- ⏳ cron待配置（Gateway未启动）

---
*2026-04-20 11:21*