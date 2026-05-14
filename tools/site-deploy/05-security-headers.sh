#!/bin/bash
# ============================================
# 安全头配置部署脚本
# 用途：在VPS上配置Nginx安全响应头
# 最后更新：2026-05-14
# ============================================

set -e

echo "[SECURITY] 配置Nginx安全头..."

# 创建安全头配置文件
cat > /etc/nginx/conf.d/security-headers.conf << 'NGINX'
# ========================================
# Nginx安全响应头配置
# 创建日期：2026-05-14
# 作用：防护常见Web攻击（XSS/点击劫持/内容嗅探）
# ========================================

# 1. 禁止iframe嵌入（防钓鱼网站嵌入我们的页面）
add_header X-Frame-Options "SAMEORIGIN" always;

# 2. 禁止浏览器猜测文件类型（防恶意脚本执行）
add_header X-Content-Type-Options "nosniff" always;

# 3. 开启浏览器内置XSS过滤
add_header X-XSS-Protection "1; mode=block" always;

# 4. 控制跳转时不泄露来源URL（防信息泄露）
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 5. HTTP严格传输安全（强制HTTPS）
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# 6. 权限策略（限制敏感API访问）
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# 7. 内容安全策略（CSP）- 最重要的安全头
# 只允许来自指定来源的脚本/样式/图片
add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;" always;
NGINX

echo "[SECURITY] 配置文件已创建: /etc/nginx/conf.d/security-headers.conf"

# 测试Nginx配置
nginx -t
if [ $? -eq 0 ]; then
    echo "[SECURITY] Nginx配置测试通过，正在重载..."
    systemctl reload nginx
    echo "[SECURITY] ✅ Nginx已重载，安全头已生效"
else
    echo "[SECURITY] ❌ Nginx配置测试失败，回滚..."
    rm -f /etc/nginx/conf.d/security-headers.conf
    systemctl reload nginx
    exit 1
fi
