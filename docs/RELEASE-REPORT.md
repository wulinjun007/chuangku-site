# 创酷 CHUANGKU · Release Report

> 交付日期：2026-10-02 · 版本 v1.0.1 · 类型：纯静态站（8 页，无构建）

## 上线地址（双通道，内容相同）

| 通道 | 地址 | 状态 |
|---|---|---|
| GitHub Pages（主） | https://wulinjun007.github.io/chuangku-site/ | ✅ 已上线（用户网络下间歇性限速） |
| Vercel 镜像（备·推荐入口） | https://chuangku-site.vercel.app/ | ✅ 已上线，实测整页 6.4s |
| GitHub 仓库 | https://github.com/wulinjun007/chuangku-site | ✅ main @ f8bde88，tag v1.0.0/v1.0.1 |
| Netlify | 账户部署额度用尽被封锁（403 "Account credit usage exceeded"），站点已建（ID `3e0a98a7-ab6d-495d-ba58-7580db4724c2`），恢复后 `netlify deploy --prod --dir . --site <ID>` 迁移 | ⛔ 账号级封锁 |

## 这是什么

参考站酷 ZCOOL 功能结构的设计创意社区演示站。视觉语言采用《网站设计系统逆向提取 · 11 站》中 **01-豆包（Semi Design 底座）** 规范：主墨 `#1c1f23`、暗底 `#0b0e1a`、CTA 渐变 `115deg #0c42c0→#0677f9`、圆角阶 14/20/48/999、发丝线 `#ececec`、Hero 64px/400、火苗推荐标 `#FF471A`。

功能：首页（暗 Hero+作品拼贴+三火体系+分类宫格+作品流）、发现（9 频道+搜索+排序）、作品详情（点赞 localStorage/评论/相似作品）、看点（7 篇）、设计大赛（6 场+日历）、找设计师（12 位）、榜单（浏览 TOP20+新星+影响力）、发布（demo 不伪造成功）。

## 数据与版权

58 件作品/58 位作者的标题、作者、头像、封面抓取自站酷公开首页（2026-10-02），图片全部本地化（jpg+webp 双份 11.6MB）；浏览量/评论/粉丝/大赛奖金为演示合成数据；`CREDITS.md` 记录来源与删除通道，页脚含永久声明。

## QA（全 PASS）

- 桌面 9 视口 + 移动端 8 页 + 360/390/768/1440 四档宽度：0 控制台错误、0 请求失败、0 横向溢出
- 修复 5 问题：设计师卡空格 / 移动端导航溢出 / 榜单 grid 溢出 305px / 榜单标题 ellipsis / backdrop-filter 劫持菜单包含块

## 增补（2026-10-02 晚 · 用户反馈"看不了"）

**诊断**：站点与构建正常（WebFetch 换视角完整加载），问题在 github.io 通道——HTML 时快时慢（0.3s~17s）、图片连接随机重置（3 次 2 失败），属间歇性限速。jsDelivr 不可用（HTML 强制 text/plain+nosniff 不渲染）；Netlify 仍 403；账户仅一个团队无备用。

**处置**：
1. 新增 **Vercel 镜像** https://chuangku-site.vercel.app/ （整页 6.4s 完整渲染；⚠️ 规范原定"Vercel 留给 Next.js"，此处为故障期临时镜像，可 `vercel remove` 撤销）
2. **弱网优化 v1.0.1**：58 封面同宽 WebP（7.1MB→4.5MB，sips 不支持 webp，用 ~/pyenv-cv 的 cv2 生成）+ srcset 自动选择 + img onerror 换参重试一次
3. QA 回归：桌面 58/58 封面选中 WebP、移动端滚动后 0 失败、0 JS 错误；Pages 已重建

## 踩坑记录

- 站酷图片 OSS 签名参数 k/t 与 x-oss-process 解耦，可自由改尺寸拉原图，无防盗链
- backdrop-filter 容器会劫持 absolute/fixed 后代包含块，下拉菜单须放毛玻璃胶囊外层
- grid 轨道会被 nowrap 文本 min-content 撑出横向溢出（子项 min-width:0 解）
- Netlify 403 先读错误 body 判断是否账号级封锁；digest API 部署法留档
- macOS 文件名 NFD：脚本按 NFC 文件名找 Desktop 文件会 FileNotFoundError，用 glob 模糊匹配
