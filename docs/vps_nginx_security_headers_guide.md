# VPS Nginx安全头配置 - 操作指南

**最后更新：** 2026-05-14  
**VPS IP：** 104.207.64.165  
**操作方式：** Spaceship Web Terminal  

---

## 一、操作步骤

### 步骤1：登录Spaceship Web Terminal

1. 访问 https://my.spaceship.com/
2. 进入 VPS Dashboard
3. 找到你的 VPS（IP: 104.207.64.165）
4. 点击 "Web Terminal" 或 "Console"

### 步骤2：创建安全头配置文件

在Web Terminal中执行以下命令：

```bash
sudo tee /etc/nginx/conf.d/security-headers.conf << 'NGINX'
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

# 5. 内容安全策略（CSP）- 最重要的安全头
# 只允许来自指定来源的脚本/样式/图片
add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;" always;
NGINX
```

### 步骤3：测试Nginx配置

```bash
sudo nginx -t
```

**预期输出：**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 步骤4：重载Nginx

```bash
sudo systemctl reload nginx
```

### 步骤5：验证安全头

在本地电脑执行（或通过其他终端）：

```bash
curl -sI https://newage-trading.com | grep -E "X-Frame|X-Content|X-XSS|Referrer|Content-Security"
```

**预期输出：**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self' ...
```

---

## 二、安全头说明

| 安全头 | 值 | 作用 |
|--------|-----|------|
| X-Frame-Options | SAMEORIGIN | 禁止其他网站iframe嵌入我们的页面 |
| X-Content-Type-Options | nosniff | 禁止浏览器猜测文件MIME类型 |
| X-XSS-Protection | 1; mode=block | 开启浏览器XSS过滤 |
| Referrer-Policy | strict-origin-when-cross-origin | 跳转时只带域名不带路径 |
| Content-Security-Policy | 见上方 | 白名单制度：只允许指定来源的资源 |

---

## 三、回滚方案

如果配置后网站出现问题，执行以下命令回滚：

```bash
sudo rm /etc/nginx/conf.d/security-headers.conf
sudo systemctl reload nginx
```

---

## 四、运维记录

| 日期 | 操作 | 操作人 | 结果 |
|------|------|--------|------|
| 2026-05-14 | 初始配置Nginx安全头 | 星期五三世+主人 | ⏳ 待执行 |

---

**备注：** 此配置为通用安全头，适用于静态Astro站点。如果后续添加外部CDN资源或第三方脚本，可能需要调整CSP策略。
