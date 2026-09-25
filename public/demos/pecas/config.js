/* Pistão Peças. Lojas, telefones e marcas tirados de turbopecas.pt.
   Stock e preços nunca são inventados: o assistente cria o pedido e o balcão confirma. */
(() => {
  const BLUE = "#E8792B", NAVY = "#183457";
  const stripes = (x, y, c) => `<g transform="translate(${x} ${y}) skewX(-20)" fill="${c}"><rect width="34" height="6" rx="1"/><rect y="11" width="26" height="6" rx="1"/><rect y="22" width="18" height="6" rx="1"/></g>`;
  const logo = `<svg viewBox="0 0 300 110" role="img" aria-label="Pistão Peças, peças auto">
    ${stripes(14, 58, BLUE)}
    <text x="150" y="40" fill="${BLUE}" font-family="'Exo 2', sans-serif" font-style="italic" font-weight="800" font-size="30">Pistão</text>
    <text x="58" y="92" fill="currentColor" font-family="'Exo 2', sans-serif" font-style="italic" font-weight="800" font-size="60" letter-spacing="3">PEÇAS</text>
    <text x="206" y="106" fill="currentColor" opacity=".6" font-family="'Exo 2', sans-serif" font-weight="600" font-size="10" letter-spacing=".5">peças auto</text></svg>`;
  const mark = `<svg viewBox="0 0 60 60" aria-hidden="true">${stripes(6, 21, BLUE)}<text x="20" y="42" fill="${NAVY}" font-family="'Exo 2', sans-serif" font-style="italic" font-weight="800" font-size="27">PP</text></svg>`;

  const STORES = { "Norte": { addr: "Rua do Exemplo, 97", tel: "220 000 201" }, "Sul": { addr: "Avenida do Exemplo, 44", tel: "220 000 202" } };
  const PARTS = [
    [/pastilh|calco/, "Pastilhas de travão", "Textar e Bendix", true],
    [/disco/, "Discos de travão", "Textar e Bendix", true],
    [/filtro (de |do )?oleo/, "Filtro de óleo", "Mahle e Purflux"],
    [/filtro (de |do )?ar\b/, "Filtro de ar", "Mahle e Purflux"],
    [/habitaculo|polen/, "Filtro de habitáculo", "Mahle e Purflux"],
    [/filtro (de |do )?(combustivel|gasoleo)/, "Filtro de combustível", "Mahle e Purflux"],
    [/filtro/, "Filtros", "Mahle e Purflux"],
    [/oleo|\b\d{1,2}w\d{2}\b/, "Óleo de motor", "Valvoline, Total, Elf e Gulf"],
    [/bateria/, "Bateria", "Yuasa"],
    [/embraiag|embreag/, "Kit de embraiagem", "Schaeffler"],
    [/amortec/, "Amortecedores", null, true],
    [/correia|distribuicao/, "Kit de distribuição", "Schaeffler"],
    [/escova|limpa.?vidro/, "Escovas limpa-vidros", null],
    [/lampada/, "Lâmpadas", null],
    [/\bvelas?\b/, "Velas", null],
  ];
  const BRANDS = ["ad", "gys", "krof", "schaeffler", "luk", "textar", "yuasa", "mahle", "purflux", "valvoline", "blue print", "febi", "tratauto", "total", "elf", "gulf", "autel", "jbm", "ctr", "bendix", "meat doria"];
  const MAKES = { vw: "VW", volkswagen: "VW", renault: "Renault", peugeot: "Peugeot", citroen: "Citroën", opel: "Opel", ford: "Ford", seat: "Seat", audi: "Audi", bmw: "BMW", mercedes: "Mercedes", fiat: "Fiat", toyota: "Toyota", honda: "Honda", nissan: "Nissan", hyundai: "Hyundai", kia: "Kia", skoda: "Skoda", dacia: "Dacia" };
  const MODELS = { golf: "VW Golf", polo: "VW Polo", passat: "VW Passat", clio: "Renault Clio", megane: "Renault Mégane", captur: "Renault Captur", kangoo: "Renault Kangoo", "208": "Peugeot 208", "308": "Peugeot 308", "2008": "Peugeot 2008", "3008": "Peugeot 3008", partner: "Peugeot Partner", c3: "Citroën C3", c4: "Citroën C4", berlingo: "Citroën Berlingo", corsa: "Opel Corsa", astra: "Opel Astra", focus: "Ford Focus", fiesta: "Ford Fiesta", transit: "Ford Transit", leon: "Seat Leon", ibiza: "Seat Ibiza", a3: "Audi A3", a4: "Audi A4", punto: "Fiat Punto", yaris: "Toyota Yaris", corolla: "Toyota Corolla", auris: "Toyota Auris", civic: "Honda Civic", qashqai: "Nissan Qashqai", micra: "Nissan Micra", i30: "Hyundai i30", sportage: "Kia Sportage", octavia: "Skoda Octavia", sandero: "Dacia Sandero", duster: "Dacia Duster" };
  const readPart = t => { for (const p of PARTS) if (p[0].test(t)) return p; return null; };
  function readCar(t, raw) {
    const car = {};
    const plate = raw.toUpperCase().match(/\b([A-Z]{2}-?\d{2}-?[A-Z]{2}|\d{2}-?[A-Z]{2}-?\d{2}|\d{2}-?\d{2}-?[A-Z]{2}|[A-Z]{2}-?\d{2}-?\d{2})\b/);
    if (plate) car.plate = plate[1];
    for (const k in MODELS) if (new RegExp(`\\b${k}\\b`).test(t)) { car.model = MODELS[k]; const gen = t.match(new RegExp(`\\b${k}\\s+(i{1,3}|iv|v|vi{1,3}|\\d)\\b`)); if (gen && !/^\d{4}$/.test(gen[1])) car.model += " " + gen[1].toUpperCase(); break; }
    if (!car.model) for (const k in MAKES) if (new RegExp(`\\b${k}\\b`).test(t)) { car.make = MAKES[k]; break; }
    const y = t.match(/\b(19[89]\d|20[0-2]\d)\b/); if (y) car.year = y[1];
    const e = t.match(/\b(\d[.,]\d)\s?(tdi|tsi|dci|hdi|bluehdi|cdti|crdi|tdci|jtd|multijet|puretech|tce|gti|d|i)?\b/); if (e) car.engine = (e[1].replace(",", ".") + (e[2] ? " " + (e[2].length <= 1 ? e[2] : e[2].toUpperCase().replace("DCI", "dCi").replace("PURETECH", "PureTech").replace("TCE", "TCe")) : "")).trim();
    return car;
  }
  const carText = c => c.plate ? `matrícula ${c.plate}` : [c.model || c.make, c.engine, c.year ? `de ${c.year}` : ""].filter(Boolean).join(" ");
  const carShort = c => c.plate ? `Matrícula ${c.plate}` : [c.model || c.make, c.engine, c.year].filter(Boolean).join(" ");

  const brain = {
    init: () => ({ part: null, car: {}, pos: null, store: null, when: null, greeted: false, awaiting: null, active: false }),
    reply(raw, S) {
      const t = H.norm(raw);
      const hi = H.greet(t) && !S.greeted; if (hi) S.greeted = true;
      let Hi = hi ? (/boa tarde/.test(t) ? "Boa tarde! " : /bom dia/.test(t) ? "Bom dia! " : /boa noite/.test(t) ? "Boa noite! " : "Olá! ") : "";
      const use = () => { const x = Hi; Hi = ""; return x; };
      const out = [];
      const say = m => { out.push(m); return { text: out.join("\n\n") }; };

      if (/oficina|conta corrente|\bconta\b|fatura|profissional|revenda/.test(t)) return { text: `${use()}Para oficinas temos condições próprias. Passei o seu contacto ao nosso comercial, que lhe liga amanhã de manhã.`, handoff: { title: "Oficina pede condições de cliente profissional", detail: `"${raw.slice(0, 80)}"` } };
      if (/entreg|envi|portes|mandam/.test(t)) return { text: `${use()}Boa pergunta. As entregas são combinadas caso a caso, por isso passei ao balcão e respondem-lhe aqui.`, handoff: { title: "Pergunta sobre entregas", detail: `"${raw.slice(0, 80)}"` } };
      if (/reclama|errad|devolv|troca/.test(t)) return { text: "Lamento. Passei já o seu caso ao responsável da loja, que lhe responde aqui ainda hoje.", handoff: { title: "Devolução ou reclamação", detail: `"${raw.slice(0, 80)}"` } };

      const brand = BRANDS.find(b => new RegExp(`\\b${b}\\b`).test(t));
      const pt = readPart(t), car = readCar(t, raw);
      if (pt) { S.part = pt; S.active = true; }
      Object.assign(S.car, car);
      if (/frente|dianteir/.test(t)) S.pos = "frente";
      if (/\btras\b|traseir/.test(t)) S.pos = "trás";
      if (/norte/.test(t)) S.store = "Norte";
      if (/\bsul\b/.test(t)) S.store = "Sul";
      const d = H.readDate(t), p = H.part(t);
      if (d) S.when = `${H.dayName(d)}${p === "am" ? " de manhã" : p === "pm" ? " à tarde" : ""}`;

      if (brand && !pt && !S.active) return { text: `${use()}Trabalhamos sim com ${brand === "total" ? "Total" : brand.replace(/\b\w/g, c => c.toUpperCase())}. Diga-me que peça procura e para que carro, e deixo o pedido feito ao balcão.` };
      if (/onde|morada|localiza/.test(t)) out.push(`${use()}Temos duas lojas: Norte, na ${STORES["Norte"].addr}, e Sul, na ${STORES["Sul"].addr}.`);
      if (/horario|abrem|fecham|aberto/.test(t)) out.push(`${use()}Estamos abertos de segunda a sábado. Pode deixar aqui o pedido a qualquer hora.`);
      if (/quanto|preco|custa|valor/.test(t)) out.push(`${use()}O preço depende da marca e da referência exata. Assim que eu tiver os dados do carro, o balcão confirma preço e disponibilidade por aqui.`);

      if (!S.active) {
        if (out.length) return say("Que peça procura?");
        if (hi) return { text: "Olá! Sou o assistente da Pistão Peças. Diga-me que peça procura e para que carro, e deixo o pedido feito ao balcão." };
        if (/obrigad/.test(t)) return { text: "Nós é que agradecemos! Boa viagem." };
        return { text: "Não quero dar-lhe uma informação errada, por isso passei ao balcão e respondem-lhe aqui em breve.", handoff: { title: "Pergunta sem resposta automática", detail: `"${raw.slice(0, 80)}"` } };
      }

      if (brand && pt) out.push(`${use()}Trabalhamos sim com ${brand === "total" ? "Total" : brand.replace(/\b\w/g, x => x.toUpperCase())}.`);
      const c = S.car, hasCar = c.plate || ((c.model || c.make) && c.year);
      if (!hasCar) {
        S.awaiting = "car";
        const intro = pt && pt[2] ? `${use()}Trabalhamos com ${pt[1].toLowerCase()} ${pt[2]}. ` : use();
        if (c.model || c.make) return say(`${intro}Para garantir que é a peça certa, diga-me o ano e o motor do ${c.model || c.make}, ou a matrícula.`);
        return say(`${intro}Para que carro é? Diga-me a marca, o modelo e o ano, ou só a matrícula.`);
      }
      if (S.part[3] && !S.pos) { S.awaiting = "pos"; return say(`${use()}É para a frente ou para trás?`); }
      const desc = `${S.part[1].toLowerCase()}${S.pos ? " da " + S.pos : ""} para ${carText(c)}`;
      if (!S.store) { S.awaiting = "store"; return say(`${use()}Perfeito: ${desc}. Levanta na loja Norte ou na loja Sul?`); }

      const extra = /pastilh/.test(S.part[1].toLowerCase()) ? " Quer que junte também os discos?" : "";
      const res = {
        text: `Combinado. Passei o pedido ao balcão ${S.store === "Norte" ? "da loja Norte" : "da loja Sul"}, que confirma o preço e a disponibilidade por aqui.${extra}`,
        card: { label: "Pedido para o balcão", title: `${S.part[1]} · ${S.store}`, detail: `${carShort(c)}${S.pos ? ", " + S.pos : ""}. ${S.when ? "Levantar " + S.when + "." : "Levantar quando der jeito."}` },
        row: { when: S.store, sub: now(), title: S.part[1] + (S.pos ? " (" + S.pos + ")" : ""), meta: carShort(c), right: "Novo" },
        reset: true,
      };
      return res;
    },
  };

  window.CLIENT = {
    public: true,
    backHref: "/#demos",
    titles: { home: "Pistão Peças Assistente", demo: "Pistão Peças Demo", como: "Como Funciona", proposta: "Pistão Peças" },
    agencyName: "Weld",
    heroLayout: "center",
    marquee: ["Textar", "Bendix", "Mahle", "Purflux", "Yuasa", "Schaeffler", "Valvoline", "Total", "Elf", "Gulf", "Febi", "Blue Print"],
    name: "Pistão Peças",
    agency: "a Weld",
    logo, mark,
    hero: {
      title: "O balcão da Pistão Peças,<br>aberto no WhatsApp.",
      lead: "Recebe pedidos de peças a qualquer hora, pergunta o que falta e entrega-os ao balcão já preenchidos.",
      decor: [[18, 260, 2.8, 0], [34, 180, 3.6, 1.2], [52, 320, 2.4, .6], [68, 140, 4.2, 2], [82, 240, 3.1, 1.6]].map(([top, w, d, delay]) => `<span class="streak" style="top:${top}%;--w:${w}px;--d:${d}s;--delay:${delay}s"></span>`).join(""),
    },
    story: [
      { title: "Pergunta pela peça.", body: "Sabe as marcas com que a loja trabalha e pede logo o que é preciso para acertar à primeira.", time: "19:42",
        msgs: [["me", "Boa tarde, têm pastilhas de travão para um Golf VII?"], ["bot", "Boa tarde! Trabalhamos com pastilhas Textar e Bendix. Para garantir que são as certas, diga-me o ano e o motor, ou a matrícula."]] },
      { title: "Pede os dados certos.", body: "Ano, motor, matrícula, frente ou trás. Sem isto a peça volta para trás. Com isto chega certa.", time: "19:43",
        msgs: [["me", "2016, 1.6 TDI. São as da frente."], ["bot", "Perfeito: pastilhas de travão da frente para VW Golf VII 1.6 TDI de 2016. Levanta na loja Norte ou na loja Sul?"]] },
      { title: "Passa ao balcão, já preenchido.", body: "O pedido fica completo e à espera da equipa, mesmo que a mensagem chegue com a loja fechada.", time: "19:43",
        msgs: [["me", "Loja Norte, amanhã de manhã."], ["bot", "Combinado. Passei o pedido ao balcão da loja Norte, que confirma o preço e a disponibilidade por aqui. Quer que junte também os discos?"], ["card", { label: "Pedido para o balcão", title: "Pastilhas de travão · Norte", detail: "VW Golf VII 1.6 TDI 2016, frente. Levantar amanhã de manhã." }]] },
      { title: "O balcão só confirma.", body: "De manhã a equipa confirma stock e preço com uma mensagem. O cliente é avisado na mesma conversa.", time: "08:31",
        msgs: [["bot", "Bom dia! Daqui é o balcão da loja Norte. Temos as pastilhas Textar em stock e já ficaram reservadas em seu nome. Até já!"]] },
    ],
    statement: "A oficina precisa da peça às 19h40. Às 8h30 o pedido já está no balcão, completo.",
    live: { title: "Peça uma peça.", lead: "Escreva como um cliente ou uma oficina. O pedido aparece no painel do balcão." },
    chips: ["Têm bateria para um Clio de 2015?", "Trabalham com óleo Valvoline?", "Filtro de óleo para a matrícula 45-AB-12", "Sou de uma oficina, fazem conta?", "Fazem entregas?"],
    welcome: "Olá! Sou o assistente da Pistão Peças. Diga-me que peça procura e para que carro, e deixo o pedido feito ao balcão.",
    example: ["Boa tarde, têm pastilhas de travão para um Golf VII?", "2016, 1.6 TDI. São as da frente.", "Loja Norte, amanhã de manhã."],
    panel: {
      title: "Pedidos para o balcão",
      stats: [{ label: "Conversas hoje", value: 14 }, { label: "Pedidos criados", value: 6 }, { label: "Chegaram fora de horas", value: 3 }],
      rowsLabel: "Pedidos criados pelo assistente",
      note: "Pedidos e números de exemplo. Lojas, telefones e marcas são os da Pistão Peças.",
      seed: () => [
        { when: "Norte", sub: "09:12", title: "Kit de embraiagem", meta: "Renault Mégane 1.5 dCi 2012", right: "Confirmado" },
        { when: "Sul", sub: "10:40", title: "Bateria", meta: "Peugeot 208 1.2 PureTech 2018", right: "Confirmado" },
        { when: "Norte", sub: "11:05", title: "Filtro de óleo", meta: "Seat Leon 1.6 TDI 2015", right: "Novo" },
      ],
    },
    brain,
    cells: {
      title: "Sabe o que o balcão sabe.",
      items: [
        { cls: "w4 tint", title: "As marcas da casa, de cor.", body: "Responde logo se a loja trabalha com a marca que o cliente pediu.",
          html: `<div class="pills">${["Textar", "Bendix", "Mahle", "Purflux", "Yuasa", "Schaeffler", "Valvoline", "Total", "Elf", "Gulf", "Febi", "Blue Print"].map(b => `<span class="pill">${b}</span>`).join("")}</div>` },
        { cls: "w2", title: "Duas lojas.",
          html: `<div class="kv"><div><span>Norte</span><b>220 000 201</b></div><div><span>Sul</span><b>220 000 202</b></div></div>` },
        { cls: "w2 tint-b", title: "Pergunta o que falta.", body: "O pedido chega completo, à primeira.",
          html: `<div class="bubble-demo"><div class="b bot">Para garantir que é a peça certa, diga-me o ano e o motor, ou a matrícula.</div></div>` },
        { cls: "w2", title: "Sabe quando parar.", body: "Contas de oficina, entregas e devoluções vão para uma pessoa.",
          html: `<div class="alert"><i></i><div><b>Oficina pede conta corrente</b><span>Passado ao comercial às 20:15</span></div></div>` },
        { cls: "w2", title: "Nunca inventa stock.", body: "Preço e disponibilidade são sempre confirmados pelo balcão.",
          html: `<div class="pills"><span class="pill">Novo</span><span class="pill on">Confirmado</span></div>` },
      ],
    },
    closing: "O balcão aberto<br>a noite toda.",
    como: {
      title: "Por trás do pedido.",
      lead: "Quatro passos entre a mensagem do cliente e a peça separada no balcão.",
      flow: [
        ["O cliente escreve", "No WhatsApp, no Instagram ou no site, a qualquer hora. Particulares e oficinas."],
        ["O assistente pergunta", "Peça, carro, ano e motor, ou só a matrícula. Até o pedido estar completo."],
        ["Cria o pedido", "Chega ao balcão da loja certa, Norte ou Sul, já preenchido."],
        ["O balcão confirma", "Stock e preço confirmados pela equipa, na mesma conversa com o cliente."],
      ],
      needsTitle: "O que falta para ligar.",
      needsLead: "A parte difícil já está feita. Faltam três coisas da Pistão Peças.",
      needs: [
        ["ok", "", "Lojas e marcas", "As duas lojas, os telefones e as marcas com que trabalham, tirados do site."],
        ["todo", "Falta confirmar", "Horários das lojas", "Para o assistente dizer quando o balcão confirma o pedido."],
        ["todo", "Falta combinar", "Quem responde no balcão", "Uma pessoa ou um número em cada loja para receber e confirmar os pedidos."],
        ["todo", "Falta ligar", "WhatsApp Business", "O número da Pistão Peças, ligado pela API oficial da Meta."],
      ],
      faq: [
        ["O assistente vê o stock?", "Nesta versão não. Cria o pedido e o balcão confirma. Mais tarde pode ligar ao sistema de stock, se fizer sentido."],
        ["Funciona para oficinas?", "Sim. Os pedidos de oficinas passam ao comercial, com as condições de cliente profissional."],
        ["E se o cliente só souber a matrícula?", "Chega. O balcão identifica a viatura pela matrícula e confirma a peça certa."],
        ["Dá para mudar marcas ou lojas depois?", "Dá. É uma alteração de minutos e o assistente usa logo a informação nova."],
      ],
      cta: "Veja a funcionar.",
    },
  };
})();
