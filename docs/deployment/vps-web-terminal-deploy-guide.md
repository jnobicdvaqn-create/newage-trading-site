# NewAge Trading 独立站 VPS Web Terminal 发布指南

**文档版本：** v1.0  
**创建日期：** 2026-05-15  
**适用场景：** SSH 被封锁，只能通过云服务商（Spaceship）Web Terminal 操作  
**关联文档：** `docs/sop/independent-site-astro-change-sop.md`  

---

## ⚠️ 操作纪律

> **铁规：如果不确定，不继续下一步。**  
> 每一步执行后必须确认结果符合预期，再继续。  
> 发现异常 → 立即停止 → 记录问题 → 必要时回滚。

---

## 一、发布前准备

### 1.1 前置条件确认

| 检查项 | 确认方式 | 通过标准 |
|--------|---------|---------|
| GitHub main 已更新 | 本地 `git log origin/main --oneline -3` | 最新 commit 包含目标 PR |
| VPS 网络可达 | Web Terminal 可登录 | 能执行命令 |
| Node.js 版本 | `node -v` | ≥ 18.x |
| npm 版本 | `npm -v` | ≥ 9.x |
| 磁盘空间 | `df -h` | 可用 ≥ 1GB |
| Nginx 运行 | `systemctl status nginx` | active (running) |
| 项目目录存在 | `ls /var/www/newage-trading.com/` | 有旧版文件 |
| Git 仓库存在 | 项目目录有 `.git/` | `git status` 可执行 |

### 1.2 准备真实联系方式

> **注意：** 以下占位符需替换为真实值，但**不要写进任何文档或 commit**。

| 环境变量 | 说明 | 占位符 |
|---------|------|--------|
| `PUBLIC_WHATSAPP_NUMBER` | WhatsApp 号码（纯数字，无+无空格） | `<number>` |
| `PUBLIC_WHATSAPP_DISPLAY` | 显示号码（+XX 格式） | `+<number>` |
| `PUBLIC_CONTACT_EMAIL` | 联系邮箱 | `<email>` |
| `PUBLIC_TELEGRAM` | Telegram handle（无@） | `<handle>` |
| `PUBLIC_TELEGRAM_URL` | Telegram 链接 | `https://t.me/<handle>` |
| `PUBLIC_FORM_MODE` | 表单模式 | `prototype` |

---

## 二、确认当前线上版本

**本步目标：** 记录当前线上状态，为回滚做准备。

```bash
# 进入项目目录
cd /path/to/project

# 查看当前分支和 commit
git log --oneline -3

# 记录当前 commit hash（用于回滚）
git rev-parse HEAD
```

**预期结果：** 显示 3 行 commit 信息，记录第一行的 hash（如 `abc1234`）。

**异常处理：** 如果 `git` 不可用 → 记录当前 dist 目录的时间戳 → 进入第三步备份。

---

## 三、备份当前版本

**本步目标：** 保留旧版 dist，以便快速回滚。

```bash
# 备份当前 dist
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp -r /var/www/newage-trading.com/ /var/www/newage-trading.com.bak_${TIMESTAMP}/

# 确认备份成功
ls -la /var/www/newage-trading.com.bak_${TIMESTAMP}/ | head -5
```

**预期结果：** 备份目录存在，文件数与原目录一致。

**异常处理：** 如果磁盘空间不足 → 清理旧备份（保留最近 2 个）→ 重试。

---

## 四、拉取 main

**本步目标：** 从 GitHub 拉取最新代码到 VPS。

```bash
# 进入项目源码目录（非 dist）
cd /path/to/project/source

# 查看当前状态
git status

# 拉取最新 main
git fetch origin main

# 确认最新 commit
git log origin/main --oneline -3

# 重置到最新 main
git reset --hard origin/main

# 确认成功
git log --oneline -1
```

**预期结果：** `HEAD` 指向 PR #7 合并后的最新 commit。

