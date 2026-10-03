// Camada comum a todas as páginas: scroll suave, transição entre páginas, cursor, cabeçalho, capítulos de cor e relógio.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);

export const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const html = document.documentElement;

/* ---------- scroll suave (Lenis) ligado ao ScrollTrigger ---------- */
export const lenis = REDUCED ? null : new Lenis({ lerp: 0.105, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
if (lenis) {
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
// âncoras na mesma página
document.addEventListener("click", e => {
  const a = e.target.closest('a[href*="#"]');
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(target, { offset: -84, duration: 1.4 }) : target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
  history.replaceState(null, "", url.hash);
});

/* ---------- transição entre páginas ---------- */
let readyResolve;
export const ready = new Promise(r => (readyResolve = r));
const pt = $(".pt"), sheet = $(".pt-sheet"), ptLabel = $(".pt-label"), ptCount = $(".pt-count");
const NAMES = { "/": "Início", "/servicos": "Serviços", "/agencias": "Para agências", "/demos": "Demos", "/sobre": "Sobre", "/contacto": "Contacto", "/pedido": "Pedido" };
const nameFor = (url, a) => {
  const p = url.pathname.replace(/\/$/, "") || "/";
  if (NAMES[p]) return NAMES[p];
  const t = (a?.dataset.label || a?.querySelector("b, h2, h3")?.textContent || a?.textContent || "").trim().replace(/\s+/g, " ");
  return t.length && t.length < 40 ? t : "weld";
};

function reveal() {
  if (!html.classList.contains("pt-cover")) { readyResolve(); return; }
  lenis?.stop();
  const boot = html.classList.contains("pt-boot");
  try { const l = sessionStorage.getItem("weld-pt-label"); if (l && !boot) ptLabel.textContent = l; } catch (e) {}
  const tl = gsap.timeline({
    onComplete() {
      html.classList.remove("pt-cover", "pt-boot", "pt-from", "pt-go");
      gsap.set([sheet, ".pt-mid"], { clearProps: "all" });
      lenis?.start();
    },
  });
  if (boot) {
    // primeira visita: o W solda-se e o contador chega a 100
    const n = { v: 0 };
    tl.to(n, { v: 100, duration: 1.15, ease: "power2.inOut", onUpdate: () => (ptCount.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0);
  } else tl.to({}, { duration: 0.12 });
  tl.to(".pt-mid", { yPercent: -60, opacity: 0, duration: 0.5, ease: "power3.in" });
  tl.to(sheet, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "<0.05");
  tl.call(() => { html.classList.add("pt-go"); readyResolve(); }, [], "<0.35");
}
// espera pelas fontes (no máximo 900 ms) para o título não saltar quando a chapa sobe
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise(r => setTimeout(r, 900))]);
fontsReady.then(reveal);

function leave(href, label) {
  try { sessionStorage.setItem("weld-pt", "1"); sessionStorage.setItem("weld-pt-label", label); } catch (e) {}
  ptLabel.textContent = label;
  ptCount.textContent = "";
  html.classList.add("pt-cover", "pt-leave");
  lenis?.stop();
  gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut" });
  gsap.fromTo(".pt-mid", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power3.out", onComplete: () => (location.href = href) });
}
if (!REDUCED) document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
  if (/\.[a-z0-9]{2,4}$/i.test(url.pathname)) return; // demos estáticas, vídeos, ficheiros
  if (url.pathname === location.pathname && url.search === location.search) {
    if (!url.hash) { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.2 }) : scrollTo({ top: 0, behavior: "smooth" }); }
    return;
  }
  e.preventDefault();
  $("#nav")?.classList.remove("open");
  leave(url.href, nameFor(url, a));
});
// voltar atrás com a cache do browser: a chapa não pode ficar tapada
addEventListener("pageshow", e => {
  if (!e.persisted) return;
  html.classList.remove("pt-cover", "pt-leave", "pt-boot", "pt-from");
  gsap.set([sheet, ".pt-mid"], { clearProps: "all" });
  lenis?.start();
});

