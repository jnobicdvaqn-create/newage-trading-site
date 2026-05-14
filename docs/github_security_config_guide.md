# GitHub仓库安全配置指南

**最后更新：** 2026-05-14  
**仓库：** https://github.com/jnobicdvaqn-create/newage-trading-site  

---

## 一、分支保护（已完成 ✅）

### 配置状态

| 配置项 | 状态 | 说明 |
|--------|------|------|
| PR审核 | ✅ 已启用 | 需要1人审核 |
| 废弃陈旧审核 | ✅ 已启用 | 新push后旧审核失效 |
| 强制管理员遵守 | ✅ 已启用 | 管理员也必须走PR流程 |
| 允许强制push | ✅ 已禁用 | 禁止force push覆盖历史 |
| 允许删除分支 | ✅ 已禁用 | 禁止删除main分支 |
| 对话解决 | ✅ 已启用 | PR中的讨论必须解决 |

### 验证方法

```bash
curl -s -H "Authorization: token <your_token>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/jnobicdvaqn-create/newage-trading-site/branches/main/protection \
  | python3 -m json.tool
```

### 回滚方法（如需临时解除保护）

```bash
curl -X DELETE \
  -H "Authorization: token <your_token>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/jnobicdvaqn-create/newage-trading-site/branches/main/protection
```

---

## 二、双因素认证（2FA）（待主人操作）

### 设置步骤

1. 登录 GitHub → 右上角头像 → Settings
2. 左侧菜单 → Password and authentication
3. 点击 "Enable two-factor authentication"
4. 选择方式：
   - **推荐：** Authenticator App（手机APP生成动态码）
   - 备选：SMS（手机短信验证码）
5. 扫描QR码或输入密钥
6. 输入验证码完成设置
7. **⚠️ 重要：** 保存恢复代码（打印/截图/保存到安全位置）

### 恢复代码的重要性

| 情况 | 恢复代码作用 |
|------|------------|
| 手机丢失 | 用恢复代码登录 |
| Authenticator误删 | 用恢复代码恢复访问 |
| 换手机 | 用恢复代码重新绑定 |

**丢失恢复代码 = 丢失仓库访问权限（如果2FA是唯一登录方式）**

---

## 三、运维记录

| 日期 | 操作 | 操作人 | 结果 |
|------|------|--------|------|
| 2026-05-14 | 启用分支保护 | 星期五三世（API） | ✅ 已完成 |
| 2026-05-14 | 设置2FA | 主人（手动） | ⏳ 待执行 |

---

**备注：** Token存储在本地 `.git-credentials` 文件中，权限已设为600（仅所有者可读写）。
