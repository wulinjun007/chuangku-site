# 创酷 CHUANGKU · 设计创意社区（站酷风格演示站）

参考 [站酷 ZCOOL](https://www.zcool.com.cn/) 功能结构的纯静态设计社区演示站，视觉语言采用《网站设计系统逆向提取 · 11 站》中 **01-豆包（Semi Design 底座）** 的提取规范。

**线上地址（双通道，内容相同）**
- 主：https://wulinjun007.github.io/chuangku-site/ （GitHub Pages）
- 备：https://chuangku-site.vercel.app/ （Vercel 镜像 · 国内访问明显更快，2026-10-02 实测整页 6.4s vs github.io 单图 8-16s）

> 弱网优化 v1.0.1：全站作品图 WebP 化（7.1MB→4.5MB，省 37%）+ srcset 自动选择 + 图片加载失败自动重试一次（对抗连接随机重置）
> 注：Netlify 站点已建（ID `3e0a98a7-ab6d-495d-ba58-7580db4724c2`）但当日账户部署额度用尽被封锁，额度恢复后可用 `netlify deploy --prod --dir . --site 3e0a98a7-ab6d-495d-ba58-7580db4724c2` 迁移。

## 功能结构（对照站酷）

| 页面 | 对应站酷功能 | 说明 |
|---|---|---|
| `index.html` | 首页 | 暗色 Hero + 作品拼贴、三火推荐体系说明、分类宫格、作品流（推荐/最新/最热）、看点/大赛/设计师精选 |
| `discover.html` | 作品发现 | 9 频道侧栏筛选 + 综合/最新/浏览排序 + 关键词搜索（`?q=`） |
| `work.html?id=` | 作品详情 | 大图、作者卡、点赞（localStorage 持久化）、评论、相似作品 |
| `articles.html` | 看点 | 创作者访谈与行业文章流 |
| `events.html` | 设计大赛/活动展览 | 6 场大赛卡片 + 大赛日历时间线 |
| `designers.html` | 找设计师 | 12 位认证设计师卡（代表作/粉丝/私信） |
| `ranking.html` | 榜单 | 作品浏览榜 TOP20 + 新星榜 + 设计师影响力榜 |
| `publish.html` | 发布作品 | 表单 demo（不上传、不伪造成功） |

## 设计语言（来源：design-system-extraction-2026-10 / 01-doubao）

- 主墨 `#1c1f23` · 暗底 `#0b0e1a` · CTA 渐变 `linear-gradient(115deg,#0c42c0,#0677f9)`
- 圆角阶：媒体卡 14px / 中卡 20px / 大卡 48px / 胶囊 999px
- 排印：Hero 64px/400 显示字阶，正文 14-16px/1.43-1.6，辅助 12px
- 发丝线 `#ececec` · 卡影 `0 20px 30px rgba(74,90,110,.12)` · 暗区玻璃卡 inset 白描边 + 蓝辉光
- 火苗推荐标 `#FF471A`（三火=首页推荐 / 二火=频道推荐 / 一火=佳作推荐）

## 数据

58 件作品、58 位作者的标题/头像/封面抓取自站酷公开首页（采样 2026-10-02），图片本地化存放；互动数据、评论、粉丝、大赛信息为演示合成数据。详见 [CREDITS.md](CREDITS.md)。

## 本地运行

```bash
cd chuangku-site
python3 -m http.server 8088   # 或任意静态服务器
# 打开 http://localhost:8088
```

## 部署

GitHub `wulinjun007/chuangku-site` + Netlify（静态直部署，无构建）。
