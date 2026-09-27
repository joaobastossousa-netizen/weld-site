// Liga o site ao painel da Weld (painel.weldstudio.pt): conta visitas e guarda os pedidos.
// Sem cookies e sem IP: cada visita é um separador (sessionStorage). A chave abaixo é pública por natureza.
// As visitas da equipa não contam depois de abrirem weldstudio.pt/?weld_ignore=1 nesse aparelho.
const API = "https://hinivkuwyvifvovaeopq.supabase.co/rest/v1/rpc/";
const KEY = "sb_publishable_LJNF6xIZkTQ7m84C9fyRwg_WtaGs0LQ";
const HEAD = { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${KEY}` };

const ignored = (() => {
  try {
    const p = new URLSearchParams(location.search);
    if (p.has("weld_ignore")) localStorage.setItem("weld_ignore", p.get("weld_ignore") === "0" ? "" : "1");
    return localStorage.getItem("weld_ignore") === "1";
  } catch { return false; }
})();
const bot = navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|linkedinbot/i.test(navigator.userAgent);
const local = /^(localhost|127\.|192\.168\.)/.test(location.hostname);

let session = null, isNew = false;
try {
  session = sessionStorage.getItem("weld_s");
  if (!session) { session = crypto.randomUUID(); sessionStorage.setItem("weld_s", session); isNew = true; }
} catch { /* sem armazenamento: conta na mesma, sem sessão */ }

const utm = (() => {
  const q = new URLSearchParams(location.search);
  const u = { source: q.get("utm_source"), medium: q.get("utm_medium"), campaign: q.get("utm_campaign") };
  try {
    if (u.source) sessionStorage.setItem("weld_utm", JSON.stringify(u));
    else return JSON.parse(sessionStorage.getItem("weld_utm") || "{}");
  } catch { /* */ }
  return u;
})();
const refHost = (() => { try { const h = document.referrer ? new URL(document.referrer).host : ""; return h === location.host ? "" : h; } catch { return ""; } })();

const post = (fn, body) => fetch(API + fn, { method: "POST", headers: HEAD, body: JSON.stringify(body), keepalive: true });
const send = (p) => { if (ignored || bot || local) return; post("weld_track", { p: { ...p, s: session, path: location.pathname } }).catch(() => {}); };

/** Evento do site (começou um pedido, clicou num botão…). */
export function track(kind, label = "") { send({ t: "ev", k: kind, l: String(label).slice(0, 120) }); }

/** Guarda um pedido no painel. Devolve true se ficou guardado. */
export async function submitLead(lead) {
  try {
    const r = await post("weld_submit_lead", { p: { ...lead, session, page: location.pathname, referrer: refHost || null, utm: utm.source ? utm : null } });
    if (!r.ok) return false;
    track("form_submit", lead.source);
    return true;
  } catch { return false; }
}

// visita
send({
  t: "pv", title: document.title.slice(0, 200), ref: refHost,
  us: utm.source || "", um: utm.medium || "", uc: utm.campaign || "",
  d: innerWidth < 700 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop",
  lang: navigator.language, tz: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ""; } })(),
  w: String(screen.width || ""), new: isNew ? "true" : "false",
});

// cliques nos botões que levam a pedir
document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a[href]");
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (/\/(contacto|pedido)/.test(href)) track("cta", (a.textContent || "").trim().slice(0, 60) || href);
  else if (/wa\.me|whatsapp|^tel:|^mailto:/.test(href)) track("contact_click", href.split(":")[0].replace(/^https?/, "whatsapp"));
}, { capture: true });
