#!/bin/bash
# ============================================
# Post-deploy hook - VPS拉取后自动执行
# 用途：执行安全配置、Nginx重载等部署后操作
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[POST-DEPLOY] 执行部署后操作..."

# 1. 安全头配置
if [ -f "${SCRIPT_DIR}/05-security-headers.sh" ]; then
    echo "[POST-DEPLOY] 执行安全头配置..."
    bash "${SCRIPT_DIR}/05-security-headers.sh"
fi

# 2. 其他部署后操作可以在这里添加
echo "[POST-DEPLOY] ✅ 部署后操作完成"
