/* ------------------------------------------------------------------
   TODOS OS TEXTOS DO SITE ESTÃO AQUI.
   Para mudar uma frase, um contacto ou um membro da equipa,
   muda-se só este ficheiro. Regra da marca: nada de travessões (—).
   Nunca pôr nomes ou logótipos de clientes reais sem autorização escrita.
------------------------------------------------------------------- */

export const site = {
  name: "Weld",
  url: "https://weldstudio.pt",
  email: "joaobastossousa@gmail.com",
  instagram: "https://www.instagram.com/weld.studio/",
  instagramHandle: "@weld.studio",
  linkedin: "https://www.linkedin.com/in/jo%C3%A3o-bastos-de-sousa-8188723b6/",
  city: "Porto",
  // Número da Weld para ligar/WhatsApp. Vazio = não aparece no site (o cliente deixa o dele e ligamos nós).
  phone: "932 803 139",
  cta: "Pedir proposta",
};

export const nav = [
  { label: "Serviços", href: "/servicos", children: true },
  { label: "Para agências", href: "/agencias" },
  { label: "Demos", href: "/demos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
];

export const team = [
  {
    name: "João Sousa",
    initials: "JS",
    role: "Fundador",
    text: "Primeiro contacto em todos os projetos. Constrói os assistentes e as automações e acompanha cada cliente do início ao fim.",
    linkedin: "https://www.linkedin.com/in/jo%C3%A3o-bastos-de-sousa-8188723b6/",
    email: "joaobastossousa@gmail.com",
  },
  {
    name: "Duarte",
    initials: "D",
    role: "Sócio e builder",
    text: "Constrói connosco quando o projeto pede duas cabeças, e divide o trabalho quando é mais rápido assim.",
    linkedin: "", // colar aqui o link do LinkedIn do Duarte
    email: "",
  },
];

/* conversas usadas nos telemóveis animados: [quem, texto]. "me" = cliente, "bot" = assistente, "ok" = resultado */
export const chats = {
  clinica: { name: "A tua clínica", status: "online", lines: [["me", "Olá! Têm vaga para sábado de manhã?"], ["bot", "Olá! Sábado tenho às 10:00 e às 11:30. Qual prefere?"], ["me", "10h, por favor. Sou a Rita."], ["bot", "Está marcado, Rita! Sábado às 10:00. Na véspera envio um lembrete."], ["ok", "Marcação enviada para a agenda"]] },
  pecas: { name: "A tua loja", status: "online", lines: [["me", "Têm pastilhas para um Golf VII de 2016?"], ["bot", "Temos. É o 1.6 TDI? Frente ou trás?"], ["me", "1.6 TDI, frente."], ["bot", "Perfeito. Passei o pedido ao balcão, que confirma o preço já a seguir."], ["ok", "Pedido criado no balcão"]] },
  leads: { name: "A tua empresa", status: "online", lines: [["me", "Boa tarde, quanto custa um site para o meu restaurante?"], ["bot", "Depende do que precisa. Tem reservas online? Quantas páginas imagina?"], ["me", "Reservas sim, umas 4 páginas."], ["bot", "Obrigado! Um colega liga-lhe amanhã de manhã com uma proposta."], ["ok", "Lead qualificado no CRM"]] },
};

export const home = {
  kicker: "Estúdio de automação com IA no Porto",
  line1: "Menos trabalho à mão.",
  line2: "Mais",
  rotate: ["clientes.", "tempo.", "vendas."],
  lead: "Assistentes de IA, automações e sites feitos à medida. Trabalhamos diretamente com empresas e, por trás, para os clientes de agências de marketing.",
  floats: [
    { icon: "ph-lightning", title: "Responde em segundos", text: "A qualquer hora, fins de semana incluídos" },
    { icon: "ph-user-switch", title: "Passa a uma pessoa", text: "Quando o pedido foge ao normal" },
  ],
  statement: ["Quem escreve às 23h", "não quer resposta amanhã.", "Quer resposta agora,", "e uma marcação feita."],
  flow: {
    inputs: [
      { icon: "whatsapp-color", text: "Têm vaga sábado?" },
      { icon: "gmail-color", text: "Fatura do fornecedor.pdf" },
      { icon: "web", text: "Formulário do site" },
    ],
    outputs: ["Consulta marcada · sáb 10:00", "Fatura lançada no Excel", "Lead no CRM e equipa avisada"],
  },
};

export const examples = {
  idx: "Exemplos",
  title: "O que fazemos, na prática.",
  tabs: [
    { key: "assistentes", label: "Assistentes de IA", icon: "ph-chats-circle", title: "Respondem, marcam e qualificam.", items: ["Marcações pelo WhatsApp com lembrete na véspera", "Preços e horários respondidos no Instagram", "Pedidos qualificados antes de chegarem à equipa"], href: "/servicos/assistentes-de-ia" },
    { key: "automacoes", label: "Automações", icon: "ph-flow-arrow", title: "O que se faz sempre igual passa a fazer-se sozinho.", items: ["Faturas lidas e lançadas no Excel", "Relatório semanal no email todas as segundas", "Formulários que vão direto para o CRM", "Lembretes de pagamento a clientes em atraso"], href: "/servicos/automacoes" },
    { key: "sites", label: "Sites e landing pages", icon: "ph-browser", title: "Sites rápidos que trazem contactos.", items: ["Site de clínica com pedido de marcação", "Landing page para campanhas de anúncios", "Página de reservas para restaurantes"], href: "/servicos/sites" },
    { key: "software", label: "Software à medida", icon: "ph-code-block", title: "Quando nenhuma ferramenta serve, fazemos a vossa.", items: ["Painel de encomendas e stock", "Portal onde o cliente vê o estado do pedido", "Ligação entre sistemas que não falam entre si"], href: "/servicos/software-a-medida" },
  ],
};

export const sectors = {
  idx: "Para quem trabalhamos",
  title: "Em cada negócio, trabalho que se faz sozinho.",
  lead: "Mensagens, pagamentos, reservas, encomendas, leads: escolhemos o que mais tempo vos rouba e tratamos disso.",
  items: [
    { img: "setor-clinica.jpg", name: "Clínicas", tag: "Assistente de IA", events: [["ph-chats-circle", "Consulta marcada pelo WhatsApp"], ["ph-bell-ringing", "Lembrete enviado na véspera"]] },
    { img: "setor-oficina.jpg", name: "Oficinas e peças", tag: "Automação", events: [["ph-package", "Pedido registado no balcão"], ["ph-arrows-clockwise", "Stock atualizado sozinho"]] },
    { img: "setor-ginasio.jpg", name: "Ginásios", tag: "Automação", events: [["ph-credit-card", "Mensalidade em atraso detetada"], ["ph-paper-plane-tilt", "Lembrete de pagamento enviado"]] },
    { img: "setor-restaurante.jpg", name: "Restaurantes", tag: "Site com reservas", events: [["ph-browser", "Reserva feita pelo site"], ["ph-calendar-check", "Mesa para 4 · sábado 20h30"]] },
    { img: "setor-imobiliaria.jpg", name: "Imobiliárias", tag: "Software à medida", events: [["ph-user-plus", "Novo lead do portal"], ["ph-house-line", "Visita marcada e agente avisado"]] },
  ],
};

export const ways = {
  idx: "Como trabalhamos",
  title: "Duas formas de trabalhar com a Weld.",
  items: [
    {
      key: "direto",
      label: "Diretamente com a Weld",
      flow: ["O teu negócio", "Weld"],
      title: "Contratas-nos a nós.",
      text: "Percebemos o que o teu negócio precisa, construímos à medida e ficamos por perto depois da entrega.",
      points: ["Proposta fechada e por escrito", "Feito para o teu negócio, nada genérico", "Acompanhamento mensal, se quiseres"],
      cta: "Pedir proposta",
      href: "/contacto",
    },
    {
      key: "agencia",
      label: "Através da tua agência",
      flow: ["Agência", "Weld", "Cliente da agência"],
      title: "Vendes com a tua marca. Nós construímos.",
      text: "Trabalhamos para os clientes da tua agência, por trás e com o nome da agência. Tu ficas com a relação e com a margem.",
      points: ["Marca branca: o cliente vê a tua agência", "Sem contratar ninguém", "Revenda, projeto fechado ou percentagem"],
      cta: "Ser agência parceira",
      href: "/agencias",
    },
  ],
};

export const integrations = {
  title: "Liga-se às ferramentas que já usam",
  items: [
    ["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["googlecalendar", "Google Calendar"],
    ["gmail", "Gmail"], ["googlesheets", "Google Sheets"], ["notion", "Notion"], ["shopify", "Shopify"],
    ["stripe", "Stripe"], ["calendly", "Calendly"], ["hubspot", "HubSpot"], ["n8n", "n8n"], ["make", "Make"],
  ],
};

export const story = {
  title: "O que acontece quando alguém escreve.",
  steps: [
    { time: "23:14", title: "A loja está fechada.", text: "Um cliente escreve no WhatsApp a perguntar por uma vaga." },
    { time: "23:14", title: "O assistente responde na hora.", text: "Dá o preço, mostra as vagas livres e pergunta o que falta." },
    { time: "09:00", title: "De manhã, está tudo feito.", text: "A marcação está no painel e a equipa só confirma." },
  ],
};

/* serviços: cada um tem a sua página em /servicos/<slug> */
export const services = [
  {
    slug: "assistentes-de-ia", icon: "ph-chats-circle", name: "Assistentes de IA", short: "WhatsApp, Instagram e site",
    card: "Respondem, dão preços e marcam a qualquer hora. Passam a uma pessoa quando é preciso.",
    title: "Um assistente que responde enquanto a equipa dorme.",
    lead: "Conhece os vossos preços, horários e serviços. Responde no WhatsApp, no Instagram e no site, marca, e passa a uma pessoa quando o pedido foge ao normal.",
    chat: "clinica",
    what: [
      ["ph-calendar-check", "Marca e lembra", "Vê as vagas reais da agenda, marca e envia lembrete na véspera."],
      ["ph-currency-eur", "Dá preços certos", "Só os valores que nos derem. Nunca inventa."],
      ["ph-funnel", "Qualifica pedidos", "Pergunta o que falta antes de passar à equipa."],
      ["ph-user-switch", "Sabe parar", "Reclamações, urgências e casos estranhos vão logo para uma pessoa."],
    ],
    for: ["Clínicas e consultórios", "Restaurantes", "Oficinas e lojas", "Ginásios e estúdios", "Imobiliárias", "Serviços ao domicílio"],
    integrate: {
      steps: [
        ["ph-coffee", "Conversa de 20 minutos", "Percebemos que perguntas chegam, a que horas e quem responde hoje."],
        ["ph-book-open-text", "Ensinamos o assistente", "Preços, horários, serviços e regras da casa. Revês tudo antes de ligar."],
        ["ph-plugs-connected", "Ligamos aos vossos canais", "WhatsApp Business, Instagram e o chat do site, com a agenda que já usam."],
        ["ph-eye", "Semana de teste", "Responde connosco a vigiar. Afinamos o tom e as respostas."],
        ["ph-check-circle", "A funcionar", "A equipa só recebe o que precisa de uma pessoa. Acompanhamos todos os meses."],
      ],
      tools: [["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["googlecalendar", "Google Calendar"], ["calendly", "Calendly"], ["hubspot", "HubSpot"]],
      before: ["Mensagens por responder à noite e ao fim de semana", "Alguém ao telefone só para marcar", "Clientes que desistem à espera de resposta"],
      after: ["Resposta em segundos, a qualquer hora", "Marcações diretas na agenda, com lembrete", "A equipa só entra quando é mesmo preciso"],
    },
    faq: [
      ["Usa a API oficial do WhatsApp?", "Sim. Ligamos pela WhatsApp Business Platform da Meta, com o número do negócio."],
      ["A equipa continua a ver as conversas?", "Sim. Pode entrar em qualquer conversa a meio, e o assistente para de responder."],
      ["Quanto tempo leva a pôr a funcionar?", "Um assistente simples fica pronto em poucos dias."],
    ],
  },
  {
    slug: "automacoes", icon: "ph-flow-arrow", name: "Automações", short: "Menos trabalho repetido",
    card: "Ligam formulários, agenda, CRM e email. O que hoje se copia à mão passa a acontecer sozinho.",
    title: "O que se faz sempre igual passa a fazer-se sozinho.",
    lead: "Descobrimos as tarefas que comem horas todas as semanas e ligamos as ferramentas que já usam para que aconteçam sem ninguém.",
    chat: "leads",
    what: [
      ["ph-arrows-left-right", "Liga ferramentas", "Formulários, folhas de cálculo, CRM, agenda e email a falarem entre si."],
      ["ph-envelope-simple", "Respostas e follow-ups", "Rascunhos e seguimentos prontos, revistos antes de sair."],
      ["ph-chart-line-up", "Relatórios automáticos", "Os números da semana chegam sozinhos, sem montar folhas à mão."],
      ["ph-bell-ringing", "Avisos à equipa", "Quando entra um pedido importante, a pessoa certa sabe logo."],
    ],
    for: ["Agências de marketing", "Equipas comerciais", "Clínicas", "Imobiliárias", "Lojas online", "Escritórios"],
    integrate: {
      steps: [
        ["ph-list-magnifying-glass", "Mapeamos as tarefas", "Listamos com a equipa o que se faz à mão todas as semanas e quanto tempo leva."],
        ["ph-target", "Escolhemos por onde começar", "Primeiro o que poupa mais horas com menos risco."],
        ["ph-plugs-connected", "Ligamos as ferramentas", "As que já usam: email, folhas, CRM, faturação, agenda. Sem mudar de programas."],
        ["ph-flask", "Testamos com dados reais", "Corre em paralelo com o processo atual até dar sempre certo."],
        ["ph-check-circle", "Fica a correr", "Com registo de tudo o que faz e aviso imediato se algo falhar."],
      ],
      tools: [["gmail", "Gmail"], ["googlesheets", "Google Sheets"], ["hubspot", "HubSpot"], ["notion", "Notion"], ["stripe", "Stripe"], ["n8n", "n8n"], ["make", "Make"]],
      before: ["Copiar dados de um sítio para outro", "Relatórios montados à mão à sexta à tarde", "Faturas e lembretes que ficam esquecidos"],
      after: ["Os dados passam sozinhos entre ferramentas", "Relatório no email todas as segundas", "Nada fica esquecido e fica tudo registado"],
    },
    faq: [
      ["Que ferramentas usam?", "As que já têm, sempre que possível. Quando falta alguma peça, usamos n8n ou Make."],
      ["E se uma automação falhar?", "Fica registado e avisamos. Na mensalidade, tratamos nós disso."],
      ["Precisamos de mudar de programas?", "Normalmente não. A ideia é ligar o que já existe."],
    ],
  },
  {
    slug: "sites", icon: "ph-browser", name: "Sites e landing pages", short: "Rápidos e feitos para converter",
    card: "Rápidos, claros e feitos para trazer contactos. Com o assistente lá dentro, se quiserem.",
    title: "Sites que explicam em 5 segundos e trazem contactos.",
    lead: "Sites institucionais e landing pages rápidos, bonitos no telemóvel e feitos para uma coisa: que quem entra perceba o que fazem e fale convosco.",
    chat: "leads",
    what: [
      ["ph-lightning", "Rápidos", "Carregam num instante, também no telemóvel."],
      ["ph-target", "Feitos para converter", "Cada página tem um objetivo claro e um botão para lá chegar."],
      ["ph-chats-circle", "Com assistente", "O assistente de IA pode viver no site e responder a quem entra."],
      ["ph-magnifying-glass", "Prontos para o Google", "Estrutura, velocidade e textos pensados para aparecer."],
    ],
    for: ["Pequenos negócios", "Profissionais independentes", "Lançamentos", "Campanhas de agências", "Restaurantes", "Clínicas"],
    integrate: {
      steps: [
        ["ph-target", "Objetivo e público", "Quem tem de entrar, o que tem de perceber e o que queremos que faça."],
        ["ph-pencil-line", "Textos e estrutura", "Escrevemos convosco. Menos texto, mais claro."],
        ["ph-paint-brush", "Design e construção", "Rápido, bonito no telemóvel e com a vossa marca."],
        ["ph-plugs-connected", "Ligações", "Formulários para o email ou CRM, assistente de IA, estatísticas e pixel dos anúncios."],
        ["ph-rocket-launch", "Online e a medir", "Domínio e alojamento tratados, e um resumo de contactos todos os meses."],
      ],
      tools: [["gmail", "Gmail"], ["hubspot", "HubSpot"], ["googlesheets", "Google Sheets"], ["calendly", "Calendly"], ["whatsapp", "WhatsApp"], ["stripe", "Stripe"]],
      before: ["Site antigo que ninguém atualiza", "Pedidos perdidos na caixa de email", "Anúncios a mandar para uma página genérica"],
      after: ["Quem entra percebe logo o que fazem", "Cada pedido vai direto a quem o trata", "Uma página por campanha, feita para converter"],
    },
    faq: [
      ["Podemos editar os textos?", "Sim. Fica tudo organizado para mudar textos sem mexer no resto."],
      ["Tratam do domínio e do alojamento?", "Tratamos, e explicamos cada passo."],
      ["Fazem só landing pages?", "Fazemos as duas coisas: páginas únicas para campanhas e sites completos."],
    ],
  },
  {
    slug: "software-a-medida", icon: "ph-code-block", name: "Software à medida", short: "Quando nada serve",
    card: "Painéis internos, integrações e pequenos produtos, quando nada do que existe serve.",
    title: "Quando nenhuma ferramenta serve, fazemos a vossa.",
    lead: "Painéis internos, integrações entre sistemas e pequenos produtos digitais, feitos à medida do vosso processo e não o contrário.",
    chat: "pecas",
    what: [
      ["ph-squares-four", "Painéis internos", "Tudo o que a equipa precisa de ver num só ecrã."],
      ["ph-plugs-connected", "Integrações", "Sistemas que não falavam passam a falar."],
      ["ph-rocket-launch", "Produtos e MVPs", "Da ideia a uma primeira versão que se pode mostrar."],
      ["ph-shield-check", "Feito para durar", "Código limpo, documentado e vosso."],
    ],
    for: ["Empresas com processos próprios", "Startups", "Agências", "Equipas de operações", "Lojas com stock", "Serviços"],
    integrate: {
      steps: [
        ["ph-magnifying-glass", "Descoberta", "Seguimos o processo de ponta a ponta e desenhamos o que falta."],
        ["ph-cursor-click", "Protótipo clicável", "Vês e experimentas antes de escrevermos código."],
        ["ph-stack", "Construção por etapas", "Entregas frequentes, sempre com algo a funcionar."],
        ["ph-plugs-connected", "Ligação aos sistemas", "Faturação, loja online, stock e CRM sincronizados."],
        ["ph-shield-check", "Entrega e manutenção", "Código e documentação vossos. Manutenção opcional."],
      ],
      tools: [["shopify", "Shopify"], ["stripe", "Stripe"], ["googlesheets", "Google Sheets"], ["hubspot", "HubSpot"], ["notion", "Notion"]],
      before: ["Excel partilhado com versões trocadas", "Três programas que não falam entre si", "Processos que dependem de uma só pessoa"],
      after: ["Um só ecrã com o que a equipa precisa", "Sistemas sincronizados sozinhos", "Um processo claro, que não depende de ninguém"],
    },
    faq: [
      ["O código fica nosso?", "Sim. Entregamos tudo, com instruções para continuar."],
      ["Como se define o preço?", "Depois de uma conversa de descoberta, com âmbito e prazo por escrito."],
      ["Dão manutenção?", "Sim, numa mensalidade opcional."],
    ],
  },
];

export const demos = {
  title: "Demos a funcionar.",
  lead: "Três negócios de exemplo, três assistentes. Abre, escreve como se fosses cliente e vê o que acontece.",
  note: "Marcas de exemplo. Os cenários são reais, os nomes não.",
  items: [
    { slug: "clinica", brand: "Oriva Dental", sector: "Clínica dentária", color: "#1FB5A8", ink: "#0F2E3D", what: "Marca consultas em duas clínicas e lembra o paciente na véspera. Urgências vão logo para a receção.", tags: ["Marcações", "Lembretes", "Urgências para a receção"] },
    { slug: "pecas", brand: "Pistão Peças", sector: "Loja de peças auto", color: "#E8792B", ink: "#0A1628", what: "Pede o carro, o ano e o motor, e entrega o pedido ao balcão já preenchido. Nunca inventa stock.", tags: ["Pedidos ao balcão", "Oficinas", "Duas lojas"] },
    { slug: "ginasio", brand: "Pulso", sector: "Ginásio", color: "#FF5A36", ink: "#111111", what: "Responde a quem chega pelos reels, explica as aulas e marca os 3 dias grátis.", tags: ["Instagram", "Aulas", "Experiência grátis"] },
  ],
};

export const agencies = {
  kicker: "Para agências de marketing",
  title: "Vocês vendem. Nós construímos.",
  lead: "Já têm os clientes e a confiança. Juntamos a parte técnica para venderem assistentes de IA e automações com o vosso nome, sem contratar ninguém.",
  flow: ["Agência", "Weld", "Cliente da agência"],
  points: [
    ["ph-mask-happy", "White label", "O cliente vê a vossa marca. Nós ficamos nos bastidores, a não ser que queiram outra coisa."],
    ["ph-handshake", "A relação é vossa", "Vocês falam com o cliente e ficam com a margem. Nós respondemos a vocês."],
    ["ph-presentation-chart", "Demo antes da venda", "Fazemos uma demo com o nome e os dados do vosso cliente para levarem à reunião."],
    ["ph-wrench", "Entrega e manutenção", "Construímos, ligamos ao WhatsApp e ficamos a manter, mês a mês."],
  ],
  steps: [
    ["Escolhem um cliente", "Mandam-nos o site e o Instagram de um cliente que recebe muitas mensagens."],
    ["Fazemos a demo", "Em poucos dias têm uma demo a funcionar com o nome dele."],
    ["Vocês vendem", "Mostram a demo na reunião e fecham, com o vosso preço."],
    ["Nós entregamos", "Configuramos, testamos com a equipa do cliente e ligamos tudo."],
  ],
};

export const compare = {
  title: "O que muda quando trabalham connosco.",
  without: ["Mensagens por responder à noite e ao fim de semana", "Clientes que desistem antes de alguém atender", "A equipa a copiar dados à mão", "Agências a dizer que não a pedidos de IA"],
  with: ["Resposta em segundos, a qualquer hora", "Marcações e pedidos feitos sem ninguém ao telefone", "Ferramentas ligadas e dados no sítio certo", "Agências a vender automação com o nome delas"],
};

export const stats = [
  ["24/7", "O assistente não fecha"],
  ["3", "Demos prontas a experimentar"],
  ["20 min", "Primeira conversa, sem compromisso"],
  ["1", "Ponto de contacto em todos os projetos"],
];

export const process = {
  title: "Do primeiro contacto à entrega.",
  steps: [
    { icon: "ph-coffee", name: "Conversa de 20 minutos", text: "Percebemos o que querem resolver. Sem compromisso." },
    { icon: "ph-file-text", name: "Proposta por escrito", text: "Âmbito, prazo e valor fechados antes de começar." },
    { icon: "ph-hammer", name: "Construção", text: "Dias, não meses. Mostramos o progresso pelo caminho." },
    { icon: "ph-rocket-launch", name: "Entrega e acompanhamento", text: "Testamos convosco, ligamos tudo e ficamos por perto." },
  ],
};

export const deals = {
  title: "Como fechamos negócio.",
  lead: "Cada projeto tem o modelo que faz mais sentido. Tudo fica num contrato simples, com âmbito, prazos e valores.",
  items: [
    { icon: "ph-seal-check", name: "Projeto fechado", text: "Um valor fixo por um âmbito definido. Sinal de 50% para arrancar, o resto na entrega.", for: "Negócios e agências" },
    { icon: "ph-arrows-clockwise", name: "Mensalidade", text: "Manutenção, melhorias e acompanhamento, mês a mês, sem fidelização longa.", for: "Negócios e agências" },
    { icon: "ph-storefront", name: "Revenda para agências", text: "Um preço fixo por cliente. A agência define o preço final e fica com a margem.", for: "Agências" },
    { icon: "ph-percent", name: "Percentagem", text: "Em vez de preço fixo, uma percentagem do que o projeto gera ou do contrato da agência. Risco partilhado.", for: "Parcerias" },
  ],
};

export const about = {
  kicker: "Sobre a Weld",
  title: "Soldar é juntar duas peças numa só.",
  lead: "É o que fazemos: pegamos em mensagens soltas, ferramentas que não falam entre si e trabalho repetido, e juntamos tudo num fluxo que funciona sozinho.",
  values: [
    ["ph-eye", "Mostrar antes de vender", "Fazemos a demo primeiro. Ninguém devia comprar automação às cegas."],
    ["ph-chat-text", "Falar como gente", "Sem jargão. Explicamos o que fazemos em frases normais."],
    ["ph-lock-key", "Só o que é oficial", "APIs oficiais, dados guardados com cuidado, nada de truques."],
    ["ph-hand-waving", "Um ponto de contacto", "Sabem sempre com quem falar."],
  ],
};

export const faq = {
  title: "Perguntas frequentes.",
  items: [
    ["Os clientes da agência sabem que somos nós?", "Só se a agência quiser. Em white label trabalhamos com a marca dela e falamos com o cliente final apenas quando nos pedem."],
    ["Quanto tempo demora?", "Um assistente simples fica pronto em poucos dias. Projetos maiores têm o prazo escrito na proposta."],
    ["Que ferramentas usam?", "As oficiais: a API do WhatsApp Business e do Instagram, a vossa agenda e o vosso CRM. Nada de contas falsas nem truques."],
    ["E se o assistente não souber responder?", "Passa a conversa a uma pessoa da equipa. Nunca inventa preços, stock ou diagnósticos."],
    ["Trabalham fora do Porto?", "Sim. Estamos no Porto, mas quase tudo se faz à distância."],
  ],
};

export const demoOffer = {
  idx: "Demo grátis",
  title: "Fazemos a tua demo, de graça.",
  lead: "Antes de pagares alguma coisa, vês a Weld a funcionar com o teu negócio: os teus serviços, os teus preços, a tua marca.",
  steps: [
    ["ph-hand-waving", "Pedes a demo", "Dois minutos: dizes o que fazes e mandas o site ou o Instagram."],
    ["ph-hammer", "Construímos com o teu negócio", "Preparamos um exemplo real, feito para ti, não um modelo genérico."],
    ["ph-presentation-chart", "Apresentamos em 20 minutos", "Mostramos a funcionar. Se fizer sentido, recebes a proposta por escrito."],
  ],
  note: "Sem compromisso. Se não avançares, não pagas nada.",
  agencies: {
    title: "Fazemos a demo para o vosso cliente, de graça.",
    lead: "Escolhem um cliente, nós preparamos a demo com a marca e os serviços dele, e apresentamos convosco ou só a vocês.",
  },
};

export const contact = {
  title: "Conta-nos o que precisas.",
  lead: "Três passos e o email fica escrito. Respondemos rápido.",
  who: ["Agência", "Negócio"],
  needs: ["Demo grátis", "Assistente de IA", "Automação", "Site", "Software à medida", "Ainda não sei"],
};

// Pedido detalhado: para quem já sabe o que quer e salta a demo.
export const order = {
  title: "Já sabes o que queres? Faz o pedido.",
  lead: "Sem demo, sem voltas. Conta-nos o projeto com detalhe e respondemos com perguntas certas ou uma proposta. Quanto mais disseres, mais rápido fica.",
  who: [
    ["ph-storefront", "Negócio", "Para a minha empresa"],
    ["ph-megaphone", "Agência, para um cliente", "Vendemos nós, fazem vocês"],
    ["ph-buildings", "Agência, para nós", "Para a própria agência"],
  ],
  services: [
    ["assistente", "ph-chat-circle-dots", "Assistente de IA"],
    ["automacao", "ph-flow-arrow", "Automação"],
    ["site", "ph-browser", "Site"],
    ["software", "ph-squares-four", "Software à medida"],
    ["outro", "ph-dots-three-outline", "Outra coisa"],
  ],
  // perguntas que aparecem conforme o serviço escolhido
  details: {
    assistente: {
      title: "Assistente de IA",
      chips: [
        ["Onde responde", ["WhatsApp", "Instagram", "Site", "Email", "Facebook", "Telefone"]],
        ["O que faz", ["Marcações", "Dúvidas e preços", "Orçamentos", "Qualificar leads", "Encomendas", "Passar a uma pessoa"]],
      ],
      fields: [
        ["Mensagens por dia (mais ou menos)", "ex.: 30, sobretudo à noite"],
        ["Onde marcam hoje", "ex.: agenda em papel, Google Calendar, software da clínica"],
      ],
    },
    automacao: {
      title: "Automação",
      chips: [["Ferramentas que usam", ["Excel / Google Sheets", "Gmail / Outlook", "Faturação (Moloni, InvoiceXpress, PHC…)", "CRM", "Loja online", "Notion", "WhatsApp", "Outra"]]],
      fields: [
        ["Que tarefa fazem à mão hoje?", "Passo a passo, como se explicasses a alguém novo na equipa", true],
        ["Horas por semana nisso", "ex.: 6 horas, 2 pessoas"],
      ],
    },
    site: {
      title: "Site",
      chips: [
        ["Situação", ["Não temos site", "Refazer o atual", "Melhorar o atual"]],
        ["Precisa de", ["Marcações", "Pedidos de orçamento", "Loja online", "Blog", "Várias línguas", "Área de cliente"]],
      ],
      fields: [
        ["Site atual ou sites de que gostam", "links"],
        ["Textos e fotos", "ex.: temos tudo, só logótipo, precisamos de ajuda"],
      ],
    },
    software: {
      title: "Software à medida",
      chips: [["Quem usa", ["Equipa interna", "Clientes", "Parceiros / fornecedores"]]],
      fields: [
        ["O que deve fazer?", "As 3 ou 4 coisas principais", true],
        ["O que usam hoje para isso", "ex.: folhas de Excel partilhadas, papel, outro programa"],
        ["Quantas pessoas vão usar", "ex.: 8 na equipa"],
      ],
    },
    outro: {
      title: "Outra coisa",
      chips: [],
      fields: [["Descreve o que tens em mente", "Sem filtro, nós organizamos", true]],
    },
  },
  timing: ["Urgente", "Este mês", "1 a 3 meses", "Sem pressa"],
  budget: ["Até 1.000 €", "1.000 a 3.000 €", "3.000 a 8.000 €", "Mais de 8.000 €", "Prefiro falar"],
  models: ["Projeto fechado", "Mensalidade", "Revenda (agência)", "Percentagem", "Aconselhem-nos"],
  reach: [
    ["ph-phone-call", "Ligar"],
    ["ph-whatsapp-logo", "WhatsApp"],
    ["ph-envelope-simple", "Email"],
  ],
  when: ["Manhã", "Almoço", "Tarde", "Fim do dia"],
};
