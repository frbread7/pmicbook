/* Copyright (c) 2026 geniuskey and ProcessBook contributors.
   PMICBook is derived from ProcessBook. Executable code: MIT (see ../LICENSE-MIT).
   Educational content and illustrations: CC BY 4.0 (see ../LICENSE.md and docs/UPSTREAM_ATTRIBUTION.md). */
/* ==========================================================================
   PMICBook shared browser helpers — global object PB
   - Builds the top bar, chapter drawer, table of contents, pager, and theme control
   - Provides canvas, chart, range, segmented-control, color, formatting, and Three.js helpers
   This file is loaded in <head> without defer; chapter scripts belong before </body>.
   ========================================================================== */
(function () {
  "use strict";

  const CHAPTERS = [
    { slug: "overview",         num: "01", title: "PMIC Systems and Power Domains", titleKo: "PMIC 시스템과 전원 도메인", desc: "Map power rails, domains, loads, sequencing, and integration needs.", descKo: "전원 레일, 도메인, 부하, 시퀀싱과 통합 요구사항을 살펴봅니다.", tags: ["systems"] },
    { slug: "fundamentals",     num: "02", title: "PMIC Specifications and Fundamentals", titleKo: "PMIC 사양과 기초", desc: "Relate regulation, efficiency, quiescent current, transients, and temperature.", descKo: "레귤레이션, 효율, 정지 전류, 과도 응답과 온도의 관계를 다룹니다.", tags: ["systems", "interactive"] },
    { slug: "references-ldo",   num: "03", title: "References, Bias, and LDOs", titleKo: "기준전압, 바이어스 및 LDO", desc: "Connect references and feedback to dropout, noise, stability, and heat.", descKo: "기준전압과 피드백을 드롭아웃, 노이즈, 안정성 및 발열과 연결합니다.", tags: ["circuits", "interactive"] },
    { slug: "switching",        num: "04", title: "Switching and Power-Path Circuits", titleKo: "스위칭 및 전원 경로 회로", desc: "Explore buck, boost, charge-pump, charger, and protection functions.", descKo: "벅·부스트·차지펌프·충전기와 보호 기능의 동작을 살펴봅니다.", tags: ["circuits", "interactive"] },
    { slug: "devices",          num: "05", title: "Semiconductor Devices for PMICs", titleKo: "PMIC용 반도체 소자", desc: "Build the MOS, BJT, junction, breakdown, and power-device foundations.", descKo: "MOS, BJT, 접합, 항복 및 전력 소자의 기초를 익힙니다.", tags: ["devices"] },
    { slug: "bcd",              num: "06", title: "BCD Technology Architecture", titleKo: "BCD 기술 아키텍처", desc: "See why bipolar, CMOS, and high-voltage devices share one platform.", descKo: "바이폴라, CMOS 및 고전압 소자를 한 플랫폼에 통합하는 이유를 설명합니다.", tags: ["BCD"] },
    { slug: "hv-devices",       num: "07", title: "High-Voltage MOS and LDMOS", titleKo: "고전압 MOS 및 LDMOS", desc: "Relate drift regions and field shaping to breakdown and on-resistance.", descKo: "드리프트 영역과 전계 제어를 항복 전압 및 온저항과 연결합니다.", tags: ["BCD", "devices"] },
    { slug: "passives",         num: "08", title: "Integrated Passive Devices", titleKo: "집적 수동소자", desc: "Compare resistor, diode, capacitor, and inductor area and parasitics.", descKo: "저항, 다이오드, 커패시터와 인덕터의 면적 및 기생 성분을 비교합니다.", tags: ["BCD", "devices"] },
    { slug: "wafer",            num: "09", title: "Starting Substrate, Wells, and Isolation", titleKo: "기판, 웰 및 절연", desc: "Connect wafers, epitaxy, wells, and isolation to BCD device boundaries.", descKo: "웨이퍼, 에피택시, 웰과 절연을 BCD 소자 경계에 연결합니다.", tags: ["process"] },
    { slug: "oxidation",        num: "10", title: "Gate Dielectrics and Field Structures", titleKo: "게이트 절연막 및 전계 구조", desc: "Relate oxidation, dielectric choices, field plates, and thermal budget.", descKo: "산화, 절연막 선택, 필드 플레이트와 열 예산의 관계를 다룹니다.", tags: ["process", "interactive"] },
    { slug: "litho",            num: "11", title: "Lithography and Resist Patterning", titleKo: "리소그래피와 포토레지스트 패터닝", desc: "Pattern wells, drift regions, isolation, field plates, and contacts.", descKo: "웰, 드리프트 영역, 절연, 필드 플레이트와 콘택트의 패턴 형성을 살펴봅니다.", tags: ["process", "interactive"] },
    { slug: "etch",             num: "12", title: "Etch, Isolation, and Contacts", titleKo: "식각, 절연 및 콘택트", desc: "Understand etch selectivity, profile, isolation, and contact geometry.", descKo: "식각 선택비와 프로파일, 절연 및 콘택트 형상을 이해합니다.", tags: ["process", "interactive"] },
    { slug: "deposition",       num: "13", title: "Deposition and Epitaxy", titleKo: "박막 증착과 에피택시", desc: "Study films, step coverage, void risk, epitaxy, and stress.", descKo: "박막, 단차 피복, 보이드 위험, 에피택시와 응력을 살펴봅니다.", tags: ["process", "interactive"] },
    { slug: "implant",          num: "14", title: "Doping and Well/Drift Implants", titleKo: "웰·드리프트 도핑과 이온 주입", desc: "Relate implant distributions and masks to wells, drift, and junctions.", descKo: "주입 분포와 마스크를 웰, 드리프트 영역 및 접합과 연결합니다.", tags: ["process", "interactive"] },
    { slug: "anneal",           num: "15", title: "Anneal and Thermal Budget", titleKo: "어닐링과 열 예산", desc: "Explore activation, diffusion, junction movement, and process tradeoffs.", descKo: "활성화, 확산, 접합 이동과 공정 간 트레이드오프를 다룹니다.", tags: ["process", "interactive"] },
    { slug: "cmp",              num: "16", title: "Planarization and CMP", titleKo: "평탄화와 CMP", desc: "Connect topography, pattern density, contacts, and metal reliability.", descKo: "단차, 패턴 밀도, 콘택트와 금속 신뢰성의 관계를 살펴봅니다.", tags: ["process", "interactive"] },
    { slug: "metal",            num: "17", title: "Contacts, BEOL, and Thick Top Metal", titleKo: "콘택트, BEOL 및 두꺼운 최상층 금속", desc: "Trace resistance, current density, IR drop, and electromigration.", descKo: "저항, 전류 밀도, IR 강하와 일렉트로마이그레이션을 추적합니다.", tags: ["process", "physical", "interactive"] },
    { slug: "integration",      num: "18", title: "BCD Process Integration Flow", titleKo: "BCD 공정 통합 흐름", desc: "Map BCD device modules, then inspect a retained low-voltage CMOS base-flow stepper.", descKo: "BCD 소자 모듈을 정리하고 기존 저전압 CMOS 기반 공정 스테퍼를 살펴봅니다.", tags: ["BCD", "process", "interactive"] },
    { slug: "layout",           num: "19", title: "Layout, Parasitics, Thermal, and Noise", titleKo: "레이아웃, 기생 성분, 열 및 노이즈", desc: "Connect current loops, substrate coupling, thermal rise, and EMI.", descKo: "전류 루프, 기판 결합, 온도 상승과 EMI를 연결합니다.", tags: ["physical"] },
    { slug: "metrology",        num: "20", title: "Characterization and Production Test", titleKo: "특성 평가 및 양산 테스트", desc: "Interpret DC, transient, efficiency, WAT, wafer, and production tests.", descKo: "DC, 과도 응답, 효율, WAT, 웨이퍼 및 양산 테스트를 해석합니다.", tags: ["test", "interactive"] },
    { slug: "reliability",      num: "21", title: "Reliability", titleKo: "신뢰성", desc: "Survey wear-out, overstress, ESD, latch-up, and power cycling.", descKo: "열화, 과전압 스트레스, ESD, 래치업과 전력 사이클링을 살펴봅니다.", tags: ["reliability"] },
    { slug: "failure-analysis", num: "22", title: "Failure Analysis", titleKo: "고장 분석", desc: "Connect electrical symptoms to localization and physical evidence.", descKo: "전기적 증상을 고장 위치 파악 및 물리적 증거와 연결합니다.", tags: ["reliability"] },
    { slug: "advanced",         num: "23", title: "Smart Power and Emerging Context", titleKo: "스마트 파워와 첨단 기술 동향", desc: "Survey automotive, higher-voltage BCD, GaN, packaging, and digital control.", descKo: "자동차용 PMIC, 고전압 BCD, GaN, 패키징과 디지털 제어를 살펴봅니다.", tags: ["advanced"] },
    { slug: "lab",              num: "24", title: "BCD Process Lab", titleKo: "BCD 공정 실험실", desc: "Inspect illustrative process steps and BCD cross-sections.", descKo: "교육용 공정 단계와 BCD 단면을 살펴봅니다.", tags: ["BCD", "process", "interactive"] },
    { slug: "glossary",         num: "25", title: "Glossary and Final Knowledge Checks", titleKo: "용어집 및 종합 지식 점검", desc: "Search PMIC and BCD terms and review the learning path.", descKo: "PMIC 및 BCD 용어를 검색하고 학습 경로를 복습합니다.", tags: ["glossary"] },
  ];

  const pageLang = (document.documentElement.lang || "en").toLowerCase().startsWith("ko") || /(?:^|\/)ko(?:\/|$)/.test(location.pathname) ? "ko" : "en";
  const isKorean = pageLang === "ko";
  const chapterTitle = (chapter) => isKorean ? (chapter.titleKo || chapter.title) : chapter.title;
  const chapterDescription = (chapter) => isKorean ? (chapter.descKo || chapter.desc || "") : (chapter.desc || "");

  const PB = (window.PB = {});
  PB.CHAPTERS = CHAPTERS;
  PB.LANG = pageLang;
  PB.chapterTitle = chapterTitle;
  PB.chapterDescription = chapterDescription;

  /* ------------------------------------------------------------ math utils */
  PB.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  PB.lerp = (a, b, t) => a + (b - a) * t;
  PB.map = (x, a, b, c, d) => c + ((x - a) * (d - c)) / (b - a);
  PB.randn = function () {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  PB.poisson = function (lambda) {
    if (lambda <= 0) return 0;
    if (lambda > 40) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * PB.randn()));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  /** 숫자 포맷: 유효 자리 */
  PB.fmt = function (x, digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) return x.toExponential(digits - 1).replace("e+", "e");
    return Number(x.toPrecision(digits)).toLocaleString("en-US", { maximumFractionDigits: 6 });
  };
  /** SI 접두사 포맷: PB.si(2.3e-9,'m') → "2.3 nm" */
  PB.si = function (x, unit = "", digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0 " + unit;
    const pre = [[1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"], [1e-15, "f"]];
    const a = Math.abs(x);
    for (const [v, p] of pre) if (a >= v * 0.9995) return Number((x / v).toPrecision(digits)) + " " + p + unit;
    return x.toExponential(digits - 1) + " " + unit;
  };

  /** 이진 접두사 바이트 포맷: PB.bytes(3*2**30) → "3 GiB" (bin=false면 10진 GB) */
  PB.bytes = function (x, digits = 3, bin = true) {
    if (!isFinite(x)) return "—";
    const base = bin ? 1024 : 1000, units = bin ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] : ["B", "KB", "PB", "GB", "TB", "PB"];
    let i = 0, a = Math.abs(x);
    while (a >= base * 0.9995 && i < units.length - 1) { a /= base; i++; }
    return Number((Math.sign(x) * a).toPrecision(digits)) + " " + units[i];
  };
  /** 정수 → 2진 문자열 (자리수 고정): PB.bin(5,4) → "0101" */
  PB.bin = (n, width = 8) => (n >>> 0).toString(2).padStart(width, "0").slice(-width);

  /** 오차 함수 (Abramowitz–Stegun 7.1.26, |ε| < 1.5e-7) */
  PB.erf = function (x) {
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  };
  PB.erfc = (x) => 1 - PB.erf(x);
  /** 캔버스 글꼴 문자열: PB.font(12) / PB.font(11, true) */
  PB.font = function (px, mono, weight) {
    const cs = getComputedStyle(document.body);
    return (weight ? weight + " " : "") + px + "px " + (mono ? cs.getPropertyValue("--mono") : cs.getPropertyValue("--font"));
  };
  /** 호출을 묶어 마지막 한 번만 실행 */
  PB.debounce = function (fn, ms = 120) { let t = 0; return function () { const a = arguments; clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; };
  /** 정규 난수 시드 고정용 간단 PRNG (mulberry32) */
  PB.rng = function (seed) { let a = seed >>> 0; return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  PB.kB = 8.617333e-5; // eV/K

  /* ------------------------------------------------------------ physics consts */
  PB.C = { h: 6.62607015e-34, c: 2.99792458e8, q: 1.602176634e-19, k: 1.380649e-23, eps0: 8.8541878128e-12, hbar: 1.054571817e-34, me: 9.1093837015e-31 };

  /** 파장(nm) → [r,g,b] 0..255 (가시광 380~780, 밖은 어두운 색) */
  PB.wl2rgbArr = function (nm) {
    let r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490 && nm >= 440) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510 && nm >= 490) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580 && nm >= 510) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645 && nm >= 580) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 780 && nm >= 645) { r = 1; }
    let f = 0;
    if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
    else if (nm >= 420 && nm <= 700) f = 1;
    else if (nm > 700 && nm <= 780) f = 0.3 + (0.7 * (780 - nm)) / 80;
    const gm = 0.8;
    const c = (v) => Math.round(255 * Math.pow(v * f, gm));
    if (nm < 380) return [110, 60, 160];   // UV: 보라 계열 표시용
    if (nm > 780) return [120, 30, 30];    // IR: 어두운 적색 표시용
    return [c(r), c(g), c(b)];
  };
  PB.wl2rgb = function (nm, alpha = 1) {
    const [r, g, b] = PB.wl2rgbArr(nm);
    return alpha === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
  };

  /* ------------------------------------------------------------ theme */
  const themeCbs = [];
  PB.onTheme = (cb) => themeCbs.push(cb);
  PB.isDark = function () {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  /** CSS 변수 값 읽기: PB.color('accent') */
  PB.color = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  };
  /** 자주 쓰는 색 묶음 (테마 변경 시 다시 호출할 것) */
  PB.palette = function () {
    const c = PB.color;
    return {
      bg: c("canvas-bg"), text: c("text"), dim: c("text-dim"), faint: c("text-faint"),
      grid: c("grid"), axis: c("axis"), border: c("border"), surface: c("surface"),
      accent: c("accent"), accent2: c("accent-2"), ok: c("ok"), warn: c("warn"), bad: c("bad"),
      red: c("red"), green: c("green"), blue: c("blue"),
      // 데이터 시리즈용 기본 순서
      series: [c("accent"), c("accent-2"), c("warn"), c("ok"), c("bad"), c("text-dim")],
    };
  };
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    themeCbs.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  }
  try { const saved = localStorage.getItem("pb-theme"); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (!document.documentElement.getAttribute("data-theme")) applyTheme(null);
    });
  }

  /* ------------------------------------------------------------ canvas helper */
  /**
   * HiDPI 캔버스. 폭은 부모 폭을 따르고 높이는 aspect(높이/폭) 또는 height(px)로 결정.
   * draw(ctx, w, h)는 리사이즈·테마 변경 시 자동 호출된다. 애니메이션이면 직접 redraw() 호출.
   *   const cv = PB.canvas(el, (ctx,w,h)=>{...}, {aspect:0.5, maxHeight: 420});
   *   cv.redraw(); cv.ctx; cv.w; cv.h
   */
  PB.canvas = function (canvas, draw, opts = {}) {
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    const ctx = canvas.getContext("2d");
    const st = { ctx, w: 0, h: 0, canvas, dpr: 1 };
    function resize() {
      const parent = canvas.parentElement;
      const w = Math.max(200, Math.floor(opts.width || parent.clientWidth || 600));
      let h = opts.height || Math.round(w * (opts.aspect || 0.5));
      if (opts.minHeight) h = Math.max(h, opts.minHeight);
      if (opts.maxHeight) h = Math.min(h, opts.maxHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h; st.dpr = dpr;
      st.redraw();
    }
    st.redraw = function () {
      if (!st.w) return;
      ctx.save();
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (!opts.noClear) {
        ctx.clearRect(0, 0, st.w, st.h);
        ctx.fillStyle = PB.color("canvas-bg");
        ctx.fillRect(0, 0, st.w, st.h);
      }
      try { draw && draw(ctx, st.w, st.h); } finally { ctx.restore(); }
    };
    st.resize = resize;
    if (window.ResizeObserver) {
      let lastW = -1;
      new ResizeObserver(() => { const w = canvas.parentElement.clientWidth; if (w !== lastW) { lastW = w; resize(); } }).observe(canvas.parentElement);
    } else window.addEventListener("resize", resize);
    PB.onTheme(() => st.redraw());
    resize();
    return st;
  };

  /**
   * 화면에 보일 때만 도는 애니메이션 루프. fn(dt초, t초)
   *   const loop = PB.loop(el, (dt,t)=>{...}); loop.stop(); loop.start();
   */
  PB.loop = function (el, fn) {
    let raf = 0, last = 0, t = 0, visible = true, running = true;
    function frame(ts) {
      raf = 0;
      if (!running || !visible) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; t += dt;
      fn(dt, t);
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    if (window.IntersectionObserver && el) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }).observe(el);
    }
    kick();
    return {
      start() { running = true; kick(); },
      stop() { running = false; },
      get running() { return running; },
      toggle() { running ? (running = false) : ((running = true), kick()); return running; },
    };
  };

  /* ------------------------------------------------------------ chart helper */
  /**
   * 간단한 선 그래프. box = {x,y,w,h}(생략 시 캔버스 전체에 여백 자동)
   * opts: { x:[min,max], y:[min,max], logX, logY, xLabel, yLabel, xTicks, yTicks,
   *         xFmt, yFmt, series:[{data:[[x,y],...], color, width, dash, fill, label}],
   *         vlines:[{x,color,label,dash}], hlines:[{y,color,label,dash}], points:[{x,y,color,r,label}],
   *         bands:[{x0,x1,color}] }
   * 반환: { X(v)->px, Y(v)->px, box }
   */
  PB.chart = function (ctx, box, opts) {
    const P = PB.palette();
    const dpr = (ctx.getTransform && ctx.getTransform().a) || 1;
    const W = ctx.canvas.width / dpr, H = ctx.canvas.height / dpr;
    if (!box) box = { x: 58, y: 16, w: W - 58 - 18, h: H - 16 - 46 };
    const [x0, x1] = opts.x, [y0, y1] = opts.y;
    const lx = (v) => (opts.logX ? Math.log10(v) : v);
    const ly = (v) => (opts.logY ? Math.log10(v) : v);
    const X = (v) => box.x + ((lx(v) - lx(x0)) / (lx(x1) - lx(x0))) * box.w;
    const Y = (v) => box.y + box.h - ((ly(v) - ly(y0)) / (ly(y1) - ly(y0))) * box.h;
    const ticks = (a, b, log, n) => {
      if (log) { const out = []; for (let e = Math.ceil(Math.log10(a) - 1e-9); e <= Math.log10(b) + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
      const span = b - a, raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= (n || 5) + 0.5) || raw;
      const out = []; for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      return out;
    };
    const defFmt = (v) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(0).replace("e+", "e") : String(Number(v.toPrecision(4))));
    const xFmt = opts.xFmt || defFmt, yFmt = opts.yFmt || defFmt;
    ctx.save();
    ctx.font = "11px " + getComputedStyle(document.body).getPropertyValue("--mono");
    ctx.lineWidth = 1;
    // bands
    (opts.bands || []).forEach((b) => { ctx.fillStyle = b.color; ctx.fillRect(X(b.x0), box.y, X(b.x1) - X(b.x0), box.h); });
    // grid + ticks
    const xt = opts.xTicks || ticks(x0, x1, opts.logX, 6);
    const yt = opts.yTicks || ticks(y0, y1, opts.logY, 5);
    ctx.strokeStyle = P.grid; ctx.fillStyle = P.dim;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xt.forEach((v) => { const px = X(v); if (px < box.x - 1 || px > box.x + box.w + 1) return; ctx.beginPath(); ctx.moveTo(px, box.y); ctx.lineTo(px, box.y + box.h); ctx.stroke(); ctx.fillText(xFmt(v), px, box.y + box.h + 6); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach((v) => { const py = Y(v); if (py < box.y - 1 || py > box.y + box.h + 1) return; ctx.beginPath(); ctx.moveTo(box.x, py); ctx.lineTo(box.x + box.w, py); ctx.stroke(); ctx.fillText(yFmt(v), box.x - 6, py); });
    ctx.strokeStyle = P.axis;
    ctx.beginPath(); ctx.moveTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.stroke();
    // labels
    ctx.fillStyle = P.dim; ctx.font = "12px " + getComputedStyle(document.body).getPropertyValue("--font");
    if (opts.xLabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(opts.xLabel, box.x + box.w / 2, box.y + box.h + 40); }
    if (opts.yLabel) { ctx.save(); ctx.translate(14, box.y + box.h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(opts.yLabel, 0, 0); ctx.restore(); }
    // clip plot area
    ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y - 2, box.w + 2, box.h + 4); ctx.clip();
    (opts.series || []).forEach((s, i) => {
      if (!s.data || !s.data.length) return;
      ctx.strokeStyle = s.color || P.series[i % P.series.length];
      ctx.lineWidth = s.width || 2; ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      let started = false;
      s.data.forEach(([x, y]) => { if (!isFinite(y) || (opts.logY && y <= 0) || (opts.logX && x <= 0)) { started = false; return; } const px = X(x), py = Y(y); started ? ctx.lineTo(px, py) : ctx.moveTo(px, py); started = true; });
      ctx.stroke();
      if (s.fill) {
        ctx.lineTo(X(s.data[s.data.length - 1][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.lineTo(X(s.data[0][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.closePath(); ctx.fillStyle = s.fill; ctx.fill();
      }
      ctx.setLineDash([]);
    });
    (opts.vlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(X(l.x), box.y); ctx.lineTo(X(l.x), box.y + box.h); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(l.label, X(l.x) + 4, box.y + 4); } });
    (opts.hlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(box.x, Y(l.y)); ctx.lineTo(box.x + box.w, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(l.label, box.x + box.w - 4, Y(l.y) - 3); } });
    (opts.points || []).forEach((p) => { ctx.fillStyle = p.color || P.accent; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.r || 4, 0, Math.PI * 2); ctx.fill(); if (p.label) { ctx.fillStyle = P.text; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(p.label, X(p.x) + 6, Y(p.y) - 4); } });
    ctx.restore();
    ctx.restore();
    return { X, Y, box };
  };

  /* ------------------------------------------------------------ controls */
  /**
   * range 입력 바인딩. output은 id+"-out" 요소 또는 <output for=id>.
   *   const get = PB.range('wl', v => v+' nm', v => redraw());  get() → 현재 값(Number)
   */
  PB.range = function (id, fmt, onInput) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const out = document.getElementById(el.id + "-out") || document.querySelector(`output[for="${el.id}"]`);
    const update = (fire) => {
      const v = Number(el.value);
      const pct = ((v - Number(el.min || 0)) / (Number(el.max || 100) - Number(el.min || 0))) * 100;
      el.style.setProperty("--fill", pct + "%");
      if (out) out.textContent = fmt ? fmt(v) : String(v);
      if (fire && onInput) onInput(v);
    };
    el.addEventListener("input", () => update(true));
    update(false);
    const get = () => Number(el.value);
    get.set = (v) => { el.value = v; update(true); };
    get.el = el;
    return get;
  };
  /**
   * 세그먼트 버튼: <div class="seg" id="mode"><button data-value="a" class="on">A</button>...</div>
   *   const mode = PB.seg('mode', v => redraw());  mode() → 현재 값
   */
  PB.seg = function (id, onChange) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const btns = [...el.querySelectorAll("button")];
    let cur = (btns.find((b) => b.classList.contains("on")) || btns[0]).dataset.value;
    const set = (v, fire = true) => {
      cur = v;
      btns.forEach((b) => { const on = b.dataset.value === v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      if (fire && onChange) onChange(v);
    };
    btns.forEach((b) => b.addEventListener("click", () => set(b.dataset.value)));
    set(cur, false);
    const get = () => cur;
    get.set = set;
    return get;
  };
  /** 통계 표시: PB.stat('snr', '32.1 dB') → id 요소의 textContent 설정(HTML 허용) */
  PB.stat = function (id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  /* ------------------------------------------------------------ three.js helper */
  /**
   * three.js 씬 준비 (전역 THREE, THREE.OrbitControls 필요).
   *   const T = PB.three(containerEl, { camera:[x,y,z], target:[x,y,z], fov:40, autoRotate:false });
   *   T.scene, T.camera, T.renderer, T.controls, T.THREE
   *   T.onFrame((dt,t)=>{...});   T.label('텍스트', new THREE.Vector3(...)) → HTML 라벨(자동 투영)
   *   T.material(color, opts)  → MeshStandardMaterial 헬퍼
   * 조명(환경광+방향광 2개), 리사이즈, 화면 밖 일시정지, 테마 대응 포함.
   */
  PB.three = function (container, opts = {}) {
    if (typeof container === "string") container = document.querySelector(container);
    if (!window.THREE) {
      const message = isKorean ? "3D 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요." : "The 3D library could not be loaded. Check your internet connection.";
      container.innerHTML = `<p style="padding:20px;color:var(--text-dim)">${message}</p>`;
      return null;
    }
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 40, 1, 0.01, 2000);
    camera.position.set(...(opts.camera || [6, 5, 8]));
    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(...(opts.target || [0, 0, 0]));
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.autoRotate = !!opts.autoRotate; controls.autoRotateSpeed = opts.autoRotateSpeed || 0.8;
      controls.enablePan = opts.pan !== false;
      if (opts.minDistance) controls.minDistance = opts.minDistance;
      if (opts.maxDistance) controls.maxDistance = opts.maxDistance;
      controls.update();
    } else camera.lookAt(...(opts.target || [0, 0, 0]));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 0.75));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.85); d1.position.set(5, 10, 7); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xbfd7ff, 0.35); d2.position.set(-6, 4, -5); scene.add(d2);

    const labelLayer = document.createElement("div");
    labelLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    container.appendChild(labelLayer);
    const labels = [];
    const frameCbs = [];
    const T = { THREE, scene, camera, renderer, controls, container, labels };
    T.onFrame = (cb) => frameCbs.push(cb);
    T.label = function (text, pos, cls) {
      const el = document.createElement("div");
      el.className = "overlay-label" + (cls ? " " + cls : "");
      el.innerHTML = text;
      labelLayer.appendChild(el);
      const L = { el, pos: pos.clone ? pos.clone() : new THREE.Vector3(...pos), visible: true, obj: null };
      L.setVisible = (v) => { L.visible = v; el.style.display = v ? "" : "none"; };
      L.remove = () => { el.remove(); labels.splice(labels.indexOf(L), 1); };
      labels.push(L);
      return L;
    };
    T.material = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o));
    function resize() {
      const w = container.clientWidth, h = container.clientHeight || 400;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px"; renderer.domElement.style.height = h + "px";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(container); else window.addEventListener("resize", resize);
    resize();
    const v = new THREE.Vector3();
    T.loop = PB.loop(container, (dt, t) => {
      frameCbs.forEach((cb) => cb(dt, t));
      if (controls) controls.update();
      renderer.render(scene, camera);
      const w = container.clientWidth, h = container.clientHeight;
      labels.forEach((L) => {
        if (!L.visible) return;
        v.copy(L.pos); if (L.obj) L.obj.localToWorld(v);
        v.project(camera);
        const behind = v.z > 1;
        L.el.style.display = behind ? "none" : "";
        L.el.style.left = ((v.x + 1) / 2) * w + "px";
        L.el.style.top = ((1 - v.y) / 2) * h + "px";
      });
    });
    return T;
  };

  /* ------------------------------------------------------------ layout build */
  const LOGO = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#pbg)"/><path d="M6 23h20v3H6z" fill="#fff"/><path d="M6 23V19h4v-6h4v6h4v-6h4v6h4v4" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 13V9h4v4M18 13V9h4v4" fill="none" stroke="#fff" stroke-width="1.4" opacity=".6"/><circle cx="16" cy="7" r="1.6" fill="#fff"/></svg>`;
  const ICON_MENU = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  const ICON_MOON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
  const ICON_SUN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

  function build() {
    const body = document.body;
    const curSlug = body.dataset.chapter || "";
    const inChapter = Boolean(curSlug);
    const assetRoot = isKorean ? (inChapter ? "../../" : "../") : (inChapter ? "../" : "");
    const sameLanguageHref = (slug) => `${inChapter ? "../" : ""}${slug ? `chapters/${slug}.html` : "index.html"}`;
    const translatedHref = (slug, targetLang) => {
      if (targetLang === pageLang) return sameLanguageHref(slug);
      if (isKorean) return `${inChapter ? "../../" : "../"}${slug ? `chapters/${slug}.html` : "index.html"}`;
      const prefix = inChapter ? "../ko/" : "ko/";
      return `${prefix}${slug ? `chapters/${slug}.html` : "index.html"}`;
    };
    const href = (slug) => sameLanguageHref(slug);
    const koreanAlternate = [...document.querySelectorAll('link[rel="alternate"][hreflang]')]
      .some((link) => link.hreflang.toLowerCase() === "ko");
    const showLanguageSwitch = isKorean || koreanAlternate;
    const switchTargetLang = isKorean ? "en" : "ko";
    const switchLabel = isKorean ? "English" : "한국어";

    // favicon
    if (!document.querySelector('link[rel="icon"]')) { const fi = document.createElement("link"); fi.rel = "icon"; fi.type = "image/svg+xml"; fi.href = assetRoot + "favicon.svg"; document.head.appendChild(fi); }

    // top bar
    const bar = document.createElement("header");
    bar.className = "pb-topbar";
    bar.innerHTML = `
      <button class="pb-btn icon" id="pb-menu" aria-label="${isKorean ? "챕터 메뉴 열기" : "Open chapter menu"}">${ICON_MENU}</button>
      <a class="pb-logo" href="${href("")}">${LOGO}<span>PMICBook <small>${isKorean ? "전력관리 IC" : "Power Management ICs"}</small></span></a>
      <span class="spacer"></span>
      ${showLanguageSwitch ? `<a class="pb-btn pb-locale" href="${translatedHref(curSlug, switchTargetLang)}" lang="${switchTargetLang}" hreflang="${switchTargetLang}" aria-label="${isKorean ? "Switch to English" : "한국어 페이지로 전환"}">${switchLabel}</a>` : ""}
      <button class="pb-btn icon" id="pb-theme" aria-label="${isKorean ? "색상 테마 전환" : "Toggle color theme"}"></button>
      <div class="pb-progress" id="pb-progress"></div>`;
    body.prepend(bar);

    // drawer
    const drawer = document.createElement("nav");
    drawer.className = "pb-drawer";
    drawer.id = "pb-chapter-drawer";
    drawer.setAttribute("aria-label", isKorean ? "챕터 탐색" : "Chapter navigation");
    drawer.inert = true;
    drawer.innerHTML = `<h4>${isKorean ? "챕터" : "Chapters"}</h4><ul class="pb-chlist">
      <li><a href="${href("")}" class="${curSlug ? "" : "active"}"><span class="num">00</span><span>${isKorean ? "홈 및 학습 경로" : "Home and roadmap"}</span></a></li>
      ${CHAPTERS.map((c) => `<li><a href="${href(c.slug)}" class="${c.slug === curSlug ? "active" : ""}"><span class="num">${c.num}</span><span>${chapterTitle(c)}</span></a></li>`).join("")}
    </ul>`;
    const backdrop = document.createElement("div");
    backdrop.className = "pb-drawer-backdrop";
    body.append(backdrop, drawer);
    const menuButton = bar.querySelector("#pb-menu");
    menuButton.setAttribute("aria-controls", drawer.id);
    menuButton.setAttribute("aria-expanded", "false");
    const toggleDrawer = (open) => {
      const isOpen = body.classList.contains("drawer-open");
      if (open === isOpen) return;
      body.classList.toggle("drawer-open", open);
      drawer.inert = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      if (open) drawer.querySelector("a")?.focus();
      else menuButton.focus();
    };
    menuButton.addEventListener("click", () => toggleDrawer(true));
    backdrop.addEventListener("click", () => toggleDrawer(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && body.classList.contains("drawer-open")) toggleDrawer(false);
    });

    // theme toggle
    const tbtn = bar.querySelector("#pb-theme");
    const setIcon = () => (tbtn.innerHTML = PB.isDark() ? ICON_SUN : ICON_MOON);
    setIcon();
    tbtn.addEventListener("click", () => {
      const next = PB.isDark() ? "light" : "dark";
      try { localStorage.setItem("pb-theme", next); } catch (e) {}
      applyTheme(next); setIcon();
    });

    // progress
    const prog = bar.querySelector("#pb-progress");
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%"; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // chapter page extras
    const main = document.querySelector("main.chapter");
    if (main) {
      // numbered h2 + TOC
      const layout = document.createElement("div");
      layout.className = "pb-layout";
      main.parentNode.insertBefore(layout, main);
      layout.appendChild(main);
      const toc = document.createElement("aside");
      toc.className = "pb-toc";
      const h2s = [...main.querySelectorAll("section > h2")];
      let n = 0;
      toc.innerHTML = `<h4>${isKorean ? "이 페이지의 목차" : "ON THIS PAGE"}</h4>` + h2s.map((h, i) => {
        const sec = h.parentElement;
        if (!sec.id) sec.id = "s" + (i + 1);
        const numbered = !sec.classList.contains("keypoints") && !sec.classList.contains("quiz-sec") && !sec.hasAttribute("data-nonum");
        if (numbered && !h.querySelector(".h-num")) { n++; h.insertAdjacentHTML("afterbegin", `<span class="h-num">${String(n).padStart(2, "0")}</span>`); }
        return `<a href="#${sec.id}">${h.textContent.replace(/^\d\d/, "").trim()}</a>`;
      }).join("");
      layout.appendChild(toc);
      const links = [...toc.querySelectorAll("a")];
      if (window.IntersectionObserver && h2s.length) {
        const io = new IntersectionObserver((es) => {
          es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); } });
        }, { rootMargin: "-20% 0px -70% 0px" });
        h2s.forEach((h) => io.observe(h.parentElement));
      }

      // pager
      const idx = CHAPTERS.findIndex((c) => c.slug === curSlug);
      const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
      const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
      const pager = document.createElement("nav");
      pager.className = "pb-pager";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${href(prev.slug)}"><small>← ${isKorean ? "이전" : "Previous"} · ${prev.num}</small>${chapterTitle(prev)}</a>` : `<a class="prev" href="${href("")}"><small>← ${isKorean ? "처음부터" : "Start here"}</small>${isKorean ? "홈 및 학습 경로" : "Home and roadmap"}</a>`) +
        (next ? `<a class="next" href="${href(next.slug)}"><small>${isKorean ? "다음" : "Next"} · ${next.num} →</small>${chapterTitle(next)}</a>` : "");
      layout.after(pager);
    }
    const foot = document.createElement("footer");
    foot.className = "pb-foot";
    foot.innerHTML = isKorean
      ? `PMICBook — 전력관리 IC 기술을 위한 인터랙티브 학습 자료입니다. 시뮬레이터 수치는 교육용 근사값입니다.<br>
      ProcessBook에서 파생 · © 2026 geniuskey 및 ProcessBook 기여자 · 콘텐츠 <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · 코드 <a href="${assetRoot}LICENSE-MIT">MIT</a> · <a href="${assetRoot}LICENSE.md">라이선스 안내</a>`
      : `PMICBook — Interactive learning about power management IC technology. Simulator values are educational approximations.<br>
      Derived from ProcessBook · © 2026 geniuskey and ProcessBook contributors · Content <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · Code <a href="${assetRoot}LICENSE-MIT">MIT</a> · <a href="${assetRoot}LICENSE.md">License guide</a>`;
    body.appendChild(foot);

    // quiz
    document.querySelectorAll(".quiz-q").forEach((q) => {
      const legacyOptions = new Set(q.querySelectorAll("button.opt"));
      const opts = [...new Set(q.querySelectorAll("button.opt, .opts button"))];
      opts.forEach((option) => option.classList.add("opt"));
      const isCorrect = (option) => {
        const value = option.getAttribute("data-correct");
        return value === "true" || (legacyOptions.has(option) && value === "");
      };
      opts.forEach((b) => b.addEventListener("click", () => {
        opts.forEach((o) => { o.disabled = true; if (isCorrect(o)) o.classList.add("right"); });
        if (!isCorrect(b)) b.classList.add("wrong");
        q.classList.add("done");
        q.dispatchEvent(new CustomEvent("answered", { bubbles: true, detail: { correct: isCorrect(b) } }));
      }));
    });

    // KaTeX
    const renderMath = () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
          throwOnError: false,
          ignoredClasses: ["no-math"],
        });
      }
    };
    if (window.renderMathInElement) renderMath();
    else window.addEventListener("load", renderMath);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
