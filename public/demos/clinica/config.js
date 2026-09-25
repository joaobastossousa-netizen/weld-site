/* Oriva Dental. Tratamentos, moradas e telefones tirados de smileclinic.pt.
   Horários e vagas são de exemplo. A clínica não publica preços, por isso o assistente não os dá. */
(() => {
  const NAVY = "#0F2E3D", ORANGE = "#1FB5A8";
  const MARK_PATHS = `
    <rect x="12" y="10" width="64" height="80" rx="22" fill="${NAVY}"/>
    <path d="M30 42 C30 34,37 33,44 37 C51 33,58 34,58 42 C58 49,56 54,55 63 C54 70,50 70,49 63 L44 55 L39 63 C38 70,34 70,33 63 C32 54,30 49,30 42 Z" stroke="${ORANGE}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  const _unused = `
    <ellipse cx="44" cy="50" rx="23" ry="39" transform="rotate(-16 44 50)" fill="${NAVY}"/>
    <path d="M27 13 C 8 31, 7 70, 33 90" stroke="${ORANGE}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M35 40 C35 33,41 32,45.5 35.5 C50 32,56 33,56 40 C56 46,54 50,53 58 C52 65,48.5 65,47.5 58 L45.5 51.5 L43.5 58 C42.5 65,39 65,38 58 C37 50,35 46,35 40 Z" stroke="#fff" stroke-width="2.2" fill="none" stroke-linejoin="round"/>`;
  const logo = `<svg viewBox="0 0 300 100" role="img" aria-label="Oriva Dental">${MARK_PATHS}
    <text x="80" y="57" font-family="Poppins, sans-serif" font-weight="500" font-size="31" fill="${ORANGE}" letter-spacing="-.5">oriva dental</text>
    <text x="82" y="77" font-family="Poppins, sans-serif" font-weight="500" font-size="8.6" fill="#6E6E73" letter-spacing="1.6">CLÍNICA DE MEDICINA DENTÁRIA</text></svg>`;
  const mark = `<svg viewBox="12 6 66 90" aria-hidden="true">${MARK_PATHS}</svg>`;

  const CLINICS = {
    "Centro": { addr: "Rua do Exemplo, 12", tel: "220 000 101", slots: ["09:30", "11:00", "15:00", "17:30", "18:30"] },
    "Praia": { addr: "Avenida da Praia, 40", tel: "220 000 102", slots: ["10:00", "14:30", "16:00"] },
  };
  const TREAT = [
    [/implant/, "Implantologia"],
    [/ortodon|aparelho|alinhador|invisiv|orthocaps/, "Ortodontia"],
    [/branque|dentes (mais )?brancos|clarear/, "Branqueamento"],
    [/faceta/, "Facetas cerâmicas"],
    [/botox|toxina/, "Toxina botulínica"],
    [/hialuron|preenchimento|labio/, "Ácido hialurónico"],
    [/bichectom/, "Bichectomia"],
    [/desvitaliz|endodon|\bcanal\b/, "Endodontia"],
    [/gengiva|periodont/, "Periodontologia"],
    [/protese|dentadura/, "Prótese dentária"],
    [/smile design|\bdsd\b/, "Digital Smile Design"],
    [/carie|restaura|obtura/, "Dentisteria"],
    [/consulta|avaliacao|check|revisao|limpeza/, "Consulta de avaliação"],
  ];
  const readTreat = t => { for (const [re, n] of TREAT) if (re.test(t)) return n; return null; };
  const readClinic = t => /centro|baixa/.test(t) ? "Centro" : /praia|foz/.test(t) ? "Praia" : null;
  const slotsFor = (clinic, d) => {
    const wd = d.getDay();
    if (wd === 0 || wd === 6) return [];
    const seed = d.getDate() + d.getMonth() * 31;
    return CLINICS[clinic].slots.filter((x, i) => i !== seed % 2);
  };

  const brain = {
    init: () => ({ booking: false, treat: null, clinic: null, date: null, time: null, name: null, first: false, awaiting: null, greeted: false }),
    reply(raw, S) {
      const t = H.norm(raw);
      const hi = H.greet(t) && !S.greeted; if (hi) S.greeted = true;
      let Hi = hi ? "Olá! " : "";
      const use = () => { const x = Hi; Hi = ""; return x; };
      const out = [];
      const say = m => { out.push(m); return { text: out.join("\n\n") }; };

      if (/\bdor\b|doi|inchad|abcesso|urgen|parti|sangr/.test(t)) {
        return { text: "Lamento muito. Para dor ou urgência o melhor é falar já com a clínica: Centro 220 000 101 ou Praia 220 000 102. Também deixei aviso à receção para lhe ligarem assim que possível.", handoff: { title: "Possível urgência", detail: `"${raw.slice(0, 80)}"` } };
      }
      if (/seguro|acordo|medis|multicare|advancecare|adse/.test(t)) {
        return { text: "Vou confirmar com a receção se temos acordo com o seu seguro e respondem-lhe aqui ainda hoje. Entretanto, quer que veja uma data para a consulta?", handoff: { title: "Pergunta sobre seguro ou acordo", detail: `"${raw.slice(0, 80)}"` } };
      }

      const tr = readTreat(t), cl = readClinic(t), d = H.readDate(t), h = H.readTime(t), p = H.part(t);
      if (tr) S.treat = tr;
      if (cl) S.clinic = cl;
      if (d) S.date = d;
      if (h) S.time = h;
      if (/primeira (vez|consulta)|nunca (fui|vim)|novo paciente/.test(t)) S.first = true;
      const asksPrice = /quanto|preco|custa|valor|orcamento/.test(t);
      const wants = /marca|vaga|agend|disponib|quero|pode ser|reserv|tem alguma|\bsim\b|claro/.test(t);

      if (S.awaiting === "name" && !tr && !cl && !d && !h && raw.trim().length <= 40) S.name = H.name(raw);

      if (/onde|morada|localiza|como chego/.test(t)) out.push(`${use()}Temos duas clínicas: Centro, na ${CLINICS["Centro"].addr}, e Praia, na ${CLINICS["Praia"].addr}.`);
      else if (/horario|abrem|fecham|aberto/.test(t)) out.push(`${use()}Estamos abertos de segunda a sexta.`);
      if (asksPrice) { out.push(`${use()}Os valores dependem de cada caso, por isso não damos preços por mensagem. O primeiro passo é uma consulta de avaliação, onde o médico explica o plano e o orçamento.`); S.booking = true; S.treat = S.treat || "Consulta de avaliação"; }
      if (tr || wants || S.awaiting) S.booking = true;

      if (!S.booking) {
        if (out.length) return say("Quer que marque uma consulta?");
        if (hi) return { text: "Olá! Sou o assistente da Oriva Dental. Posso marcar consultas nas clínicas do Centro e da Praia e responder a dúvidas sobre os tratamentos." };
        if (/obrigad/.test(t)) return { text: "Nós é que agradecemos! Qualquer coisa, é só dizer." };
        return { text: "Boa pergunta. Não quero dar-lhe uma resposta errada, por isso passei à receção e respondem-lhe aqui em breve.", handoff: { title: "Pergunta sem resposta automática", detail: `"${raw.slice(0, 80)}"` } };
      }

      if (S.first && !S.firstSaid) { out.push("Fico contente por nos escolher!"); S.firstSaid = true; }
      if (!S.treat) { S.awaiting = "treat"; return say(`${use()}Claro! É para que tratamento? Se não tiver a certeza, marcamos uma consulta de avaliação.`); }
      if (!S.clinic) {
        S.awaiting = "clinic";
        const intro = tr && tr !== "Consulta de avaliação" && !asksPrice ? `${use()}Fazemos sim. Tudo começa com uma consulta de avaliação, para o médico ver o seu caso e explicar as opções. ` : use();
        return say(`${intro}Prefere a clínica do Centro ou a da Praia?`);
      }
      if (!S.date) { S.awaiting = "date"; return say(`${use()}Ótimo, na clínica ${S.clinic}. Que dia lhe dá jeito?`); }
      let free = slotsFor(S.clinic, S.date);
      if (!free.length) { S.date = null; S.awaiting = "date"; return say("Ao fim de semana estamos fechados. Pode ser durante a semana?"); }
      if (S.time && !free.includes(S.time)) { const w = S.time; S.time = null; S.awaiting = "time"; return say(`Às ${w.replace(":", "h")} já não tenho vaga. ${H.cap(H.dayName(S.date))} na clínica ${S.clinic} tenho ${H.listTimes(free)}. Qual prefere?`); }
      if (!S.time) { S.awaiting = "time"; free = H.filterPart(free, p); return say(`${use()}${H.cap(H.dayName(S.date))}${p === "am" ? " de manhã" : p === "pm" ? " à tarde" : ""}, na clínica ${S.clinic}, tenho ${H.listTimes(free)}. ${free.length === 1 ? "Pode ser?" : "Qual prefere?"}`); }
      if (!S.name) { S.awaiting = "name"; return say("Para deixar a consulta marcada, como se chama?"); }

      const c = CLINICS[S.clinic];
      const first = S.name.split(" ")[0];
      const res = {
        text: `Está marcado, ${first}! ${H.cap(H.dayName(S.date))} às ${S.time} na Oriva Dental (${S.clinic}), ${c.addr}. Na véspera envio-lhe um lembrete por aqui.`,
        card: { label: "Consulta marcada", title: `${S.treat} · ${S.clinic}`, detail: `${H.cap(H.dayLabel(S.date))} às ${S.time}. Lembrete na véspera.` },
        row: { when: S.time, sub: H.dayName(S.date), title: S.treat, meta: `${S.name} · ${S.clinic}`, right: S.first ? "1.ª vez" : "" },
        reset: true,
      };
      return res;
    },
  };

  const thu = H.nextDay(4);
  window.CLIENT = {
    public: true,
    backHref: "/#demos",
    titles: { home: "Oriva Dental Assistente", demo: "Oriva Dental Demo", como: "Como Funciona", proposta: "Oriva Dental" },
    agencyName: "Weld",
    heroLayout: "split",
    name: "Oriva Dental",
    agency: "a Weld",
    logo, mark,
    hero: {
      title: "O assistente da <span class=\"smile\">Oriva Dental.</span>",
      lead: "Marca consultas pelo WhatsApp nas duas clínicas, a qualquer hora. A receção fica livre para quem está à frente dela.",
      visualDecor: `<div class="halo"></div><div class="orbit"></div>
        <div class="float f1" data-drift="-30"><b>Consulta marcada</b><span>Quinta, 17:30 · Centro</span></div>
        <div class="float f2" data-drift="-60"><b>Lembrete enviado</b><span>Para amanhã às 10:00</span></div>`,
    },
    story: [
      { title: "Pergunta pelo tratamento.", body: "Conhece todos os tratamentos da clínica, da implantologia às facetas. E explica que tudo começa por uma consulta de avaliação.", time: "21:12",
        msgs: [["me", "Olá, queria saber se fazem branqueamento dentário"], ["bot", "Olá! Fazemos sim. O branqueamento começa sempre com uma consulta de avaliação, para o médico ver o seu caso e explicar as opções. Prefere a clínica do Centro ou a da Praia?"]] },
      { title: "Escolhe a clínica mais perto.", body: "Centro ou Praia, cada uma com a sua agenda. O assistente só mostra as vagas livres da clínica escolhida.", time: "21:13",
        msgs: [["me", "Centro. Tem alguma coisa na quinta à tarde?"], ["bot", "Na quinta à tarde, no Centro, tenho às 15:00, 17:30 e às 18:30. Qual prefere?"]] },
      { title: "Recolhe o que a receção precisa.", body: "Nome, primeira visita ou não, tratamento de interesse. Chega tudo arrumado, sem telefonemas para trás e para a frente.", time: "21:13",
        msgs: [["me", "17:30. É a primeira vez que vou aí."], ["bot", "Fico contente por nos escolher! Para deixar a consulta marcada, como se chama?"]] },
      { title: "Confirma. E lembra na véspera.", body: "O paciente recebe a confirmação na hora e um lembrete no dia anterior. Menos faltas, menos cadeiras vazias.", time: "21:14",
        msgs: [["me", "Ana Ribeiro"], ["bot", "Está marcado, Ana! Quinta às 17:30 na Oriva Dental do Centro, Rua do Exemplo, 12. Na véspera envio-lhe um lembrete por aqui."], ["card", { label: "Consulta marcada", title: "Branqueamento · Centro", detail: "Quinta às 17:30. Lembrete na véspera." }]] },
    ],
    statement: "O paciente escreve às 22h. Recebe resposta às 22h. E a consulta fica marcada antes de ir dormir.",
    live: { title: "Experimente como paciente.", lead: "Pergunte por um tratamento, escolha a clínica e marque. A consulta aparece na agenda da receção." },
    chips: ["Fazem implantes?", "Quanto custa um aparelho invisível?", "Estou com muita dor de dentes", "Onde ficam as clínicas?", "Têm acordo com a Médis?"],
    welcome: "Olá! Sou o assistente da Oriva Dental. Posso marcar consultas no Centro e na Praia e responder a dúvidas sobre os tratamentos.",
    example: ["Olá, queria saber se fazem branqueamento dentário", "Centro. Tem alguma coisa na quinta à tarde?", "17:30. É a primeira vez que vou aí.", "Ana Ribeiro"],
    panel: {
      title: "Agenda da receção",
      stats: [{ label: "Conversas hoje", value: 9 }, { label: "Consultas marcadas", value: 4 }, { label: "Lembretes enviados", value: 12 }],
      rowsLabel: "Consultas marcadas pelo assistente",
      note: "Horários, vagas e números de exemplo. Tratamentos, moradas e telefones são os da Oriva Dental.",
      seed: () => [
        { when: "09:30", sub: "amanhã", title: "Implantologia", meta: "Rui Costa · Centro", right: "" },
        { when: "14:30", sub: "amanhã", title: "Consulta de avaliação", meta: "Marta Lopes · Praia", right: "1.ª vez" },
        { when: "11:00", sub: H.dayName(thu), title: "Ortodontia", meta: "Inês Moreira · Centro", right: "" },
      ],
    },
    brain,
    cells: {
      title: "Sabe o que a receção sabe.",
      items: [
        { cls: "w4 tint", title: "Todos os tratamentos, explicados.", body: "Responde a dúvidas simples e encaminha sempre para a consulta de avaliação. Nunca dá diagnósticos.",
          html: `<div class="pills"><span class="pill">Implantologia</span><span class="pill">Ortodontia</span><span class="pill">Orthocaps</span><span class="pill">Branqueamento</span><span class="pill">Facetas</span><span class="pill">Endodontia</span><span class="pill">Periodontologia</span><span class="pill">Ácido hialurónico</span><span class="pill">DSD</span></div>` },
        { cls: "w2", title: "Duas clínicas, uma conversa.",
          html: `<div class="kv"><div><span>Centro</span><b>220 000 101</b></div><div><span>Praia</span><b>220 000 102</b></div></div>` },
        { cls: "w2 tint-b", title: "Lembrete na véspera.", body: "Cada consulta marcada recebe um lembrete automático. As faltas descem.",
          html: `<div class="bubble-demo"><div class="b bot">Olá Ana! Lembramos a sua consulta amanhã às 17:30 em Centro. Até amanhã!</div></div>` },
        { cls: "w2", title: "Sabe quando parar.", body: "Dor, urgências e seguros passam logo para uma pessoa.",
          html: `<div class="alert"><i></i><div><b>Possível urgência</b><span>Passado à receção às 22:41</span></div></div>` },
        { cls: "w2", title: "Só vagas reais.", body: "Liga à agenda da clínica e oferece apenas o que está livre.",
          html: `<div class="pills"><span class="pill off">15:00</span><span class="pill on">17:30</span><span class="pill">18:30</span></div>` },
      ],
    },
    closing: "Uma receção que<br>nunca fecha.",
    como: {
      title: "Por trás da conversa.",
      lead: "Quatro passos, em segundos, sempre que um paciente escreve.",
      flow: [
        ["O paciente escreve", "No WhatsApp, no Instagram ou no site da clínica. Como escreveria a qualquer pessoa."],
        ["O assistente percebe", "Que tratamento, que clínica e para quando. Se faltar alguma coisa, pergunta."],
        ["Consulta a agenda", "Só vagas reais de Centro ou de Praia, nunca horas inventadas."],
        ["Marca ou chama a receção", "Confirma e lembra na véspera. Dor, urgências e seguros vão para uma pessoa."],
      ],
      needsTitle: "O que falta para ligar.",
      needsLead: "A parte difícil já está feita. Faltam três coisas da Oriva Dental.",
      needs: [
        ["ok", "", "Tratamentos e moradas", "Todos os tratamentos, as duas clínicas e os telefones, tirados do site da clínica."],
        ["todo", "Falta confirmar", "Horários das clínicas", "Os horários desta demo são de exemplo. Basta a clínica dizer os verdadeiros."],
        ["todo", "Falta ligar", "Agenda de marcações", "O programa de marcações que a clínica já usa, ou um Google Calendar, para ver e ocupar vagas reais."],
        ["todo", "Falta ligar", "WhatsApp Business", "O número da clínica, ligado pela API oficial da Meta. Sem apps estranhas nem contas falsas."],
      ],
      faq: [
        ["O assistente dá diagnósticos?", "Nunca. Explica cada tratamento em termos gerais e encaminha sempre para a consulta de avaliação."],
        ["E se for uma urgência?", "Dá os telefones das duas clínicas e avisa logo a receção para ligar ao paciente."],
        ["Que dados dos pacientes guarda?", "Só o necessário para marcar: nome, contacto, tratamento e hora. Nada de histórico clínico."],
        ["A receção continua a ver as mensagens?", "Sim. Tudo fica no WhatsApp da clínica, e qualquer pessoa da equipa pode entrar na conversa a meio."],
      ],
      cta: "Veja a funcionar.",
    },
  };
})();
