/* ------------------------------------------------------------------
   TODOS OS TEXTOS DO SITE ESTÃO AQUI.
   Para mudar uma frase, um contacto ou um membro da equipa,
   muda-se só este ficheiro. Regra da marca: nada de travessões (—).
   Nunca pôr nomes ou logótipos de clientes reais sem autorização escrita.
------------------------------------------------------------------- */

export const contacts = {
  email: "joaobastossousa@gmail.com",
  instagram: "https://www.instagram.com/weld.studio/",
  instagramHandle: "@weld.studio",
  city: "Porto",
};

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

export const hero = {
  kicker: "Estúdio de automação com IA no Porto",
  line1: "Mensagens respondidas.",
  line2: "Clientes",
  rotate: ["marcados.", "atendidos.", "qualificados."],
  lead: "Assistentes de IA no WhatsApp e no Instagram, que respondem, dão preços e marcam a qualquer hora. Para agências revenderem e para negócios usarem.",
  agency: "Sou uma agência",
  business: "Tenho um negócio",
};

/* animação do topo: mensagens entram, a Weld solda, resultados saem */
export const flow = {
  inputs: [
    { icon: "whatsapp-color", text: "Têm vaga sábado?" },
    { icon: "instagram-color", text: "Quanto custa?" },
    { icon: "gmail-color", text: "Pedido de orçamento" },
  ],
  outputs: ["Consulta marcada · sáb 10:00", "Preço enviado e lead guardado", "Proposta pedida à equipa"],
};

export const integrations = {
  title: "Liga-se ao que já usam",
  items: [
    ["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["googlecalendar", "Google Calendar"],
    ["gmail", "Gmail"], ["googlesheets", "Google Sheets"], ["notion", "Notion"], ["shopify", "Shopify"],
    ["stripe", "Stripe"], ["calendly", "Calendly"], ["hubspot", "HubSpot"], ["n8n", "n8n"], ["make", "Make"],
  ],
};

/* secção que avança com o scroll */
export const story = {
  title: "O que acontece quando alguém escreve.",
  steps: [
    { time: "23:14", title: "A loja está fechada.", text: "Um cliente escreve no WhatsApp a perguntar por uma vaga." },
    { time: "23:14", title: "O assistente responde na hora.", text: "Dá o preço, mostra as vagas livres e pergunta o que falta." },
    { time: "09:00", title: "De manhã, está tudo feito.", text: "A marcação está no painel e a equipa só confirma." },
  ],
};

export const demos = {
  title: "Experimenta as demos.",
  lead: "Três negócios de exemplo, três assistentes a funcionar. Abre, escreve como se fosses cliente e vê o que acontece.",
  note: "Marcas de exemplo. Os cenários são reais, os nomes não.",
  items: [
    { slug: "clinica", brand: "Oriva Dental", sector: "Clínica dentária", color: "#1FB5A8", ink: "#0F2E3D", what: "Marca consultas em duas clínicas e lembra o paciente na véspera. Urgências vão logo para a receção." },
    { slug: "pecas", brand: "Pistão Peças", sector: "Loja de peças auto", color: "#E8792B", ink: "#0A1628", what: "Pede o carro, o ano e o motor, e entrega o pedido ao balcão já preenchido. Nunca inventa stock." },
    { slug: "ginasio", brand: "Pulso", sector: "Ginásio", color: "#FF5A36", ink: "#111111", what: "Responde a quem chega pelos reels, explica as aulas e marca os 3 dias grátis." },
  ],
};

export const paths = {
  title: "Duas formas de trabalhar connosco.",
  agency: {
    tab: "Para agências",
    title: "Vocês vendem. Nós construímos.",
    lead: "Já têm os clientes e a confiança. Juntamos a parte técnica para venderem automação sem contratar ninguém.",
    points: [
      "White label: o cliente vê a vossa marca, não a nossa.",
      "Vocês ficam com a relação com o cliente e com a margem.",
      "Tratamos da construção, da entrega e da manutenção.",
      "Fazemos a demo para o vosso cliente antes de venderem.",
    ],
    diagram: ["Agência", "Weld", "Cliente da agência"],
    cta: "Propor uma parceria",
  },
  business: {
    tab: "Para negócios",
    title: "Contratem-nos diretamente.",
    lead: "Sem equipa técnica? Nós somos a vossa. Do assistente que responde às DMs ao site que traz contactos.",
    points: [
      "Assistentes que respondem, dão preços e marcam por vocês.",
      "Automações que acabam com o copiar e colar.",
      "Sites rápidos, claros e feitos para trazer contactos.",
      "Âmbito, prazo e valor por escrito antes de começar.",
    ],
    diagram: ["O vosso negócio", "Weld"],
    cta: "Pedir proposta",
  },
};

export const services = {
  title: "O que construímos.",
  items: [
    { icon: "ph-chats-circle", name: "Assistentes de IA", text: "Respondem, dão preços e marcam no WhatsApp, no Instagram ou no site. Passam a uma pessoa quando é preciso." },
    { icon: "ph-flow-arrow", name: "Automações", text: "Ligam formulários, agenda, CRM e email. O que hoje se copia à mão passa a acontecer sozinho." },
    { icon: "ph-browser", name: "Sites e landing pages", text: "Rápidos, claros e feitos para converter. Com o assistente lá dentro, se quiserem." },
    { icon: "ph-code-block", name: "Software à medida", text: "Painéis internos, integrações e pequenos produtos, quando nada do que existe serve." },
  ],
};

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

export const contact = {
  title: "Conta-nos o que precisas.",
  lead: "Três passos e o email fica escrito. Respondemos rápido.",
  who: ["Agência", "Negócio"],
  needs: ["Assistente de IA", "Automação", "Site", "Software à medida", "Ainda não sei"],
};
