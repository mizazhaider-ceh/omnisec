/* =====================================================================
   The OmniSec Roadmap: Application Logic
   Author: Muhammad Izaz Haider
   Vanilla JS. State in localStorage. Cards expand into full lessons.
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
    theme:  localStorage.getItem(LS.theme) || "dark",
    filter: localStorage.getItem(LS.filter) || "all",
    query:  ""
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
  function allNodes(){
    const out = [];
    ROADMAP.forEach(p => p.stages.forEach(s => s.nodes.forEach(n => out.push(n))));
    return out;
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // ---------- progress ----------
  function isDone(id){ return !!state.done[id]; }
  function toggle(id){
    if (state.done[id]) delete state.done[id]; else state.done[id] = 1;
    save(LS.done, state.done);
    updateProgress();
    document.querySelectorAll(`[data-node="${id}"]`).forEach(card=>{
      card.classList.toggle("is-done", isDone(id));
      const chk = card.querySelector(".chk");
      if (chk) chk.setAttribute("aria-checked", isDone(id));
    });
    refreshPhaseCounters();
  }
  function progressNums(){
    const nodes = allNodes(), total = nodes.length;
    const done = nodes.filter(n => isDone(n.id)).length;
    return { done, total, pct: total ? Math.round(done/total*100) : 0 };
  }
  function updateProgress(){
    const { done, total, pct } = progressNums();
    el("barFill").style.width = pct + "%";
    el("progPct").textContent = pct + "%";
    el("progText").textContent = `${done} ${t("of")} ${total} ${t("done")}`;
    el("ringPct").textContent = pct + "%";
    el("ring").style.background = `conic-gradient(var(--accent) ${pct*3.6}deg, var(--ring-track) 0deg)`;
  }
  function refreshPhaseCounters(){
    document.querySelectorAll(".phase").forEach(p=>{
      const ids = Array.from(p.querySelectorAll("[data-node]")).map(c=>c.dataset.node);
      const uniq = [...new Set(ids)];
      const done = uniq.filter(isDone).length;
      const badge = p.querySelector(".phase-prog span");
      if (badge) badge.textContent = `${done}/${uniq.length}`;
    });
  }

  // ---------- matching ----------
  function matches(node){
    if (state.filter === "skip" && !node.skip) return false;
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const hay = [node.t, node.d, (node.tags||[]).join(" "), (node.tools||[]).join(" "),
                 (node.learn||[]).join(" "), (node.do||[]).join(" "),
                 (node.res||[]).map(r=>r.t).join(" ")].join(" ").toLowerCase();
    return hay.includes(q);
  }

  // ---------- rendering ----------
  function renderRoadmap(){
    const root = el("roadmap");
    root.innerHTML = "";
    let visibleTotal = 0;

    ROADMAP.forEach((phase, pi) => {
      const visNodes = [];
      phase.stages.forEach(s => s.nodes.forEach(n => { if (matches(n)) visNodes.push(n); }));
      if (!visNodes.length) return;
      visibleTotal += visNodes.length;

      const phaseEl = document.createElement("section");
      phaseEl.className = "phase";
      const doneInPhase = visNodes.filter(n => isDone(n.id)).length;
      phaseEl.innerHTML = `
        <div class="phase-head">
          <div class="mascot" data-phase="${phase.id}" title="${esc(phase.phase)}">
            ${CHARACTERS.byPhase[phase.id] || CHARACTERS.hero}
          </div>
          <div class="phase-meta">
            <div class="phase-kicker">${phase.icon} ${esc(t("phases"))} ${pi+1}</div>
            <h2 class="phase-title">${esc(phase.phase)}</h2>
            <p class="phase-blurb">${esc(phase.blurb)}</p>
            <div class="phase-prog"><span>${doneInPhase}/${visNodes.length}</span></div>
          </div>
        </div>`;

      const stagesWrap = document.createElement("div");
      stagesWrap.className = "stages";
      let stepNum = 0;

      phase.stages.forEach(stage => {
        const sNodes = stage.nodes.filter(matches);
        if (!sNodes.length) return;
        const stageEl = document.createElement("div");
        stageEl.className = "stage";
        stageEl.innerHTML = `<h3 class="stage-title"><span class="stage-dot"></span>${esc(stage.title)}</h3>`;
        const grid = document.createElement("div");
        grid.className = "node-grid";
        sNodes.forEach(n => { stepNum++; grid.appendChild(card(n, stepNum)); });
        stageEl.appendChild(grid);
        stagesWrap.appendChild(stageEl);
      });

      phaseEl.appendChild(stagesWrap);
      root.appendChild(phaseEl);
    });

    el("empty").hidden = visibleTotal !== 0;
  }

  function list(items, icon){
    return `<ul class="d-list">${items.map(i=>`<li><span class="li-ico">${icon}</span><span>${esc(i)}</span></li>`).join("")}</ul>`;
  }

  function card(n, num){
    const c = document.createElement("article");
    c.className = "node" + (isDone(n.id) ? " is-done" : "") + (n.skip ? " is-skip" : "");
    c.dataset.node = n.id;

    const lvName = LEVELS[n.lv] || "";
    const tools = (n.tools||[]).map(tl => `<span class="tool">${esc(tl)}</span>`).join("");
    const res = (n.res||[]).map(r =>
      `<a class="res" href="${esc(r.u)}" target="_blank" rel="noopener">🔗 ${esc(r.t)}</a>`).join("");

    const learnBlock = (n.learn&&n.learn.length) ? `<div class="d-sec"><h5>🎯 ${esc(t("learnHdr"))}</h5>${list(n.learn,"•")}</div>` : "";
    const doBlock    = (n.do&&n.do.length)       ? `<div class="d-sec"><h5>🛠️ ${esc(t("doHdr"))}</h5>${list(n.do,"›")}</div>` : "";
    const resBlock   = res ? `<div class="d-sec"><h5>📚 ${esc(t("resHdr"))}</h5><div class="res-wrap">${res}</div></div>` : "";
    const toolBlock  = tools ? `<div class="d-sec d-tools"><h5>🧰 ${esc(t("tools"))}</h5><div class="tools">${tools}</div></div>` : "";
    const tipBlock   = (n.skip && n.tip) ? `<div class="tipbox"><b>💡 ${esc(t("tipHdr"))}:</b> ${esc(n.tip)}</div>` : "";

    c.innerHTML = `
      <div class="node-head">
        <span class="chk" role="checkbox" tabindex="0" aria-checked="${isDone(n.id)}" aria-label="${esc(t('markDone'))}"></span>
        <div class="node-headtext">
          <div class="node-titleline">
            <span class="stepno">${num}</span>
            <h4 class="node-title">${esc(n.t)}</h4>
            ${n.skip ? `<span class="skip-flag" title="${esc(t('skipBadge'))}">⭐</span>` : ``}
          </div>
          <p class="node-desc">${esc(n.d)}</p>
          <div class="node-badges">
            ${lvName ? `<span class="lv lv-${n.lv}">${esc(lvName)}</span>` : ``}
            ${n.time ? `<span class="time">⏱ ${esc(n.time)}</span>` : ``}
            ${n.skip ? `<span class="gem">⭐ ${esc(t('gemTag'))}</span>` : ``}
          </div>
        </div>
        <button class="chev" aria-label="${esc(t('expand'))}" aria-expanded="false">▾</button>
      </div>
      <div class="node-body" hidden>
        ${tipBlock}${learnBlock}${doBlock}${toolBlock}${resBlock}
      </div>`;

    // expand / collapse (header, but not the checkbox)
    const head = c.querySelector(".node-head");
    const body = c.querySelector(".node-body");
    const chev = c.querySelector(".chev");
    function setOpen(open){
      c.classList.toggle("open", open);
      body.hidden = !open;
      chev.setAttribute("aria-expanded", open);
    }
    head.addEventListener("click", e => {
      if (e.target.closest(".chk")) return;          // checkbox handles itself
      setOpen(!c.classList.contains("open"));
    });

    // mark done (checkbox only)
    const chk = c.querySelector(".chk");
    const doToggle = e => { e.preventDefault(); e.stopPropagation(); toggle(n.id); };
    chk.addEventListener("click", doToggle);
    chk.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") doToggle(e); });

    return c;
  }

  // ---------- language selector ----------
  function buildLangSelect(){
    el("langSelect").innerHTML = I18N.LANGS
      .map(l => `<option value="${l.c}" ${l.c===state.lang?"selected":""}>${l.n}</option>`).join("");
  }

  // ---------- static text ----------
  function applyStatic(){
    const meta = I18N.meta(state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = meta.dir;
    document.body.classList.toggle("rtl", meta.dir === "rtl");

    el("tagline").textContent   = t("tagline");
    el("intro").textContent     = t("intro");
    el("search").placeholder    = t("search");
    el("fAll").textContent      = t("filterAll");
    el("fSkip").textContent     = t("filterSkip");
    el("expandAll").textContent = t("expand");
    el("collapseAll").textContent = t("collapse");
    el("resetBtn").textContent  = t("reset");
    el("progLabel").textContent = t("progress");
    el("builtBy").textContent   = t("built");
    el("role").textContent      = t("role");
    el("contact").textContent   = t("contact");
    el("langLabel").textContent = t("language");
    el("themeLabel").textContent= t("theme");
    el("skipTitle").textContent = t("skipTitle");
    el("skipDesc").textContent  = t("skipDesc");
    el("emptyMsg").textContent  = t("noResults");
    el("howTitle").textContent  = t("howTitle");
    el("howBody").innerHTML     = t("howBody");
    el("themeName").textContent = state.theme === "light" ? t("light") : t("dark");
    const cs = el("ctaStart"); if (cs) cs.textContent = t("ctaStart");
    const cw = el("ctaWhy");   if (cw) cw.textContent = t("ctaWhy");
    updateProgress();
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

  // ---------- filter ----------
  function setFilter(f){
    state.filter = f;
    localStorage.setItem(LS.filter, f);
    el("fAll").classList.toggle("active", f==="all");
    el("fSkip").classList.toggle("active", f==="skip");
    renderRoadmap();
  }
  function expandAll(open){
    document.querySelectorAll(".node").forEach(c=>{
      c.classList.toggle("open", open);
      const b=c.querySelector(".node-body"); if(b) b.hidden=!open;
      const ch=c.querySelector(".chev"); if(ch) ch.setAttribute("aria-expanded",open);
    });
  }

  // ---------- init ----------
  function init(){
    initStars();
    buildLangSelect();
    applyTheme();
    applyStatic();
    el("heroMascot").innerHTML = CHARACTERS.hero;

    el("langSelect").addEventListener("change", e => {
      state.lang = e.target.value;
      localStorage.setItem(LS.lang, state.lang);
      applyStatic(); renderRoadmap();
    });
    el("themeToggle").addEventListener("click", toggleTheme);
    el("fAll").addEventListener("click", ()=>setFilter("all"));
    el("fSkip").addEventListener("click", ()=>setFilter("skip"));
    el("expandAll").addEventListener("click", ()=>expandAll(true));
    el("collapseAll").addEventListener("click", ()=>expandAll(false));
    el("resetBtn").addEventListener("click", ()=>{
      if (confirm(t("confirmReset"))) { state.done={}; save(LS.done,state.done); renderRoadmap(); updateProgress(); }
    });

    let deb;
    el("search").addEventListener("input", e => {
      clearTimeout(deb);
      deb = setTimeout(()=>{ state.query=e.target.value; renderRoadmap(); observeAll(); }, 120);
    });

    const top = el("toTop");
    window.addEventListener("scroll", ()=> top.classList.toggle("show", window.scrollY > 600));
    top.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));

    setFilter(state.filter);
    observeAll();

    // card spotlight follows the cursor (the "wow" glow)
    document.addEventListener("pointermove", e => {
      const card = e.target.closest ? e.target.closest(".node") : null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    }, { passive: true });
  }

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
    function frame(t){
      ctx.clearRect(0, 0, W, H);
      const d = dim();
      stars.forEach(st => {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t/1000*st.s + st.p));
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

  // reveal-on-scroll
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{ if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.06 });
  function observeAll(){ document.querySelectorAll(".phase:not(.in)").forEach(p=>io.observe(p)); }

  document.addEventListener("DOMContentLoaded", init);
})();