/* ---------- cursor com etiqueta (só rato) ---------- */
if (FINE && !REDUCED) {
  const c = $(".cursor"), label = $("span", c);
  const qx = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3.out" }), qy = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3.out" });
  addEventListener("pointermove", e => { qx(e.clientX); qy(e.clientY); c.classList.add("seen"); }, { passive: true });
  document.addEventListener("pointerover", e => {
    const t = e.target.closest("[data-cursor]");
    c.classList.toggle("on", !!t);
    if (t) label.textContent = t.dataset.cursor;
  });
  document.addEventListener("pointerleave", () => c.classList.remove("seen"));
}

/* ---------- cabeçalho: esconde ao descer, volta ao subir ---------- */
const nav = $("#nav");
if (nav) ScrollTrigger.create({
  start: 0, end: "max",
  onUpdate(self) {
    const y = self.scroll();
    nav.classList.toggle("tucked", self.direction === 1 && y > 420 && !nav.classList.contains("open"));
  },
});

/* ---------- capítulos: a cor de fundo muda entre secções escuras e de papel ---------- */
const chapters = $$("[data-chapter]").filter(el => el !== document.body);
if (chapters.length) {
  const set = v => { if (document.body.dataset.chapter !== v) document.body.dataset.chapter = v; };
  chapters.forEach(el => ScrollTrigger.create({
    trigger: el, start: "top 52%", end: "bottom 52%", refreshPriority: -1,
    onToggle: s => s.isActive && set(el.dataset.chapter),
  }));
}

/* ---------- relógio do Porto ---------- */
const clocks = $$("[data-clock]");
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" });
  const tick = () => clocks.forEach(c => (c.textContent = fmt.format(new Date())));
  tick(); setInterval(tick, 15000);
}

/* ---------- letreiros que correm (marquee): duplica o conteúdo e anda com o scroll ---------- */
$$("[data-marquee]").forEach(m => {
  const track = m.firstElementChild;
  track.append(...[...track.children].map(n => { const c = n.cloneNode(true); c.setAttribute("aria-hidden", "true"); return c; }));
  if (REDUCED) return;
  const dir = m.dataset.marquee === "rev" ? 1 : -1;
  let x = 0, boost = 0;
  const speed = +(m.dataset.speed || 40);
  lenis?.on("scroll", ({ velocity }) => (boost = Math.min(18, Math.abs(velocity) * 0.9)));
  gsap.ticker.add((t, dt) => {
    const half = track.scrollWidth / 2;
    x += dir * (speed + boost * 22) * (dt / 1000);
    boost *= 0.94;
    if (dir < 0 && x <= -half) x += half;
    if (dir > 0 && x >= 0) x -= half;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
  if (dir > 0) x = -track.scrollWidth / 4;
});

/* ---------- títulos que sobem linha a linha, traços que se desenham, W do rodapé que enche ---------- */
if (!REDUCED) {
  $$("[data-rise]").forEach(h => gsap.from($$(".ln > span", h), {
    yPercent: 118, duration: 1.25, ease: "expo.out", stagger: 0.09,
    scrollTrigger: { trigger: h, start: "top 88%", once: true, refreshPriority: -1 },
  }));
  $$("[data-draw]").forEach(p => gsap.fromTo(p, { strokeDashoffset: 1 }, {
    strokeDashoffset: 0, ease: "none",
    scrollTrigger: { trigger: p.closest("section") || p, start: "top 70%", end: "top 15%", scrub: true, refreshPriority: -1 },
  }));
  const mark = $(".foot-mark span");
  if (mark) gsap.fromTo(mark, { "--fill": "0%" }, { "--fill": "100%", ease: "none", scrollTrigger: { trigger: ".foot-mark", start: "top bottom", end: "bottom bottom", scrub: true, refreshPriority: -1 } });
}
