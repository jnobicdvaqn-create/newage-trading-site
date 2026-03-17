# 🛠️ 工具集

## 图片分析工具 (image_analyzer.py)

### 功能
- ✅ OCR 文字识别（中文 + 英文）
- ✅ 图片元数据提取
- ✅ 图片类型智能推测
- ✅ 多格式输出（text/json/markdown）

### 用法

```bash
# 文本格式
python3 tools/image_analyzer.py <图片路径>

# JSON 格式
python3 tools/image_analyzer.py <图片路径> json

# Markdown 格式
python3 tools/image_analyzer.py <图片路径> markdown
```

### 示例

```bash
python3 tools/image_analyzer.py /path/to/image.jpg markdown
```

### 依赖

```bash
pip install Pillow pytesseract
```

---

## 待添加工具

- [ ] 语音转文字工具
- [ ] 文档分析工具
- [ ] 数据导出工具
