// Laboratório da página inicial: três demos interativas (fatura para o Excel, site antes/depois com reservas, painel de encomendas).
import { gsap } from "gsap";
import { REDUCED, FINE } from "./shell.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));
const eur = n => n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" }) + " €";
const D = REDUCED ? 0 : 1;

const root = $(".lab5");
if (root) {
  const visible = new Set();
  const onShow = {};

  /* ---------- separadores ---------- */
  const tabs = $$(".lab-tab", root), panes = $$(".lab-pane", root), hint = $(".lab-hint span", root);
  const show = key => {
    tabs.forEach(t => { const on = t.dataset.tab === key; t.classList.toggle("on", on); t.setAttribute("aria-selected", String(on)); if (on) hint.textContent = t.dataset.hint; });
    panes.forEach(p => {
      const on = p.dataset.pane === key;
      p.hidden = !on; p.classList.toggle("on", on);
      if (on) { gsap.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 * D, ease: "expo.out" }); onShow[key]?.(); }
    });
  };
  tabs.forEach(t => t.addEventListener("click", () => show(t.dataset.tab)));
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { visible.add("lab"); onShow[$(".lab-tab.on", root).dataset.tab]?.(); } else visible.delete("lab"); }, { threshold: 0.3 }).observe($(".lab", root));

  /* ---------- arrastar com o rato (no toque usa-se o clique) ---------- */
  function draggable(el, { onDrop, zones }) {
    let start = null, ghost = null, over = null;
    el.addEventListener("pointerdown", e => {
      if (e.pointerType === "touch" || e.button !== 0 || e.target.closest("button:not(.inv)") && e.target.closest("button") !== el) return;
      e.preventDefault(); // sem selecionar texto ao arrastar
      start = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", e => {
      if (!start) return;
      if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6) return;
      if (!ghost) {
        const r = el.getBoundingClientRect();
        ghost = el.cloneNode(true);
        ghost.classList.add("lab-ghost");
        Object.assign(ghost.style, { width: r.width + "px", left: r.left + "px", top: r.top + "px" });
        ghost.dataset.ox = start.x - r.left; ghost.dataset.oy = start.y - r.top;
        document.body.appendChild(ghost);
        el.classList.add("lifted");
        gsap.to(ghost, { rotate: -3, scale: 1.04, duration: 0.25 });
      }
      ghost.style.left = e.clientX - ghost.dataset.ox + "px";
      ghost.style.top = e.clientY - ghost.dataset.oy + "px";
      const hit = zones().find(z => { const r = z.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
      if (hit !== over) { over?.classList.remove("over"); hit?.classList.add("over"); over = hit; }
    });
    const end = () => {
      if (!start) return;
      start = null;
      if (!ghost) return;
      el.dataset.dragged = "1";
      setTimeout(() => delete el.dataset.dragged, 50);
      el.classList.remove("lifted");
      const g = ghost; ghost = null;
      over?.classList.remove("over");
      if (over) { g.remove(); onDrop(over); }
      else { const r = el.getBoundingClientRect(); gsap.to(g, { left: r.left, top: r.top, rotate: 0, scale: 1, duration: 0.4, ease: "power3.out", onComplete: () => g.remove() }); }
      over = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  /* =========================================================
     01 · FATURA PARA O EXCEL
     ========================================================= */
  const fat = $(".fat", root);
  if (fat) {
    const INV = JSON.parse(fat.dataset.inv);
    const read = $(".fat-read", fat), state = $(".fr-state", fat), doc = $(".doc", fat), paper = $(".doc-paper", fat), scan = $(".doc-scan", fat);
    const sheet = $(".fat-sheet", fat), anchor = $(".srow-new", fat), sumEl = $(".sheet-sum", fat), timeEl = $(".ft-s", fat);
    const approve = $(".approve", fat), reset = $(".fat-reset", fat);
    const BASE = +sumEl.dataset.base;
    let busy = false, sum = BASE, timer = 0;
    const fields = Object.fromEntries($$(".fields li", fat).map(li => [li.dataset.f, li]));

    function render(v) {
      $(".doc-logo", paper).textContent = v.short;
      $(".doc-logo", paper).style.background = v.color;
      $(".d-sup", paper).textContent = v.supplier;
      $(".d-nif", paper).textContent = "NIF " + v.nif;
      $(".d-doc", paper).textContent = v.doc;
      $(".d-date", paper).textContent = v.date;
      $(".doc-lines", paper).innerHTML = v.lines.map(([a, b]) => `<p><span>${a}</span><b>${b} €</b></p>`).join("");
      $(".d-base", paper).textContent = eur(v.base);
      $(".d-vat", paper).textContent = v.vat + "%";
      $(".d-total", paper).textContent = eur(v.total);
    }
    const setSum = to => { const o = { v: sum }; sum = to; gsap.to(o, { v: to, duration: 0.9 * D, ease: "power2.out", onUpdate: () => (sumEl.textContent = eur(o.v)) }); };
    const tick = t0 => { const run = () => { timeEl.textContent = ((performance.now() - t0) / 1000).toFixed(1).replace(".", ",") + " s"; timer = requestAnimationFrame(run); }; run(); };

    async function process(id) {
      const btn = $(`.inv[data-id="${id}"]`, fat);
      if (busy || btn.classList.contains("used")) return;
      busy = true; fat.classList.add("busy"); btn.classList.add("used");
      const v = INV.find(x => x.id === id);
      const t0 = performance.now(); tick(t0);
      Object.values(fields).forEach(li => { li.classList.remove("got"); $("b", li).textContent = "·"; });
      render(v);
      doc.classList.add("has");
      read.classList.add("working");
      state.textContent = "A Weld está a ler a fatura";
      gsap.fromTo(paper, { y: 40, opacity: 0, rotate: -4 }, { y: 0, opacity: 1, rotate: 0, duration: 0.7 * D, ease: "expo.out" });
      await wait(550);
      gsap.fromTo(scan, { top: "0%", opacity: 1 }, { top: "100%", duration: 1.3 * D, ease: "power1.inOut", onComplete: () => gsap.set(scan, { opacity: 0 }) });
      const order = [["sup", v.supplier, ".d-sup"], ["date", v.date, ".d-date"], ["cat", v.category, ".doc-lines"], ["total", eur(v.total), ".d-total-w"]];
      for (const [k, val, sel] of order) {
        await wait(300);
        fields[k].classList.add("got"); $("b", fields[k]).textContent = val;
        const hl = $(sel, paper); hl.classList.add("hl"); setTimeout(() => hl.classList.remove("hl"), 900);
      }
      await wait(350);
      state.textContent = "A lançar na folha";
      const over = v.total > 500;
      const row = document.createElement("div");
      row.className = "srow srow-in";
      const cells = [v.date.slice(0, 5), v.supplier, v.category, v.vat + "%", eur(v.total), over ? "Por aprovar" : "Lançada"];
      row.innerHTML = cells.map((c, k) => `<span class="${k === 5 ? "st " + (over ? "st-wait" : "st-ok") : ""}"><i>${c}</i></span>`).join("");
      anchor.before(row);
      gsap.from(row, { height: 0, opacity: 0, duration: 0.45 * D, ease: "power3.out" });
      for (const [k, cell] of $$("span", row).entries()) { await wait(110); cell.classList.add("in"); if (k === 4) setSum(sum + v.total); }
      cancelAnimationFrame(timer);
      timeEl.textContent = ((performance.now() - t0) / 1000).toFixed(1).replace(".", ",") + " s";
      read.classList.remove("working");
      state.textContent = `Feito em ${timeEl.textContent}`;
      if (over) {
        $(".ap-txt", approve).textContent = `Fatura de ${eur(v.total)} da ${v.supplier}. Acima de 500 € pedes para aprovar.`;
        approve.classList.add("on");
        const yes = await new Promise(res => { $(".ap-yes", approve).onclick = () => res(true); $(".ap-no", approve).onclick = () => res(false); });
        approve.classList.remove("on");
        const st = $(".st", row);
        st.className = "st in " + (yes ? "st-ok" : "st-no");
        $("i", st).textContent = yes ? "Aprovada" : "Recusada";
        if (!yes) setSum(sum - v.total);
        state.textContent = yes ? "Aprovada. Fica registado quem aprovou." : "Recusada. O fornecedor é avisado.";
      }
      busy = false; fat.classList.remove("busy");
      if ($$(".inv", fat).every(b => b.classList.contains("used"))) reset.classList.add("on");
    }
    $$(".inv", fat).forEach(b => {
      b.addEventListener("click", () => { if (!b.dataset.dragged) process(b.dataset.id); });
      if (FINE) draggable(b, { zones: () => [read, sheet], onDrop: () => process(b.dataset.id) });
    });
    reset.addEventListener("click", () => {
      $$(".srow-in", fat).forEach(r => r.remove());
      $$(".inv", fat).forEach(b => b.classList.remove("used"));
      Object.values(fields).forEach(li => { li.classList.remove("got"); $("b", li).textContent = "·"; });
      doc.classList.remove("has"); reset.classList.remove("on");
      sum = BASE; sumEl.textContent = eur(BASE); timeEl.textContent = "0,0 s";
      state.textContent = "À espera de uma fatura";
    });
  }

  /* =========================================================
     02 · SITE ANTES E DEPOIS, COM RESERVAS
     ========================================================= */
  const ba = $(".ba", root);
  if (ba) {
    const view = $(".ba-view", ba), handle = $(".ba-handle", ba);
    let pos = 50, hinted = false;
    const set = p => { pos = Math.min(96, Math.max(4, p)); view.style.setProperty("--pos", pos + "%"); handle.setAttribute("aria-valuenow", Math.round(pos)); };
    handle.addEventListener("pointerdown", e => {
      handle.setPointerCapture(e.pointerId);
      view.classList.add("dragging");
      const r = view.getBoundingClientRect();
      const move = ev => set(((ev.clientX - r.left) / r.width) * 100);
      const up = () => { view.classList.remove("dragging"); handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", up);
    });
    handle.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { set(pos - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { set(pos + 5); e.preventDefault(); }
    });
    // ao aparecer pela primeira vez, a barra mexe-se sozinha para mostrar que se arrasta
    onShow.site = () => {
      if (hinted || REDUCED || !visible.has("lab")) return;
      hinted = true;
      const o = { p: 50 };
      gsap.timeline({ delay: 0.5 })
        .to(o, { p: 26, duration: 0.9, ease: "power2.inOut", onUpdate: () => set(o.p) })
        .to(o, { p: 72, duration: 1.2, ease: "power2.inOut", onUpdate: () => set(o.p) })
        .to(o, { p: 50, duration: 0.8, ease: "power2.inOut", onUpdate: () => set(o.p) });
    };

    const form = $(".book", ba), sumEl = $(".book-sum", ba), list = $(".bp-list", ba);
    const pick = k => $(`.book-row[data-k="${k}"] button.on`, form).dataset.v;
    const label = () => `${pick("people")} pessoas · ${pick("day")} · ${pick("time")}`;
    $$(".book-row", form).forEach(row => row.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b || b.disabled) return;
      $$("button", row).forEach(x => x.classList.toggle("on", x === b));
      sumEl.textContent = label();
    }));
    form.addEventListener("submit", e => {
      e.preventDefault();
      const t = pick("time"), p = pick("people"), d = pick("day");
      $(".book-done-t", form).textContent = label();
      form.classList.add("done");
      const li = document.createElement("li");
      li.className = "bp-new";
      li.innerHTML = `<b>${t}</b><span>Mesa para ${p}<small>${d} · reservado agora</small></span><em>site</em>`;
      const after = $$("li", list).find(x => $("b", x).textContent > t);
      after ? after.before(li) : list.appendChild(li);
      gsap.from(li, { height: 0, opacity: 0, x: 20, duration: 0.6 * D, ease: "expo.out" });
    });
    $(".book-again", form).addEventListener("click", () => form.classList.remove("done"));
  }

  /* =========================================================
     03 · PAINEL DE ENCOMENDAS
     ========================================================= */
  const kan = $(".kan", root);
  if (kan) {
    const ORDER = ["new", "oven", "ready", "done"];
    const MAX = { choc: 3, flour: 12, eggs: 90 };
    const stock = JSON.parse(kan.dataset.stock);
    const incoming = JSON.parse(kan.dataset.incoming);
    const msgs = $(".km-list", kan), alert = $(".ks-alert", kan);
    let paid = 0, alerted = false;
    const fmtStock = (k, v) => (k === "eggs" ? `${Math.round(v)} un.` : `${v.toFixed(1).replace(".", ",")} kg`);
    const drawStock = () => Object.entries(stock).forEach(([k, v]) => {
      const row = $(`.ks[data-s="${k}"]`, kan);
      $("b", row).textContent = fmtStock(k, v);
      $("em", row).style.width = Math.max(2, (v / MAX[k]) * 100) + "%";
      row.classList.toggle("low", k === "choc" ? v < 1 : v < MAX[k] * 0.25);
    });
    const counts = () => {
      $$(".kcol", kan).forEach(c => ($(".kcol-h b", c).textContent = $$(".kcard", c).length));
      $('[data-kpi="all"]', kan).textContent = $$(".kcard", kan).length;
      $('[data-kpi="oven"]', kan).textContent = $$('.kcol-oven .kcard', kan).length;
      $('[data-kpi="ready"]', kan).textContent = $$('.kcol-ready .kcard', kan).length;
    };
    const setPaid = to => { const o = { v: paid }; paid = to; gsap.to(o, { v: to, duration: 0.8 * D, onUpdate: () => ($('[data-kpi="eur"]', kan).textContent = eur(o.v)) }); };
    const now = () => new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" }).format(new Date());

    function message(card) {
      $(".km-empty", msgs)?.remove();
      const first = card.dataset.client.split(" ")[0];
      const li = document.createElement("li");
      li.innerHTML = `<p><b>Para ${card.dataset.client}</b><time>${now()}</time></p><span>Olá ${first}! A sua encomenda #${card.dataset.id} (${card.dataset.item.toLowerCase()}) está pronta para levantar. Até já, Pastelaria Aurora.</span><small><i class="ph-bold ph-checks"></i>Entregue</small>`;
      msgs.prepend(li);
      gsap.from(li, { y: -16, opacity: 0, height: 0, duration: 0.6 * D, ease: "expo.out" });
      $$("li", msgs).slice(3).forEach(x => x.remove());
    }
    function move(card, to) {
      const from = card.closest(".kcol").dataset.col;
      if (from === to) return;
      const r0 = card.getBoundingClientRect();
      $(`.kcol-${to} .kcol-list`, kan).prepend(card);
      const r1 = card.getBoundingClientRect();
      gsap.fromTo(card, { x: r0.left - r1.left, y: r0.top - r1.top }, { x: 0, y: 0, duration: 0.55 * D, ease: "expo.out", clearProps: "transform" });
      card.classList.add("flash"); setTimeout(() => card.classList.remove("flash"), 900);
      const use = JSON.parse(card.dataset.use);
      if (to === "oven" && !card.dataset.baked) {
        card.dataset.baked = "1";
        Object.keys(use).forEach(k => (stock[k] = Math.max(0, stock[k] - use[k])));
        drawStock();
        if (stock.choc < 1 && !alerted) { alerted = true; alert.classList.add("on"); }
      }
      if (to === "ready" && !card.dataset.told) { card.dataset.told = "1"; message(card); }
      if (to === "done" && !card.dataset.paid) { card.dataset.paid = "1"; setPaid(paid + +card.dataset.price); card.classList.add("paid"); }
      counts();
    }
    const advance = card => { const i = ORDER.indexOf(card.closest(".kcol").dataset.col); if (i < ORDER.length - 1) move(card, ORDER[i + 1]); };
    const wire = card => {
      $(".kc-go", card).addEventListener("click", e => { e.stopPropagation(); advance(card); });
      if (FINE) draggable(card, { zones: () => $$(".kcol", kan), onDrop: col => move(card, col.dataset.col) });
    };
    $$(".kcard", kan).forEach(wire);
    // encomendas antigas já estão no forno / prontas: contam no stock e nas mensagens desde o início
    $$(".kcol-oven .kcard, .kcol-ready .kcard", kan).forEach(c => (c.dataset.baked = "1"));
    $$(".kcol-ready .kcard", kan).forEach(c => (c.dataset.told = "1"));
    $$(".kcol-done .kcard", kan).forEach(c => { c.dataset.baked = c.dataset.told = c.dataset.paid = "1"; c.classList.add("paid"); paid += +c.dataset.price; });
    $('[data-kpi="eur"]', kan).textContent = eur(paid);
    drawStock(); counts();

    // novas encomendas a entrar pelo site enquanto se está a ver
    let started = false;
    onShow.kan = () => {
      if (started || !visible.has("lab")) return;
      started = true;
      (function next() {
        if (!incoming.length) return;
        setTimeout(() => {
          if (!$(".lab-pane.on[data-pane=kan]", root) || !visible.has("lab")) return next();
          const o = incoming.shift();
          const c = document.createElement("article");
          c.className = "kcard is-new";
          Object.assign(c.dataset, { id: o.id, use: JSON.stringify(o.use), price: o.price, client: o.client, item: o.item, cursor: "Arrastar" });
          c.innerHTML = `<p class="kc-top"><b>#${o.id}</b><span>${o.when}</span></p><p class="kc-item">${o.item}<small>${o.size}</small></p><p class="kc-foot"><span>${o.client}</span><em>novo · site</em><button type="button" class="kc-go" aria-label="Passar à coluna seguinte"><i class="ph-bold ph-arrow-right"></i></button></p>`;
          $(".kcol-new .kcol-list", kan).prepend(c);
          gsap.from(c, { y: -24, opacity: 0, scale: 0.96, duration: 0.7 * D, ease: "expo.out" });
          wire(c); counts();
          next();
        }, REDUCED ? 0 : 7000);
      })();
    };
  }
}
