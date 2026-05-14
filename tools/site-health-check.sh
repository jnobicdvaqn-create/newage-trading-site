#!/bin/bash
# ============================================================================
# newage-trading.com 网站健康检查脚本
# 用法：bash tools/site-health-check.sh
# 可加入cron定期运行：0 */6 * * * /home/xinwen3046/openclaw/workspace/tools/site-health-check.sh
# ============================================================================

SITE="https://newage-trading.com"
LOG="/home/xinwen3046/openclaw/workspace/memory/site-health.log"
ERRORS=0

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === 健康检查开始 ===" >> "$LOG"

# 1. 检查网站是否可达
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$SITE/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ 首页可达 (HTTP $HTTP_CODE)" >> "$LOG"
else
    echo "  ❌ 首页不可达 (HTTP $HTTP_CODE)" >> "$LOG"
    ERRORS=$((ERRORS+1))
fi

# 2. 检查各语言首页
for LANG in en ru zh; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$SITE/$LANG/" 2>/dev/null)
    if [ "$CODE" = "200" ]; then
        echo "  ✅ /$LANG/ 正常" >> "$LOG"
    else
        echo "  ❌ /$LANG/ 异常 (HTTP $CODE)" >> "$LOG"
        ERRORS=$((ERRORS+1))
    fi
done

# 3. 检查sitemap
SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$SITE/sitemap-index.xml" 2>/dev/null)
if [ "$SITEMAP_CODE" = "200" ]; then
    echo "  ✅ Sitemap正常" >> "$LOG"
    PAGE_COUNT=$(curl -s "$SITE/sitemap-0.xml" 2>/dev/null | grep -c "<loc>" || echo "0")
    echo "  📄 索引页面: $PAGE_COUNT" >> "$LOG"
else
    echo "  ❌ Sitemap异常 (HTTP $SITEMAP_CODE)" >> "$LOG"
    ERRORS=$((ERRORS+1))
fi

# 4. 检查SSL证书
if command -v openssl &> /dev/null; then
    EXPIRY=$(echo | openssl s_client -servername newage-trading.com -connect newage-trading.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ -n "$EXPIRY" ]; then
        EXPIRY_TS=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
        NOW_TS=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_TS - NOW_TS) / 86400 ))
        if [ "$DAYS_LEFT" -lt 30 ]; then
            echo "  🔴 SSL证书即将过期！剩余 ${DAYS_LEFT}天" >> "$LOG"
            ERRORS=$((ERRORS+1))
        else
            echo "  ✅ SSL证书剩余 ${DAYS_LEFT}天" >> "$LOG"
        fi
    fi
fi

# 5. 检查关键页面
KEY_PAGES=(
    "$SITE/en/cars/"
    "$SITE/en/lingerie/"
    "$SITE/en/security/"
    "$SITE/en/blog/"
    "$SITE/en/contact/"
)

for PAGE in "${KEY_PAGES[@]}"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$PAGE" 2>/dev/null)
    if [ "$CODE" = "200" ]; then
        echo "  ✅ $(basename $PAGE)/ 正常" >> "$LOG"
    else
        echo "  ❌ $(basename $PAGE)/ 异常 (HTTP $CODE)" >> "$LOG"
        ERRORS=$((ERRORS+1))
    fi
done

# 总结
echo "  错误数: $ERRORS" >> "$LOG"
if [ "$ERRORS" -eq 0 ]; then
    echo "  ✅ 全部检查通过" >> "$LOG"
else
    echo "  ⚠️ 发现 $ERRORS 个问题" >> "$LOG"
fi
echo "---" >> "$LOG"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 检查完成 ($ERRORS errors)"
