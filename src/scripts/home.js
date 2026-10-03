// Movimento da página inicial: título, editor de fluxos, frase com fotos, cartões empilhados, ecrã das demos e processo.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ready, REDUCED, FINE } from "./shell.js";
gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const mm = gsap.matchMedia();

/* ---------- capa: as letras sobem e esticam, depois reagem ao rato ---------- */
const hero = $(".hero5"), title = $(".h5-title"), chars = $$(".ch", title);
ready.then(() => {
  title.classList.remove("pre");
  if (REDUCED) return;
  gsap.fromTo(chars, { yPercent: 112, "--wd": 62, "--wg": 300 }, {
    yPercent: 0, "--wd": 100, "--wg": 560, duration: 1.35, ease: "expo.out", stagger: 0.032,
    onComplete() { $$(".h5-line", title).forEach(l => (l.style.overflow = "visible")); if (FINE) proximity(); },
  });
  gsap.from(".h5-anim", { y: 26, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.45 });
  gsap.from(".flow", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.6, clearProps: "opacity" });
});

function proximity() {
  let pts = [], mx = -1e4, my = -1e4, raf = 0;
  const measure = () => (pts = chars.map(c => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY]; }));
  measure();
  addEventListener("resize", measure);
  const apply = () => {
    raf = 0;
    chars.forEach((c, i) => {
      const d = Math.hypot(pts[i][0] - mx, pts[i][1] - my);
      const k = Math.max(0, 1 - d / 260) ** 1.6;
      gsap.to(c, { "--wd": 100 + k * 25, "--wg": 560 + k * 300, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    });
  };
  hero.addEventListener("pointermove", e => { mx = e.pageX; my = e.pageY; raf ||= requestAnimationFrame(apply); });
  hero.addEventListener("pointerleave", () => { mx = my = -1e4; raf ||= requestAnimationFrame(apply); });
}

if (!REDUCED) {
  // as duas linhas afastam-se ao descer
  gsap.to('.h5-line[data-line="0"]', { xPercent: -7, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true } });
  gsap.to('.h5-line[data-line="1"]', { xPercent: 5, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true } });
  // o editor começa inclinado e endireita-se
  gsap.fromTo(".flow", { rotateX: 24, scale: 0.9 }, { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".flow-stage", start: "top 95%", end: "top 22%", scrub: true } });
}