**异常处理：**
- `git fetch` 失败 → 检查网络连接 → `ping github.com`
- 认证失败 → 检查 Git 凭证 → `git config credential.helper`
- 冲突 → 使用 `git reset --hard` 强制重置（已备份，安全）

---

## 五、配置环境变量

**本步目标：** 在 VPS 本地创建 `.env.production` 文件。

> **⚠️ 重要：** 此文件绝不提交到 Git。`.gitignore` 已包含 `.env.production`。

```bash
# 进入项目源码目录
cd /path/to/project/source

# 创建 .env.production（首次创建或更新已有文件）
cat > .env.production << 'EOF'
PUBLIC_WHATSAPP_NUMBER=<number>
PUBLIC_WHATSAPP_DISPLAY=+<number>
PUBLIC_CONTACT_EMAIL=<email>
PUBLIC_TELEGRAM=<handle>
PUBLIC_TELEGRAM_URL=https://t.me/<handle>
PUBLIC_FORM_MODE=prototype
EOF

# 确认文件创建成功
cat .env.production

# 确认文件权限（仅 owner 可读）
chmod 600 .env.production
ls -la .env.production
```

**预期结果：**
- 文件存在，内容为 6 行环境变量
- 权限为 `-rw-------`

**异常处理：**
- 如果不确定真实联系方式 → **不继续下一步** → 向主人确认
- 如果文件已存在 → 确认内容是否正确 → 不正确则覆盖

---

## 六、安装依赖

**本步目标：** 确保 `node_modules` 完整。

```bash
cd /path/to/project/source

# 检查 node_modules 是否存在
ls node_modules/ | head -3

# 安装或更新依赖
npm ci --production=false

# 确认安装成功
ls node_modules/ | wc -l
```

**预期结果：** `node_modules` 包含约 300+ 个包。

**异常处理：**
- `npm ci` 失败 → 尝试 `npm install`
- 内存不足 → 检查 `free -m` → 关闭不必要进程
- Node 版本不符 → `node -v` → 使用 nvm 切换版本

---

## 七、构建项目

**本步目标：** 用真实环境变量构建静态站。

```bash
cd /path/to/project/source

# 构建（传入环境变量）
PUBLIC_WHATSAPP_NUMBER=<number> \
PUBLIC_WHATSAPP_DISPLAY=+<number> \
PUBLIC_CONTACT_EMAIL=<email> \
PUBLIC_TELEGRAM=<handle> \
PUBLIC_TELEGRAM_URL=https://t.me/<handle> \
PUBLIC_FORM_MODE=prototype \
npm run build
```

**预期结果：**
```
▶ Astro collects analytics data...
▶ Astro v5.x.x
  → 构建无错误
  → 367 页（或更多）
  → 0 警告
  → Complete!
```

**异常处理：**
- 构建报错 → 查看错误信息 → 修复后重试
- 页面数异常 → 检查 `src/pages/` 目录
- 内存不足 → 检查 `free -m`

---

## 八、检查构建产物

**本步目标：** 确认构建产物中没有占位符残留。

```bash
cd /path/to/project/source

# 检查是否还有占位符（必须为空）
echo "=== 占位符检查 ==="
grep -rn "WHATSAPP_NUMBER" dist/en/ dist/zh/ dist/ru/ 2>/dev/null || echo "✅ 无 WHATSAPP_NUMBER"
grep -rn "CONTACT_EMAIL" dist/en/ dist/zh/ dist/ru/ 2>/dev/null || echo "✅ 无 CONTACT_EMAIL"
grep -rn "placeholder_telegram" dist/en/ dist/zh/ dist/ru/ 2>/dev/null || echo "✅ 无 placeholder_telegram"

# 检查真实联系方式已写入（应有输出）
echo "=== 真实值检查 ==="
grep -oE "wa\.me/[0-9]+" dist/en/index.html | head -1
grep -oE "mailto:[a-zA-Z0-9_.@]+" dist/en/contact/index.html | head -1
grep -oE "t\.me/[a-zA-Z0-9_]+" dist/en/index.html | head -1

# 检查页面数
echo "=== 页面数 ==="
find dist/ -name "index.html" | wc -l
```

