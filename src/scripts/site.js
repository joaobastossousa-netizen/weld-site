// Movimento e interações do site da Weld (todas as páginas).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));

/* ---------- faíscas: partículas que desenham o W e soltam faíscas na solda ---------- */
(function sparks() {
  const cv = $("#sparks");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const W_PTS = [[12, 20], [32, 78], [50, 40], [68, 78], [88, 20]];
  let w, h, dpr, size, cx, cy, pts = [], flow = [], burst = [], scrollY0 = 0, mx = -9999, my = -9999, t = 0, running = true;
  const segs = [];
  for (let i = 0; i < W_PTS.length - 1; i++) segs.push([W_PTS[i], W_PTS[i + 1]]);
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const along = u => { let d = u * total; for (let i = 0; i < segs.length; i++) { if (d <= lens[i]) { const [a, b] = segs[i], k = d / lens[i]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= lens[i]; } return W_PTS[W_PTS.length - 1]; };
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const toScreen = ([x, y]) => [cx + (x - 50) / 100 * size, cy + (y - 50) / 100 * size];
  function layout() {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = w < 900;
    size = mobile ? Math.min(w * 1.1, 520) : Math.min(h * .95, w * .5, 820);
    cx = mobile ? w * .5 : w * .8; cy = h * (mobile ? .42 : .5);
    const n = mobile ? 1300 : 2800;
    pts = Array.from({ length: n }, () => ({ u: Math.random(), o: gauss() * 3.6, o2: gauss() * 3.6, ph: Math.random() * 6.28, sp: .4 + Math.random() * .9, r: .7 + Math.random() * 1.5, a: .25 + Math.random() * .6, mint: Math.random() < .55 }));
    flow = Array.from({ length: mobile ? 26 : 46 }, () => ({ u: Math.random(), v: .0009 + Math.random() * .0016 }));
  }
  function spark() {
    const [x, y] = toScreen([50, 40]);
    for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + gauss() * 1.4, s = 1.5 + Math.random() * 4.5; burst.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 }); }
  }
  function frame() {
    if (!running) return;
    t += 1;
    ctx.clearRect(0, 0, w, h);
    const sy = (scrollY - scrollY0) * -.12;
    const fade = Math.max(.35, 1 - scrollY / (h * 2.2));
    // brilho suave por baixo, para o W se ler de longe
    ctx.save(); ctx.translate(0, sy); ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath(); W_PTS.forEach((q, i) => { const [x, y] = toScreen(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.strokeStyle = `rgba(92,197,150,${.07 * fade})`; ctx.lineWidth = size * .09; ctx.shadowColor = "rgba(92,197,150,.5)"; ctx.shadowBlur = 40; ctx.stroke(); ctx.restore();
    ctx.globalCompositeOperation = "lighter";
    for (const p of pts) {
      const [bx, by] = along(p.u);
      let [x, y] = toScreen([bx + p.o + Math.sin(t * .01 * p.sp + p.ph) * 1.2, by + p.o2 + Math.cos(t * .012 * p.sp + p.ph) * 1.2]);
      y += sy;
      const dx = x - mx, dy = y - my, dist = Math.hypot(dx, dy);
      if (dist < 90) { x += dx / dist * (90 - dist) * .35; y += dy / dist * (90 - dist) * .35; }
      const tw = .6 + .4 * Math.sin(t * .03 * p.sp + p.ph);
      ctx.fillStyle = p.mint ? `rgba(120,220,170,${p.a * tw * fade})` : `rgba(235,245,238,${p.a * tw * .7 * fade})`;
      ctx.fillRect(x, y, p.r, p.r);
    }
    for (const f of flow) {
      f.u = (f.u + f.v) % 1;
      const [x, y] = toScreen(along(f.u));
      const g = ctx.createRadialGradient(x, y + sy, 0, x, y + sy, 7);
      g.addColorStop(0, `rgba(170,255,210,${.9 * fade})`); g.addColorStop(1, "rgba(92,197,150,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + sy, 7, 0, 6.28); ctx.fill();
    }
    if (t % 150 === 0) spark();
    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      b.x += b.vx; b.y += b.vy; b.vy += .12; b.vx *= .985; b.life -= .018;
      if (b.life <= 0) { burst.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${200 + 55 * b.life | 0},255,${190 + 40 * b.life | 0},${b.life * fade})`;
      ctx.fillRect(b.x, b.y + sy, 2, 2);
    }
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(frame);
  }
  layout();
  addEventListener("resize", layout);
  if (FINE) addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
  if (REDUCED) { running = false; t = 60; running = true; frame(); running = false; }
  else requestAnimationFrame(frame);
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

/* botão flutuante aparece depois do topo, e nunca na página de contacto */
const floatCta = $(".float-cta");
if (floatCta && !location.pathname.startsWith("/contacto")) {
  const first = $("main > section");
  new IntersectionObserver(([e]) => floatCta.classList.toggle("show", !e.isIntersecting), { threshold: .1 }).observe(first);
}

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

/* frase que se acende palavra a palavra */
$$("[data-words]").forEach(el => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
  const ws = $$(".w", el);
  if (REDUCED) { ws.forEach(w => (w.style.opacity = 1)); return; }
  gsap.to(ws, { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: .6 } });
});

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
  const msgs = $$(".msg", machine), outs = $$(".out", machine), core = $(".core", machine), spark = $(".core-spark", machine);
  if (REDUCED) gsap.set([...msgs, ...outs], { opacity: 1 });
  else {
    gsap.set(msgs, { opacity: 0, x: -24 }); gsap.set(outs, { opacity: 0, x: -24 });
    const toCore = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.left + b.width / 2 - (a.left + a.width / 2); };
    const toCoreY = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.top + b.height / 3 - (a.top + a.height / 2); };
    const hit = () => { core.classList.remove("hit"); void core.offsetWidth; core.classList.add("hit"); gsap.fromTo(spark, { scale: 1 }, { scale: 2.4, duration: .25, yoyo: true, repeat: 1 }); };
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
    url.textContent = `weld-site.vercel.app/demos/${descs[i].dataset.slug}`;
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
  const go = n => {
    stepsEls.forEach(s => s.classList.toggle("on", +s.dataset.step === n));
    dots.forEach((d, i) => { d.classList.toggle("on", i === n - 1); d.classList.toggle("done", i < n - 1); });
    if (n === 3) setTimeout(() => $("#f-name").focus({ preventScroll: true }), 300);
  };
  $$(".opt", form).forEach(o => o.addEventListener("click", () => {
    $$(`.opt[data-field="${o.dataset.field}"]`, form).forEach(x => x.classList.toggle("sel", x === o));
    data[o.dataset.field] = o.dataset.value;
    setTimeout(() => go(o.dataset.field === "who" ? 2 : 3), 220);
  }));
  $$("[data-back]", form).forEach(b => b.addEventListener("click", () => go(+b.closest(".brief-step").dataset.step - 1)));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#f-name").value.trim(), company = $("#f-company").value.trim(), msg = $("#f-msg").value.trim();
    $("#f-err").hidden = !!name;
    if (!name) { $("#f-name").focus(); return; }
    const subject = `Pedido Weld: ${data.need || "conversa"}${company ? " para " + company : ""}`;
    const lines = ["Olá João,", "", `Sou ${name}${company ? ", da " + company : ""}.`, `Somos: ${data.who || "não indicado"}.`, `Precisamos de: ${data.need || "ainda não sei"}.`, msg ? `\n${msg}` : "", "", "Podemos marcar uma conversa de 20 minutos?"];
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
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
