/* =====================================================================
   The OmniSec Roadmap: Cyber Characters (offline SVG mascots)
   Procedurally-drawn, AI-styled vector guardians. No external images,
   no network: pure inline SVG so the whole project works offline.
   Each phase gets a themed mascot; a hero mascot greets on load.
   ===================================================================== */

const CHARACTERS = (function(){

  // Shared defs: glow filter + gradients, injected once.
  function svgWrap(inner, vb="0 0 120 140"){
    return `<svg viewBox="${vb}" class="mascot-svg" xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <linearGradient id="g-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--mascot-1)"/>
          <stop offset="1" stop-color="var(--mascot-2)"/>
        </linearGradient>
        <radialGradient id="g-eye" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stop-color="#fff"/>
          <stop offset="0.5" stop-color="var(--accent)"/>
          <stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>
        </radialGradient>
      </defs>${inner}</svg>`;
  }

  // ---- HERO: a friendly cyber sentinel with a hoodie + circuit visor ----
  const hero = svgWrap(`
    <g class="float">
      <ellipse cx="60" cy="130" rx="30" ry="6" fill="var(--accent)" opacity="0.18"/>
      <!-- hood -->
      <path d="M30 70 Q60 18 90 70 L90 86 Q60 74 30 86 Z" fill="url(#g-body)"/>
      <!-- face plate -->
      <rect x="40" y="52" width="40" height="40" rx="14" fill="#0b1220"/>
      <!-- visor -->
      <rect x="44" y="62" width="32" height="14" rx="7" fill="#04121f"/>
      <circle cx="54" cy="69" r="5" fill="url(#g-eye)"/>
      <circle cx="66" cy="69" r="5" fill="url(#g-eye)"/>
      <!-- circuit lines -->
      <path d="M44 84 H76 M50 88 V92 M70 88 V92" stroke="var(--accent)" stroke-width="1.6" fill="none" opacity="0.9"/>
      <!-- body -->
      <path d="M34 92 Q60 84 86 92 L92 124 Q60 132 28 124 Z" fill="url(#g-body)"/>
      <path d="M60 96 V124" stroke="#0b1220" stroke-width="2" opacity="0.5"/>
      <circle cx="60" cy="104" r="3.4" fill="var(--accent)"/>
    </g>`);

  // ---- Phase mascots: distinct silhouettes, themed accents ----
  const navigator = svgWrap(`<g class="float">
    <polygon points="60,16 104,40 104,96 60,124 16,96 16,40" fill="url(#g-body)"/>
    <circle cx="60" cy="68" r="26" fill="#0b1220"/>
    <path d="M60 50 L66 70 L60 86 L54 70 Z" fill="var(--accent)"/>
    <circle cx="60" cy="68" r="4" fill="#fff"/>
    <circle cx="60" cy="68" r="30" fill="none" stroke="var(--accent)" stroke-width="1.4" opacity="0.5"/>
  </g>`);

  const brick = svgWrap(`<g class="float">
    <rect x="24" y="34" width="72" height="78" rx="10" fill="url(#g-body)"/>
    <rect x="34" y="50" width="22" height="16" rx="3" fill="#0b1220"/>
    <rect x="64" y="50" width="22" height="16" rx="3" fill="#0b1220"/>
    <circle cx="45" cy="58" r="4" fill="url(#g-eye)"/>
    <circle cx="75" cy="58" r="4" fill="url(#g-eye)"/>
    <rect x="40" y="82" width="40" height="6" rx="3" fill="var(--accent)" opacity="0.85"/>
    <path d="M30 34 V20 M90 34 V20" stroke="var(--accent)" stroke-width="3"/>
    <circle cx="30" cy="18" r="3" fill="var(--accent)"/><circle cx="90" cy="18" r="3" fill="var(--accent)"/>
  </g>`);

  const scope = svgWrap(`<g class="float">
    <circle cx="56" cy="60" r="34" fill="none" stroke="url(#g-body)" stroke-width="9"/>
    <circle cx="56" cy="60" r="20" fill="#0b1220"/>
    <path d="M56 44 V76 M40 60 H72" stroke="var(--accent)" stroke-width="1.6"/>
    <circle cx="56" cy="60" r="6" fill="url(#g-eye)"/>
    <rect x="80" y="84" width="30" height="11" rx="5" transform="rotate(45 80 84)" fill="url(#g-body)"/>
  </g>`);

  const web = svgWrap(`<g class="float">
    <path d="M60 18 V112 M18 60 H102 M28 30 L92 96 M92 30 L28 96" stroke="url(#g-body)" stroke-width="3"/>
    <circle cx="60" cy="60" r="16" fill="#0b1220"/>
    <circle cx="60" cy="60" r="5" fill="url(#g-eye)"/>
    <circle cx="60" cy="18" r="4" fill="var(--accent)"/><circle cx="60" cy="112" r="4" fill="var(--accent)"/>
    <circle cx="18" cy="60" r="4" fill="var(--accent)"/><circle cx="102" cy="60" r="4" fill="var(--accent)"/>
  </g>`);

  const blast = svgWrap(`<g class="float">
    <polygon points="60,14 70,46 104,46 76,66 88,100 60,80 32,100 44,66 16,46 50,46"
      fill="url(#g-body)"/>
    <circle cx="60" cy="58" r="15" fill="#0b1220"/>
    <circle cx="60" cy="58" r="5" fill="url(#g-eye)"/>
  </g>`);

  const rocket = svgWrap(`<g class="float">
    <path d="M60 14 Q84 44 84 84 Q84 104 60 116 Q36 104 36 84 Q36 44 60 14 Z" fill="url(#g-body)"/>
    <circle cx="60" cy="58" r="13" fill="#0b1220"/>
    <circle cx="60" cy="58" r="5" fill="url(#g-eye)"/>
    <path d="M36 84 L22 104 L42 96 Z M84 84 L98 104 L78 96 Z" fill="url(#g-body)"/>
    <path d="M52 116 Q60 132 68 116" fill="var(--accent)"/>
  </g>`);

  const trophy = svgWrap(`<g class="float">
    <path d="M38 30 H82 V52 Q82 78 60 84 Q38 78 38 52 Z" fill="url(#g-body)"/>
    <path d="M38 36 H26 Q24 54 40 58 M82 36 H94 Q96 54 80 58" fill="none" stroke="url(#g-body)" stroke-width="5"/>
    <rect x="52" y="84" width="16" height="14" fill="url(#g-body)"/>
    <rect x="40" y="98" width="40" height="9" rx="3" fill="url(#g-body)"/>
    <circle cx="60" cy="54" r="6" fill="url(#g-eye)"/>
  </g>`);

  const byPhase = { p0:navigator, p1:brick, p2:scope, p3:web, p4:blast, p5:rocket, p6:trophy };

  return { hero, byPhase };
})();
