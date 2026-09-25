/* ------------------------------------------------------------------
   TODOS OS TEXTOS DO SITE ESTÃO AQUI.
   Para mudar uma frase, um contacto ou um membro da equipa,
   muda-se só este ficheiro. Regra da marca: nada de travessões (—).
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
  title: "Soldamos a IA ao que já funciona.",
  lead: "Assistentes de IA, automações e sites para agências de marketing e para negócios. Revendem com o vosso nome, ou contratam-nos diretamente.",
  agency: "Sou uma agência",
  business: "Tenho um negócio",
};

export const paths = {
  title: "Duas formas de trabalhar connosco.",
  agency: {
    tab: "Para agências",
    title: "Vocês vendem. Nós construímos.",
    lead: "Já têm os clientes e a confiança. Juntamos a parte técnica para poderem vender automação sem contratar ninguém.",
    points: [
      "White label: o cliente vê a vossa marca, não a nossa.",
      "Vocês ficam com a relação com o cliente e com a margem.",
      "Tratamos da construção, da entrega e da manutenção.",
      "Demos prontas para mostrarem aos vossos clientes.",
    ],
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
    cta: "Pedir proposta",
  },
};

export const services = {
  title: "O que construímos.",
  items: [
    { tag: "01", name: "Assistentes de IA", text: "Respondem, dão preços e marcam no WhatsApp, no Instagram ou no site. Passam a uma pessoa quando é preciso.", size: "wide" },
    { tag: "02", name: "Automações", text: "Ligam as ferramentas que já usam: formulários, agenda, CRM e email. Menos trabalho repetido.", size: "narrow" },
    { tag: "03", name: "Sites e landing pages", text: "Rápidos, claros e feitos para converter. Com o assistente lá dentro, se quiserem.", size: "narrow" },
    { tag: "04", name: "Software à medida", text: "Painéis internos, integrações e pequenos produtos, quando nada do que existe serve.", size: "wide" },
  ],
};

export const demos = {
  title: "Demos que já construímos.",
  lead: "Exemplos a funcionar, feitos para mostrar a agências e aos clientes delas como fica na prática.",
  items: [
    { sector: "Clínica dentária", what: "Marca consultas em duas clínicas e envia um lembrete na véspera.", me: "Fazem branqueamento?", bot: "Fazemos sim. Prefere a clínica do centro ou a da praia?", chip: "Consulta marcada" },
    { sector: "Loja de peças auto", what: "Pedidos fora de horas chegam ao balcão já preenchidos.", me: "Pastilhas para um Golf VII?", bot: "Diga-me o ano e o motor, ou a matrícula.", chip: "Pedido ao balcão" },
    { sector: "Ginásio", what: "Transforma DMs do Instagram em aulas experimentais marcadas.", me: "Quanto custa o ginásio?", bot: "Antes de decidir, experimente 3 dias grátis. Quer marcar?", chip: "3 dias grátis" },
    { sector: "Lavagem auto", what: "Preços por tipo de carro e marcações sem ninguém ao telefone.", me: "Quanto é um SUV por dentro e por fora?", bot: "Lavagem Completa para SUV: 25€. Quer marcar?", chip: "Lavagem marcada" },
  ],
};

export const process = {
  title: "Como trabalhamos.",
  steps: [
    { name: "Conversa de 20 minutos", text: "Percebemos o que querem resolver. Sem compromisso." },
    { name: "Proposta por escrito", text: "Âmbito, prazo e valor fechados antes de começar." },
    { name: "Construção", text: "Dias, não meses. Mostramos o progresso pelo caminho." },
    { name: "Entrega e acompanhamento", text: "Testamos convosco, ligamos tudo e ficamos por perto." },
  ],
};

export const deals = {
  title: "Como fechamos negócio.",
  lead: "Cada projeto tem o modelo que faz mais sentido. Tudo fica num contrato simples, com âmbito, prazos e valores.",
  items: [
    { name: "Projeto fechado", text: "Um valor fixo por um âmbito definido. Sinal de 50% para arrancar, o resto na entrega.", for: "Negócios e agências" },
    { name: "Mensalidade", text: "Manutenção, melhorias e acompanhamento, mês a mês, sem fidelização longa.", for: "Negócios e agências" },
    { name: "Revenda para agências", text: "Um preço fixo por cliente. A agência define o preço final e fica com a margem.", for: "Agências" },
    { name: "Percentagem", text: "Em vez de preço fixo, uma percentagem do que o projeto gera ou do contrato da agência. Risco partilhado.", for: "Parcerias" },
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
