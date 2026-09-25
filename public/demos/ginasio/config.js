/* Pulso, centro da cidade. Aulas, serviços, os 3 dias grátis e o slogan são os de start-up.pt.
   O horário das aulas é de exemplo. Os preços não são públicos, por isso o assistente não os inventa. */
(() => {
  const Y = "#FF5A36";
  const MARK = `<circle cx="30" cy="30" r="26" fill="${Y}"/><circle cx="30" cy="30" r="15" fill="#111"/><text x="30" y="36.5" text-anchor="middle" fill="${Y}" font-family="Barlow, sans-serif" font-style="italic" font-weight="900" font-size="17">P</text>`;
  const logo = `<svg viewBox="0 0 300 90" role="img" aria-label="Pulso, fitness and health club">
    <g transform="translate(4 12)">${MARK}</g>
    <text x="76" y="54" fill="currentColor" font-family="Barlow, sans-serif" font-style="italic" font-weight="900" font-size="44" letter-spacing="-.5">PULSO</text>
    <text x="78" y="74" fill="currentColor" opacity=".7" font-family="Barlow, sans-serif" font-weight="600" font-size="10.5" letter-spacing="3.2">TREINO &amp; BEM-ESTAR</text></svg>`;
  const mark = `<svg viewBox="0 0 60 60" aria-hidden="true">${MARK}</svg>`;

  const CLASSES = [
    [/boxing|boxe/, "Boxe"], [/danc|dance/, "Dança"], [/mind/, "Mind"], [/pump/, "Pump"],
    [/\bstep\b/, "Step"], [/\bgap\b/, "GAP"], [/running|corrida/, "Running"], [/pilates/, "Pilates"], [/cycling|bicicleta|spinning/, "Cycling"],
  ];
  // horário de exemplo: dia da semana (0 = domingo) -> [hora, aula]
  const SCHEDULE = {
    1: [["09:30", "Pilates"], ["19:00", "Boxe"], ["20:00", "Cycling"]],
    2: [["10:00", "Step"], ["18:00", "GAP"], ["19:00", "Dança"]],
    3: [["09:30", "Pilates"], ["19:00", "Pump"], ["20:00", "Boxe"]],
    4: [["18:30", "Cycling"], ["19:00", "Dança"], ["20:00", "Mind"]],
    5: [["18:00", "GAP"], ["19:00", "Boxe"]],
    6: [["09:30", "Running"], ["11:00", "Cycling"]],
  };
  const readClass = t => { for (const [re, n] of CLASSES) if (re.test(t)) return n; return null; };
  const listClasses = (arr) => arr.map(([h, n]) => `${n} às ${h}`).reduce((a, b, i, all) => i === 0 ? b : i === all.length - 1 ? `${a} e ${b}` : `${a}, ${b}`, "");

  const brain = {
    init: () => ({ trial: false, date: null, cls: null, time: null, sala: false, name: null, greeted: false, awaiting: null }),
    reply(raw, S) {
      const t = H.norm(raw);
      const hi = H.greet(t) && !S.greeted; if (hi) S.greeted = true;
      let Hi = hi ? "Olá! " : "";
      const use = () => { const x = Hi; Hi = ""; return x; };
      const out = [];
      const say = m => { out.push(m); return { text: out.join("\n\n") }; };

      if (/congel|cancel|desist|anular|suspend/.test(t)) return { text: `${use()}Claro, é só tratar com a receção. Já lhes passei o seu pedido e respondem-lhe aqui amanhã.`, handoff: { title: "Pedido para congelar ou cancelar", detail: `"${raw.slice(0, 80)}"` } };
      if (/personal|\bpt\b|treinador/.test(t)) return { text: `${use()}Temos Personal Training, com um plano feito só para si. Passei o seu contacto a um dos nossos PT, que lhe liga para combinar. Entretanto, quer experimentar o ginásio 3 dias grátis?`, handoff: { title: "Interesse em Personal Training", detail: `"${raw.slice(0, 80)}"` } };
      if (/psicolog|nutri/.test(t)) return { text: `${use()}Temos sim. É o que nos distingue: na Pulso treina-se o corpo e a mente, com consultas de psicologia e de nutrição no mesmo espaço. Passei o pedido à equipa para marcar consigo.`, handoff: { title: /nutri/.test(t) ? "Pedido de consulta de nutrição" : "Pedido de consulta de psicologia", detail: `"${raw.slice(0, 80)}"` } };

      const cl = readClass(t), d = H.readDate(t), h = H.readTime(t), p = H.part(t);
      if (cl && !(/quanto|preco|mensalidade|custa|plano|valor/.test(t))) S.cls = cl;
      if (d) S.date = d;
      if (h) S.time = h;
      if (/\bsala\b|maquinas|musculacao|sozinh/.test(t)) S.sala = true;
      const price = /quanto|preco|mensalidade|custa|plano|valor/.test(t);
      const trial = /gratis|experiment|3 dias|tres dias|conhecer|quero|pode ser|marca|comecar|\bsim\b|claro|bora|vamos/.test(t);

      if (S.awaiting === "name" && !cl && !d && !h && raw.trim().length <= 40) S.name = H.name(raw);

      if (/onde|morada|localiza/.test(t)) out.push(`${use()}Estamos no centro da cidade.`);
      if (price) out.push(`${use()}Temos vários planos, conforme quantas vezes quer treinar. Antes de decidir, pode experimentar 3 dias grátis, com acesso às aulas.`);

      // pergunta sobre aulas, sem marcação
      if (!S.trial && !trial && !price && (/aula|horario/.test(t) || cl)) {
        if (d) { const day = SCHEDULE[d.getDay()]; return say(day ? `${use()}${H.cap(H.dayName(d))} há ${listClasses(day)}. Quer experimentar uma, grátis?` : `${use()}Ao domingo não há aulas. Quer ver outro dia?`); }
        if (cl) { const when = Object.entries(SCHEDULE).flatMap(([wd, arr]) => arr.filter(a => a[1] === cl).map(a => `${["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][wd]} às ${a[0]}`)); return say(`${use()}${cl} é ${when.join(", ").replace(/, ([^,]*)$/, " e $1")}. Quer experimentar, grátis?`); }
        return say(`${use()}Temos Boxe, Dança, Mind, Pump, Step, GAP, Running, Pilates e Cycling. Que dia lhe dava jeito?`);
      }
      if (trial || S.awaiting) S.trial = true;
      if (!S.trial) {
        if (out.length) return say("Quer marcar os 3 dias grátis?");
        if (hi) return { text: "Olá! Sou o assistente da Pulso. Posso falar-lhe das aulas, dos planos e marcar os seus 3 dias grátis." };
        if (/obrigad/.test(t)) return { text: "Nós é que agradecemos! Até breve." };
        return { text: "Boa pergunta! Não quero responder mal, por isso passei à receção e respondem-lhe aqui.", handoff: { title: "Pergunta sem resposta automática", detail: `"${raw.slice(0, 80)}"` } };
      }

      if (!S.date) { S.awaiting = "date"; return say(`${use()}Boa! Que dia quer começar?`); }
      const day = SCHEDULE[S.date.getDay()];
      if (!day) { S.date = null; S.awaiting = "date"; return say("Ao domingo estamos fechados. Pode ser outro dia?"); }
      if (S.cls && !day.some(a => a[1] === S.cls)) { const c = S.cls; S.cls = null; out.push(`${use()}${H.cap(H.dayName(S.date))} não há ${c}.`); }
      if (S.cls && !S.time) S.time = day.find(a => a[1] === S.cls)[0];
      if (!S.cls && S.time) { const m = day.find(a => a[0] === S.time); if (m) S.cls = m[1]; else if (!S.sala) S.sala = true; }
      if (!S.cls && !S.sala) {
        S.awaiting = "class";
        const opts = p ? day.filter(a => (p === "am" ? +a[0].slice(0, 2) < 13 : +a[0].slice(0, 2) >= 13)) : day;
        return say(`${use()}Claro! ${H.cap(H.dayName(S.date))}${p === "pm" ? " ao fim do dia" : p === "am" ? " de manhã" : ""} há ${listClasses(opts.length ? opts : day)}. Quer vir a uma aula ou prefere treinar na sala?`);
      }
      if (S.sala && !S.time) { S.awaiting = "time"; return say(`${use()}Perfeito, treino na sala. A que horas pensa vir?`); }
      if (!S.name) { S.awaiting = "name"; return say(`${use()}${S.cls ? "Boa escolha! " : ""}Traga roupa confortável, água e uma toalha. Como se chama?`); }

      const what = S.cls || "Treino na sala";
      const first = S.name.split(" ")[0];
      return {
        text: `Está feito, ${first}! ${H.cap(H.dayName(S.date))} às ${S.time}, ${what}, o primeiro dos seus 3 dias grátis. Na receção já sabem que vem.`,
        card: { label: "3 dias grátis", title: `${what} · ${S.name}`, detail: `${H.cap(H.dayLabel(S.date))} às ${S.time}` },
        row: { when: S.time, sub: H.dayName(S.date), title: `3 dias grátis · ${what}`, meta: S.name, right: "Lead" },
        reset: true,
      };
    },
  };

  window.CLIENT = {
    public: true,
    backHref: "/#demos",
    titles: { home: "Pulso Assistente", demo: "Pulso Demo", como: "Como Funciona", proposta: "Pulso" },
    agencyName: "Weld",
    heroLayout: "kinetic",
    marquee: ["Boxe", "Dança", "Mind", "Pump", "Step", "GAP", "Running", "Pilates", "Cycling"],
    name: "Pulso",
    agency: "a Weld",
    logo, mark,
    hero: {
      lines: ["Cada DM,", "um treino", "<mark>marcado.</mark>"],
      lead: "O assistente da Pulso responde a quem chega pelo Instagram e marca os 3 dias grátis. A qualquer hora.",
      visualDecor: `<div class="sun"></div>`,
    },
    story: [
      { title: "Chega pelo Instagram.", body: "Viu um reel, ficou curioso e perguntou o preço. É o momento em que a maioria dos ginásios demora a responder.", time: "22:08",
        msgs: [["me", "Olá! Vi o vosso vídeo de Boxe. Quanto custa o ginásio?"], ["bot", "Olá! Temos vários planos, conforme quantas vezes quer treinar. Antes de decidir, pode experimentar 3 dias grátis, com acesso às aulas. Quer marcar?"]] },
      { title: "Transforma a dúvida em visita.", body: "Em vez de uma tabela de preços, um convite. Os 3 dias grátis que o site já oferece, marcados na hora.", time: "22:09",
        msgs: [["me", "Quero! Posso começar segunda ao fim do dia?"], ["bot", "Claro! Segunda ao fim do dia há Boxe às 19:00 e Cycling às 20:00. Quer vir a uma aula ou prefere treinar na sala?"]] },
      { title: "Conhece as aulas de cor.", body: "Boxe, Dança, Pilates, Cycling e as restantes, com o horário de cada dia.", time: "22:09",
        msgs: [["me", "Boxe às 19h"], ["bot", "Boa escolha! Traga roupa confortável, água e uma toalha. Como se chama?"]] },
      { title: "Entrega à receção um lead quente.", body: "Nome, dia, hora e aula. Quando o Tiago chega, a equipa já sabe quem ele é.", time: "22:10",
        msgs: [["me", "Tiago Mendes"], ["bot", "Está feito, Tiago! Segunda às 19:00, Boxe, o primeiro dos seus 3 dias grátis. Na receção já sabem que vem."], ["card", { label: "3 dias grátis", title: "Boxe · Tiago Mendes", detail: "Segunda às 19:00" }]] },
    ],
    statement: "Quem vê um reel às 23h quer resposta às 23h.",
    live: { title: "Experimente como quem viu um reel.", lead: "Pergunte pelo preço, pelas aulas ou pelos 3 dias grátis. O lead aparece no painel da receção." },
    chips: ["Que aulas há na quarta?", "Têm personal trainer?", "Fazem consultas de nutrição?", "Quero congelar a inscrição", "Quando há Pilates?"],
    welcome: "Olá! Sou o assistente da Pulso. Posso falar-lhe das aulas, dos planos e marcar os seus 3 dias grátis.",
    example: ["Olá! Vi o vosso vídeo de Boxe. Quanto custa o ginásio?", "Quero! Posso começar segunda ao fim do dia?", "Boxe às 19h", "Tiago Mendes"],
    panel: {
      title: "Leads da receção",
      stats: [{ label: "Mensagens hoje", value: 17 }, { label: "3 dias grátis marcados", value: 5 }, { label: "Vindas do Instagram", value: 11 }],
      rowsLabel: "Experiências marcadas pelo assistente",
      note: "Horário das aulas, leads e números de exemplo. Aulas, serviços e os 3 dias grátis são os da Pulso.",
      seed: () => [
        { when: "18:00", sub: "terça", title: "3 dias grátis · GAP", meta: "Sofia Pinto", right: "Lead" },
        { when: "19:00", sub: "quarta", title: "3 dias grátis · Pump", meta: "Bruno Teixeira", right: "Lead" },
        { when: "09:30", sub: "sábado", title: "3 dias grátis · Running", meta: "Carla Magalhães", right: "Lead" },
      ],
    },
    brain,
    cells: {
      title: "Sabe o que a receção sabe.",
      items: [
        { cls: "w4 tint", title: "As aulas todas, de cor.", body: "Diz que aulas há em cada dia e a que horas, e marca a primeira.",
          html: `<div class="pills">${["Boxe", "Dança", "Mind", "Pump", "Step", "GAP", "Running", "Pilates", "Cycling"].map(c => `<span class="pill">${c}</span>`).join("")}</div>` },
        { cls: "w2", title: "3 dias grátis, na hora.", body: "O convite do site, agora em cada conversa.",
          html: `<div class="bubble-demo"><div class="b bot">Antes de decidir, pode experimentar 3 dias grátis. Quer marcar?</div></div>` },
        { cls: "w2 tint-b", title: "Fitness e mente.", body: "Sabe explicar o que torna a Pulso diferente e passa os pedidos de psicologia e nutrição à equipa." },
        { cls: "w2", title: "Sabe quando parar.", body: "Congelar, cancelar ou reclamar vai sempre para uma pessoa.",
          html: `<div class="alert"><i></i><div><b>Pedido para congelar inscrição</b><span>Passado à receção às 23:02</span></div></div>` },
        { cls: "w2", title: "Segunda ao fim do dia.", body: "Mostra só as aulas do dia pedido.",
          html: `<div class="pills"><span class="pill on">19:00 Boxe</span><span class="pill">20:00 Cycling</span></div>` },
      ],
    },
    closing: "Cada DM,<br>uma visita.",
    como: {
      title: "Do reel à receção.",
      lead: "Quatro passos entre um vídeo no Instagram e uma pessoa a entrar pela porta.",
      flow: [
        ["Vê um reel e escreve", "No Instagram ou no WhatsApp, muitas vezes à noite."],
        ["O assistente responde", "Aulas, horários, planos e o conceito de fitness e mente da Pulso."],
        ["Marca os 3 dias grátis", "Dia, hora e aula, sem esperar pela receção."],
        ["A receção recebe o lead", "Nome, aula e hora no painel, antes de a pessoa chegar."],
      ],
      needsTitle: "O que falta para ligar.",
      needsLead: "A parte difícil já está feita. Faltam três coisas da Pulso.",
      needs: [
        ["ok", "", "Aulas e serviços", "As nove aulas, o Personal Training, a psicologia, a nutrição e os 3 dias grátis, tirados do site."],
        ["todo", "Falta confirmar", "Horário real das aulas", "O horário desta demo é de exemplo. Basta a Pulso partilhar o verdadeiro."],
        ["todo", "Falta decidir", "Planos e preços", "Para o assistente explicar os planos. Se preferirem, continua só a convidar para os 3 dias grátis."],
        ["todo", "Falta ligar", "Instagram e WhatsApp", "As contas da Pulso, ligadas pelas APIs oficiais da Meta."],
      ],
      faq: [
        ["Responde também a comentários?", "Pode responder às DMs e aos comentários que perguntam preços ou horários, sempre no tom da marca."],
        ["E se alguém quiser cancelar?", "Congelar, cancelar e reclamações vão sempre para a receção, sem o assistente tentar resolver."],
        ["Marca psicologia e nutrição?", "Recebe o pedido e passa à equipa, que marca com o profissional certo."],
        ["Fala como a Pulso?", "Sim. O tom de voz é o da marca, definido convosco."],
      ],
      cta: "Veja a funcionar.",
    },
  };
})();
