/* Molde de mini-site de demo. Cada página tem <body data-page="home|demo|como|proposta">
   e é gerada a partir de window.CLIENT (config.js do cliente). */
document.documentElement.classList.add("js");
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- utilitários partilhados com as configs ---------- */
const H = (() => {
  const DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const pad = n => String(n).padStart(2, "0");
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  function readDate(t) {
    const d = today();
    if (/\bhoje\b/.test(t)) return d;
    if (/\bamanha\b/.test(t)) { d.setDate(d.getDate() + 1); return d; }
    const names = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    for (let i = 0; i < 7; i++) if (t.includes(names[i])) {
      let add = (i - d.getDay() + 7) % 7; if (add === 0) add = 7;
      d.setDate(d.getDate() + add); return d;
    }
    return null;
  }
  function readTime(t) {
    const m = t.match(/\b(\d{1,2})\s*(?:h|:|horas?)\s*(\d{2})?\b/) || t.match(/\bas\s+(\d{1,2})\b/);
    if (!m) return null;
    const h = +m[1], mi = m[2] ? +m[2] : 0;
    return h < 7 || h > 22 ? null : `${pad(h)}:${pad(mi)}`;
  }
  function dayLabel(d) {
    const diff = Math.round((d - today()) / 864e5);
    const nm = diff === 0 ? "hoje" : diff === 1 ? "amanhã" : DAYS[d.getDay()];
    return `${nm}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }
  const dayName = d => dayLabel(d).split(",")[0];
  const nextDay = wd => { const d = today(); let add = (wd - d.getDay() + 7) % 7 || 7; d.setDate(d.getDate() + add); return d; };
  const listTimes = a => a.length === 1 ? `às ${a[0]}` : `às ${a.slice(0, -1).join(", ")} e às ${a[a.length - 1]}`;
  const part = t => /\b(de|pela|na) manha\b/.test(t) ? "am" : /\b(a|de|pela|na|ao fim da) tarde\b|fim do dia|depois do trabalho|\bnoite\b/.test(t) ? "pm" : null;
  const filterPart = (slots, p) => {
    if (!p) return slots;
    const f = slots.filter(x => (p === "am" ? +x.slice(0, 2) < 13 : +x.slice(0, 2) >= 13));
    return f.length ? f : slots;
  };
  const greet = t => /^(ola|boa tarde|bom dia|boa noite|oi|viva)\b/.test(t);
  const name = raw => raw.trim().replace(/^(sou o|sou a|chamo-me|e o|e a|o meu nome e|o meu nome é)\s+/i, "").split(/\s+/).slice(0, 2).map(cap).join(" ");
  return { norm, cap, pad, today, readDate, readTime, dayLabel, dayName, nextDay, listTimes, part, filterPart, greet, name };
})();

/* ---------- peças do telemóvel ---------- */
const now = () => { const d = new Date(); return `${H.pad(d.getHours())}:${H.pad(d.getMinutes())}`; };
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 40) : ms));
function bubble(box, text, who, time = now()) {
  const el = document.createElement("div");
  el.className = "b " + who; el.textContent = text;
  const tm = document.createElement("span"); tm.className = "t"; tm.textContent = time;
  el.appendChild(tm); box.appendChild(el); box.scrollTop = box.scrollHeight;
  return el;
}
function card(box, c) {
  const el = document.createElement("div");
  el.className = "confirm";
  el.innerHTML = `<span class="h"></span><span class="s"></span><span class="d"></span>`;
  el.querySelector(".h").textContent = c.label;
  el.querySelector(".s").textContent = c.title;
  el.querySelector(".d").textContent = c.detail;
  box.appendChild(el); box.scrollTop = box.scrollHeight;
  return el;
}
function typing(box) {
  const el = document.createElement("div");
  el.className = "typing"; el.innerHTML = "<i></i><i></i><i></i>";
  box.appendChild(el); box.scrollTop = box.scrollHeight;
  return el;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ARROW = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>`;
const SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
function phoneHTML(C, id, withInput) {
  return `<div class="phone"><div class="screen">
    <div class="island" aria-hidden="true"></div>
    <div class="chat-head"><div class="avatar" aria-hidden="true">${C.mark}</div><div class="who"><b>${esc(C.name)}</b><span>online</span></div></div>
    <div class="msgs" id="${id}" aria-live="polite"><div class="daychip">Hoje</div></div>
    ${withInput ? `<div class="chips" id="chips">${C.chips.map(c => `<button class="chip" type="button">${esc(c)}</button>`).join("")}</div>
    <form class="composer" id="form" autocomplete="off"><input id="input" type="text" placeholder="Escreva uma mensagem" aria-label="Mensagem"><button class="send" type="submit" aria-label="Enviar">${SEND}</button></form>` : ""}
  </div></div>`;
}

/* ---------- estrutura comum ---------- */
const LINKS = [["home", "index.html", "Visão geral"], ["demo", "demo.html", "Demo"], ["como", "como-funciona.html", "Como funciona"], ["proposta", "proposta.html", "Proposta"]];
const navHTML = (C, page) => `<nav class="nav" aria-label="Principal"><div class="container">
  <a class="nav-logo" href="index.html" aria-label="Início">${C.navLogo || C.logo}</a>
  <ul class="nav-links">${LINKS.filter(l => !(C.public && l[0] === "proposta")).map(([k, href, label]) => `<li><a href="${href}"${k === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
  <div class="nav-right"><a class="btn btn-sm" href="demo.html">Experimentar a demo</a><button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div>
</div></nav>`;
const footerHTML = C => C.public
  ? `<footer class="footer"><div class="container"><span>Demo da Weld com uma marca de exemplo. ${esc(C.name)} não é um negócio real.</span><span><a href="${C.backHref || "/"}">Voltar à Weld</a></span></div></footer>`
  : `<footer class="footer"><div class="container"><span>Protótipo feito por João Sousa para ${esc(C.agency)}. Não é um serviço oficial da ${esc(C.name)}.</span><span><a href="proposta.html">Proposta para ${esc(C.agencyName)}</a></span></div></footer>`;
const ctaBand = (C, title) => `<section class="container pad"><div class="cta-band">
  <div class="reveal cta-mark" style="width:84px">${C.mark}</div>
  <h2 class="h-sec reveal">${title}</h2>
  <a class="btn reveal d1" href="demo.html">Experimentar a demo</a></div></section>`;

function heroHTML(C) {
  const h = C.hero, decor = h.decor ? `<div class="decor" aria-hidden="true">${h.decor}</div>` : "";
  const ctas = `<div class="hero-ctas reveal d2"><a class="btn" href="demo.html">Experimentar a demo</a><a class="link-arrow" href="como-funciona.html">Como funciona ${ARROW}</a></div>`;
  if (C.heroLayout === "center") return `<section class="hero hero-center container">${decor}
    <div class="hero-logo logo-in">${C.logo}</div>
    <h1 class="h-hero reveal">${h.title}</h1><p class="lead reveal d1">${h.lead}</p>${ctas}</section>`;
  if (C.heroLayout === "kinetic") return `<section class="hero hero-kinetic container">${decor}
    <h1 class="h-hero kinetic">${h.lines.map((l, i) => `<span class="line"><span class="in" style="--i:${i}">${l}</span></span>`).join("")}</h1>
    <div class="hero-row"><div><p class="lead reveal d2">${h.lead}</p>${ctas}</div>
    <div class="hero-visual reveal d1">${h.visualDecor || ""}${phoneHTML(C, "hero-msgs", false)}</div></div></section>`;
  return `<section class="hero container"><div class="hero-split">${decor}
    <div><div class="hero-logo logo-in">${C.logo}</div><h1 class="h-hero reveal">${h.title}</h1><p class="lead reveal d1">${h.lead}</p>${ctas}</div>
    <div class="hero-visual reveal d1">${h.visualDecor || ""}${phoneHTML(C, "hero-msgs", false)}</div></div></section>`;
}

const PAGES = {
  home: C => `${heroHTML(C)}
    ${C.marquee ? `<div class="marquee reveal" aria-hidden="true"><div class="marquee-track">${[...C.marquee, ...C.marquee].map(m => `<span>${m}</span>`).join("")}</div></div>` : ""}
    <section class="container pad-sm" id="conversa" aria-label="Uma conversa, passo a passo"><div class="story">
      <div class="story-phone">${phoneHTML(C, "story-msgs", false)}<p class="caption" id="caption" aria-hidden="true"></p></div>
      <div class="steps">${C.story.map((s, i) => `<div class="step" data-step="${i}"><span class="num">${String(i + 1).padStart(2, "0")}</span><h2 class="h-card">${s.title}</h2><p class="body">${s.body}</p></div>`).join("")}</div>
    </div></section>
    <section class="container pad"><p class="words" data-words>${C.statement}</p></section>
    <section class="container pad-sm"><h2 class="h-sec center reveal">${C.cells.title}</h2>
      <div class="bento">${C.cells.items.map((c, i) => `<article class="cell card-fx ${c.cls} reveal ${i % 2 ? "d1" : ""}"><h3 class="h-card">${c.title}</h3>${c.body ? `<p class="body">${c.body}</p>` : ""}${c.html || ""}</article>`).join("")}</div>
    </section>
    ${ctaBand(C, C.closing)}`,

  demo: C => `<header class="container page-top center"><h1 class="h-page reveal">${C.live.title}</h1><p class="lead reveal d1">${C.live.lead}</p></header>
    <section class="container"><div class="live-wrap">
      <div class="reveal">${phoneHTML(C, "msgs", true)}</div>
      <div class="side">
        <section class="panel reveal d1" aria-label="${esc(C.panel.title)}">
          <div class="panel-head"><h2 class="h-card">${C.panel.title}</h2><span class="live">Ao vivo</span></div>
          <div class="stats">${C.panel.stats.map((s, i) => `<div class="stat" id="st-${i}"><span class="n">${s.value}</span><span class="l">${s.label}</span></div>`).join("")}</div>
          <div><p class="label">${C.panel.rowsLabel}</p><div class="list" id="rows"></div></div>
          <div><p class="label">Para a equipa</p><div class="list" id="handoffs"></div></div>
          <p class="note">${C.panel.note}</p>
        </section>
        <div class="reveal d2" style="display:flex;gap:10px;flex-wrap:wrap"><button class="ghost" id="example" type="button">Ver uma conversa de exemplo</button><button class="ghost" id="restart" type="button">Recomeçar</button></div>
      </div>
    </div></section>`,

  como: C => { const K = C.como; return `<header class="container page-top center"><h1 class="h-page reveal">${K.title}</h1><p class="lead reveal d1">${K.lead}</p></header>
    <section class="container pad-sm"><div class="flow">
      <svg class="flow-line" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true"><path d="M60 1 H 940"/></svg>
      ${K.flow.map((f, i) => `<div class="flow-step reveal d${i}"><div class="flow-dot">${i + 1}</div><h3>${f[0]}</h3><p>${f[1]}</p></div>`).join("")}
    </div></section>
    <section class="container pad-sm"><h2 class="h-sec center reveal">${K.needsTitle}</h2><p class="lead center reveal d1" style="margin-top:18px">${K.needsLead}</p>
      <div class="needs">${K.needs.map((n, i) => `<div class="need card-fx reveal ${i % 2 ? "d1" : ""}"><span class="st ${n[0]}">${n[0] === "ok" ? "Já temos" : n[1]}</span><h3>${n[2]}</h3><p>${n[3]}</p></div>`).join("")}</div>
    </section>
    <section class="container pad-sm"><h2 class="h-sec center reveal">Perguntas de quem vai usar.</h2>
      <div class="faq reveal d1">${K.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    </section>
    ${ctaBand(C, K.cta)}`; },

  proposta: C => { const P = C.proposta; return `<header class="container page-top center"><p class="kicker reveal">Para a ${esc(C.agencyName)}</p><h1 class="h-page reveal d1">${P.title}</h1><p class="lead reveal d2">${P.lead}</p></header>
    <section class="container pad-sm"><div class="duo">
      <div class="side-card card-fx reveal"><span class="who">${esc(C.agencyName)}</span><h2 class="h-card">${P.them[0]}</h2><ul>${P.them[1].map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div class="side-card me card-fx reveal d1"><span class="who">João Sousa</span><h2 class="h-card">${P.me[0]}</h2><ul>${P.me[1].map(x => `<li>${x}</li>`).join("")}</ul></div>
    </div></section>
    <section class="container pad-sm"><h2 class="h-sec center reveal">${P.pilotTitle}</h2><p class="lead center reveal d1" style="margin-top:18px">${P.pilotLead}</p>
      <div class="timeline">${P.timeline.map(([w, h, p]) => `<div class="tl reveal"><span class="when">${w}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join("")}</div>
    </section>
    <section class="container pad-sm center"><h2 class="h-sec reveal">${P.valueTitle}</h2><p class="lead center reveal d1" style="margin-top:18px">${P.valueText}</p></section>
    <section class="container pad"><div class="cta-band">
      <div class="reveal cta-mark" style="width:84px">${C.mark}</div>
      <h2 class="h-sec reveal">Próximo passo:<br>um café de 20 minutos.</h2>
      <p class="contact reveal d1">joaobastossousa@gmail.com</p>
      <a class="btn reveal d2" href="demo.html">Experimentar a demo</a></div></section>`; },
};

/* ---------- conversa do topo (hero) ---------- */
async function mountHeroPhone(C) {
  const box = document.getElementById("hero-msgs");
  if (!box) return;
  const s = C.story[0];
  await wait(1100);
  for (const m of s.msgs) {
    if (m[0] === "me") { bubble(box, m[1], "me", s.time); await wait(700); }
    else if (m[0] === "bot") { const ty = typing(box); await wait(1100); ty.remove(); bubble(box, m[1], "bot", s.time); }
  }
}

/* ---------- conversa que avança com o scroll ---------- */
function mountStory(C) {
  const box = document.getElementById("story-msgs");
  if (!box) return;
  const caption = document.getElementById("caption");
  const steps = [...document.querySelectorAll(".step")];
  let shown = -1, token = 0;
  async function goTo(k) {
    const my = ++token;
    if (k < shown) { box.querySelectorAll("[data-s]").forEach(el => { if (+el.dataset.s > k) el.remove(); }); shown = k; return; }
    box.querySelectorAll("[data-s]").forEach(el => { if (+el.dataset.s > shown) el.remove(); });
    for (let s = shown + 1; s <= k; s++) {
      const step = C.story[s], fast = s !== k;
      for (const m of step.msgs) {
        if (my !== token) return;
        let el;
        if (m[0] === "me") { el = bubble(box, m[1], "me", step.time); el.dataset.s = s; await wait(fast ? 60 : 420); continue; }
        if (m[0] === "bot") {
          if (!fast) { const ty = typing(box); ty.dataset.s = s; await wait(900); ty.remove(); if (my !== token) return; }
          el = bubble(box, m[1], "bot", step.time);
        } else { await wait(fast ? 0 : 380); if (my !== token) return; el = card(box, m[1]); }
        el.dataset.s = s;
      }
      shown = s;
    }
  }
  const setCaption = i => { caption.innerHTML = `<span class="num">${String(i + 1).padStart(2, "0")}</span>`; caption.append(steps[i].querySelector("h2").textContent); };
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const i = +en.target.dataset.step;
    steps.forEach(s => s.classList.toggle("active", s === en.target));
    setCaption(i); goTo(i);
  }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => io.observe(s));
  setCaption(0);
}

/* ---------- demo ao vivo ---------- */
function mountLive(C) {
  const msgs = document.getElementById("msgs");
  if (!msgs) return;
  const input = document.getElementById("input");
  const rows = document.getElementById("rows");
  const hand = document.getElementById("handoffs");
  const EMPTY = '<div class="empty">Nada pendente. O assistente resolveu tudo sozinho.</div>';
  let state, busy = false, counted = false, run = 0;
  const bump = i => {
    const el = document.getElementById("st-" + i), n = el.querySelector(".n");
    n.textContent = String(+n.textContent + 1);
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  };
  function addRow(r, isNew) {
    const row = document.createElement("div");
    row.className = "row" + (isNew ? " new" : "");
    row.innerHTML = `<div class="when"><b></b><span></span></div><div class="what"><b></b><span></span></div><div class="right"></div>`;
    row.querySelector(".when b").textContent = r.when;
    row.querySelector(".when span").textContent = r.sub;
    row.querySelector(".what b").textContent = r.title;
    const m = row.querySelector(".what span"); m.textContent = r.meta;
    if (isNew) { const t = document.createElement("span"); t.className = "tag"; t.textContent = "nova"; m.appendChild(t); }
    row.querySelector(".right").textContent = r.right || "";
    isNew ? rows.prepend(row) : rows.appendChild(row);
  }
  function addHandoff(h) {
    hand.querySelector(".empty")?.remove();
    const el = document.createElement("div"); el.className = "handoff";
    el.innerHTML = `<i></i><div><b></b><span></span></div>`;
    el.querySelector("b").textContent = h.title; el.querySelector("div span").textContent = h.detail;
    hand.prepend(el);
  }
  function seed() {
    rows.innerHTML = ""; hand.innerHTML = EMPTY;
    C.panel.stats.forEach((s, i) => { document.querySelector(`#st-${i} .n`).textContent = s.value; });
    C.panel.seed().forEach(r => addRow(r, false));
  }
  function welcome() {
    msgs.innerHTML = '<div class="daychip">Hoje</div>';
    bubble(msgs, C.welcome, "bot").style.animation = "none";
    state = C.brain.init(); counted = false;
  }
  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    if (!counted) { counted = true; bump(0); }
    bubble(msgs, text, "me");
    let r;
    try { r = C.brain.reply(text, state); } catch (e) { console.error(e); r = { text: "Desculpe, não percebi. Pode reformular?" }; }
    if (r.reset) state = C.brain.init();
    await wait(380);
    const ty = typing(msgs);
    await wait(Math.min(1700, 650 + r.text.length * 9));
    ty.remove();
    bubble(msgs, r.text, "bot");
    if (r.card) { await wait(420); card(msgs, r.card); }
    if (r.row) { await wait(320); addRow(r.row, true); bump(1); }
    if (r.handoff) { await wait(300); addHandoff(r.handoff); }
    busy = false;
  }
  async function example() {
    const id = ++run;
    for (const line of C.example) {
      while (busy) await wait(100);
      input.value = "";
      for (const ch of line) { if (id !== run) return; input.value += ch; await wait(ch === " " ? 45 : 24); }
      await wait(250);
      if (id !== run) return;
      input.value = ""; await send(line); await wait(650);
    }
  }
  const stop = () => { run++; };
  document.getElementById("form").addEventListener("submit", e => { e.preventDefault(); stop(); const v = input.value; input.value = ""; send(v); });
  input.addEventListener("keydown", stop);
  document.getElementById("chips").addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) { stop(); send(c.textContent); } });
  document.getElementById("example").addEventListener("click", async () => { stop(); while (busy) await wait(100); welcome(); example(); });
  document.getElementById("restart").addEventListener("click", async () => { stop(); input.value = ""; while (busy) await wait(100); seed(); welcome(); });
  seed(); welcome();
  if (location.hash === "#exemplo") setTimeout(() => document.getElementById("example").click(), 900);
}