/* ---------- editor de fluxos: nós arrastáveis, fios e execuções ---------- */
const flow = $(".flow");
if (flow) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = $(".flow-wires", flow);
  const nodeEls = $$(".node", flow);
  const node = Object.fromEntries(nodeEls.map(n => [n.dataset.id, n]));
  const inputs = nodeEls.filter(n => n.classList.contains("node-in"));
  const outputs = nodeEls.filter(n => n.classList.contains("node-out"));
  const links = [...inputs.map(n => [n.dataset.id, "weld"]), ...outputs.map(n => ["weld", n.dataset.id])];
  const LAYOUT = {
    wide: { wa: [4, 18], ig: [2.5, 44], gm: [6, 70], weld: [39, 28], cal: [74.5, 14], crm: [77, 43], sh: [73, 72] },
    narrow: { wa: [4, 13], ig: [52, 13], gm: [28, 24], weld: [50, 36], cal: [4, 73], crm: [52, 73], sh: [28, 82] },
  };
  const custom = {};
  let vertical = false;
  const wires = {};
  const mk = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  links.forEach(([a, b]) => {
    const key = `${a}>${b}`;
    wires[key] = { path: mk("path", { class: "wire" }), label: mk("text", { class: "wire-l" }) };
    wires[key].label.textContent = "1 item";
  });
  const halo = mk("circle", { r: 14, class: "pkt-h", opacity: 0 });
  const pkt = mk("circle", { r: 3.6, class: "pkt", opacity: 0 });

  function place() {
    vertical = flow.clientWidth < 700;
    const L = vertical ? LAYOUT.narrow : LAYOUT.wide;
    const W = flow.clientWidth, H = flow.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    nodeEls.forEach(n => {
      const id = n.dataset.id;
      let [x, y] = custom[id] || L[id];
      let px = (x / 100) * W, py = (y / 100) * H;
      if (vertical && id === "weld") px -= n.offsetWidth / 2;
      px = Math.min(Math.max(px, 8), W - n.offsetWidth - 8);
      py = Math.min(Math.max(py, 64), H - n.offsetHeight - 70);
      n.style.left = px + "px"; n.style.top = py + "px";
    });
    draw();
  }
  function draw() {
    Object.entries(wires).forEach(([key, w]) => {
      const [a, b] = key.split(">").map(id => node[id]);
      const hidden = !a.offsetParent || !b.offsetParent;
      w.path.style.display = w.label.style.display = hidden ? "none" : "";
      if (hidden) return;
      let d;
      if (vertical) {
        const x1 = a.offsetLeft + a.offsetWidth / 2, y1 = a.offsetTop + a.offsetHeight, x2 = b.offsetLeft + b.offsetWidth / 2, y2 = b.offsetTop;
        const dy = Math.max(30, Math.abs(y2 - y1) / 2);
        d = `M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`;
      } else {
        const x1 = a.offsetLeft + a.offsetWidth, y1 = a.offsetTop + a.offsetHeight / 2, x2 = b.offsetLeft, y2 = b.offsetTop + b.offsetHeight / 2;
        const dx = Math.max(40, Math.abs(x2 - x1) / 2);
        d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      }
      w.path.setAttribute("d", d);
      const len = w.path.getTotalLength(), mid = w.path.getPointAtLength(len / 2);
      w.label.setAttribute("x", mid.x); w.label.setAttribute("y", mid.y - 8);
      if (vertical || len < 140) w.label.style.display = "none";
    });
  }
  // portas ficam por cima/baixo no telemóvel
  const ports = () => nodeEls.forEach(n => $$(".port", n).forEach(p => p.style.cssText = vertical ? (p.classList.contains("in") ? "left:50%;top:-5.5px;margin:0 0 0 -5.5px" : "left:50%;right:auto;top:auto;bottom:-5.5px;margin:0 0 0 -5.5px") : ""));
  const relayout = () => { place(); ports(); draw(); };
  relayout();
  new ResizeObserver(relayout).observe(flow);
  document.fonts?.ready.then(relayout);

  // arrastar (rato e caneta; no toque o dedo continua a fazer scroll)
  nodeEls.forEach(n => n.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    e.preventDefault();
    n.setPointerCapture(e.pointerId);
    n.classList.add("drag");
    const sx = e.clientX, sy = e.clientY, ox = n.offsetLeft, oy = n.offsetTop;
    const scale = flow.getBoundingClientRect().width / flow.offsetWidth || 1;
    const move = ev => {
      const W = flow.clientWidth, H = flow.clientHeight;
      const x = Math.min(Math.max(ox + (ev.clientX - sx) / scale, 8), W - n.offsetWidth - 8);
      const y = Math.min(Math.max(oy + (ev.clientY - sy) / scale, 60), H - n.offsetHeight - 66);
      n.style.left = x + "px"; n.style.top = y + "px";
      custom[n.dataset.id] = [(x / W) * 100 + (vertical && n.dataset.id === "weld" ? (n.offsetWidth / 2 / W) * 100 : 0), (y / H) * 100];
      draw();
    };
    const up = () => { n.classList.remove("drag"); n.removeEventListener("pointermove", move); n.removeEventListener("pointerup", up); n.removeEventListener("pointercancel", up); };
    n.addEventListener("pointermove", move); n.addEventListener("pointerup", up); n.addEventListener("pointercancel", up);
  }));

  // execuções de exemplo
  const MSG = {
    wa: ["Têm vaga sábado de manhã?", "Posso passar para quinta?", "Fazem limpeza dentária?"],
    ig: ["Quanto custa um site?", "Fazem lojas online?", "Têm exemplos de sites?"],
    gm: ["fornecedor_0912.pdf", "fatura_luz_set.pdf", "FT 2026-4471.pdf"],
  };
  const OUT = {
    cal: ["Sáb · 10:00 · Rita M.", "Qui · 15:30 · Nuno P.", "Ter · 09:15 · Inês C."],
    crm: ["Restaurante · 4 páginas", "Loja online · 30 produtos", "Clínica · site e marcações"],
    sh: ["Fatura · 312,40 €", "Fatura · 87,15 €", "Fatura · 1.204,00 €"],
  };
  const logEl = $(".flow-log", flow), logT = $(".flow-log-t", flow), runsEl = $("[data-runs]", flow);
  const log = t => { logT.textContent = t; logEl.classList.add("is-live"); };
  let runs = 1284, busy = false, turn = 0, visible = false;
  const travel = (key, dur = 0.85) => new Promise(res => {
    const w = wires[key];
    w.path.classList.add("hot");
    const o = { t: 0 };
    gsap.set([pkt, halo], { attr: { opacity: 1 } });
    gsap.to(o, {
      t: 1, duration: REDUCED ? 0 : dur, ease: "power2.inOut",
      onUpdate() { const p = w.path.getPointAtLength(o.t * w.path.getTotalLength()); pkt.setAttribute("cx", p.x); pkt.setAttribute("cy", p.y); halo.setAttribute("cx", p.x); halo.setAttribute("cy", p.y); },
      onComplete() { w.path.classList.remove("hot"); gsap.set([pkt, halo], { attr: { opacity: 0 } }); res(); },
    });
  });
  async function run() {
    if (busy) return;
    busy = true;
    const live = inputs.filter(n => n.offsetParent !== null);
    const a = live[turn % live.length], b = node[a.dataset.to], k = Math.floor(turn / live.length) % 3;
    turn++;
    const t0 = performance.now();
    $(".node-t em", a).textContent = MSG[a.dataset.id][k];
    a.classList.add("fire");
    log(`${$(".node-t small", a).textContent} · ${$(".node-t b", a).textContent.toLowerCase()}`);
    await travel(`${a.dataset.id}>weld`);
    a.classList.remove("fire");
    node.weld.classList.add("busy");
    log("A Weld está a tratar disto");
    await wait(REDUCED ? 0 : 650);
    node.weld.classList.remove("busy");
    await travel(`weld>${b.dataset.id}`);
    $(".node-t em", b).textContent = OUT[b.dataset.id][k];
    b.classList.add("done");
    runs++;
    runsEl.textContent = runs.toLocaleString("pt-PT");
    log(`Feito em ${((performance.now() - t0) / 1000).toFixed(1).replace(".", ",")} s · ${$(".node-t b", b).textContent.toLowerCase()}`);
    setTimeout(() => b.classList.remove("done"), 1600);
    busy = false;
  }
  $(".flow-run", flow).addEventListener("click", run);
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.25 }).observe(flow);
  ready.then(async () => {
    await wait(1400);
    (function loop() { if (visible && !document.hidden) run(); setTimeout(loop, 3300); })();
  });
}

