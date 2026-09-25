// Movimento e interações do site da Weld (todas as páginas).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));

/* ---------- fundo: fios verdes finos com um sinal de luz a passar ---------- */
(function wires() {
  const cv = $("#wires");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  let w, h, dpr, t = 0, running = true, threads = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function layout() {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 700 ? 4 : 6;
    threads = Array.from({ length: n }, (_, i) => ({
      y: (i + 0.5) / n, a1: rnd(18, 46), f1: rnd(0.0012, 0.0026), s1: rnd(0.004, 0.009), p: rnd(0, 6.28),
      a2: rnd(6, 18), f2: rnd(0.004, 0.007), s2: rnd(0.006, 0.012), par: rnd(0.05, 0.18),
      pulse: rnd(-0.6, 0), speed: rnd(0.0012, 0.0022), alpha: rnd(0.16, 0.28),
    }));
  }
  const yAt = (th, x, base) => base + Math.sin(x * th.f1 + t * th.s1 + th.p) * th.a1 + Math.sin(x * th.f2 - t * th.s2) * th.a2;
  function frame() {
    if (!running) return;
    t += 1;
    ctx.clearRect(0, 0, w, h);
    const sy = scrollY;
    for (const th of threads) {
      const span = h + 240;
      let base = ((th.y * span - sy * th.par) % span + span) % span - 120;
      // fio
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(43,138,97,0)"); g.addColorStop(0.2, `rgba(43,138,97,${th.alpha})`);
      g.addColorStop(0.8, `rgba(43,138,97,${th.alpha})`); g.addColorStop(1, "rgba(43,138,97,0)");
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 16) { const y = yAt(th, x, base); x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
      // sinal
      th.pulse += th.speed;
      if (th.pulse > 1.3) th.pulse = rnd(-0.8, -0.1);
      if (th.pulse > 0 && th.pulse < 1.15) {
        const hx = th.pulse * (w + 200) - 100, len = 160;
        ctx.beginPath();
        for (let x = hx - len; x <= hx; x += 8) { const y = yAt(th, x, base); x === hx - len ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        const pg = ctx.createLinearGradient(hx - len, 0, hx, 0);
        pg.addColorStop(0, "rgba(92,197,150,0)"); pg.addColorStop(1, "rgba(92,197,150,.75)");
        ctx.strokeStyle = pg; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, yAt(th, hx, base), 2.6, 0, 6.28); ctx.fillStyle = "rgba(92,197,150,.9)"; ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  layout();
  addEventListener("resize", layout);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
  if (REDUCED) { t = 200; running = true; frame(); running = false; } else requestAnimationFrame(frame);
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
