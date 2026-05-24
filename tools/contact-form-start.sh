#!/bin/bash
# ============================================
# Contact Form Backend - 启动/重启脚本
# 用途：VPS部署后拉起Node.js后端服务（端口3210）
# 最后更新：2026-05-16
# ============================================

set -e

SERVICE_NAME="contact-form"
SERVER_SCRIPT="/var/www/newage-trading.com/tools/contact-form-server.js"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "[INFO] 检查并启动联系表单后端服务..."

# 1. 创建 submissions 目录
mkdir -p /var/www/newage-trading.com/submissions
chmod 755 /var/www/newage-trading.com/submissions

# 2. 安装 systemd 服务文件（如果尚未安装或已更新）
cat > "${SERVICE_FILE}" << 'EOF'
[Unit]
Description=NewAge Trading Contact Form API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/newage-trading.com
ExecStart=/usr/bin/node /var/www/newage-trading.com/tools/contact-form-server.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 3. 重新加载 systemd 配置
systemctl daemon-reload

# 4. 重启服务（首次会启动，后续会重启）
systemctl restart "${SERVICE_NAME}"

# 5. 设置开机自启
systemctl enable "${SERVICE_NAME}"

# 6. 验证服务状态
sleep 2
if systemctl is-active --quiet "${SERVICE_NAME}"; then
    echo "[OK] ✅ 联系表单后端服务已启动（端口3210）"
    echo "[OK] PID: $(systemctl show -p MainPID --value ${SERVICE_NAME})"
else
    echo "[ERROR] ❌ 服务启动失败，请检查日志："
    echo "  journalctl -u ${SERVICE_NAME} --no-pager -n 20"
    exit 1
fi
