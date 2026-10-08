/* =====================================================================
   The OmniSec Roadmap: Application Logic
   Author: Muhammad Izaz Haider
   Vanilla JS SPA. Hash router: Home -> Phase page -> Topic page.
   State in localStorage. All offline, no backend.
   ===================================================================== */
(function () {
  "use strict";

  const LS = {
    done:  "omnisec.progress.v2",
    lang:  "omnisec.lang.v1",
    theme: "omnisec.theme.v1",
    filter:"omnisec.filter.v1"
  };

  const state = {
    done:   load(LS.done, {}),
    lang:   localStorage.getItem(LS.lang)  || detectLang(),
    theme:  localStorage.getItem(LS.theme) || "light",
    filter: localStorage.getItem(LS.filter) || "all",
    query:  "",
    view:   "home",
    viewId: null
  };

  // ---------- helpers ----------
  function load(k, def){ try { return JSON.parse(localStorage.getItem(k)) || def; } catch(e){ return def; } }
  function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
  function el(id){ return document.getElementById(id); }
  function t(key){ return I18N.t(state.lang, key); }
  function detectLang(){
    const n = (navigator.language || "en").slice(0,2);
    return I18N.LANGS.some(l => l.c === n) ? n : "en";
  }
  function orderedNodes(){
    const out = [];
    ROADMAP.forEach((p, pi) => p.stages.forEach((s, si) =>
      s.nodes.forEach(n => out.push({ p, s, n, pi, si }))));
    return out;
  }
  function findRef(id){
    return orderedNodes().find(r => r.n.id === id) || null;
  }
  function nextRef(){
    return orderedNodes().find(r => !isDone(r.n.id)) || null;
  }
  function phaseDone(p){
    let d = 0, total = 0;
    p.stages.forEach(s => s.nodes.forEach(n => { total++; if (isDone(n.id)) d++; }));
    return { d, total };
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // ---------- progress ----------
  function isDone(id){ return !!state.done[id]; }
  function toggle(id){
    if (state.done[id]) delete state.done[id]; else state.done[id] = 1;
    save(LS.done, state.done);
    updateProgress();
    refreshNextHint();
    document.querySelectorAll(`[data-node="${id}"]`).forEach(card=>{
      card.classList.toggle("done", isDone(id));
      card.classList.toggle("is-done", isDone(id));
      const chk = card.querySelector(".chk");
      if (chk) chk.setAttribute("aria-checked", isDone(id));
    });
    if (state.view === "topic" && state.viewId === id) paintTopicDone(id);
    if (state.view === "phase") refreshPhaseStats();
  }
  function progressNums(){
    const nodes = orderedNodes(), total = nodes.length;
    const done = nodes.filter(r => isDone(r.n.id)).length;
    return { done, total, pct: total ? Math.round(done/total*100) : 0 };
  }
  function updateProgress(){
    if (!el("barFill")) return;
    const { done, total, pct } = progressNums();
    el("barFill").style.width = pct + "%";
    el("progPct").textContent = pct + "%";
    el("progText").textContent = `${done} ${t("of")} ${total} ${t("done")}`;
    el("ringPct").textContent = pct + "%";
    el("ring").style.background = `conic-gradient(var(--accent) ${pct*3.6}deg, var(--ring-track) 0deg)`;
  }
  function refreshNextHint(){
    const hint = el("nextHint");
    if (!hint) return;
    const nx = nextRef();
    if (!nx){ hint.innerHTML = "🏆 " + esc(t("allDone")); return; }
    hint.innerHTML = `<span class="nh-k">${esc(t("upNext"))}</span> <a href="#/topic/${nx.n.id}"><b>${esc(nx.n.t)}</b></a> <span class="nh-p">${esc(nx.p.phase)}</span>`;
  }

  // ---------- matching (search / gems filter) ----------
  function matches(node){
    if (state.filter === "skip" && !node.skip) return false;
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const hay = [node.t, node.d, (node.tags||[]).join(" "), (node.tools||[]).join(" "),
                 (node.learn||[]).join(" "), (node.do||[]).join(" "),
                 (node.res||[]).map(r=>r.t).join(" ")].join(" ").toLowerCase();
    return hay.includes(q);
  }
  function listMode(){
    return state.query.trim() !== "" || state.filter === "skip";
  }
  function conceptList(items){
    const icons = ["◈","✦","⬢","⬣","◉","◎"];
    return `<ul class="concepts">${items.map((i,ix)=>`<li><span class="c-ico">${icons[ix % icons.length]}</span><span>${esc(i)}</span></li>`).join("")}</ul>`;
  }
  function stepList(items){
    return `<ol class="steps">${items.map(i=>`<li><span>${esc(i)}</span></li>`).join("")}</ol>`;
  }
  function badges(n, done){
    const lvName = LEVELS[n.lv] || "";
    return (lvName ? `<span class="lv lv-${n.lv}">${esc(lvName)}</span>` : ``) +
      (n.time ? `<span class="time">⏱ ${esc(n.time)}</span>` : ``) +
      (n.skip ? `<span class="gem">⭐ ${esc(t("gemTag"))}</span>` : ``) +
      (done ? `<span class="gem done-tag">✓ ${esc(t("completedTag"))}</span>` : ``);
  }

  // ================= ROUTER =================
  function route(){
    if (window._storyTimers){ window._storyTimers.forEach(clearTimeout); window._storyTimers = null; }
    const h = location.hash || "#/";
    const parts = h.replace(/^#\/?/, "").split("/");
    window.scrollTo({ top: 0 });
    if (parts[0] === "story") return viewStory();
    if (parts[0] === "resources") return viewResources();
    if (["tools","labs","cheatsheets","glossary","career","faq"].includes(parts[0])) return viewProPage(parts[0]);
    if (parts[0] === "phase" && parts[1]){
      const p = ROADMAP.find(x => x.id === parts[1]);
      if (p) return viewPhase(p);
    }
    if (parts[0] === "topic" && parts[1]){
      const ref = findRef(parts[1]);
      if (ref) return viewTopic(ref);
    }
    return viewHome();
  }

  function setDocTitle(s){
    document.title = s + " | The OmniSec Roadmap";
  }

  // ================= VIEW: STORY (The PenTrix x OmniSec) =================
  function viewStory(){
    state.view = "story"; state.viewId = null;
    setDocTitle(t("story"));
    const app = el("app");
    app.innerHTML = `
    <div class="view"><main class="wrap">
      <nav class="crumb"><a href="#/">${esc(t("home"))}</a><span>/</span><span>${esc(t("story"))}</span></nav>
      <div class="story-stage" id="storyStage">
        <div class="story-kickerline">${esc(t("storyKicker"))}</div>
        <canvas id="burst"></canvas>
        <div class="flare flare-a"></div>
        <div class="flare flare-b"></div>
        <div class="orb orb-a"><span>The PenTrix</span></div>
        <div class="orb orb-b"><span>OmniSec</span></div>
        <div class="flash"></div>
        <div class="shock"></div>
        <div class="shock d2"></div>
        <div class="shock d3"></div>
        <div class="core">✦</div>
        <div class="orbit-p o1"><i></i></div>
        <div class="orbit-p o2"><i></i></div>
        <div class="orbit-p o3"><i></i></div>
        <div class="story-ctrl">
          <button id="replayStory">↻ ${esc(t("replay"))}</button>
          <button id="skipStory">${esc(t("skip"))} →</button>
        </div>
      </div>
      <div class="story-content" id="storyContent" hidden>
        <div class="phase-kicker rv" style="--d:.05s;text-align:center">${esc(t("storyKicker"))}</div>
        <h2 class="rv" style="--d:.15s">${t("storyTitle")}</h2>
        <p class="lede rv" style="--d:.3s">${t("storyP1")}</p>
        <p class="lede rv" style="--d:.45s">${t("storyP2")}</p>
        <p class="lede rv" style="--d:.6s">${t("storyP3")}</p>
        <div class="pillars rv" style="--d:.75s">
          <div class="pillar"><span class="p-ico">🎯</span><h3>${esc(t("pillar1t"))}</h3><p>${esc(t("pillar1d"))}</p></div>
          <div class="pillar"><span class="p-ico">🛠️</span><h3>${esc(t("pillar2t"))}</h3><p>${esc(t("pillar2d"))}</p></div>
          <div class="pillar"><span class="p-ico">🌍</span><h3>${esc(t("pillar3t"))}</h3><p>${esc(t("pillar3d"))}</p></div>
        </div>
        <div class="story-cta rv" style="--d:.9s">
          <a class="btn btn-primary" href="#/">${esc(t("startLearning"))} →</a>
        </div>
      </div>
    </main></div>`;
    el("replayStory").addEventListener("click", playStory);
    el("skipStory").addEventListener("click", skipStory);
    playStory();
  }

  function playStory(){
    const stage = el("storyStage"), content = el("storyContent");
    if (!stage) return;
    if (window._storyTimers){ window._storyTimers.forEach(clearTimeout); }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.classList.remove("s1","s2","s3");
    if (content){ content.hidden = true; content.classList.remove("show"); }
    if (reduce){ skipStory(); return; }
    void stage.offsetWidth;
    const timers = [];
    timers.push(setTimeout(()=>{ const s=el("storyStage"); if(s) s.classList.add("s1"); }, 200));
    timers.push(setTimeout(()=>{ const s=el("storyStage"); if(s) s.classList.add("s2"); }, 1600));
    timers.push(setTimeout(()=>{ const s=el("storyStage"); if(s){ s.classList.add("s3"); } burst(); }, 2800));
    timers.push(setTimeout(()=>{
      const c=el("storyContent"); if(!c) return;
      c.hidden = false; requestAnimationFrame(()=>c.classList.add("show"));
    }, 3700));
    window._storyTimers = timers;
  }
  function skipStory(){
    if (window._storyTimers){ window._storyTimers.forEach(clearTimeout); window._storyTimers = null; }
    const stage = el("storyStage"), content = el("storyContent");
    if (stage) stage.classList.add("s3");
    if (content){ content.hidden = false; content.classList.add("show"); }
  }
  function burst(){
    const cv = el("burst"), stage = el("storyStage");
    if (!cv || !stage) return;
    const w = cv.width = stage.clientWidth, h = cv.height = stage.clientHeight;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const cx = w/2, cy = h/2;
    const VIOLET = ["167,139,250","139,92,246","196,141,255"];
    const TEAL = ["45,212,191","94,234,212","153,246,228"];
    const ps = [];
    const start = performance.now();
    const SWIRL_MS = 950;

    function spawnSwirl(side){
      // side -1: violet from left, +1: teal from right
      const cols = side < 0 ? VIOLET : TEAL;
      const ex = cx + side * (w*0.32), ey = cy + (Math.random()-.5)*60;
      const ang = Math.atan2(cy-ey, cx-ex);
      ps.push({
        x: ex, y: ey,
        vx: Math.cos(ang)*(2.5+Math.random()*2) , vy: Math.sin(ang)*(2.5+Math.random()*2) - 1.2,
        swirl: side * (1.5+Math.random()*2),
        r: 2+Math.random()*4, life: 1, decay: .006+Math.random()*.008,
        c: cols[(Math.random()*cols.length)|0], flick: Math.random()*6.28
      });
    }
    function explode(){
      const all = VIOLET.concat(TEAL, ["255,255,255","255,255,255"]);
      for (let i=0;i<200;i++){
        const a = Math.random()*Math.PI*2, sp = 2+Math.random()*9;
        ps.push({
          x: cx, y: cy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
          swirl: 0, r: 1.5+Math.random()*4, life: 1, decay: .007+Math.random()*.013,
          c: all[(Math.random()*all.length)|0], flick: Math.random()*6.28
        });
      }
    }

    ctx.globalCompositeOperation = "lighter";
    let exploded = false, t = 0;
    (function frame(){
      t = performance.now() - start;
      ctx.clearRect(0,0,w,h);
      if (t < SWIRL_MS){
        for (let i=0;i<7;i++){ spawnSwirl(-1); spawnSwirl(1); }
      } else if (!exploded){ exploded = true; explode(); }
      let alive = false;
      for (const p of ps){
        if (p.life <= 0) continue;
        alive = true;
        // swirl curl + upward flame drift
        const px = -p.vy, py = p.vx;
        p.vx += px * .02 * p.swirl; p.vy += py * .02 * p.swirl;
        p.vy -= .015;
        p.x += p.vx; p.y += p.vy;
        p.vx *= .99; p.vy *= .99;
        p.life -= p.decay; p.flick += .3;
        const fr = p.r * p.life * (0.75 + 0.25*Math.sin(p.flick));
        if (fr <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, fr, 0, 7);
        ctx.fillStyle = "rgba(" + p.c + "," + Math.max(p.life,0).toFixed(3) + ")";
        ctx.fill();
      }
      if (alive || t < SWIRL_MS + 100) requestAnimationFrame(frame);
      else ctx.clearRect(0,0,w,h);
    })();
  }

  // ================= VIEW: HOME =================
  function viewHome(){
    state.view = "home"; state.viewId = null;
    setDocTitle("Zero-to-Hero Offensive Security");
    const app = el("app");
    const { done, total, pct } = progressNums();
    const nx = nextRef();
    const ctaHref = nx ? `#/topic/${nx.n.id}` : "#cats";
    const ctaLabel = nx ? `▶ ${esc(t("continueBtn"))}` : esc(t("explore"));

    app.innerHTML = `
    <div class="view">
      <section class="hero">
        <div class="wrap">
          <div class="hero-orbit"><div class="hero-mascot" id="heroMascot"></div></div>
          <span class="eyebrow">✦ ${esc(t("pentrixTag"))} · Open-Source | Offline-First</span>
          <h1>The <span class="grad">OmniSec</span> Roadmap</h1>
          <p id="tagline">${esc(t("tagline"))}</p>
          <p id="intro">${esc(t("intro"))}</p>
          <div class="hero-badges">
            <span class="badge"><span class="dot"></span>${ROADMAP.length} ${esc(t("phases"))}</span>
            <span class="badge"><span class="dot"></span>${total} ${esc(t("topics"))}</span>
            <span class="badge"><span class="dot"></span>70+ ${esc(t("languages"))}</span>
            <span class="badge"><span class="dot"></span>100% Offline</span>
          </div>
          <div class="hero-cta">
            <a class="btn btn-primary" href="${ctaHref}">${ctaLabel}</a>
            <a class="btn btn-ghost" href="#why">${esc(t("ctaWhy"))}</a>
          </div>
          <div><a class="story-link" href="#/story">✨ ${esc(t("storyLink"))} →</a></div>
          <div class="scroll-hint">Scroll<span>↓</span></div>
        </div>
      </section>

      <main class="wrap">
        <div class="dash">
          <div class="panel">
            <div class="search-row">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
                <input id="search" type="search" placeholder="${esc(t("search"))}" autocomplete="off" />
              </div>
              <div class="chips">
                <button id="fAll" class="chip${state.filter==="all"?" active":""}">${esc(t("filterAll"))}</button>
                <button id="fSkip" class="chip${state.filter==="skip"?" active":""}">${esc(t("filterSkip"))}</button>
              </div>
            </div>
            <div class="toolbar-row">
              <div class="legend">${esc(t("legend"))}</div>
            </div>
            <div class="next-hint" id="nextHint"></div>
            <div class="results" id="homeResults" hidden></div>
          </div>

          <div class="panel prog-panel">
            <div class="ring" id="ring"><div class="inner" id="ringPct">${pct}%</div></div>
            <div class="prog-meta">
              <div class="lbl">${esc(t("progress"))}</div>
              <div class="pct" id="progPct">${pct}%</div>
              <div class="bar"><i id="barFill" style="width:${pct}%"></i></div>
              <div id="progText">${done} ${esc(t("of"))} ${total} ${esc(t("done"))}</div>
              <div class="streak-line">🔥 <b id="streakN">${state.streak ? state.streak.count : 0}</b> ${esc(t("streak"))}</div>
              <button class="reset" id="resetBtn">${esc(t("reset"))}</button>
            </div>
          </div>
        </div>

        <div id="catsWrap">
          <div class="sec-head">
            <div>
              <div class="phase-kicker">${esc(t("phases"))}</div>
              <h2>${esc(t("choosePhase"))}</h2>
              <p>${esc(t("choosePhaseSub"))}</p>
            </div>
          </div>
          <div class="cat-grid">
            ${ROADMAP.map((p, pi) => {
              const { d, total: pt } = phaseDone(p);
              const ppct = pt ? Math.round(d/pt*100) : 0;
              return `
              <a class="cat-card${d===pt && pt>0 ? " cat-done":""}" href="#/phase/${p.id}">
                <span class="cat-mascot">${CHARACTERS.byPhase[p.id] || CHARACTERS.hero}</span>
                <span class="cat-kicker">${p.icon} ${esc(t("phases"))} ${pi+1}</span>
                <h3>${esc(p.phase)}</h3>
                <p>${esc(p.blurb)}</p>
                <span class="cat-foot">
                  <span class="cat-count">${pt} ${esc(t("topics"))} · ${d}/${pt}</span>
                  <span class="cat-bar"><i style="width:${ppct}%"></i></span>
                  <span class="cat-go">${esc(t("explore"))} →</span>
                </span>
              </a>`;
            }).join("")}
          </div>

          <section class="levelup">
            <div class="sec-head">
              <div>
                <div class="phase-kicker">⚡ ${esc(t("levelUpKicker"))}</div>
                <h2>${esc(t("levelUp"))}</h2>
                <p>${esc(t("levelUpSub"))}</p>
              </div>
              <a class="btn btn-ghost" href="#/resources">${esc(t("resources"))} →</a>
            </div>
            <div class="res-grid">
              ${RES_CARDS.map(resCard).join("")}
            </div>
          </section>

          <section class="why" id="why">
            <div class="kicker">// ${esc(t("authorNote"))}</div>
            <h2>${t("whyTitle")}</h2>
            <p>${t("whyP1")}</p>
            <p>${t("whyP2")}</p>
            <p>${t("whyP3")}</p>
            <p>${t("whyP4")}</p>
            <div class="sig">~ Muhammad Izaz Haider</div>
          </section>
        </div>
      </main>
    </div>`;

    el("heroMascot").innerHTML = CHARACTERS.hero;
    updateProgress();
    refreshNextHint();
    bindHomeSearch();
    el("resetBtn").addEventListener("click", ()=>{
      if (confirm(t("confirmReset"))){ state.done={}; save(LS.done,state.done); viewHome(); }
    });
  }

  function bindHomeSearch(){
    const input = el("search");
    if (!input) return;
    el("fAll").addEventListener("click", ()=>{ state.filter="all"; save(LS.filter,"all"); paintHomeResults(); syncChips(); });
    el("fSkip").addEventListener("click", ()=>{ state.filter="skip"; save(LS.filter,"skip"); paintHomeResults(); syncChips(); });
    let deb;
    input.addEventListener("input", e => {
      clearTimeout(deb);
      deb = setTimeout(()=>{ state.query = e.target.value; paintHomeResults(); }, 120);
    });
    paintHomeResults();
  }
  function syncChips(){
    el("fAll").classList.toggle("active", state.filter==="all");
    el("fSkip").classList.toggle("active", state.filter==="skip");
  }
  function paintHomeResults(){
    const box = el("homeResults"), wrap = el("catsWrap");
    if (!box) return;
    if (!listMode()){ box.hidden = true; box.innerHTML=""; if(wrap) wrap.hidden = false; return; }
    const refs = orderedNodes().filter(r => matches(r.n));
    box.hidden = false;
    if (wrap) wrap.hidden = true;
    box.innerHTML = refs.length ? refs.map(r => `
      <article class="res-row${isDone(r.n.id)?" done":""}" data-node="${r.n.id}" data-topic="${r.n.id}" tabindex="0" role="button">
        <span class="chk" role="checkbox" aria-checked="${isDone(r.n.id)}" aria-label="${esc(t("markDone"))}"></span>
        <span class="res-main">
          <span class="res-title">${esc(r.n.t)} ${r.n.skip ? "⭐" : ""}</span>
          <span class="res-sub">${esc(r.p.phase)} · ${esc(r.s.title)}</span>
        </span>
        <span class="res-go">→</span>
      </article>`).join("")
      : `<div class="empty"><div class="big">🔍</div><p>${esc(t("noResults"))}</p></div>`;
    box.querySelectorAll("[data-topic]").forEach(row=>{
      row.addEventListener("click", e=>{
        if (e.target.closest(".chk")) return;
        location.hash = "#/topic/" + row.dataset.topic;
      });
      const chk = row.querySelector(".chk");
      chk.addEventListener("click", e=>{ e.stopPropagation(); toggle(row.dataset.topic); });
    });
  }

  // ================= VIEW: PHASE =================
  function viewPhase(p){
    state.view = "phase"; state.viewId = p.id;
    const pi = ROADMAP.indexOf(p);
    setDocTitle(p.phase);
    const app = el("app");
    const { d, total } = phaseDone(p);
    const pct = total ? Math.round(d/total*100) : 0;
    let step = 0;

    app.innerHTML = `
    <div class="view"><main class="wrap">
      <nav class="crumb"><a href="#/">${esc(t("home"))}</a><span>/</span><span>${esc(p.phase)}</span></nav>
      <header class="phase-hero">
        <div class="mascot ph-mascot">${CHARACTERS.byPhase[p.id] || CHARACTERS.hero}</div>
        <div class="ph-meta">
          <div class="phase-kicker">${p.icon} ${esc(t("phases"))} ${pi+1}</div>
          <h1>${esc(p.phase)}</h1>
          <p class="phase-blurb">${esc(p.blurb)}</p>
          <div class="ph-stats">
            <span class="ph-stat"><b>${total}</b> ${esc(t("topics"))}</span>
            <span class="ph-stat"><b>${d}/${total}</b> ${esc(t("done"))}</span>
            <span class="ph-barwrap"><span class="bar ph-bar"><i id="phBarFill" style="width:${pct}%"></i></span><b id="phPct">${pct}%</b></span>
          </div>
        </div>
      </header>
      ${p.stages.map(s => `
        <section class="stage">
          <h3 class="stage-title"><span class="stage-dot"></span>${esc(s.title)}</h3>
          <div class="topic-grid">
            ${s.nodes.map(n => { step++; return `
              <article class="tcard${isDone(n.id)?" done":""}" data-node="${n.id}" data-topic="${n.id}" tabindex="0" role="button" aria-label="${esc(n.t)}">
                <span class="tcard-top">
                  <span class="stepno">${step}</span>
                  <span class="tcard-title">${esc(n.t)}${n.skip?` <span class="skip-flag" title="${esc(t("skipBadge"))}">⭐</span>`:""}</span>
                </span>
                <span class="tcard-desc">${esc(n.d)}</span>
                <span class="tcard-meta">${badges(n, false)}</span>
                <span class="tcard-open">${esc(t("openLesson"))} <span>→</span></span>
                <button class="chk tcard-chk" aria-checked="${isDone(n.id)}" aria-label="${esc(t("markDone"))}" title="${esc(t("markDone"))}"></button>
              </article>`; }).join("")}
          </div>
        </section>`).join("")}
    </main></div>`;

    app.querySelectorAll("[data-topic]").forEach(card=>{
      card.addEventListener("click", e=>{
        if (e.target.closest(".tcard-chk")) return;
        location.hash = "#/topic/" + card.dataset.topic;
      });
      card.addEventListener("keydown", e=>{
        if ((e.key==="Enter"||e.key===" ") && !e.target.closest(".tcard-chk")){ e.preventDefault(); location.hash = "#/topic/" + card.dataset.topic; }
      });
      card.querySelector(".tcard-chk").addEventListener("click", e=>{ e.stopPropagation(); toggle(card.dataset.topic); });
    });
  }
  function refreshPhaseStats(){
    const p = ROADMAP.find(x => x.id === state.viewId);
    if (!p || !el("phBarFill")) return;
    const { d, total } = phaseDone(p);
    const pct = total ? Math.round(d/total*100) : 0;
    el("phBarFill").style.width = pct + "%";
    el("phPct").textContent = pct + "%";
  }

  // ================= VIEW: TOPIC =================
  function viewTopic(ref){
    state.view = "topic"; state.viewId = ref.n.id;
    const { p, s, n } = ref;
    const pi = ROADMAP.indexOf(p);
    setDocTitle(n.t);
    const app = el("app");
    const all = orderedNodes();
    const idx = all.findIndex(r => r.n.id === n.id);
    const prev = idx > 0 ? all[idx-1] : null;
    const next = idx < all.length-1 ? all[idx+1] : null;

    const tools = (n.tools||[]).map(x => `<span class="tool">${esc(x)}</span>`).join("");
    const res = (n.res||[]).map(r =>
      `<a class="res" href="${esc(r.u)}" target="_blank" rel="noopener">🔗 ${esc(r.t)}</a>`).join("");
    const tipBlock = (n.skip && n.tip) ? `<div class="tipbox"><b>💡 ${esc(t("tipHdr"))}:</b> ${esc(n.tip)}</div>` : "";

    app.innerHTML = `
    <div class="view"><main class="wrap detail-wrap">
      <nav class="crumb"><a href="#/">${esc(t("home"))}</a><span>/</span><a href="#/phase/${p.id}">${esc(p.phase)}</a><span>/</span><span>${esc(s.title)}</span></nav>
      <header class="detail-head">
        <div class="phase-kicker">${p.icon} ${esc(t("phases"))} ${pi+1} · ${esc(s.title)}</div>
        <h1>${esc(n.t)}</h1>
        <p class="detail-sub">${esc(n.d)}</p>
        <div class="dw-badges" id="topicBadges">${badges(n, isDone(n.id))}</div>
      </header>
      ${tipBlock}
      <div class="detail-grid">
        <div class="detail-main">
          ${(n.learn&&n.learn.length) ? `<section class="d-card"><h5>🎯 ${esc(t("learnHdr"))} <span class="sec-count">${n.learn.length}</span></h5>${conceptList(n.learn)}</section>` : ""}
          ${(n.do&&n.do.length) ? `<section class="d-card"><h5>🛠️ ${esc(t("doHdr"))} <span class="sec-count">${n.do.length}</span></h5>${stepList(n.do)}</section>` : ""}
        </div>
        <aside class="detail-side">
          ${tools ? `<section class="d-card"><h5>🧰 ${esc(t("tools"))}</h5><div class="tools">${tools}</div></section>` : ""}
          ${res ? `<section class="d-card"><h5>📚 ${esc(t("resHdr"))}</h5><div class="res-wrap">${res}</div></section>` : ""}
          <section class="d-card"><h5>📝 ${esc(t("myNotes"))}</h5>
            <textarea id="topicNotes" class="notes" rows="4" placeholder="${esc(t("notesPh"))}"></textarea>
            <div class="notes-hint">${esc(t("notesHint"))}</div>
          </section>
          <section class="d-card meta-card">
            <div class="meta-row"><span>${esc(t("phase"))}</span><b>${esc(p.phase)}</b></div>
            <div class="meta-row"><span>${esc(t("stage"))}</span><b>${esc(s.title)}</b></div>
            ${n.time ? `<div class="meta-row"><span>${esc(t("estTime"))}</span><b>⏱ ${esc(n.time)}</b></div>` : ""}
          </section>
        </aside>
      </div>
      <div class="detail-actions">
        <button id="topicDone" class="btn btn-primary"></button>
        <button id="bookmarkBtn" class="btn btn-ghost"></button>
        ${next ? `<a class="btn btn-ghost" href="#/topic/${next.n.id}">${esc(t("nextLesson"))} →</a>` : ""}
      </div>
      <nav class="pager">
        ${prev ? `<a class="pager-card" href="#/topic/${prev.n.id}"><span class="pg-k">← ${esc(t("prevLesson"))}</span><span class="pg-t">${esc(prev.n.t)}</span></a>` : `<span></span>`}
        ${next ? `<a class="pager-card pg-next" href="#/topic/${next.n.id}"><span class="pg-k">${esc(t("nextLesson"))} →</span><span class="pg-t">${esc(next.n.t)}</span></a>` : ""}
      </nav>
    </main></div>`;

    paintTopicDone(n.id);
    el("topicDone").addEventListener("click", ()=> toggle(n.id));
    paintBookmark(n.id);
    el("bookmarkBtn").addEventListener("click", ()=>{ toggleMark(n.id); paintBookmark(n.id); });
    const ta = el("topicNotes");
    if (ta){
      ta.value = getNotes()[n.id] || "";
      let deb = null;
      ta.addEventListener("input", ()=>{ clearTimeout(deb); deb = setTimeout(()=> saveNote(n.id, ta.value), 400); });
    }
  }
  function paintBookmark(id){
    const bb = el("bookmarkBtn");
    if (!bb) return;
    const on = getMarks().includes(id);
    bb.innerHTML = (on ? "★ " : "☆ ") + esc(t(on ? "bookmarked" : "bookmark"));
    bb.classList.toggle("on", on);
  }
  function paintTopicDone(id){
    const btn = el("topicDone");
    if (!btn) return;
    const doneState = isDone(id);
    btn.innerHTML = doneState ? `✓ ${esc(t("completedTag"))}` : `✓ ${esc(t("markComplete"))}`;
    btn.classList.toggle("btn-primary", !doneState);
    btn.classList.toggle("btn-ghost", doneState);
    const badgesEl = el("topicBadges");
    const ref = findRef(id);
    if (badgesEl && ref) badgesEl.innerHTML = badges(ref.n, doneState);
  }

  // ---------- chrome static text ----------
  function applyStatic(){
    const meta = I18N.meta(state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = meta.dir;
    document.body.classList.toggle("rtl", meta.dir === "rtl");
    el("langLabel").textContent  = t("language");
    el("themeLabel").textContent = t("theme");
    el("themeName").textContent  = state.theme === "light" ? t("light") : t("dark");
    el("builtBy").textContent    = t("built");
    el("role").textContent       = t("role");
    el("contact").textContent    = t("contact");
    const sl = el("storyLink"); if (sl) sl.textContent = "✨ " + t("story");
    const rl = el("resLink"); if (rl) rl.textContent = "◈ " + t("resources");
    buildLangSelect();
  }
  function buildLangSelect(){
    el("langSelect").innerHTML = I18N.LANGS
      .map(l => `<option value="${l.c}" ${l.c===state.lang?"selected":""}>${l.n}</option>`).join("");
  }

  // ---------- theme ----------
  function applyTheme(){
    document.documentElement.setAttribute("data-theme", state.theme);
    el("themeName").textContent = state.theme === "light" ? t("light") : t("dark");
    el("themeToggle").setAttribute("aria-pressed", state.theme === "dark");
  }
  function toggleTheme(){
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem(LS.theme, state.theme);
    applyTheme();
  }

  // ---------- init ----------
  function init(){
    initStars();
    applyTheme();
    applyStatic();
    state.streak = touchStreak();
    el("langSelect").addEventListener("change", e => {
      state.lang = e.target.value;
      localStorage.setItem(LS.lang, state.lang);
      applyStatic(); route();
    });
    el("themeToggle").addEventListener("click", toggleTheme);
    const top = el("toTop");
    window.addEventListener("scroll", ()=> top.classList.toggle("show", window.scrollY > 600));
    top.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));
    window.addEventListener("hashchange", route);
    route();
  }

  // reveal-on-scroll (for dynamically added .phase blocks if any)
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{ if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.04 });

  // ---------- galaxy starfield ----------
  function initStars(){
    const cv = el("stars");
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    let W, H, stars = [];
    function resize(){
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      const n = Math.min(260, Math.floor(W * H / 9000));
      stars = Array.from({length:n}, () => ({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.6 + 0.3,
        p: Math.random()*Math.PI*2,
        s: 0.4 + Math.random()*1.2,
        c: Math.random() < 0.12 ? "45,212,191" : (Math.random() < 0.2 ? "167,139,250" : "226,232,240")
      }));
    }
    function dim(){
      return document.documentElement.getAttribute("data-theme") === "light" ? 0.45 : 1;
    }
    function frame(tm){
      ctx.clearRect(0, 0, W, H);
      const d = dim();
      stars.forEach(st => {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(tm/1000*st.s + st.p));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${st.c},${(tw*d).toFixed(3)})`;
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(frame);
  }

  // ================= PRODUCTIVITY: streak, bookmarks, notes =================
  const LSX = { streak:"omnisec.streak.v1", notes:"omnisec.notes.v1", marks:"omnisec.marks.v1" };
  function getStreak(){ try{ return JSON.parse(localStorage.getItem(LSX.streak)) || {count:0,last:""}; }catch(e){ return {count:0,last:""}; } }
  function touchStreak(){
    const s = getStreak();
    const day = d => d.toISOString().slice(0,10);
    const today = day(new Date());
    if (s.last === today) return s;
    const yest = day(new Date(Date.now()-864e5));
    s.count = (s.last === yest) ? s.count+1 : 1;
    s.last = today;
    try{ localStorage.setItem(LSX.streak, JSON.stringify(s)); }catch(e){}
    return s;
  }
  function getMarks(){ try{ return JSON.parse(localStorage.getItem(LSX.marks)) || []; }catch(e){ return []; } }
  function toggleMark(id){
    let m = getMarks();
    m = m.includes(id) ? m.filter(x=>x!==id) : m.concat([id]);
    try{ localStorage.setItem(LSX.marks, JSON.stringify(m)); }catch(e){}
    return m;
  }
  function getNotes(){ try{ return JSON.parse(localStorage.getItem(LSX.notes)) || {}; }catch(e){ return {}; } }
  function saveNote(id, text){
    const n = getNotes();
    if (text.trim()) n[id] = text; else delete n[id];
    try{ localStorage.setItem(LSX.notes, JSON.stringify(n)); }catch(e){}
  }
  function findNode(id){
    for (const p of ROADMAP) for (const s of p.stages) for (const n of s.nodes)
      if (n.id === id) return {node:n, phase:p};
    return null;
  }
  function resCard(c){
    return `
      <a class="cat-card res-card" href="#/${c.id}">
        <div class="cat-top"><span class="cat-mascot">${c.icon}</span></div>
        <h3>${esc(c.t)}</h3>
        <p>${esc(c.d)}</p>
        <span class="cat-cta">${esc(t("open"))} →</span>
      </a>`;
  }

  // ================= RESOURCES HUB =================
  function viewResources(){
    state.view = "resources"; state.viewId = null;
    setDocTitle(t("resources"));
    const marks = getMarks();
    const markRows = marks.map(id => {
      const f = findNode(id);
      return f ? `<a class="mark-row" href="#/topic/${f.node.id}"><span class="mark-star">★</span><span class="mark-t">${esc(f.node.t)}</span><span class="mark-p">${esc(f.phase.phase.split(":")[0])}</span></a>` : "";
    }).join("");
    el("app").innerHTML = `
    <div class="view"><main class="wrap">
      <nav class="crumb"><a href="#/">${esc(t("home"))}</a><span>/</span><span>${esc(t("resources"))}</span></nav>
      <header class="page-hero">
        <span class="eyebrow">◈ ${esc(t("resources"))}</span>
        <h2>${esc(t("resourcesTitle"))}</h2>
        <p>${esc(t("resourcesSub"))}</p>
      </header>
      <div class="res-grid">${RES_CARDS.map(resCard).join("")}</div>
      <section class="d-card marks-sec">
        <h5>★ ${esc(t("yourBookmarks"))} <span class="sec-count">${marks.length}</span></h5>
        ${marks.length ? `<div class="mark-list">${markRows}</div>` : `<p class="empty-note">${esc(t("noBookmarks"))}</p>`}
      </section>
    </main></div>`;
  }

  // ================= PRO PAGES =================
  const PRO_TITLES = {tools:"pgTools", labs:"pgLabs", cheatsheets:"pgCheats", glossary:"pgGlossary", career:"pgCareer", faq:"pgFaq"};
  function viewProPage(which){
    state.view = which; state.viewId = null;
    setDocTitle(t(PRO_TITLES[which] || "resources"));
    const bodies = {tools:proTools, labs:proLabs, cheatsheets:proCheats, glossary:proGlossary, career:proCareer, faq:proFaq};
    el("app").innerHTML = `
    <div class="view"><main class="wrap">
      <nav class="crumb"><a href="#/">${esc(t("home"))}</a><span>/</span><a href="#/resources">${esc(t("resources"))}</a><span>/</span><span>${esc(t(PRO_TITLES[which] || "resources"))}</span></nav>
      ${bodies[which]()}
    </main></div>`;
    wireProPage(which);
  }
  function pageHero(kicker, titleKey, subKey){
    return `<header class="page-hero">
      <span class="eyebrow">◈ ${esc(t(kicker))}</span>
      <h2>${esc(t(titleKey))}</h2>
      <p>${esc(t(subKey))}</p>
    </header>`;
  }
  function proTools(){
    const cats = ["All"].concat([...new Set(TOOLS.map(x=>x.c))]);
    return pageHero("pgTools","pgTools","pgToolsSub") + `
      <div class="chips" id="toolChips">${cats.map((c,i)=>`<button class="chip${i===0?" on":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div class="tool-grid" id="toolGrid">${TOOLS.map(x=>`
        <a class="tool-card" href="${x.u}" target="_blank" rel="noopener" data-cat="${esc(x.c)}">
          <span class="tool-cat">${esc(x.c)}</span>
          <h4>${esc(x.n)}</h4><p>${esc(x.d)}</p>
          <span class="tool-go">↗</span>
        </a>`).join("")}</div>`;
  }
  function proLabs(){
    return pageHero("pgLabs","pgLabs","pgLabsSub") + `
      <div class="lab-grid">${LABS.map(l=>`
        <a class="lab-card" href="${l.u}" target="_blank" rel="noopener">
          <div class="lab-badges"><span class="lab-price">${esc(l.price)}</span><span class="lab-best">${esc(l.best)}</span></div>
          <h4>${esc(l.n)}</h4><p>${esc(l.d)}</p>
          <span class="tool-go">↗</span>
        </a>`).join("")}</div>`;
  }
  function proCheats(){
    return pageHero("pgCheats","pgCheats","pgCheatsSub") + `
      <div class="cheat-grid">${CHEATS.map((c,i)=>`
        <div class="cheat-card">
          <h4>${esc(c.t)}</h4><p>${esc(c.d)}</p>
          <pre class="cheat-code">${c.cmds.map(esc).join("\n")}</pre>
          <button class="mini-btn" data-cheat="${i}">⧉ ${esc(t("copy"))}</button>
        </div>`).join("")}</div>`;
  }
  function proGlossary(){
    return pageHero("pgGlossary","pgGlossary","pgGlossarySub") + `
      <div class="searchbar glos-search"><input id="glosQ" type="search" placeholder="${esc(t("searchGlossary"))}" autocomplete="off"></div>
      <div class="glos-list" id="glosList">${GLOSSARY.map(g=>`
        <div class="glos-row" data-term="${esc(g[0].toLowerCase())}"><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div>`;
  }
  function proCareer(){
    return pageHero("pgCareer","pgCareer","pgCareerSub") + `
      <h3 class="sec-h">${esc(t("certPath"))}</h3>
      <div class="cert-track">${CERTS.map((c,i)=>`
        <div class="cert-card"><span class="cert-step">${i+1}</span>
          <span class="cert-lvl">${esc(c.lvl)}</span>
          <h4>${esc(c.n)}</h4><p>${esc(c.d)}</p>
        </div>`).join("")}</div>
      <h3 class="sec-h">${esc(t("rolesTitle"))}</h3>
      <div class="role-grid">${ROLES.map(r=>`
        <div class="role-card"><h4>${esc(r.t)}</h4><p>${esc(r.d)}</p>
          <span class="role-skills">◈ ${esc(r.s)}</span>
        </div>`).join("")}</div>`;
  }
  function proFaq(){
    return pageHero("pgFaq","pgFaq","pgFaqSub") + `
      <div class="faq-list">${FAQS.map(f=>`
        <details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;
  }
  function wireProPage(which){
    if (which === "tools"){
      const chips = el("toolChips"), grid = el("toolGrid");
      if (!chips || !grid) return;
      chips.addEventListener("click", e=>{
        const b = e.target.closest(".chip"); if (!b) return;
        chips.querySelectorAll(".chip").forEach(c=>c.classList.remove("on"));
        b.classList.add("on");
        const cat = b.dataset.cat;
        grid.querySelectorAll(".tool-card").forEach(card=>{
          card.style.display = (cat === "All" || card.dataset.cat === cat) ? "" : "none";
        });
      });
    }
    if (which === "cheatsheets"){
      el("app").addEventListener("click", e=>{
        const b = e.target.closest("[data-cheat]"); if (!b) return;
        const c = CHEATS[+b.dataset.cheat];
        const done = ()=>{ b.textContent = "✓ " + t("copied"); setTimeout(()=>{ b.innerHTML = "⧉ " + esc(t("copy")); }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(c.cmds.join("\n")).then(done).catch(done);
        } else done();
      });
    }
    if (which === "glossary"){
      const q = el("glosQ"), list = el("glosList");
      if (!q || !list) return;
      q.addEventListener("input", ()=>{
        const v = q.value.trim().toLowerCase();
        list.querySelectorAll(".glos-row").forEach(r=>{
          r.style.display = (!v || r.dataset.term.includes(v) || r.textContent.toLowerCase().includes(v)) ? "" : "none";
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
