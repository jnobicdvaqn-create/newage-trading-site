# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 🔧 已配置工具

### 图片分析工具

**路径：** `tools/image_analyzer.py`

**功能：**
- OCR 文字识别（中文 + 英文）
- 图片元数据提取
- 图片类型智能推测
- 多格式输出（text/json/markdown）

**用法：**
```bash
python3 tools/image_analyzer.py <图片路径> [text|json|markdown]
```

**依赖：**
- tesseract 4.1.1 ✅ 已安装
- chi_sim 中文包 ✅ 已安装
- Pillow ✅ 已安装
- pytesseract ✅ 已安装

### 语音识别工具

**引擎：** faster-whisper
**模型：** base (int8)
**语言：** 中文 (zh)
**状态：** ✅ 已配置

---

Add whatever helps you do your job. This is your cheat sheet.