**预期结果：**
- 占位符检查：全部输出 `✅`
- 真实值检查：显示真实号码/邮箱/Telegram
- 页面数：≥ 367

**异常处理：**
- 占位符仍存在 → 检查构建命令是否正确传入环境变量 → 重新构建
- 页面数异常 → 检查 `src/pages/` 完整性 → 重新构建

---

## 九、部署 dist

**本步目标：** 将新构建产物部署到 Nginx 静态目录。

```bash
# 确认 Nginx 静态目录
SITE_DIR="/var/www/newage-trading.com"
echo "当前静态目录: $SITE_DIR"
ls "$SITE_DIR" | head -5

# 清除旧文件
rm -rf "$SITE_DIR"/*

# 部署新文件
cp -r dist/* "$SITE_DIR"/

# 确认部署成功
ls "$SITE_DIR" | head -10
ls "$SITE_DIR" | wc -l
```

**预期结果：** 静态目录包含 `index.html`、`en/`、`ru/`、`zh/` 等。

**异常处理：**
- 权限错误 → 检查是否需要 `sudo`
- 目录不存在 → 创建目录 → `mkdir -p "$SITE_DIR"`

---

## 十、重载服务

**本步目标：** 让 Nginx 提供新内容。

```bash
# 测试 Nginx 配置
nginx -t

# 如果测试通过，重载
systemctl reload nginx

# 确认 Nginx 运行正常
systemctl status nginx | head -5
```

**预期结果：**
- `nginx -t` → `syntax is ok` + `test is successful`
- `systemctl status nginx` → `active (running)`

**异常处理：**
- `nginx -t` 失败 → 检查 Nginx 配置 → `cat /etc/nginx/sites-enabled/*` → 修复后重试
- reload 失败 → 尝试 `systemctl restart nginx`

---

## 十一、发布后回归检查

**本步目标：** 确认所有页面正常工作。

```bash
# 检查首页
curl -sI http://localhost/

# 检查联系页
curl -sI http://localhost/en/contact/

# 检查定价页
curl -sI http://localhost/en/pricing/

# 检查裸路径跳转
curl -sI http://localhost/pricing/

# 检查 WhatsApp 链接
grep -oE "wa\.me/[0-9]+" "$SITE_DIR/en/index.html" | head -1

# 检查 Telegram 链接
grep -oE "t\.me/[a-zA-Z0-9_]+" "$SITE_DIR/en/index.html" | head -1

# 检查 Email 链接
grep -oE "mailto:[a-zA-Z0-9_.@]+" "$SITE_DIR/en/contact/index.html" | head -1

# 检查是否还有占位符
grep -rn "WHATSAPP_NUMBER\|CONTACT_EMAIL\|placeholder_telegram" "$SITE_DIR/" | head -3
```

**预期结果：**
- 所有页面返回 `200 OK`
- 裸路径 `/pricing/` 返回 `301` 或 `200`（跳转生效）
- WhatsApp/Telegram/Email 链接为真实值
- 无占位符残留

**异常处理：**
- 页面 404 → 检查 Nginx `root` 指令 → 检查 dist 目录结构
- 占位符残留 → 重新构建并部署

---

## 十二、常见故障

| 故障 | 可能原因 | 处理方法 |
|------|---------|---------|
| 构建通过但页面 404 | Nginx 静态目录未更新 | 确认 `cp -r dist/*` 目标路径 |
| WhatsApp 链接无效 | 号码格式含 `+` 或空格 | `PUBLIC_WHATSAPP_NUMBER` 必须纯数字 |
| 构建后仍显示占位符 | 环境变量未传入 | 检查构建命令中 `PUBLIC_` 前缀 |
| Nginx reload 失败 | 配置文件语法错误 | `nginx -t` 查看错误 → 修复 |
| Web Terminal 超时 | 命令执行时间过长 | 拆分为小步骤执行 |
| git fetch 失败 | 网络问题 | `ping github.com` → 重试 |
| npm ci 失败 | 锁文件不匹配 | `rm -rf node_modules` → `npm install` |
| 磁盘空间不足 | 旧备份未清理 | `ls /var/www/*.bak_*` → 删除旧备份 |
| 权限错误 | 用户无写入权限 | 检查 `whoami` → 使用 `sudo` 或 `su` |
| Node 版本不符 | 旧版本不支持 Astro 5 | `node -v` → nvm 升级到 18+ |

