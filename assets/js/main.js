/* 创酷 CHUANGKU · 交互层
   复用规则：works.js 先于本文件加载；body[data-page] 决定导航态与暗色头 */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var CATS = ['AIGC影像', '插画漫画', '品牌设计', '三维CG', '游戏创意', 'UI·网页', '字体设计', '摄影', '看点·文章'];
  var CAT_ICONS = { 'AIGC影像': '🤖', '插画漫画': '🎨', '品牌设计': '💎', '三维CG': '🧊', '游戏创意': '🎮', 'UI·网页': '📱', '字体设计': '🔤', '摄影': '📷', '看点·文章': '📖' };
  var PAGE = document.body.getAttribute('data-page') || '';

  function fmt(n) {
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + 'w';
    return String(n);
  }
  function fireSVG(n) {
    var f = '<svg viewBox="0 0 16 16" aria-label="推荐"><path d="M13.4 1.6c-1.8.6-2.5 1.8-2.6 3 0 0 0 .3-.1.5-.2.1-.3 0-.6-.2-.6-1-1-2.4-1-4.9-4 1.6-4.8 4.5-4.8 6.3 0 .6-.5.5-.6.5-.4-.3-.6-.7-.6-.7V6c-.2-1.1 0-2 0-2C1.6 4.8.9 6.9.9 8.6.9 12.7 4.1 16 8 16s7.1-2.9 7.1-7c0-2.6-1.7-4.1-1.7-7.4"/></svg>';
    var out = '';
    for (var i = 0; i < n; i++) out += f;
    return out;
  }
  function likeSVG() {
    return '<svg viewBox="0 0 16 17" fill="none"><path fill="currentColor" d="M12 6.305c.98 0 2.173.1 2.74.887v.007c.347.48.387 1.126.12 1.913l-1.06 2.867c-.76 2.14-1.513 2.66-3.833 2.66h-3.8a1 1 0 0 1-1-1V7.125c0-.495.391-.88.804-1.154q.125-.083.236-.192c.166-.174.246-.34.373-.947.093-.453.113-.68.133-.947.014-.173.034-.353.067-.593.153-1.02.82-1.653 1.733-1.653.767 0 1.78.58 2.107 2.213.187.913-.04 1.833-.273 2.453zM4.167 7.305a1 1 0 0 0-1-1h-.26c-1.014 0-1.834.82-1.834 1.834v4.666c0 1.014.82 1.834 1.834 1.834h.26a1 1 0 0 0 1-1z"/></svg>';
  }
  function playSVG() {
    return '<svg viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17m-.94-4.327 4.386-2.925a1.5 1.5 0 0 0 0-2.496L11.06 7.827c-.996-.664-2.332.05-2.332 1.249v5.849c0 1.197 1.335 1.912 2.332 1.248" clip-rule="evenodd"/></svg>';
  }

  /* ---------- 点赞持久化 ---------- */
  var LIKES_KEY = 'cku_likes_v1';
  var likedSet = {};
  try { likedSet = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); } catch (e) { likedSet = {}; }
  function isLiked(id) { return !!likedSet[id]; }
  function toggleLike(id) {
    if (likedSet[id]) delete likedSet[id]; else likedSet[id] = 1;
    try { localStorage.setItem(LIKES_KEY, JSON.stringify(likedSet)); } catch (e) {}
    return !!likedSet[id];
  }
  function likeCount(w) { return w.likes + (isLiked(w.id) ? 1 : 0); }

  /* ---------- 组件：作品卡 ---------- */
  function workCard(w) {
    return '<a class="wcard" href="work.html?id=' + w.id + '">' +
      '<div class="cover"><img src="' + w.img + '" alt="' + esc(w.title) + '" loading="lazy">' +
      (w.video ? '<span class="typebox">' + playSVG() + '</span>' : '') +
      '<span class="badge" title="站酷风格推荐等级">' + fireSVG(w.tier) + '</span></div>' +
      '<div class="body"><div class="wt">' + esc(w.title) + '</div>' +
      '<div class="meta"><img src="' + w.av + '" alt="' + esc(w.author) + '"><span class="au">' + esc(w.author) + '</span>' +
      '<span class="ops ' + (isLiked(w.id) ? 'lked' : '') + '" data-like="' + w.id + '">' + likeSVG() + '<i data-lk="' + w.id + '">' + fmt(likeCount(w)) + '</i></span>' +
      '</div></div></a>';
  }
  function articleCard(w) {
    var abs = ABS[w.id] || '点击阅读全文，看看创作者的思考与观察。';
    return '<a class="acard" href="work.html?id=' + w.id + '">' +
      '<div class="cover"><img src="' + w.img + '" alt="' + esc(w.title) + '" loading="lazy"></div>' +
      '<div class="body"><span class="a-cat">' + esc(w.cat) + ' · ' + w.date + '</span>' +
      '<div class="a-title">' + esc(w.title) + '</div>' +
      '<div class="a-abs">' + esc(abs) + '</div>' +
      '<div class="a-meta"><img src="' + w.av + '" alt=""><span>' + esc(w.author) + '</span><span>·</span><span>' + fmt(w.views) + ' 阅读</span><span>·</span><span>' + fmt(w.likes) + ' 赞</span></div>' +
      '</div></a>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- 头部 / 页脚注入 ---------- */
  var NAVS = [
    ['index.html', '首页', 'index'],
    ['discover.html', '发现', 'discover'],
    ['articles.html', '看点', 'articles'],
    ['events.html', '设计大赛', 'events'],
    ['designers.html', '找设计师', 'designers'],
    ['ranking.html', '榜单', 'ranking']
  ];
  function renderHeader() {
    var host = $('#site-header');
    if (!host) return;
    var dark = document.body.hasAttribute('data-header-dark');
    var nav = NAVS.map(function (n) {
      return '<a href="' + n[0] + '"' + (PAGE === n[2] ? ' class="active"' : '') + '>' + n[1] + '</a>';
    }).join('');
    host.className = dark ? 'site-header header-dark' : 'site-header';
    host.innerHTML =
      '<div class="' + (dark ? 'hd-wrap' : 'container') + '"><div class="hd-inner">' +
      '<a class="logo" href="index.html"><span class="logo-mark">创</span>CHUANGKU<span class="logo-cn">创酷设计社区</span></a>' +
      '<nav class="nav" aria-label="主导航">' + nav + '</nav>' +
      '<form class="hd-search" action="discover.html" method="get">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<input name="q" placeholder="搜索作品 / 设计师" aria-label="搜索"></form>' +
      '<div class="hd-actions">' +
      '<a class="hd-login" href="javascript:void(0)" data-login>登录</a>' +
      '<a class="btn btn-primary btn-publish" href="publish.html" style="height:38px;padding:0 22px;font-size:13px">发布作品</a>' +
      '<button class="menu-toggle" id="menu-toggle" aria-label="菜单"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '</div></div></div>' +
      '<nav class="nav nav-mobile" id="nav-mobile" aria-label="移动端导航">' + nav + '</nav>';
    var tg = $('#menu-toggle');
    if (tg) tg.addEventListener('click', function () { $('#nav-mobile').classList.toggle('open'); });
  }
  function renderFooter() {
    var host = $('#site-footer');
    if (!host) return;
    host.innerHTML =
      '<div class="container"><div class="ft-grid">' +
      '<div class="ft-brand"><a class="logo" href="index.html"><span class="logo-mark">创</span>CHUANGKU<span class="logo-cn">创酷设计社区</span></a>' +
      '<p>发现原创造意，连接设计价值。中国设计师的作品展示与创意交流平台（演示项目）。</p></div>' +
      '<div class="ft-col"><div class="fc-t">产品服务</div><a href="discover.html">作品发现</a><a href="javascript:void(0)">素材库</a><a href="javascript:void(0)">AI 工作流</a><a href="javascript:void(0)">版权图库</a><a href="designers.html">找设计师</a></div>' +
      '<div class="ft-col"><div class="fc-t">学习成长</div><a href="articles.html">看点资讯</a><a href="javascript:void(0)">专业课程</a><a href="javascript:void(0)">AI 实战指南</a><a href="ranking.html">热门榜单</a></div>' +
      '<div class="ft-col"><div class="fc-t">关于我们</div><a href="javascript:void(0)">企业服务</a><a href="events.html">设计大赛</a><a href="javascript:void(0)">全职工作</a><a href="javascript:void(0)">兼职外快</a></div>' +
      '</div><div class="ft-bottom"><span>© 2026 CHUANGKU 创酷 · 本站为学习演示项目，非商业站点</span>' +
      '<span>作品图片来自 <a href="https://www.zcool.com.cn/" target="_blank" rel="noopener">站酷 ZCOOL</a> 公开页面，版权归原作者所有 · <a href="https://github.com/wulinjun007/chuangku-site" target="_blank" rel="noopener">GitHub</a></span></div></div>';
  }

  /* ---------- Toast / BackTop ---------- */
  function toast(msg) {
    var t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function initBacktop() {
    var b = document.createElement('button');
    b.id = 'backtop'; b.setAttribute('aria-label', '回到顶部');
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(b);
    window.addEventListener('scroll', function () { b.classList.toggle('show', window.scrollY > 500); }, { passive: true });
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  function initLogin() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-login]')) toast('演示站点：登录功能未接入服务端');
    });
  }

  /* ---------- 全局点赞代理 ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-like]');
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    var id = el.getAttribute('data-like');
    var on = toggleLike(id);
    el.classList.toggle('lked', on);
    var w = WORKS.find(function (x) { return x.id === id; });
    var num = el.querySelector('[data-lk]');
    if (num && w) num.textContent = fmt(likeCount(w));
    toast(on ? '已点赞 ♥' : '已取消点赞');
  });

  /* ---------- 首页 ---------- */
  function initIndex() {
    var grid = $('#home-grid');
    if (!grid) return;
    // hero 拼贴：赞数最高的 4 件非文章作品
    var feats = WORKS.filter(function (w) { return w.type === 'work'; }).sort(function (a, b) { return b.likes - a.likes; }).slice(0, 4);
    var collage = $('#hero-collage');
    if (collage) {
      var cls = ['t1', 't2', 't3', 't4'];
      collage.innerHTML = feats.map(function (w, i) {
        return '<div class="tile ' + cls[i] + '"><img src="' + w.img + '" alt="' + esc(w.title) + '">' +
          '<div class="cap"><span>' + esc(w.title) + '</span><span class="lk">♥ ' + w.likes + '</span></div></div>';
      }).join('');
    }
    // 分类宫格计数
    var catBox = $('#cat-grid');
    if (catBox) {
      catBox.innerHTML = CATS.map(function (c) {
        var n = WORKS.filter(function (w) { return w.cat === c; }).length;
        return '<a class="cat-item" href="discover.html?cat=' + encodeURIComponent(c) + '"><span class="ic">' + (CAT_ICONS[c] || '✦') + '</span><span class="nm">' + c + '</span><span class="ct">' + n + ' 件作品</span></a>';
      }).join('');
    }
    // 推荐等级计数
    var t3 = WORKS.filter(function (w) { return w.tier === 3; }).length,
        t2 = WORKS.filter(function (w) { return w.tier === 2; }).length,
        t1 = WORKS.filter(function (w) { return w.tier === 1; }).length;
    var tierBox = $('#tier-strip');
    if (tierBox) {
      tierBox.innerHTML =
        '<div class="tier-card"><span class="flames">' + fireSVG(3) + '</span><div><div class="t-name">首页推荐</div><div class="t-desc">编辑团队每周精选，社区最高展示位，本站现有 ' + t3 + ' 件</div></div></div>' +
        '<div class="tier-card"><span class="flames">' + fireSVG(2) + '</span><div><div class="t-name">频道推荐</div><div class="t-desc">各频道优质内容，进入分类榜候选，本站现有 ' + t2 + ' 件</div></div></div>' +
        '<div class="tier-card"><span class="flames">' + fireSVG(1) + '</span><div><div class="t-name">佳作推荐</div><div class="t-desc">通过原创审核的佳作，获得基础流量扶持，本站现有 ' + t1 + ' 件</div></div></div>';
    }
    // 首页作品流：tab 切换
    var state = { tab: 'rec' };
    function render() {
      var list;
      if (state.tab === 'new') list = WORKS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      else if (state.tab === 'hot') list = WORKS.filter(function (w) { return w.type === 'work'; }).sort(function (a, b) { return b.views - a.views; });
      else list = WORKS.filter(function (w) { return w.tier >= 2; }).sort(function (a, b) { return b.likes - a.likes; });
      grid.innerHTML = list.slice(0, 12).map(workCard).join('');
    }
    $$('#home-tabs .tab').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('#home-tabs .tab').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        state.tab = t.getAttribute('data-tab'); render();
      });
    });
    render();
    // 看点精选
    var artBox = $('#home-articles');
    if (artBox) artBox.innerHTML = WORKS.filter(function (w) { return w.type === 'article'; }).slice(0, 3).map(articleCard).join('');
    // 大赛精选
    var evBox = $('#home-events');
    if (evBox && typeof EVENTS !== 'undefined') evBox.innerHTML = EVENTS.slice(0, 3).map(eventCard).join('');
    // 设计师精选
    var desBox = $('#home-designers');
    if (desBox && typeof DESIGNERS !== 'undefined') desBox.innerHTML = DESIGNERS.slice(0, 3).map(designerCard).join('');
    // hero 搜索
    var hs = $('#hero-search');
    if (hs) hs.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('input', hs).value.trim();
      location.href = 'discover.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  /* ---------- 发现页 ---------- */
  function initDiscover() {
    var grid = $('#disc-grid');
    if (!grid) return;
    var qs = new URLSearchParams(location.search);
    var state = { cat: qs.get('cat') || '全部', q: (qs.get('q') || '').trim(), sort: qs.get('sort') || 'rec' };
    // 侧栏分类
    var side = $('#disc-side');
    var allCnt = WORKS.length;
    side.innerHTML = ['全部'].concat(CATS).map(function (c) {
      var n = c === '全部' ? allCnt : WORKS.filter(function (w) { return w.cat === c; }).length;
      return '<a href="javascript:void(0)" data-cat="' + c + '" class="' + (state.cat === c ? 'active' : '') + '"><span>' + (CAT_ICONS[c] || '✦') + ' ' + c + '</span><span class="n">' + n + '</span></a>';
    }).join('');
    function apply() {
      var list = WORKS.slice();
      if (state.cat !== '全部') list = list.filter(function (w) { return w.cat === state.cat; });
      if (state.q) {
        var k = state.q.toLowerCase();
        list = list.filter(function (w) { return (w.title + w.author).toLowerCase().indexOf(k) > -1; });
      }
      if (state.sort === 'new') list.sort(function (a, b) { return b.date.localeCompare(a.date); });
      else if (state.sort === 'hot') list.sort(function (a, b) { return b.views - a.views; });
      else list.sort(function (a, b) { return (b.tier - a.tier) || (b.likes - a.likes); });
      $('#disc-count').textContent = state.q ? '“' + state.q + '” 相关作品 ' + list.length + ' 个结果' : '共收录 ' + list.length + ' 件作品';
      grid.innerHTML = list.length ? list.map(workCard).join('') : '<div class="empty" style="grid-column:1/-1"><div class="ic">🔍</div>没有找到相关作品<br><small>试试其他关键词，或浏览全部分类</small></div>';
    }
    side.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cat]'); if (!a) return;
      state.cat = a.getAttribute('data-cat');
      $$('a', side).forEach(function (x) { x.classList.toggle('active', x === a); });
      apply();
    });
    $$('#disc-tabs .tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-sort') === state.sort);
      t.addEventListener('click', function () {
        $$('#disc-tabs .tab').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active'); state.sort = t.getAttribute('data-sort'); apply();
      });
    });
    apply();
  }

  /* ---------- 榜单 ---------- */
  function initRanking() {
    var box = $('#rank-list');
    if (!box) return;
    var hot = WORKS.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 20);
    box.innerHTML = hot.map(function (w, i) {
      return '<a class="rank-row' + (i < 3 ? ' top' + (i + 1) : '') + '" href="work.html?id=' + w.id + '">' +
        '<span class="no">' + (i + 1) + '</span>' +
        '<span class="thumb"><img src="' + w.img + '" alt="" loading="lazy"></span>' +
        '<span class="r-info"><span class="r-t">' + esc(w.title) + '</span><span class="r-a"><img src="' + w.av + '" alt="">' + esc(w.author) + ' · ' + w.cat + ' · ' + w.date + '发布</span></span>' +
        '<span class="r-hot"><svg viewBox="0 0 16 16"><path d="M13.4 1.6c-1.8.6-2.5 1.8-2.6 3 0 0 0 .3-.1.5-.2.1-.3 0-.6-.2-.6-1-1-2.4-1-4.9-4 1.6-4.8 4.5-4.8 6.3 0 .6-.5.5-.6.5-.4-.3-.6-.7-.6-.7V6c-.2-1.1 0-2 0-2C1.6 4.8.9 6.9.9 8.6.9 12.7 4.1 16 8 16s7.1-2.9 7.1-7c0-2.6-1.7-4.1-1.7-7.4"/></svg>' + fmt(w.views) + '</span></a>';
    }).join('');
    // 新星榜（最近 20 天发布）
    var rising = WORKS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 10)
      .sort(function (a, b) { return b.likes - a.likes; });
    $('#rank-rising').innerHTML = rising.map(function (w, i) {
      return '<a href="work.html?id=' + w.id + '"><span class="no' + (i < 3 ? ' hot' : '') + '">' + (i + 1) + '</span><span class="t">' + esc(w.title) + '</span><span class="v">' + w.likes + ' 赞</span></a>';
    }).join('');
    // 设计师影响力榜
    var byAuthor = {};
    WORKS.forEach(function (w) {
      if (!byAuthor[w.author]) byAuthor[w.author] = { author: w.author, av: w.av, likes: 0, n: 0 };
      byAuthor[w.author].likes += w.likes; byAuthor[w.author].n++;
    });
    var tops = Object.values(byAuthor).sort(function (a, b) { return b.likes - a.likes; }).slice(0, 10);
    $('#rank-designers').innerHTML = tops.map(function (d, i) {
      return '<a href="designers.html"><span class="no' + (i < 3 ? ' hot' : '') + '">' + (i + 1) + '</span><span class="t">' + esc(d.author) + '</span><span class="v">' + fmt(d.likes) + ' 获赞</span></a>';
    }).join('');
  }

  /* ---------- 找设计师 ---------- */
  function designerCard(d) {
    var wks = WORKS.filter(function (w) { return w.author === d.author; }).slice(0, 3);
    var cells = [];
    for (var i = 0; i < 3; i++) cells.push(wks[i % wks.length]); // 不足 3 件时循环填充，避免空格
    return '<div class="dcard"><div class="d-top"><img class="d-av" src="' + d.av + '" alt="' + esc(d.author) + '">' +
      '<div><div class="d-nm">' + esc(d.author) + '</div><div class="d-honor">' + esc(d.honor) + ' · ' + d.city + '</div></div></div>' +
      '<div class="d-meta"><span>粉丝 <b>' + fmt(d.fans) + '</b></span><span>获赞 <b>' + fmt(d.likes) + '</b></span><span>作品 <b>' + d.n + '</b></span></div>' +
      '<div class="d-fields">' + d.fields.map(function (f) { return '<span class="f">' + esc(f) + '</span>'; }).join('') + '</div>' +
      '<div class="d-works">' + cells.map(function (w) { return '<a href="work.html?id=' + w.id + '"><img src="' + w.img + '" alt="' + esc(w.title) + '" loading="lazy"></a>'; }).join('') + '</div>' +
      '<div class="d-foot"><button class="btn btn-line btn-sm" data-msg="演示站点：关注功能未接入服务端">+ 关注</button>' +
      '<button class="btn btn-primary btn-sm" data-msg="演示站点：私信功能未接入服务端">私信</button></div></div>';
  }
  function initDesigners() {
    var box = $('#des-grid');
    if (!box || typeof DESIGNERS === 'undefined') return;
    box.innerHTML = DESIGNERS.map(designerCard).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-msg]'); if (!b) return;
      if (b.textContent.indexOf('关注') === 0) { b.textContent = '已关注'; b.classList.add('btn-followed'); toast('已关注（演示状态，仅本机生效）'); }
      else toast(b.getAttribute('data-msg'));
    });
  }

  /* ---------- 看点 ---------- */
  function initArticles() {
    var box = $('#art-grid');
    if (!box) return;
    var arts = WORKS.filter(function (w) { return w.type === 'article'; })
      .concat(typeof EXTRA_ARTICLES !== 'undefined' ? EXTRA_ARTICLES : [])
      .sort(function (a, b) { return b.date.localeCompare(a.date); });
    box.innerHTML = arts.map(articleCard).join('');
  }

  /* ---------- 大赛 ---------- */
  function eventCard(ev) {
    return '<a class="ecard" href="javascript:void(0)" data-msg="演示站点：大赛详情页未收录">' +
      '<img src="' + ev.img + '" alt="' + esc(ev.name) + '" loading="lazy"><span class="veil"></span>' +
      '<span class="e-tag' + (ev.ended ? ' end' : '') + '">' + (ev.ended ? '已截稿' : '征稿中') + '</span>' +
      '<div class="ebody"><div class="e-name">' + esc(ev.name) + '</div>' +
      '<div class="e-info"><span>💰 ' + ev.prize + '</span><span>⏳ ' + ev.deadline + (ev.ended ? ' 截稿' : ' 截稿') + '</span><span>👤 ' + ev.host + '</span></div></div></a>';
  }
  function initEvents() {
    var box = $('#event-grid');
    if (!box || typeof EVENTS === 'undefined') return;
    box.innerHTML = EVENTS.map(eventCard).join('');
    box.addEventListener('click', function (e) {
      var a = e.target.closest('[data-msg]'); if (a) toast(a.getAttribute('data-msg'));
    });
  }

  /* ---------- 作品详情 ---------- */
  var ABS = window.ABS || {}; // 看点摘要（site-data.js 注入）
  var CMT_POOL = [
    ['这个完成度太高了，细节经得起放大看。', '收藏了，等一个过程分享！'],
    ['配色和光影氛围绝了，请问是哪个软件的流程？', '已关注，蹲一个教程。'],
    ['创意很打动我，叙事节奏也很好。', '这张构图真的舒服，学到了。'],
    ['质感做得好细腻，参考价值很高。', '太强了，这就是行业天花板吧。'],
    ['看完立刻转发给了团队，大家一起学习。', '期待出系列，追定了！']
  ];
  function initDetail() {
    var main = $('#detail-main');
    if (!main) return;
    var qs = new URLSearchParams(location.search);
    var id = qs.get('id');
    var w = WORKS.find(function (x) { return x.id === id; }) || WORKS[0];
    document.title = w.title + ' · ' + w.author + ' - 创酷 CHUANGKU';
    $('#crumb-here').textContent = w.title.length > 14 ? w.title.slice(0, 14) + '…' : w.title;
    var abs = ABS[w.id] || '';
    main.innerHTML =
      '<h1 class="d-title">' + esc(w.title) + '</h1>' +
      '<div class="d-sub"><a class="cat-link" href="discover.html?cat=' + encodeURIComponent(w.cat) + '">' + esc(w.cat) + '</a>' +
      '<span>' + w.date + ' 发布</span><span>' + fmt(w.views) + ' 浏览</span><span>' + fmt(w.favs) + ' 收藏</span><span>' + w.comments + ' 条评论</span>' +
      (w.video ? '<span>含视频内容</span>' : '') + '</div>' +
      '<figure class="detail-cover"><img src="' + w.img + '" alt="' + esc(w.title) + '"></figure>' +
      '<div class="detail-body"><p>' + (abs || '《' + w.title + '》来自创作者 ' + w.author + '，发布于' + w.cat + '频道。作品通过了社区原创审核，并在首页推荐流中展示。') + '</p>' +
      '<p>本页为静态演示详情：封面与作者信息均抓取自站酷公开页面，仅作学习演示，版权归原作者所有。喜欢这部作品的话，欢迎点赞支持创作者。</p></div>' +
      '<div class="action-rail">' +
      '<button class="act-btn' + (isLiked(w.id) ? ' liked' : '') + '" id="d-like">' + likeSVG() + '<span>' + fmt(likeCount(w)) + '</span> 点赞</button>' +
      '<button class="act-btn" data-msg="演示站点：收藏功能未接入服务端">☆ 收藏 ' + fmt(w.favs) + '</button>' +
      '<button class="act-btn" data-msg="链接已复制（演示）">↗ 分享</button>' +
      '<button class="act-btn" data-msg="演示站点：评论功能未接入服务端">💬 评论 ' + w.comments + '</button></div>';
    $('#d-like').addEventListener('click', function () {
      var on = toggleLike(w.id);
      this.classList.toggle('liked', on);
      $('span', this).textContent = fmt(likeCount(w));
      toast(on ? '已点赞 ♥' : '已取消点赞');
    });
    // 侧栏作者卡
    var byAuthor = WORKS.filter(function (x) { return x.author === w.author; });
    $('#detail-side').innerHTML =
      '<div class="author-card"><img class="big-av" src="' + w.av + '" alt="' + esc(w.author) + '">' +
      '<div class="a-nm">' + esc(w.author) + '</div><div class="a-honor">' + esc(w.honor) + '</div>' +
      '<div class="a-stats"><span><b>' + fmt(1200 + w.likes * 31) + '</b>粉丝</span><span><b>' + byAuthor.length + '</b>作品</span><span><b>' + fmt(byAuthor.reduce(function (s, x) { return s + x.likes; }, 0)) + '</b>获赞</span></div>' +
      '<button class="btn btn-primary" data-msg="演示站点：关注功能未接入服务端">+ 关注</button></div>' +
      '<div class="info-panel"><div class="row"><span class="k">所属频道</span><a class="v" style="color:var(--link)" href="discover.html?cat=' + encodeURIComponent(w.cat) + '">' + w.cat + '</a></div>' +
      '<div class="row"><span class="k">推荐等级</span><span class="v" style="color:var(--fire)">' + '🔥'.repeat(w.tier) + ' ' + (w.tier === 3 ? '首页推荐' : w.tier === 2 ? '频道推荐' : '佳作推荐') + '</span></div>' +
      '<div class="row"><span class="k">发布时间</span><span class="v">' + w.date + '</span></div>' +
      '<div class="row"><span class="k">内容类型</span><span class="v">' + (w.video ? '视频作品' : '图文作品') + '</span></div>' +
      '<div class="row"><span class="k">原创声明</span><span class="v">已通过审核</span></div></div>';
    // 相似作品（同分类，排除自身）
    var sim = WORKS.filter(function (x) { return x.cat === w.cat && x.id !== w.id; }).slice(0, 6);
    if (sim.length < 6) {
      WORKS.forEach(function (x) { if (sim.length < 6 && x.id !== w.id && sim.indexOf(x) === -1) sim.push(x); });
    }
    $('#sim-grid').innerHTML = sim.map(workCard).join('');
    // 评论区（静态合成）
    var names = WORKS.filter(function (x) { return x.author !== w.author; }).slice(w.comments % 40, w.comments % 40 + 4);
    var pool = CMT_POOL[w.comments % CMT_POOL.length];
    $('#cmt-list').innerHTML = names.map(function (u, i) {
      return '<div class="comment"><img src="' + u.av + '" alt=""><div class="c-body">' +
        '<div class="c-a">' + esc(u.author) + '<span class="honor">' + esc(u.honor) + '</span><time>' + (i + 1) + ' 天前</time></div>' +
        '<div class="c-txt">' + esc(pool[i % pool.length]) + '</div>' +
        '<div class="c-ops"><button data-msg="演示站点：回复功能未接入">回复</button><button data-msg="演示站点：点赞功能未接入">♥ ' + (3 + i * 5) + '</button></div>' +
        '</div></div>';
    }).join('');
    // 通用 data-msg 提示（含评论区/侧栏）
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-msg]');
      if (el && el.id !== 'd-like') toast(el.getAttribute('data-msg'));
    });
  }

  /* ---------- 发布页 ---------- */
  function initPublish() {
    var form = $('#pub-form');
    if (!form) return;
    var picked = false;
    var up = $('#up-box');
    up.addEventListener('click', function () { $('#up-file').click(); });
    $('#up-file').addEventListener('change', function () {
      if (this.files.length) { picked = true; up.innerHTML = '<div class="ic">🖼️</div><div class="picked">' + esc(this.files[0].name) + '</div><div class="tip" style="margin-top:6px">演示环境：文件不会被真正上传</div>'; }
    });
    $$('#tag-picks button').forEach(function (b) {
      b.addEventListener('click', function () { b.classList.toggle('on'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = $('#f-title').value.trim();
      if (!title) { toast('请填写作品标题'); $('#f-title').focus(); return; }
      if (!picked) { toast('请选择封面图片（演示环境下不会上传）'); return; }
      toast('演示站点：发布功能未接入服务端，内容未被保存');
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderHeader(); renderFooter(); initBacktop(); initLogin();
    if (PAGE === 'index') initIndex();
    else if (PAGE === 'discover') initDiscover();
    else if (PAGE === 'ranking') initRanking();
    else if (PAGE === 'designers') initDesigners();
    else if (PAGE === 'articles') initArticles();
    else if (PAGE === 'events') initEvents();
    else if (PAGE === 'work') initDetail();
    else if (PAGE === 'publish') initPublish();
  });
})();