/* ---------- frase do posicionamento: as fotos abrem dentro do texto ---------- */
if (!REDUCED) {
  const pcs = $$(".mani .pc");
  if (pcs.length) {
    gsap.fromTo(pcs, { width: 0, marginLeft: 0, marginRight: 0 }, {
      width: "1.7em", marginLeft: "0.14em", marginRight: "0.14em", ease: "power2.out", stagger: 0.12,
      scrollTrigger: { trigger: ".mani-text", start: "top 82%", end: "center 52%", scrub: 0.8 },
    });
    gsap.fromTo($$(".mani .pc img"), { scale: 1.6 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".mani-text", start: "top 82%", end: "bottom 40%", scrub: true } });
  }
}

/* ---------- serviços: cartões presos que se empilham ---------- */
const cards = $$(".sk");
cards.forEach(c => ScrollTrigger.create({ trigger: c, start: "top 75%", onEnter: () => c.classList.add("on"), onLeaveBack: () => c.classList.remove("on") }));
if (!REDUCED) mm.add("(min-width: 901px)", () => {
  const stack = $(".stack");
  cards.forEach((c, i) => {
    const top = 92 + i * 18;
    ScrollTrigger.create({ trigger: c, start: `top ${top}px`, endTrigger: stack, end: "bottom bottom", pin: true, pinSpacing: false });
    if (i < cards.length - 1) gsap.fromTo($(".sk-in", c), { scale: 1, filter: "brightness(1)" }, {
      scale: 0.9 + i * 0.015, filter: "brightness(0.45)", ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: `top ${top + 18}px`, scrub: true },
    });
  });
});

/* ---------- demos: o ecrã endireita-se ---------- */
if (!REDUCED) gsap.fromTo(".mon", { rotateX: 28, scale: 0.8, y: 60 }, { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: ".mon-wrap", start: "top 98%", end: "top 18%", scrub: true } });

/* ---------- processo: a linha de solda corre na horizontal ---------- */
const proc = $(".proc5");
if (proc) {
  const track = $(".proc-track", proc), fill = $(".proc-fill", proc), spark = $(".proc-spark", proc), steps = $$(".pstep", proc);
  mm.add("(min-width: 901px)", () => {
    if (REDUCED) { steps.forEach(s => s.classList.add("lit")); gsap.set(fill, { scaleX: 1 }); return; }
    const dist = () => track.scrollWidth - innerWidth * 0.6;
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: proc, start: "top top", end: () => "+=" + dist(), pin: $(".proc-pin", proc), scrub: 0.7, invalidateOnRefresh: true,
        onUpdate() {
          const tx = gsap.getProperty(track, "x");
          const head = Math.max(0, -tx + innerWidth * 0.55);
          const w = track.scrollWidth;
          gsap.set(fill, { scaleX: Math.min(1, head / w) });
          gsap.set(spark, { x: Math.min(head, w) });
          steps.forEach(s => s.classList.toggle("lit", s.offsetLeft + 8 <= head));
        },
      },
    });
  });
  mm.add("(max-width: 900px)", () => {
    gsap.fromTo(fill, { scaleX: 1, scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: track, start: "top 70%", end: "bottom 60%", scrub: true } });
    steps.forEach(s => ScrollTrigger.create({ trigger: s, start: "top 72%", onEnter: () => s.classList.add("lit"), onLeaveBack: () => s.classList.remove("lit") }));
  });
}

// os gatilhos criados antes (capítulos de cor, títulos) contam com o espaço que os pins acrescentam
ScrollTrigger.sort();