/* ---------- movimento ---------- */
function mountNav() {
  const nav = document.querySelector(".nav"), btn = nav.querySelector(".menu-btn");
  btn.addEventListener("click", () => btn.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
}
function mountReveal() {
  const els = document.querySelectorAll(".reveal");
  if (REDUCED || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  els.forEach(e => io.observe(e));
}
function mountSpotlight() {
  if (!FINE) return;
  document.querySelectorAll(".card-fx").forEach(el => el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
}
function mountTilt() {
  const wrap = document.querySelector(".hero-visual"), ph = wrap?.querySelector(".phone");
  if (!ph || !FINE || REDUCED) return;
  wrap.addEventListener("pointermove", e => {
    const r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    ph.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
  });
  wrap.addEventListener("pointerleave", () => { ph.style.transform = ""; });
}
function mountScroll() {
  if (REDUCED || !window.gsap || !window.ScrollTrigger) return false;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll("[data-words]").forEach(el => {
    el.classList.add("scrub");
    gsap.to(el.querySelectorAll(".w"), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
  });
  const vis = document.querySelector(".hero-visual");
  if (vis) gsap.to(vis, { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  document.querySelectorAll("[data-drift]").forEach(el => gsap.to(el, { yPercent: +el.dataset.drift, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } }));
  const path = document.querySelector(".flow-line path");
  if (path) { const len = path.getTotalLength(); gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".flow", start: "top 75%", end: "top 30%", scrub: 0.6 } }); }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  const C = window.CLIENT, page = document.body.dataset.page || "home";
  document.title = C.titles[page];
  document.body.insertAdjacentHTML("afterbegin", `${navHTML(C, page)}<main>${PAGES[page](C)}</main>${footerHTML(C)}`);
  document.querySelectorAll("[data-words]").forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" "); });
  mountNav();
  if (page === "home") { mountHeroPhone(C); mountStory(C); }
  if (page === "demo") mountLive(C);
  mountReveal();
  mountSpotlight();
  mountTilt();
  const gs = mountScroll();
  if (C.enhance) C.enhance({ gsap: gs ? window.gsap : null, page, REDUCED, FINE });
  if (location.hash && location.hash !== "#exemplo") setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 60);
});
