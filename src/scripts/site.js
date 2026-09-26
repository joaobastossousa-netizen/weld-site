// Movimento e interações do site da Weld (todas as páginas).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));

/* ---------- costura de solda: pistas nas margens que se desenham com o scroll ---------- */
(function seam() {
  const svg = $("#seam");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  let tracks = [], H = 0, cur = [], vel = 0, lastY = scrollY;

  function build() {
    svg.innerHTML = "";
    const W = document.documentElement.clientWidth;
    H = document.documentElement.scrollHeight;
    svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const defs = mk("defs", {});
    const g = mk("linearGradient", { id: "seam-g", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    mk("stop", { offset: 0, "stop-color": "#2B8A61" }, g); mk("stop", { offset: 1, "stop-color": "#5CC596" }, g);
    const f = mk("filter", { id: "seam-blur", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    mk("feGaussianBlur", { stdDeviation: 4 }, f);
    const rg = mk("radialGradient", { id: "seam-head" }, defs);
    mk("stop", { offset: 0, "stop-color": "#EFFFF6" }, rg); mk("stop", { offset: .35, "stop-color": "#8FE0B8" }, rg); mk("stop", { offset: 1, "stop-color": "rgba(92,197,150,0)" }, rg);

    const gut = (W - 1200) / 2;
    const mobile = W < 900;
    const lx = gut > 70 ? gut - 40 : (mobile ? 7 : 10);
    const bounds = $$("main > section, main > div.band, main > .ways-wrap, .footer").map(el => el.getBoundingClientRect().top + scrollY).filter(y => y > 120).sort((a, b) => a - b);
    const sides = mobile ? [[lx, 1]] : [[lx, 1], [W - lx, -1]];
    tracks = sides.map(([x0, dir], si) => {
      const pts = [[x0, 90]], nodes = [];
      let x = x0;
      bounds.forEach((y, i) => {
        const yy = si === 0 ? y : y + 140;              // a pista da direita dobra noutro sítio
        if (yy > H - 60) return;
        const out = x === x0;
        const nx = out ? x0 + dir * 22 : x0;
        pts.push([x, yy - 22]); pts.push([nx, yy]);
        nodes.push([nx, yy]);
        x = nx;
      });
      pts.push([x, H - 30]);
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      mk("path", { d, class: "seam-ghost" });
      const glow = mk("path", { d, class: "seam-glow" });
      const live = mk("path", { d, class: "seam-live" });
      const len = live.getTotalLength();
      [glow, live].forEach(p => { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
      const nodeEls = nodes.map(([nx, ny]) => ({ y: ny, el: mk("rect", { x: nx - 4, y: ny - 4, width: 8, height: 8, class: "seam-node", transform: `rotate(45 ${nx} ${ny})` }) }));
      const halo = mk("circle", { r: 16, fill: "url(#seam-head)", class: "seam-halo" });
      const head = mk("circle", { r: 3.2, class: "seam-head" });
      // tabela comprimento -> y, para achar onde a solda deve estar
      const lut = [];
      for (let l = 0; l <= len; l += 12) lut.push([l, live.getPointAtLength(l).y]);
      lut.push([len, live.getPointAtLength(len).y]);
      return { live, glow, len, lut, nodeEls, head, halo };
    });
    cur = tracks.map(() => 0);
  }
  const lenForY = (lut, y) => {
    if (y <= lut[0][1]) return 0;
    for (let i = 1; i < lut.length; i++) if (lut[i][1] >= y) { const [l0, y0] = lut[i - 1], [l1, y1] = lut[i]; return l0 + (l1 - l0) * ((y - y0) / Math.max(1e-3, y1 - y0)); }
    return lut[lut.length - 1][0];
  };
  function frame() {
    const target = scrollY + innerHeight * 0.62;
    vel += (Math.abs(scrollY - lastY) - vel) * 0.15; lastY = scrollY;
    tracks.forEach((t, i) => {
      const want = lenForY(t.lut, target);
      if (Math.abs(want - cur[i]) < 0.5 && vel < 0.05 && t.drawn) return;   // parado: não redesenha
      t.drawn = true;
      cur[i] += (want - cur[i]) * (REDUCED ? 1 : 0.12);
      const off = t.len - cur[i];
      t.live.style.strokeDashoffset = off; t.glow.style.strokeDashoffset = off;
      const pt = t.live.getPointAtLength(Math.max(0, cur[i]));
      const boost = Math.min(1, vel / 30);
      t.head.setAttribute("cx", pt.x); t.head.setAttribute("cy", pt.y);
      t.halo.setAttribute("cx", pt.x); t.halo.setAttribute("cy", pt.y);
      t.halo.setAttribute("r", 14 + boost * 22);
      t.halo.style.opacity = 0.55 + boost * 0.45;
      t.nodeEls.forEach(n => n.el.classList.toggle("on", n.y <= pt.y + 1));
    });
    requestAnimationFrame(frame);
  }
  build();
  addEventListener("resize", () => build());
  addEventListener("load", () => build());
  setTimeout(build, 1500);
  requestAnimationFrame(frame);
})();

/* ---------- navegação ---------- */
const nav = $("#nav");
const sentinel = document.createElement("div");
sentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px";
document.body.prepend(sentinel);
new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting)).observe(sentinel);
const menuBtn = $(".menu-btn");
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

/* ---------- entradas ---------- */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
$$(".reveal").forEach(el => (REDUCED ? el.classList.add("in") : revealIO.observe(el)));

/* palavra que roda no título */
const rots = $$(".rotator .rot");
let rotI = 0;
if (!REDUCED && rots.length > 1) setInterval(() => {
  const cur = rots[rotI];
  cur.classList.remove("on"); cur.classList.add("out");
  setTimeout(() => cur.classList.remove("out"), 600);
  rotI = (rotI + 1) % rots.length;
  rots[rotI].classList.add("on");
}, 2400);

/* ---------- registo ao vivo da capa ---------- */
const hxLog = $(".hx-log");
if (hxLog) {
  const items = JSON.parse(hxLog.dataset.log), ul = $(".hx-list", hxLog), n = $("#hx-n");
  // contador começa num valor plausível para a hora do dia
  const now = new Date();
  let count = 40 + Math.round((now.getHours() * 60 + now.getMinutes()) / 9), k = 0;
  const hhmm = d => d.toTimeString().slice(0, 5);
  const add = (anim, when = new Date()) => {
    const [icon, svc, text] = items[k++ % items.length];
    const li = document.createElement("li");
    li.innerHTML = `<span class="ic"><i class="ph-bold ${icon}"></i></span><span><small>${svc} · ${hhmm(when)}</small><b></b></span><i class="ph-bold ph-check-circle ok"></i>`;
    $("b", li).textContent = text;
    if (anim) li.className = "new";
    ul.prepend(li);
    while (ul.children.length > 6) ul.lastChild.remove();
  };
  for (let i = 4; i >= 0; i--) add(false, new Date(Date.now() - i * 97000));
  n.textContent = count;
  if (!REDUCED) setInterval(() => { if (document.hidden) return; add(true); n.textContent = ++count; }, 2300);
}

/* ---------- telemóveis com conversa em loop ---------- */
$$(".phone[data-chat]").forEach(ph => {
  const lines = JSON.parse(ph.dataset.chat), body = $(".phone-body", ph);
  let visible = false, started = false;
  async function loop() {
    started = true;
    while (true) {
      body.innerHTML = "";
      for (const [who, text] of lines) {
        while (!visible) await wait(400);
        if (who === "bot") { const ty = document.createElement("div"); ty.className = "typing"; ty.innerHTML = "<i></i><i></i><i></i>"; body.appendChild(ty); await wait(1000); ty.remove(); }
        const b = document.createElement("div");
        b.className = "pb " + who; b.textContent = who === "ok" ? "✓ " + text : text;
        body.appendChild(b);
        await wait(who === "me" ? 900 : 1100);
      }
      await wait(3200);
    }
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !started) loop(); }, { threshold: .3 }).observe(ph);
});

/* inclinação do telemóvel com o rato e cartões que flutuam com o scroll */
if (FINE && !REDUCED) $$(".hero-visual").forEach(v => {
  const ph = $(".phone", v);
  if (!ph) return;
  v.addEventListener("pointermove", e => { const r = v.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; ph.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`; });
  v.addEventListener("pointerleave", () => { ph.style.transform = ""; });
});
if (!REDUCED) $$("[data-drift]").forEach(el => gsap.to(el, { y: +el.dataset.drift, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true } }));

/* ---------- máquina: mensagens entram no W e saem resolvidas ---------- */
const machine = $(".machine");
if (machine) {
  const msgs = $$(".msg", machine), outs = $$(".out", machine), core = $(".core", machine);
  if (REDUCED) gsap.set([...msgs, ...outs], { opacity: 1 });
  else {
    gsap.set(msgs, { opacity: 0, x: -24 }); gsap.set(outs, { opacity: 0, x: -24 });
    const toCore = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.left + b.width / 2 - (a.left + a.width / 2); };
    const toCoreY = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.top + b.height / 3 - (a.top + a.height / 2); };
    const hit = () => { core.classList.remove("hit"); void core.offsetWidth; core.classList.add("hit"); };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .4, paused: true });
    msgs.forEach((m, i) => {
      tl.to(m, { opacity: 1, x: 0, duration: .5, ease: "power3.out" })
        .to(m, { x: () => toCore(m), y: () => toCoreY(m), scale: .4, opacity: 0, duration: .65, ease: "power2.in" }, "+=.55")
        .call(hit)
        .to(outs[i], { opacity: 1, x: 0, duration: .55, ease: "back.out(1.6)" }, "-=.05");
    });
    tl.to(outs, { opacity: 0, x: 24, duration: .45, stagger: .08, ease: "power2.in" }, "+=2.2").set(msgs, { x: -24, y: 0, scale: 1 }).set(outs, { x: -24 });
    ScrollTrigger.create({ trigger: machine, start: "top 85%", end: "bottom top", onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
  }
}

/* ---------- história presa ao scroll ---------- */
const stage = $(".stage");
if (stage) {
  const sSteps = $$(".s-step"), status = $("#sp-status");
  const setStep = i => {
    stage.classList.remove("p1", "p2", "p3"); stage.classList.add("p" + (i + 1));
    sSteps.forEach((s, k) => s.classList.toggle("on", k === i));
    status.textContent = ["fechada · 23:14", "assistente online · 23:14", "aberta · 09:00"][i];
  };
  setStep(REDUCED ? 2 : 0);
  if (!REDUCED) ScrollTrigger.create({ trigger: ".story", start: "top top", end: "bottom bottom", onUpdate: s => setStep(Math.min(2, Math.floor(s.progress * 3))) });
}

/* ---------- números a contar ---------- */
$$(".count").forEach(el => {
  const m = el.dataset.count.match(/^(\d+)(.*)$/);
  if (!m || REDUCED) return;
  const n = +m[1], rest = m[2], o = { v: 0 };
  el.textContent = "0" + rest;
  ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => gsap.to(o, { v: n, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v) + rest) }) });
});

/* ---------- fotos: máscara a abrir, zoom lento, galeria horizontal ---------- */
// vigia o elemento pai: uma foto toda tapada pela máscara conta como invisível para o browser
const maskIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$(".img-reveal", e.target).forEach(m => m.classList.add("in")); maskIO.unobserve(e.target); } }), { threshold: .15 });
$$(".img-reveal").forEach(el => (REDUCED ? el.classList.add("in") : maskIO.observe(el.parentElement)));
if (!REDUCED) $$("[data-zoom]").forEach(img => gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.closest(".img-reveal") || img, start: "top bottom", end: "bottom top", scrub: true } }));

const sectorsEl = $(".sectors");
if (sectorsEl) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .35 });
  $$(".sector", sectorsEl).forEach(c => (REDUCED ? c.classList.add("in") : io.observe(c)));
}

/* calculadora: tempo perdido por mês */
const calc = $(".calc-box");
if (calc) {
  const v = {}, fmt = n => Math.round(n).toLocaleString("pt-PT");
  const shown = { hours: 0 };
  const run = () => {
    $$("input[type=range]", calc).forEach(i => (v[i.dataset.k] = +i.value));
    $('[data-o="msg"]', calc).textContent = v.msg; $('[data-o="min"]', calc).textContent = v.min;
    $('[data-o="rep"]', calc).textContent = v.rep; $('[data-o="eur"]', calc).textContent = v.eur + " €";
    const hmsg = v.msg * v.min * 22 / 60, hrep = v.rep * 4.33, hours = hmsg + hrep;
    $('[data-r="hmsg"]', calc).textContent = fmt(hmsg) + " h"; $('[data-r="hrep"]', calc).textContent = fmt(hrep) + " h";
    $('[data-r="eur"]', calc).textContent = fmt(hours * v.eur) + " €";
    $('[data-r="days"]', calc).textContent = (hours / 8).toLocaleString("pt-PT", { maximumFractionDigits: 1 });
    const max = Math.max(hmsg, hrep, 1);
    $('[data-bar="msg"]', calc).style.width = (hmsg / max * 100) + "%"; $('[data-bar="rep"]', calc).style.width = (hrep / max * 100) + "%";
    gsap.to(shown, { hours, duration: REDUCED ? 0 : .6, ease: "power3.out", onUpdate: () => ($('[data-r="hours"]', calc).textContent = fmt(shown.hours)) });
    $$("input[type=range]", calc).forEach(i => i.style.setProperty("--p", ((i.value - i.min) / (i.max - i.min) * 100) + "%"));
  };
  $$("input[type=range]", calc).forEach(i => i.addEventListener("input", run));
  ScrollTrigger.create({ trigger: calc, start: "top 80%", once: true, onEnter: run });
  run();
}

/* serviços: foto que segue o cursor */
const prev = $(".svc-preview");
if (prev && FINE && !REDUCED) {
  const pimg = $("img", prev);
  const qx = gsap.quickTo(prev, "x", { duration: .5, ease: "power3.out" }), qy = gsap.quickTo(prev, "y", { duration: .5, ease: "power3.out" });
  let lastX = 0;
  gsap.set(prev, { xPercent: -50, yPercent: -50, scale: .7 });
  addEventListener("scroll", () => { if (prev.classList.contains("on")) { prev.classList.remove("on"); gsap.to(prev, { scale: .7, duration: .3 }); } }, { passive: true });
  $$(".svc-row[data-img]").forEach(row => {
    row.addEventListener("pointerenter", () => { if (pimg.getAttribute("src") !== row.dataset.img) pimg.src = row.dataset.img; prev.classList.add("on"); gsap.to(prev, { scale: 1, duration: .45, ease: "back.out(1.6)" }); });
    row.addEventListener("pointerleave", () => { prev.classList.remove("on"); gsap.to(prev, { scale: .7, duration: .3 }); });
    row.addEventListener("pointermove", e => { qx(e.clientX + 170); qy(e.clientY); gsap.to(prev, { rotation: Math.max(-8, Math.min(8, (e.clientX - lastX) * .6)), duration: .4 }); lastX = e.clientX; });
  });
}

/* ---------- exemplos: separadores que avançam sozinhos ---------- */
const exEl = $(".ex");
if (exEl) {
  const tabs = $$(".ex-tab", exEl), panels = $$(".ex-panel", exEl);
  let cur = 0, timer = null, visible = false;
  const show = i => {
    cur = i;
    tabs.forEach((t, k) => { t.classList.toggle("on", k === i); t.setAttribute("aria-selected", String(k === i)); const b = $(".ex-bar i", t); b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; });
    panels.forEach((p, k) => p.classList.toggle("on", k === i));
    clearTimeout(timer);
    if (visible && !REDUCED) timer = setTimeout(() => show((cur + 1) % tabs.length), 7000);
  };
  tabs.forEach((t, k) => t.addEventListener("click", () => show(k)));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) show(cur); else clearTimeout(timer); }, { threshold: .3 }).observe(exEl);
}

/* ---------- linha do processo ---------- */
$$(".steps").forEach(st => {
  const fill = $(".steps-fill", st), vertical = matchMedia("(max-width: 900px)").matches;
  if (REDUCED) { gsap.set(fill, { scaleX: 1, scaleY: 1 }); return; }
  gsap.to(fill, { [vertical ? "scaleY" : "scaleX"]: 1, ease: "none", scrollTrigger: { trigger: st, start: "top 75%", end: "bottom 55%", scrub: .6 } });
});

/* ---------- montra de demos (início) ---------- */
const showcase = $(".showcase");
if (showcase) {
  const items = $$(".demo-item", showcase), videos = $$(".demo-video", showcase), descs = $$(".demo-desc", showcase), url = $(".demo-url", showcase);
  let cur = 0, vis = false;
  const show = (i, user) => {
    cur = i;
    items.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", String(k === i)); });
    descs.forEach((d, k) => d.classList.toggle("on", k === i));
    videos.forEach((v, k) => { v.classList.toggle("on", k === i); if (k === i) { v.preload = "auto"; v.currentTime = 0; if (vis || user) v.play().catch(() => {}); } else v.pause(); });
    url.textContent = `weldstudio.pt/demos/${descs[i].dataset.slug}`;
    const bar = $(".demo-bar i", items[i]); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
  };
  videos.forEach((v, k) => { v.addEventListener("loadedmetadata", () => items[k].style.setProperty("--dur", `${v.duration}s`)); v.addEventListener("ended", () => show((k + 1) % videos.length)); });
  items.forEach((b, k) => b.addEventListener("click", () => show(k, true)));
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; vis ? videos[cur].play().catch(() => {}) : videos[cur].pause(); }, { threshold: .3 }).observe(showcase);
}
/* vídeos que só tocam quando se veem (página de demos) */
const vIO = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); }), { threshold: .35 });
$$(".autoplay-in-view").forEach(v => vIO.observe(v));

/* ---------- luz nos cartões e botões que puxam ---------- */
if (FINE && !REDUCED) {
  $$(".card-fx").forEach(el => el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
  $$(".magnetic").forEach(el => {
    const qx = gsap.quickTo(el, "x", { duration: .4, ease: "power3.out" }), qy = gsap.quickTo(el, "y", { duration: .4, ease: "power3.out" });
    el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
    el.addEventListener("pointerleave", () => { qx(0); qy(0); });
  });
}

/* ---------- pedido em 3 passos (contacto) ---------- */
const form = $("#brief");
if (form) {
  const data = {}, stepsEls = $$(".brief-step", form), dots = $$(".brief-steps li", form);
  let wantsDemo = false;
  const go = n => {
    stepsEls.forEach(s => s.classList.toggle("on", +s.dataset.step === n));
    dots.forEach((d, i) => { d.classList.toggle("on", i === n - 1); d.classList.toggle("done", i < n - 1); });
    if (n === 3) setTimeout(() => $("#f-name").focus({ preventScroll: true }), 300);
  };
  $$(".opt", form).forEach(o => o.addEventListener("click", () => {
    $$(`.opt[data-field="${o.dataset.field}"]`, form).forEach(x => x.classList.toggle("sel", x === o));
    data[o.dataset.field] = o.dataset.value;
    if (!(wantsDemo && o.dataset.field === "who")) setTimeout(() => go(o.dataset.field === "who" ? 2 : 3), 220);
  }));
  $$("[data-back]", form).forEach(b => b.addEventListener("click", () => go(+b.closest(".brief-step").dataset.step - 1)));
  // vindo de um botão "Pedir demo grátis": a demo fica escolhida e salta esse passo
  wantsDemo = new URLSearchParams(location.search).has("demo");
  if (wantsDemo) {
    data.need = "Demo grátis";
    $$('.opt[data-field="need"]', form).forEach(x => x.classList.toggle("sel", x.dataset.value === "Demo grátis"));
    const lbl = $('label[for="f-msg"]', form); if (lbl) lbl.textContent = "Site ou Instagram do negócio, e o que fazem";
    $$('.opt[data-field="who"]', form).forEach(o => o.addEventListener("click", () => setTimeout(() => go(3), 230)));
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#f-name").value.trim(), company = $("#f-company").value.trim(), msg = $("#f-msg").value.trim();
    $("#f-err").hidden = !!name;
    if (!name) { $("#f-name").focus(); return; }
    const subject = `Pedido Weld: ${data.need || "conversa"}${company ? " para " + company : ""}`;
    const lines = ["Olá João,", "", `Sou ${name}${company ? ", da " + company : ""}.`, `Somos: ${data.who || "não indicado"}.`, `Precisamos de: ${data.need || "ainda não sei"}.`, msg ? `\n${msg}` : "", "", data.need === "Demo grátis" ? "Gostava de ver a demo grátis com o nosso negócio. Quando podemos marcar os 20 minutos?" : "Podemos marcar uma conversa de 20 minutos?"];
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
}
/* ---------- pedido detalhado (/pedido) ---------- */
const order = $("#order");
if (order) {
  const list = $("#os-list"), pct = $("#os-pct"), arc = $("#os-arc"), note = $("#os-note");
  const svcLabel = {}; $$('input[name="service"]', order).forEach(i => { svcLabel[i.value] = i.dataset.label; });
  const vals = name => $$(`[name="${CSS.escape(name)}"]`, order).filter(i => (i.type === "checkbox" || i.type === "radio") ? i.checked : i.value.trim()).map(i => i.value.trim());
  const one = name => vals(name).join(", ");
  let last = {};
  // lê o formulário todo, na ordem em que aparece, e devolve secções de [pergunta, resposta]
  const read = () => {
    const who = one("who"), services = vals("service");
    const s = { who, services, sections: [] };
    const push = (title, rows) => { rows = rows.filter(r => r[1]); if (rows.length) s.sections.push([title, rows]); };
    push("Quem somos", [["Tipo", who], ["Cliente final", who.includes("cliente") ? one("endClient") : ""], ["Nº de clientes", who.includes("cliente") ? one("agencyCount") : ""], ["Marca", who.includes("cliente") ? one("brand") : ""]]);
    push("O que queremos", [["Serviços", services.map(k => svcLabel[k]).join(", ")]]);
    services.forEach(k => {
      const box = $(`[data-detail="${k}"]`, order); if (!box) return;
      const names = [...new Set($$("input,textarea", box).map(i => i.name))];
      push(svcLabel[k], names.map(n => [n.split(":").slice(1).join(":"), one(n)]));
    });
    push("Contexto", [["Empresa", one("company")], ["Setor", one("sector")], ["Site/Instagram", one("link")], ["Equipa", one("team")], ["Objetivo", one("goal")], ["Prazo", one("timing")], ["Orçamento", one("budget")], ["Modelo", one("model")]]);
    push("Contacto", [["Nome", one("name")], ["Cargo", one("role")], ["Email", one("email")], ["Telemóvel", one("phone")], ["Preferência", one("reach")], ["Melhor altura", one("when")], ["Mais", one("extra")]]);
    return s;
  };
  const summary = [["Quem", () => one("who")], ["Precisa de", () => vals("service").map(k => svcLabel[k]).join(", ")], ["Empresa", () => [one("company"), one("sector")].filter(Boolean).join(" · ")], ["Prazo", () => one("timing")], ["Orçamento", () => one("budget")], ["Contacto", () => [one("name"), one("phone") || one("email")].filter(Boolean).join(" · ")], ["Preferência", () => one("reach")]];
  const refresh = () => {
    const who = one("who"), services = vals("service");
    $$("[data-when-who]", order).forEach(el => { el.hidden = el.dataset.whenWho !== who; });
    $$("[data-detail]", order).forEach(el => { el.hidden = !services.includes(el.dataset.detail); });
    $("#o-empty").hidden = services.length > 0;
    if (services.length) $("#o-err-svc").hidden = true;
    list.innerHTML = "";
    summary.forEach(([k, f]) => {
      const v = f(), row = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = k; dd.textContent = v || "por preencher"; if (!v) dd.className = "none";
      if (v && v !== last[k]) row.className = "fresh"; last[k] = v;
      row.append(dt, dd); list.append(row);
    });
    // progresso: blocos essenciais preenchidos
    const checks = [who, services.length, services.some(k => $$(`[data-detail="${k}"] input,[data-detail="${k}"] textarea`, order).some(i => (i.type === "checkbox") ? i.checked : i.value.trim())), one("company") || one("sector"), one("goal"), one("timing"), one("budget"), one("name"), one("email") || one("phone")];
    const p = Math.round(checks.filter(Boolean).length / checks.length * 100);
    pct.textContent = `${p}% preenchido`; arc.style.strokeDasharray = `${p} 100`;
  };
  const text = () => {
    const s = read(), out = ["Olá João,", "", "Segue o nosso pedido, feito no site da Weld.", ""];
    s.sections.forEach(([t, rows]) => { out.push(`▸ ${t.toUpperCase()}`); rows.forEach(([q, a]) => { const k = /[?:]$/.test(q) ? q : q + ":"; out.push(a.includes("\n") ? `${k}\n${a}` : `${k} ${a}`); }); out.push(""); });
    const reach = one("reach");
    out.push(reach === "Ligar" ? "Prefiro que me liguem." : reach === "WhatsApp" ? "Prefiro falar por WhatsApp." : "Prefiro resposta por email.", "", "Obrigado!");
    return out.join("\n");
  };
  const subject = () => { const s = read(); return `Pedido Weld: ${s.services.map(k => svcLabel[k]).join(" + ") || "projeto"}${one("company") ? " para " + one("company") : ""}`; };
  const copy = async () => { try { await navigator.clipboard.writeText(`${subject()}\n\n${text()}`); return true; } catch { return false; } };
  order.addEventListener("input", refresh); order.addEventListener("change", refresh); refresh();
  order.addEventListener("submit", async e => {
    e.preventDefault();
    const err = $("#o-err"), svc = vals("service").length, name = one("name"), reach = one("reach"), phone = one("phone"), email = one("email");
    let msg = "";
    if (!svc) { $("#o-err-svc").hidden = false; $('input[name="service"]', order).focus(); $('input[name="service"]', order).closest(".o-block").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (!name) msg = "Falta o nome.";
    else if (reach !== "Email" && !phone) msg = "Deixa o teu telemóvel para te ligarmos (ou escolhe email).";
    else if (!phone && !email) msg = "Deixa um email ou um telemóvel.";
    err.textContent = msg; err.hidden = !msg;
    if (msg) { err.closest(".o-block").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const btn = $(".os-send"); btn.disabled = true; note.textContent = "A enviar…";
    try {
      const r = await fetch("/api/pedido", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: subject(), text: text(), name, email, phone, website: one("website") }) });
      if (r.ok) {
        const side = $(".order-side"); side.classList.add("sent"); $("#os-done").hidden = false;
        $("#os-done-text").textContent = reach === "Email" ? "Já está connosco. Respondemos por email em 24 horas úteis." : `Já está connosco. ${reach === "WhatsApp" ? "Falamos por WhatsApp" : "Ligamos-te"} para o ${phone} em 24 horas úteis.`;
        side.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    } catch {}
    btn.disabled = false;
    // sem servidor (ou falhou): cai para o email pré-escrito
    const copied = await copy();
    note.textContent = copied ? "O pedido também ficou copiado. Se o email não abrir, cola-o numa mensagem para " + order.dataset.email : "Se o email não abrir, escreve-nos para " + order.dataset.email;
    location.href = `mailto:${order.dataset.email}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(text())}`;
  });
  $("#os-copy").addEventListener("click", async () => {
    const lbl = $("#os-copy span"), ok = await copy();
    lbl.textContent = ok ? "Pedido copiado" : "Não deu para copiar";
    setTimeout(() => { lbl.textContent = "Copiar pedido"; }, 1800);
  });
}
const copyBtn = $("#copy-email");
if (copyBtn) {
  const label = $("#copy-label");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.email); label.textContent = "Email copiado"; }
    catch { location.href = "mailto:" + copyBtn.dataset.email; }
    setTimeout(() => { label.textContent = copyBtn.dataset.email; }, 1800);
  });
}
