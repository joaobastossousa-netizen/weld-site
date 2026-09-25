// Interações e movimento do site da Weld. Sem bibliotecas.
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));

/* nav ganha linha por baixo quando se sai do topo */
const nav = $("#nav");
const topSentinel = document.createElement("div");
topSentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px";
document.body.prepend(topSentinel);
new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting)).observe(topSentinel);

/* secções entram ao fazer scroll */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
}), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
$$(".reveal").forEach(el => REDUCED ? el.classList.add("in") : revealIO.observe(el));

/* linha do processo */
const steps = $("#steps");
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { steps.classList.add("go"); o.disconnect(); } }, { threshold: 0.4 }).observe(steps);

/* conversa do topo: passa pelos exemplos sozinha */
const demos = window.WELD_DEMOS || [];
const body = $("#chat-body"), nameEl = $("#chat-name"), tabs = $$(".chat-tab");
let current = 0, token = 0, visible = true;
function bubble(text, cls) {
  const el = document.createElement("div");
  el.className = "b " + cls; el.textContent = text;
  body.appendChild(el);
  return el;
}
async function play(i) {
  const my = ++token;
  current = i;
  tabs.forEach((t, k) => t.classList.toggle("on", k === i));
  nameEl.style.opacity = 0; await wait(200); nameEl.textContent = demos[i].sector; nameEl.style.opacity = 1;
  body.innerHTML = "";
  await wait(450); if (my !== token) return;
  bubble(demos[i].me, "me");
  await wait(650); if (my !== token) return;
  const ty = document.createElement("div"); ty.className = "typing"; ty.innerHTML = "<i></i><i></i><i></i>"; body.appendChild(ty);
  await wait(1100); ty.remove(); if (my !== token) return;
  bubble(demos[i].bot, "bot");
  await wait(700); if (my !== token) return;
  bubble("✓ " + demos[i].chip, "result");
  await wait(3600); if (my !== token) return;
  while (!visible) { await wait(400); if (my !== token) return; }
  play((i + 1) % demos.length);
}
tabs.forEach((t, k) => t.addEventListener("click", () => play(k)));
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe($(".hero-panel"));
if (demos.length) setTimeout(() => play(0), REDUCED ? 0 : 900);

/* escolher entre agência e negócio */
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