---

## 十三、回滚方案

### 13.1 紧急回滚（页面异常）

```bash
# 列出备份
ls -la /var/www/ | grep bak

# 选择最近的备份（确认目录名）
LATEST_BAK=$(ls -dt /var/www/newage-trading.com.bak_* | head -1)
echo "回滚到: $LATEST_BAK"

# 清除当前内容
rm -rf /var/www/newage-trading.com/*

# 恢复备份
cp -r "$LATEST_BAK"/newage-trading.com/* /var/www/newage-trading.com/

# 重载 Nginx
nginx -t && systemctl reload nginx

# 确认恢复
curl -sI http://localhost/
```

### 13.2 Git 回滚（代码有问题）

```bash
cd /path/to/project/source

# 回退到 PR #7 合并前的 commit
git log --oneline | grep "Merge PR #6"  # 找到 hash
git reset --hard <old_commit_hash>

# 重新构建
npm run build

# 重新部署
rm -rf /var/www/newage-trading.com/*
cp -r dist/* /var/www/newage-trading.com/
nginx -t && systemctl reload nginx
```

### 13.3 环境变量回滚

```bash
# 修改 .env.production 为旧值
nano .env.production

# 重新构建
npm run build

# 重新部署
rm -rf /var/www/newage-trading.com/*
cp -r dist/* /var/www/newage-trading.com/
nginx -t && systemctl reload nginx
```

---

## 十四、发布记录模板

> 发布完成后，请填写以下记录并存档。

```markdown
## 发布记录

**发布日期：** YYYY-MM-DD HH:MM
**操作人：** <name>
**Web Terminal 登录方式：** <spaceship dashboard > VPS > terminal>

### 版本信息
- **部署前 commit：** `<old_hash>`
- **部署后 commit：** `<new_hash>`
- **PR 编号：** #7
- **分支：** main

### 环境变量
- PUBLIC_WHATSAPP_NUMBER: <已配置>
- PUBLIC_WHATSAPP_DISPLAY: <已配置>
- PUBLIC_CONTACT_EMAIL: <已配置>
- PUBLIC_TELEGRAM: <已配置>
- PUBLIC_TELEGRAM_URL: <已配置>
- PUBLIC_FORM_MODE: prototype

### 构建结果
- 构建时间：XX 秒
- 页面数：XXX
- 警告：0
- 错误：0

### 检查结果
- [ ] 首页正常
- [ ] 联系页正常
- [ ] 定价页正常
- [ ] WhatsApp 链接正确
- [ ] Telegram 链接正确
- [ ] Email 链接正确
- [ ] 无占位符残留
- [ ] 裸路径跳转正常
- [ ] 手机端正常（如有真机测试）

### 备份信息
- 旧版备份路径：`/var/www/newage-trading.com.bak_YYYYMMDD_HHMMSS/`
- 备份 commit：`<old_hash>`

### 备注
<任何异常、处理、待办事项>
```

---

## ⚠️ 最终提醒

1. **发布前：** 确认所有 6 个环境变量值正确
2. **构建后：** 确认无占位符残留
3. **部署后：** 用浏览器实际访问页面（不要只用 curl）
4. **不确定：** 立即停止，不要继续
5. **保留备份：** 旧版 dist 备份至少保留 7 天

---

*本文档基于 PR #7 实际部署需求编写。所有联系方式均以占位符表示，实际操作时需替换为真实值。*
