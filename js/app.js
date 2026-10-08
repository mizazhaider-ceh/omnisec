/* =====================================================================
   The OmniSec Roadmap: Application Logic
   Author: Muhammad Izaz Haider
   Vanilla JS. State in localStorage. Quest-path UI with lesson drawer.
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
    query:  "",
    lesson: null   // currently open lesson node id
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
      s.nodes.forEach((n, ni) => out.push({ p, s, n, pi, si, ni }))));
    return out;
  }
  function findRef(id){
    return orderedNodes().find(r => r.n.id === id) || null;
  }
  function nextRef(){
    return orderedNodes().find(r => !isDone(r.n.id)) || null;
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
      card.classList.toggle("is-done", isDone(id));
      card.classList.toggle("done", isDone(id));
      const chk = card.querySelector(".chk");
      if (chk) chk.setAttribute("aria-checked", isDone(id));
    });
    // re-render path so the "next" marker moves
    renderRoadmap(); observeAll();
    if (state.lesson) paintDrawer(state.lesson);
  }
  function progressNums(){
    const nodes = orderedNodes(), total = nodes.length;
    const done = nodes.filter(r => isDone(r.n.id)).length;
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
  function refreshNextHint(){
    const nx = nextRef();
    const hint = el("nextHint");
    if (!hint) return;
    if (!nx){ hint.innerHTML = "🏆 " + esc(t("allDone")); return; }
    hint.innerHTML = `<span class="nh-k">${esc(t("upNext"))}</span> <b>${esc(nx.n.t)}</b> <span class="nh-p">${esc(nx.p.phase)}</span>`;
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

  // ---------- rendering ----------
  function renderRoadmap(){
    const root = el("roadmap");
    root.innerHTML = "";
    if (listMode()) renderResults(root);
    else renderPath(root);
    el("empty").hidden = root.children.length !== 0;
    refreshPhaseCounters();
    refreshNextHint();
  }

  function phaseHead(phase, pi, visCount){
    return `
      <div class="phase-head">
        <div class="mascot" data-phase="${phase.id}" title="${esc(phase.phase)}">
          ${CHARACTERS.byPhase[phase.id] || CHARACTERS.hero}
        </div>
        <div class="phase-meta">
          <div class="phase-kicker">${phase.icon} ${esc(t("phases"))} ${pi+1}</div>
          <h2 class="phase-title">${esc(phase.phase)}</h2>
          <p class="phase-blurb">${esc(phase.blurb)}</p>
          <div class="phase-prog"><span>0/${visCount}</span></div>
        </div>
      </div>`;
  }

  // --- quest path mode ---
  function renderPath(root){
    const nx = nextRef();
    const nextId = nx ? nx.n.id : null;

    ROADMAP.forEach((phase, pi) => {
      const phaseEl = document.createElement("section");
      phaseEl.className = "phase";
      let total = 0;
      phase.stages.forEach(s => { total += s.nodes.length; });
      phaseEl.innerHTML = phaseHead(phase, pi, total);

      phase.stages.forEach(stage => {
        const stageEl = document.createElement("div");
        stageEl.className = "stage";
        stageEl.innerHTML = `<h3 class="stage-title"><span class="stage-dot"></span>${esc(stage.title)}</h3>`;
        const path = document.createElement("div");
        path.className = "path";
        stage.nodes.forEach(n => path.appendChild(pathNode(n, n.id === nextId)));
        stageEl.appendChild(path);
        phaseEl.appendChild(stageEl);
      });

      root.appendChild(phaseEl);
    });
  }

  function pathNode(n, isNext){
    const a = document.createElement("article");
    a.className = "pnode" + (isDone(n.id) ? " done" : "") + (isNext ? " next" : "");
    a.dataset.node = n.id;
    a.tabIndex = 0;
    a.setAttribute("role", "button");
    a.setAttribute("aria-label", n.t);

    const lvName = LEVELS[n.lv] || "";
    a.innerHTML = `
      <span class="pnode-dot"><span class="pnode-num">✓</span></span>
      <span class="pnode-card">
        ${isNext ? `<span class="pnode-flag">🎯 ${esc(t("upNext"))}</span>` : ``}
        <span class="pnode-title">${esc(n.t)} ${n.skip ? `<span class="skip-flag" title="${esc(t("skipBadge"))}">⭐</span>` : ``}</span>
        <span class="pnode-desc">${esc(n.d)}</span>
        <span class="pnode-meta">
          ${lvName ? `<span class="lv lv-${n.lv}">${esc(lvName)}</span>` : ``}
          ${n.time ? `<span class="time">⏱ ${esc(n.time)}</span>` : ``}
          ${n.skip ? `<span class="gem">⭐ ${esc(t("gemTag"))}</span>` : ``}
        </span>
      </span>
      <button class="chk pnode-chk" aria-checked="${isDone(n.id)}" aria-label="${esc(t("markDone"))}" title="${esc(t("markDone"))}"></button>`;

    a.addEventListener("click", e => {
      if (e.target.closest(".pnode-chk")) return;
      openLesson(n.id);
    });
    a.addEventListener("keydown", e => {
      if (e.target.closest(".pnode-chk")) return;
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openLesson(n.id); }
    });
    const chk = a.querySelector(".pnode-chk");
    chk.addEventListener("click", e => { e.stopPropagation(); toggle(n.id); });
    return a;
  }

  // --- results list mode (search / gems) ---
  function renderResults(root){
    const refs = orderedNodes().filter(r => matches(r.n));
    const wrap = document.createElement("div");
    wrap.className = "results";
    refs.forEach(r => {
      const row = document.createElement("article");
      row.className = "res-row" + (isDone(r.n.id) ? " done" : "");
      row.dataset.node = r.n.id;
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      const lvName = LEVELS[r.n.lv] || "";
      row.innerHTML = `
        <span class="chk" role="checkbox" aria-checked="${isDone(r.n.id)}" aria-label="${esc(t("markDone"))}"></span>
        <span class="res-main">
          <span class="res-title">${esc(r.n.t)} ${r.n.skip ? "⭐" : ""}</span>
          <span class="res-sub">${esc(r.p.phase)} · ${esc(r.s.title)}${lvName ? " · " + esc(lvName) : ""}${r.n.time ? " · ⏱ " + esc(r.n.time) : ""}</span>
        </span>
        <span class="res-go">→</span>`;
      row.addEventListener("click", e => {
        if (e.target.closest(".chk")) return;
        openLesson(r.n.id);
      });
      row.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openLesson(r.n.id); }
      });
      const chk = row.querySelector(".chk");
      chk.addEventListener("click", e => { e.stopPropagation(); toggle(r.n.id); });
      wrap.appendChild(row);
    });
    root.appendChild(wrap);
  }

  // ---------- lesson drawer ----------
  function list(items, icon){
    return `<ul class="d-list">${items.map(i=>`<li><span class="li-ico">${icon}</span><span>${esc(i)}</span></li>`).join("")}</ul>`;
  }

  function openLesson(id){
    state.lesson = id;
    paintDrawer(id);
    el("scrim").hidden = false;
    el("drawer").hidden = false;
    requestAnimationFrame(()=> document.body.classList.add("dw-open"));
    document.body.style.overflow = "hidden";
  }
  function closeLesson(){
    state.lesson = null;
    document.body.classList.remove("dw-open");
    document.body.style.overflow = "";
    setTimeout(()=>{ el("scrim").hidden = true; el("drawer").hidden = true; }, 320);
  }

  function paintDrawer(id){
    const ref = findRef(id);
    if (!ref) return;
    const { p, s, n } = ref;
    const lvName = LEVELS[n.lv] || "";
    const tools = (n.tools||[]).map(x => `<span class="tool">${esc(x)}</span>`).join("");
    const res = (n.res||[]).map(r =>
      `<a class="res" href="${esc(r.u)}" target="_blank" rel="noopener">🔗 ${esc(r.t)}</a>`).join("");
    const learnBlock = (n.learn&&n.learn.length) ? `<div class="d-sec"><h5>🎯 ${esc(t("learnHdr"))}</h5>${list(n.learn,"•")}</div>` : "";
    const doBlock    = (n.do&&n.do.length)       ? `<div class="d-sec"><h5>🛠️ ${esc(t("doHdr"))}</h5>${list(n.do,"›")}</div>` : "";
    const resBlock   = res ? `<div class="d-sec"><h5>📚 ${esc(t("resHdr"))}</h5><div class="res-wrap">${res}</div></div>` : "";
    const toolBlock  = tools ? `<div class="d-sec d-tools"><h5>🧰 ${esc(t("tools"))}</h5><div class="tools">${tools}</div></div>` : "";
    const tipBlock   = (n.skip && n.tip) ? `<div class="tipbox"><b>💡 ${esc(t("tipHdr"))}:</b> ${esc(n.tip)}</div>` : "";

    el("dwCrumb").textContent = `${p.phase} · ${s.title}`;
    el("dwTitle").textContent = n.t;
    el("dwBadges").innerHTML =
      (lvName ? `<span class="lv lv-${n.lv}">${esc(lvName)}</span>` : ``) +
      (n.time ? `<span class="time">⏱ ${esc(n.time)}</span>` : ``) +
      (n.skip ? `<span class="gem">⭐ ${esc(t("gemTag"))}</span>` : ``) +
      (isDone(n.id) ? `<span class="gem done-tag">✓ ${esc(t("completedTag"))}</span>` : ``);
    el("dwBody").innerHTML = tipBlock + learnBlock + doBlock + toolBlock + resBlock;

    const doneBtn = el("dwDone");
    doneBtn.innerHTML = isDone(n.id)
      ? `${esc(t("nextLesson"))} →`
      : `✓ ${esc(t("markCompleteNext"))}`;

    // prev/next availability
    const all = orderedNodes();
    const idx = all.findIndex(r => r.n.id === id);
    el("dwPrev").disabled = idx <= 0;
    el("dwPrev").style.opacity = idx <= 0 ? .4 : 1;
  }

  function stepLesson(dir){
    if (!state.lesson) return;
    const all = orderedNodes();
    const idx = all.findIndex(r => r.n.id === state.lesson);
    const ni = idx + dir;
    if (ni < 0 || ni >= all.length) return;
    state.lesson = all[ni].n.id;
    paintDrawer(state.lesson);
    el("dwBody").scrollTop = 0;
  }

  function completeAndNext(){
    if (!state.lesson) return;
    const id = state.lesson;
    if (!isDone(id)) toggle(id);   // toggle re-renders path + repaints drawer
    const nx = nextRef();
    if (nx && nx.n.id !== id){ state.lesson = nx.n.id; paintDrawer(nx.n.id); }
    else closeLesson();
    el("dwBody").scrollTop = 0;
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
    el("legend").textContent    = t("legend");
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
    const cb = el("continueBtn"); if (cb) cb.innerHTML = `▶ ${esc(t("continueBtn"))}`;
    const cs = el("ctaStart"); if (cs) cs.textContent = t("ctaStart");
    const cw = el("ctaWhy");   if (cw) cw.textContent = t("ctaWhy");
    el("dwPrev").textContent = "← " + t("prevLesson");
    updateProgress();
    refreshNextHint();
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
    observeAll();
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
      applyStatic(); renderRoadmap(); observeAll();
      if (state.lesson) paintDrawer(state.lesson);
    });
    el("themeToggle").addEventListener("click", toggleTheme);
    el("fAll").addEventListener("click", ()=>setFilter("all"));
    el("fSkip").addEventListener("click", ()=>setFilter("skip"));
    el("resetBtn").addEventListener("click", ()=>{
      if (confirm(t("confirmReset"))) { state.done={}; save(LS.done,state.done); renderRoadmap(); updateProgress(); refreshNextHint(); }
    });
    el("continueBtn").addEventListener("click", ()=>{
      const nx = nextRef();
      if (!nx) return;
      setFilter("all"); state.query = ""; el("search").value = "";
      renderRoadmap(); observeAll();
      const nodeEl = document.querySelector(`.pnode[data-node="${nx.n.id}"]`);
      if (nodeEl) nodeEl.scrollIntoView({behavior:"smooth", block:"center"});
      setTimeout(()=> openLesson(nx.n.id), 450);
    });

    let deb;
    el("search").addEventListener("input", e => {
      clearTimeout(deb);
      deb = setTimeout(()=>{ state.query=e.target.value; renderRoadmap(); observeAll(); }, 120);
    });

    // drawer controls
    el("dwClose").addEventListener("click", closeLesson);
    el("scrim").addEventListener("click", closeLesson);
    el("dwPrev").addEventListener("click", ()=>stepLesson(-1));
    el("dwDone").addEventListener("click", completeAndNext);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && state.lesson) closeLesson();
    });

    const top = el("toTop");
    window.addEventListener("scroll", ()=> top.classList.toggle("show", window.scrollY > 600));
    top.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));

    // card spotlight follows the cursor
    document.addEventListener("pointermove", e => {
      const card = e.target.closest ? e.target.closest(".pnode-card") : null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    }, { passive: true });

    setFilter(state.filter);
    observeAll();
  }

  // reveal-on-scroll
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{ if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.04 });
  function observeAll(){ document.querySelectorAll(".phase:not(.in)").forEach(p=>io.observe(p)); }

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

  document.addEventListener("DOMContentLoaded", init);
})();
