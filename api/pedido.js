// Recebe o pedido detalhado (/pedido) e envia-o por email via Resend.
// Variáveis no Vercel: RESEND_API_KEY (obrigatória), PEDIDO_TO e PEDIDO_FROM (opcionais).
// Sem chave responde 503 e o site cai para o email pré-escrito (mailto).
const TO = process.env.PEDIDO_TO || "joaobastossousa@gmail.com";
const FROM = process.env.PEDIDO_FROM || "Weld site <onboarding@resend.dev>";
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) return json({ ok: false, error: "sem-chave" }, 503);
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: "json" }, 400); }
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  // campo escondido: se vier preenchido é um robô, finge que correu bem
  if (str(d.website, 200)) return json({ ok: true });
  const subject = str(d.subject, 200) || "Pedido Weld", text = str(d.text, 12000), name = str(d.name, 120), email = str(d.email, 200), phone = str(d.phone, 40);
  if (!text || !name || (!email && !phone)) return json({ ok: false, error: "incompleto" }, 400);
  const tel = phone.replace(/[^\d+]/g, "");
  const html = `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#0A2119;max-width:640px">
${tel ? `<p style="margin:0 0 16px"><a href="tel:${esc(tel)}" style="background:#0A2119;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">Ligar a ${esc(name)} · ${esc(phone)}</a></p>` : ""}
<pre style="white-space:pre-wrap;font:inherit;margin:0">${esc(text)}</pre></div>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], subject, text, html, ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { reply_to: email } : {}) }),
  });
  if (!r.ok) { console.error("resend", r.status, await r.text()); return json({ ok: false, error: "resend" }, 502); }
  return json({ ok: true });
}
