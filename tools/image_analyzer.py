#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片分析工具 - 支持 OCR 识别、图片信息提取、结构化输出
"""

import os
import sys
import json
from datetime import datetime
from PIL import Image
import pytesseract

class ImageAnalyzer:
    """图片分析器"""
    
    def __init__(self, lang='chi_sim+eng'):
        self.lang = lang
        
    def analyze(self, image_path, output_format='text'):
        """
        分析图片
        
        Args:
            image_path: 图片路径
            output_format: 输出格式 (text/json/markdown)
            
        Returns:
            分析结果
        """
        if not os.path.exists(image_path):
            return {"error": f"文件不存在：{image_path}"}
        
        try:
            img = Image.open(image_path)
            
            # 基础信息
            info = {
                "文件路径": image_path,
                "文件名": os.path.basename(image_path),
                "尺寸": f"{img.size[0]} × {img.size[1]} 像素",
                "宽高比": f"{img.size[0]/img.size[1]:.2f}",
                "格式": img.format,
                "模式": img.mode,
                "文件大小": f"{os.path.getsize(image_path) / 1024:.2f} KB",
                "分析时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            # OCR 识别
            ocr_text = pytesseract.image_to_string(img, lang=self.lang)
            ocr_text = ocr_text.strip()
            
            # 图片类型推测
            img_type = self._guess_image_type(img, ocr_text)
            
            result = {
                "基础信息": info,
                "图片类型": img_type,
                "OCR 识别": ocr_text if ocr_text else "(未识别到文字)",
                "文字长度": len(ocr_text)
            }
            
            if output_format == 'json':
                return json.dumps(result, ensure_ascii=False, indent=2)
            elif output_format == 'markdown':
                return self._to_markdown(result)
            else:
                return self._to_text(result)
                
        except Exception as e:
            return {"error": str(e)}
    
    def _guess_image_type(self, img, ocr_text):
        """推测图片类型"""
        width, height = img.size
        
        # 根据尺寸和比例推测
        if width > 2000 and height > 1000:
            if "状态栏" in ocr_text or "信号" in ocr_text or "电池" in ocr_text:
                return "手机截图"
            elif width / height > 2:
                return "宽屏截图/横幅"
            else:
                return "高清图片"
        elif width == height:
            return "正方形图片/头像"
        elif height > width:
            return "竖屏图片/手机照片"
        else:
            return "横屏图片"
    
    def _to_text(self, result):
        """文本格式输出"""
        lines = []
        lines.append("=== 图片分析报告 ===\n")
        
        if "基础信息" in result:
            lines.append("【基础信息】")
            for k, v in result["基础信息"].items():
                lines.append(f"  {k}: {v}")
        
        lines.append(f"\n【图片类型】{result.get('图片类型', '未知')}")
        lines.append(f"\n【OCR 识别】")
        lines.append(result.get("OCR 识别", "(无)"))
        lines.append(f"\n【文字长度】{result.get('文字长度', 0)} 字符")
        
        return "\n".join(lines)
    
    def _to_markdown(self, result):
        """Markdown 格式输出"""
        lines = []
        lines.append("## 📸 图片分析报告\n")
        
        if "基础信息" in result:
            lines.append("### 基础信息\n")
            lines.append("| 属性 | 值 |")
            lines.append("|------|-----|")
            for k, v in result["基础信息"].items():
                lines.append(f"| {k} | {v} |")
        
        lines.append(f"\n### 图片类型\n")
        lines.append(f"{result.get('图片类型', '未知')}\n")
        
        lines.append("### OCR 识别结果\n")
        lines.append("```")
        lines.append(result.get("OCR 识别", "(无)"))
        lines.append("```\n")
        
        return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("用法：python image_analyzer.py <图片路径> [输出格式]")
        print("输出格式：text(默认) | json | markdown")
        sys.exit(1)
    
    image_path = sys.argv[1]
    output_format = sys.argv[2] if len(sys.argv) > 2 else 'text'
    
    analyzer = ImageAnalyzer()
    result = analyzer.analyze(image_path, output_format)
    print(result)


if __name__ == '__main__':
    main()
