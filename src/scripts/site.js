// Movimento e interações do site da Weld.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* nav ganha linha por baixo quando se sai do topo */
const nav = $("#nav");
const sentinel = document.createElement("div");
sentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px";
document.body.prepend(sentinel);
new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting)).observe(sentinel);

/* secções entram ao fazer scroll */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
$$(".reveal").forEach(el => (REDUCED ? el.classList.add("in") : revealIO.observe(el)));

/* palavra que roda no título */
const rots = $$("#rotator .rot");
let rotI = 0;
if (!REDUCED && rots.length > 1) setInterval(() => {
  const cur = rots[rotI];
  cur.classList.remove("on"); cur.classList.add("out");
  setTimeout(() => cur.classList.remove("out"), 600);
  rotI = (rotI + 1) % rots.length;
  rots[rotI].classList.add("on");
}, 2400);

/* máquina do topo: mensagens entram no W e saem resolvidas */
const machine = $(".machine");
if (machine) {
  const msgs = $$(".msg", machine), outs = $$(".out", machine), core = $(".core", machine), spark = $(".core-spark", machine);
  if (REDUCED) { gsap.set([...msgs, ...outs], { opacity: 1 }); }
  else {
    gsap.set(msgs, { opacity: 0, x: -24 });
    gsap.set(outs, { opacity: 0, x: -24 });
    const toCore = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.left + b.width / 2 - (a.left + a.width / 2); };
    const toCoreY = el => { const a = el.getBoundingClientRect(), b = core.getBoundingClientRect(); return b.top + b.height / 3 - (a.top + a.height / 2); };
    const hit = () => { core.classList.remove("hit"); void core.offsetWidth; core.classList.add("hit"); gsap.fromTo(spark, { scale: 1 }, { scale: 2.4, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" }); };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .4, delay: 1.2 });
    msgs.forEach((m, i) => {
      tl.to(m, { opacity: 1, x: 0, duration: .5, ease: "power3.out" })
        .to(m, { x: () => toCore(m), y: () => toCoreY(m), scale: .4, opacity: 0, duration: .65, ease: "power2.in" }, "+=.55")
        .call(hit)
        .to(outs[i], { opacity: 1, x: 0, duration: .55, ease: "back.out(1.6)" }, "-=.05");
    });
    tl.to(outs, { opacity: 0, x: 24, duration: .45, stagger: .08, ease: "power2.in" }, "+=2.2")
      .set(msgs, { x: -24, y: 0, scale: 1 })
      .set(outs, { x: -24 });
    ScrollTrigger.create({ trigger: machine, start: "top bottom", end: "bottom top", onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
  }
}

/* manchas de cor do topo movem-se com o scroll */
if (!REDUCED) {
  gsap.to(".blob.b1", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".blob.b2", { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
}

/* história: três passos presos ao scroll */
const stage = $(".stage"), sSteps = $$(".s-step"), status = $("#sp-status");
function setStep(i) {
  stage.classList.remove("p1", "p2", "p3"); stage.classList.add("p" + (i + 1));
  sSteps.forEach((s, k) => s.classList.toggle("on", k === i));
  status.textContent = i === 0 ? "fechada · 23:14" : i === 1 ? "assistente online · 23:14" : "aberta · 09:00";
}
setStep(0);
if (REDUCED) setStep(2);
else ScrollTrigger.create({
  trigger: ".story", start: "top top", end: "bottom bottom",
  onUpdate: s => setStep(Math.min(2, Math.floor(s.progress * 3))),
});

/* demos: vídeo a passar, muda sozinho no fim */
const items = $$(".demo-item"), videos = $$(".demo-video"), descs = $$(".demo-desc"), urlEl = $("#demo-url");
const demoData = window.WELD_DEMOS || [];
let demoI = 0, demoVisible = false;
function showDemo(i, user) {
  demoI = i;
  items.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", String(k === i)); });
  descs.forEach((d, k) => d.classList.toggle("on", k === i));
  videos.forEach((v, k) => {
    v.classList.toggle("on", k === i);
    if (k === i) { v.preload = "auto"; v.currentTime = 0; if (demoVisible || user) v.play().catch(() => {}); }
    else v.pause();
  });
  urlEl.textContent = `weld-site.vercel.app/demos/${demoData[i]?.slug || ""}`;
  const bar = items[i].querySelector(".demo-bar i");
  bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
}
videos.forEach((v, k) => {
  v.loop = false;
  v.addEventListener("loadedmetadata", () => items[k].style.setProperty("--dur", `${v.duration}s`));
  v.addEventListener("ended", () => showDemo((k + 1) % videos.length));
});
items.forEach((b, k) => b.addEventListener("click", () => showDemo(k, true)));
new IntersectionObserver(([e]) => {
  demoVisible = e.isIntersecting;
  const v = videos[demoI];
  if (demoVisible) v.play().catch(() => {}); else v.pause();
}, { threshold: .3 }).observe($(".showcase"));

/* agência ou negócio */
const pill = $(".switch-pill"), tabBtns = $$(".switch [role=tab]");
function movePill(btn) { pill.style.width = btn.offsetWidth + "px"; pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`; }
function selectPath(key) {
  tabBtns.forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === key)));
  $$(".path").forEach(p => p.classList.toggle("on", p.dataset.panel === key));
  movePill(tabBtns.find(b => b.dataset.tab === key));
}
tabBtns.forEach(b => b.addEventListener("click", () => selectPath(b.dataset.tab)));
$(".switch").addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const i = tabBtns.findIndex(b => b.getAttribute("aria-selected") === "true");
  const n = tabBtns[(i + (e.key === "ArrowRight" ? 1 : tabBtns.length - 1)) % tabBtns.length];
  selectPath(n.dataset.tab); n.focus();
});
$$("[data-path]").forEach(a => a.addEventListener("click", () => selectPath(a.dataset.path)));
requestAnimationFrame(() => movePill(tabBtns[0]));
addEventListener("resize", () => movePill(tabBtns.find(b => b.getAttribute("aria-selected") === "true")));

/* linha do processo enche com o scroll */
const vertical = matchMedia("(max-width: 820px)").matches;
if (!REDUCED) gsap.to(".steps-fill", { [vertical ? "scaleY" : "scaleX"]: 1, ease: "none", scrollTrigger: { trigger: "#steps", start: "top 75%", end: "bottom 55%", scrub: .6 } });
else gsap.set(".steps-fill", { scaleX: 1, scaleY: 1 });

/* luz que segue o rato nos cartões e botões que puxam */
if (FINE && !REDUCED) {
  $$(".card-fx").forEach(el => el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
  $$(".magnetic").forEach(el => {
    const qx = gsap.quickTo(el, "x", { duration: .4, ease: "power3.out" }), qy = gsap.quickTo(el, "y", { duration: .4, ease: "power3.out" });
    el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
    el.addEventListener("pointerleave", () => { qx(0); qy(0); });
  });
}

/* pedido em 3 passos que acaba num email já escrito */
const form = $("#brief"), data = {};
const stepsEls = $$(".brief-step", form), dots = $$(".brief-steps li", form);
function go(n) {
  stepsEls.forEach(s => s.classList.toggle("on", +s.dataset.step === n));
  dots.forEach((d, i) => { d.classList.toggle("on", i === n - 1); d.classList.toggle("done", i < n - 1); });
  if (n === 3) setTimeout(() => $("#f-name").focus({ preventScroll: true }), 300);
}
$$(".opt", form).forEach(o => o.addEventListener("click", () => {
  $$(`.opt[data-field="${o.dataset.field}"]`, form).forEach(x => x.classList.toggle("sel", x === o));
  data[o.dataset.field] = o.dataset.value;
  setTimeout(() => go(o.dataset.field === "who" ? 2 : 3), 220);
}));
$$("[data-back]", form).forEach(b => b.addEventListener("click", () => go(+b.closest(".brief-step").dataset.step - 1)));
$$("[data-who]").forEach(a => a.addEventListener("click", () => {
  const opt = $$(`.opt[data-field="who"]`, form).find(o => o.dataset.value === a.dataset.who);
  if (opt) { $$(`.opt[data-field="who"]`, form).forEach(x => x.classList.toggle("sel", x === opt)); data.who = opt.dataset.value; go(2); }
}));
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#f-name").value.trim(), company = $("#f-company").value.trim(), msg = $("#f-msg").value.trim();
  $("#f-err").hidden = !!name;
  if (!name) { $("#f-name").focus(); return; }
  const subject = `Pedido Weld: ${data.need || "conversa"}${company ? " para " + company : ""}`;
  const lines = [
    "Olá João,", "",
    `Sou ${name}${company ? ", da " + company : ""}.`,
    `Somos: ${data.who || "não indicado"}.`,
    `Precisamos de: ${data.need || "ainda não sei"}.`,
    msg ? `\n${msg}` : "", "",
    "Podemos marcar uma conversa de 20 minutos?",
  ];
  location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
});

/* copiar o email */
const copyBtn = $("#copy-email"), copyLabel = $("#copy-label");
copyBtn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(copyBtn.dataset.email); copyLabel.textContent = "Email copiado"; }
  catch { location.href = "mailto:" + copyBtn.dataset.email; }
  setTimeout(() => { copyLabel.textContent = copyBtn.dataset.email; }, 1800);
});
