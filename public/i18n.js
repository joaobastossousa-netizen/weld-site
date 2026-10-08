/* Weld · versão inglesa do site.
   Carregado com defer antes dos scripts do site: quando a língua é EN, troca o texto da página
   (texto, placeholders, aria-label, title, data-t) antes de as animações partirem os títulos.
   O texto que os scripts escrevem depois (demos, formulários) é trocado por um MutationObserver.
   A escolha fica no localStorage ("weld-lang") e também se pode forçar com ?lang=en ou ?lang=pt. */
(function () {
  var KEY = "weld-lang";
  var q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "pt") { try { localStorage.setItem(KEY, q); } catch (e) {} }
  var lang = "pt";
  try { lang = localStorage.getItem(KEY) === "en" ? "en" : "pt"; } catch (e) {}
  window.WELD_LANG = lang;

  var EN = {
    // navegação e geral
    "Início": "Home", "Serviços": "Services", "Para agências": "For agencies", "Sobre": "About", "Contacto": "Contact", "Contactos": "Contacts",
    "Abrir menu": "Open menu", "Principal": "Main", "Saltar para o conteúdo": "Skip to content", "Voltar ao topo": "Back to top", "Voltar": "Back",
    "Hora no Porto": "Time in Porto", "Todos os serviços": "All services", "Weld, início": "Weld, home", "Continua a descer": "Keep scrolling",
    "Pedir demo grátis": "Get a free demo", "Pedir demo": "Get a demo", "Demo grátis": "Free demo", "grátis": "free", "Fazer um pedido": "Make a request",
    "Saber mais": "Learn more", "Vamos": "Let's go", "Vamos a isso": "Let's do it", "Enviar": "Send", "Enviar pedido": "Send request",
    "Weld · Soldamos IA ao teu negócio": "Weld · We weld AI into your business",
    "Contacto · Weld": "Contact · Weld", "Sobre · Weld": "About · Weld", "Serviços · Weld": "Services · Weld", "Para agências · Weld": "For agencies · Weld",
    "Pedido detalhado · Weld": "Detailed request · Weld", "Assistentes de IA · Weld": "AI assistants · Weld", "Automações · Weld": "Automations · Weld",
    "Sites e landing pages · Weld": "Websites and landing pages · Weld", "Software à medida · Weld": "Custom software · Weld",
    "© 2026 Weld · Assistentes de IA, automações e sites": "© 2026 Weld · AI assistants, automations and websites",
    "Estúdio de automação com IA": "AI automation studio",
    "Assistentes de IA, automações e sites feitos à medida. Trabalhamos diretamente com empresas e, por trás, para os clientes de agências de marketing.": "AI assistants, automations and custom-built websites. We work directly with businesses and, behind the scenes, for the clients of marketing agencies.",
    "Assistentes de IA, automações, sites e software à medida para agências e negócios.": "AI assistants, automations, websites and custom software for agencies and businesses.",
    "Assistentes que respondem, automações que fazem o trabalho repetido, sites e software à medida. Para negócios, e para agências que revendem com a sua marca.": "Assistants that reply, automations that do the repetitive work, websites and custom software. For businesses, and for agencies that resell under their own brand.",
    "Porto": "Porto", "Porto, PT": "Porto, PT", "no Porto.": "in Porto.",

    // home
    "Soldamos IA ao teu negócio.": "We weld AI into your business.",
    "Soldar é juntar duas peças numa só.": "Welding is joining two pieces into one.",
    "Nós soldamo-las.": "We weld them together.", "Só não falam umas com as outras.": "They just don't talk to each other.",
    "O teu negócio já tem as peças:": "Your business already has the pieces:", "mensagens,": "messages,", "agenda,": "calendar,", "faturas e": "invoices and", "clientes.": "customers.",
    "É o que fazemos: pegamos em mensagens soltas, ferramentas que não falam entre si e trabalho repetido, e juntamos tudo num fluxo que funciona sozinho.": "That's what we do: we take scattered messages, tools that don't talk to each other and repetitive work, and join it all into a flow that runs on its own.",
    "Não vendemos uma ferramenta nem um chatbot genérico. Sentamo-nos contigo, vemos o que se faz à mão e ligamos o que já usas. Entregamos a funcionar e ficamos por perto.": "We don't sell a tool or a generic chatbot. We sit down with you, see what gets done by hand and connect what you already use. We hand it over working and stay close.",
    "Percebemos o que o teu negócio precisa, construímos à medida e ficamos por perto depois da entrega.": "We understand what your business needs, build it to measure and stay close after delivery.",
    "Duas formas de": "Two ways to", "trabalhar connosco.": "work with us.", "Duas formas de trabalhar com a Weld.": "Two ways to work with Weld.",
    "Diretamente com a Weld": "Directly with Weld", "Revenda através da tua agência": "Resale through your agency",
    "Para o teu negócio": "For your business", "Para a agência": "For the agency", "Para a Weld": "For Weld",
    "Contratas-nos a nós.": "You hire us.", "Revendes com a tua marca. Nós construímos.": "You resell under your brand. We build.",
    "Trabalhamos diretamente com negócios e também por trás de agências, que revendem o nosso trabalho aos seus clientes.": "We work directly with businesses and also behind agencies, who resell our work to their clients.",
    "Trabalhamos para os clientes da tua agência, por trás e com o nome da agência. Tu vendes ao preço que quiseres e ficas com a margem.": "We work for your agency's clients, behind the scenes and under the agency's name. You sell at the price you want and keep the margin.",
    "falas sempre com o João": "you always talk to João",
    "Marca branca: o cliente vê a tua agência": "White label: the client sees your agency",
    "Revenda: preço fixo por cliente, a margem é tua": "Resale: fixed price per client, the margin is yours",
    "Sem contratar ninguém: nós construímos e mantemos": "No hiring: we build and maintain",
    "Feito para o teu negócio, nada genérico": "Made for your business, nothing generic",
    "Demo antes da venda": "Demo before the sale", "Mostrar antes de vender": "Show before you sell",
    "Quatro coisas": "Four things", "que soldamos.": "we weld.", "O que faz.": "What it does.", "O que faz": "What it does",
    "Podes começar por uma e juntar as outras quando fizer sentido. A maioria começa pelo assistente.": "You can start with one and add the others when it makes sense. Most start with the assistant.",
    "Podem começar por um serviço e juntar outros quando fizer sentido. A maioria começa pelo assistente de IA.": "You can start with one service and add others when it makes sense. Most start with the AI assistant.",
    "Três serviços, três exemplos. Não são vídeos: arrasta, carrega e vê o que acontece.": "Three services, three examples. They're not videos: drag, click and see what happens.",
    "Um fluxo como os que construímos. Arrasta os blocos, ou carrega em Testar fluxo.": "A flow like the ones we build. Drag the blocks, or click Test flow.",
    "Exemplo de um fluxo da Weld: mensagens e faturas a entrar, a Weld no meio, marcações e registos a sair": "Example of a Weld flow: messages and invoices coming in, Weld in the middle, bookings and records going out",
    "Testar fluxo": "Test flow", "Fluxo": "Flow", "Editor": "Editor", "Execuções": "Runs", "execuções": "runs", "A correr · 37 execuções hoje": "Running · 37 runs today",
    "fluxo da página inicial": "home page flow", "ao fluxo ligado.": "to the live flow.", "Enquanto esperas, experimenta o": "While you wait, try the",
    "Se os teus clientes escrevem, marcam ou encomendam, dá para automatizar.": "If your customers write, book or order, it can be automated.",
    "Trabalho repetido, feito à mão?": "Repetitive work, done by hand?", "fazer à mão?": "do by hand?", "Mostra-nos.": "Show us.",
    "Mostra-nos como trabalhas. Em poucos dias vês a Weld a funcionar no teu negócio, de graça.": "Show us how you work. In a few days you'll see Weld working in your business, for free.",
    "Quanto te custa": "What it costs you", "Mexe nos valores do teu negócio. Fazemos as contas ao tempo que hoje vai para trabalho que dá para automatizar.": "Change the numbers for your business. We work out the time that today goes into work that could be automated.",
    "Horas por semana em tarefas repetidas": "Hours per week on repetitive tasks", "Pessoas na equipa": "People on the team", "Custo de uma hora da equipa": "Cost of one team hour",
    "Mensagens de clientes por dia": "Customer messages per day", "Minutos por resposta": "Minutes per reply",
    "Por mês, vai para trabalho automatizável": "Per month, goes into work that could be automated", "em tempo da equipa, todos os meses": "in team time, every month",
    "dias de trabalho por mês": "working days per month", "horas": "hours",
    "Estimativa com os números que puseste, a contar 22 dias úteis por mês.": "Estimate based on the numbers you entered, counting 22 working days a month.",
    "Como trabalhamos": "How we work", "Do primeiro café": "From the first coffee", "Do primeiro contacto à entrega.": "From first contact to delivery.",
    "Perguntas frequentes.": "Frequently asked questions.", "Dúvidas e preços": "Questions and pricing", "Perguntas": "Questions",
    "Vamos": "Let's", "soldar?": "weld?", "de falar connosco.": "to talk to us.",
    "Preferes ver primeiro a funcionar?": "Rather see it working first?", "Preferes falar já?": "Rather talk now?",
    "Café no Porto ou chamada": "Coffee in Porto or a call", "Café no Porto ou chamada.": "Coffee in Porto or a call.",
    "Contas-nos o que te come tempo. Café no Porto ou chamada.": "Tell us what eats up your time. Coffee in Porto or a call.",
    "Respondes ao João, não a um robô. Normalmente no próprio dia.": "You reply to João, not to a robot. Usually the same day.",
    "Falamos por WhatsApp": "We talk on WhatsApp", "Falemos por WhatsApp": "Let's talk on WhatsApp",
    "Ver isto a funcionar no meu negócio": "See this working in my business", "Quero isto no meu negócio": "I want this in my business", "Quero isto para mim": "I want this for me",
    "Exemplos": "Examples", "exemplo": "example", "Dados de exemplo": "Sample data", "Marcas e números de exemplo.": "Sample brands and numbers.",
    "Setores e ferramentas": "Sectors and tools", "Liga-se ao que já usam": "Connects to what you already use",
    "E a outras ferramentas, se tiverem forma de se ligar.": "And to other tools, if they have a way to connect.",

    // serviços
    "Assistente": "Assistant", "Assistente de IA": "AI assistant", "Assistentes de IA": "AI assistants", "Automação": "Automation", "Automações": "Automations",
    "Sites e landing pages": "Websites and landing pages", "Software à medida": "Custom software", "Site": "Website", "site": "website",
    "Assistente e automações": "Assistant and automations", "Outros serviços.": "Other services.",
    "Ver assistentes de IA": "See AI assistants", "Ver automações": "See automations", "Ver sites e landing pages": "See websites and landing pages", "Ver software à medida": "See custom software",
    "Respondem, marcam e qualificam.": "They reply, book and qualify.", "Liga ferramentas": "Connects tools", "Rápidos e feitos para converter": "Fast and built to convert",
    "Quando nada serve": "When nothing fits", "Um assistente que responde enquanto a equipa dorme.": "An assistant that replies while the team sleeps.",
    "Respondem, dão preços e marcam a qualquer hora. Passam a uma pessoa quando é preciso.": "They reply, give prices and book at any hour. They hand over to a person when needed.",
    "Conhece os vossos preços, horários e serviços. Responde no WhatsApp, no Instagram e no site, marca, e passa a uma pessoa quando o pedido foge ao normal.": "It knows your prices, opening hours and services. It replies on WhatsApp, Instagram and your website, books, and hands over to a person when a request is out of the ordinary.",
    "Ligam formulários, agenda, CRM e email. O que hoje se copia à mão passa a acontecer sozinho.": "They connect forms, calendar, CRM and email. What gets copied by hand today starts happening on its own.",
    "Descobrimos as tarefas que comem horas todas as semanas e ligamos as ferramentas que já usam para que aconteçam sem ninguém.": "We find the tasks that eat hours every week and connect the tools you already use so they happen without anyone.",
    "O que se faz sempre igual passa a fazer-se sozinho.": "What's always done the same way starts doing itself.",
    "Sites que explicam em 5 segundos e trazem contactos.": "Websites that explain in 5 seconds and bring in leads.", "Sites rápidos que trazem contactos.": "Fast websites that bring in leads.",
    "Sites institucionais e landing pages rápidos, bonitos no telemóvel e feitos para uma coisa: que quem entra perceba o que fazem e fale convosco.": "Company websites and landing pages that are fast, look great on mobile and are built for one thing: visitors understand what you do and get in touch.",
    "Rápidos, claros e feitos para trazer contactos. Com o assistente lá dentro, se quiserem.": "Fast, clear and built to bring in leads. With the assistant inside, if you want.",
    "Quando nenhuma ferramenta serve, fazemos a vossa.": "When no tool fits, we build yours.",
    "Painéis internos, integrações e pequenos produtos, quando nada do que existe serve.": "Internal dashboards, integrations and small products, when nothing out there fits.",
    "Painéis internos, integrações entre sistemas e pequenos produtos digitais, feitos à medida do vosso processo e não o contrário.": "Internal dashboards, integrations between systems and small digital products, built around your process and not the other way round.",
    "Tudo o que liga a vossa empresa aos clientes.": "Everything that connects your company to its customers.",
    "Como entra no teu negócio.": "How it fits into your business.", "Para quem é.": "Who it's for.", "Os pormenores": "The details", "Quem usa": "Who uses it",
    "Onde responde": "Where it replies", "WhatsApp, Instagram e site": "WhatsApp, Instagram and website", "WhatsApp, Instagram, Google": "WhatsApp, Instagram, Google",
    "WhatsApp Business, Instagram e o chat do site, com a agenda que já usam.": "WhatsApp Business, Instagram and the website chat, with the calendar you already use.",
    "Sabe": "Knows", "Preços, horários e regras da casa": "Prices, opening hours and house rules", "Preços, horários, serviços e regras da casa. Revês tudo antes de ligar.": "Prices, hours, services and house rules. You review everything before it goes live.",
    "Marca e lembra": "Books and reminds", "Vê as vagas reais da agenda, marca e envia lembrete na véspera.": "Sees the real slots in the calendar, books and sends a reminder the day before.",
    "Sabe parar": "Knows when to stop", "Passa a uma pessoa da equipa": "Hands over to a team member",
    "Passa a conversa a uma pessoa da equipa. Nunca inventa preços, stock ou diagnósticos.": "Hands the conversation to a team member. Never makes up prices, stock or diagnoses.",
    "Qualifica pedidos": "Qualifies requests", "Pergunta o que falta antes de passar à equipa.": "Asks what's missing before passing it to the team.",
    "Várias línguas": "Multiple languages", "Falar como gente": "Talks like a person", "Dá preços certos": "Gives the right prices", "Passar a uma pessoa": "Hand over to a person", "Se não souber": "If it doesn't know",
    "Só os valores que nos derem. Nunca inventa.": "Only the figures you give us. It never makes things up.",
    "Reclamações, urgências e casos estranhos vão logo para uma pessoa.": "Complaints, emergencies and odd cases go straight to a person.",
    "Resposta em segundos, a qualquer hora": "Replies in seconds, at any hour", "Mensagens por responder à noite e ao fim de semana": "Messages left unanswered at night and at weekends",
    "Preços e horários respondidos no Instagram": "Prices and hours answered on Instagram", "Marcações pelo WhatsApp com lembrete na véspera": "WhatsApp bookings with a reminder the day before",
    "Marcações diretas na agenda, com lembrete": "Bookings straight into the calendar, with a reminder", "Pedidos qualificados antes de chegarem à equipa": "Requests qualified before they reach the team",
    "Clientes que desistem à espera de resposta": "Customers who give up waiting for a reply", "Alguém ao telefone só para marcar": "Someone on the phone just to take bookings",
    "Ensinamos o assistente": "We train the assistant", "Ligamos aos vossos canais": "We connect your channels", "Assistente treinado": "Trained assistant",
    "Responde connosco a vigiar. Afinamos o tom e as respostas.": "It replies while we watch. We fine-tune the tone and the answers.",
    "Percebemos que perguntas chegam, a que horas e quem responde hoje.": "We learn which questions come in, at what times and who answers them today.",
    "Semana de teste": "Test week", "Fica a correr": "Left running", "Ligado e acompanhado": "Connected and looked after",
    "Instalamos, ligamos ao WhatsApp e ficamos a manter. Sem contratar ninguém.": "We install it, connect it to WhatsApp and keep maintaining it. No hiring needed.",
    "Construímos, ligamos ao WhatsApp e ficamos a manter, mês a mês.": "We build it, connect it to WhatsApp and keep maintaining it, month by month.",
    "Copiar dados de um sítio para outro": "Copying data from one place to another", "Faturas e lembretes que ficam esquecidos": "Invoices and reminders that get forgotten",
    "Relatórios montados à mão à sexta à tarde": "Reports put together by hand on Friday afternoon", "Pedidos perdidos na caixa de email": "Requests lost in the inbox",
    "Excel partilhado com versões trocadas": "Shared Excel with mixed-up versions", "Três programas que não falam entre si": "Three programs that don't talk to each other",
    "Processos que dependem de uma só pessoa": "Processes that depend on a single person", "Ligação entre sistemas que não falam entre si": "Connection between systems that don't talk to each other",
    "Os dados passam sozinhos entre ferramentas": "Data moves between tools on its own", "Nada fica esquecido e fica tudo registado": "Nothing gets forgotten and everything is recorded",
    "Os números da semana chegam sozinhos, sem montar folhas à mão.": "The week's numbers arrive on their own, without building spreadsheets by hand.",
    "Cada pedido vai direto a quem o trata": "Each request goes straight to whoever handles it", "Quando entra um pedido importante, a pessoa certa sabe logo.": "When an important request comes in, the right person knows straight away.",
    "Sistemas que não falavam passam a falar.": "Systems that didn't talk start talking.", "Sistemas sincronizados sozinhos": "Systems that sync on their own",
    "Faturação, loja online, stock e CRM sincronizados.": "Invoicing, online shop, stock and CRM in sync.", "Formulários, folhas de cálculo, CRM, agenda e email a falarem entre si.": "Forms, spreadsheets, CRM, calendar and email talking to each other.",
    "Com registo de tudo o que faz e aviso imediato se algo falhar.": "With a log of everything it does and an instant alert if something fails.",
    "Rascunhos e seguimentos prontos, revistos antes de sair.": "Drafts and follow-ups ready, reviewed before they go out.",
    "Mapeamos as tarefas": "We map the tasks", "Listamos com a equipa o que se faz à mão todas as semanas e quanto tempo leva.": "We list with the team what's done by hand every week and how long it takes.",
    "Escolhemos por onde começar": "We choose where to start", "Primeiro o que poupa mais horas com menos risco.": "First whatever saves the most hours with the least risk.",
    "Ligamos as ferramentas": "We connect the tools", "Testamos com dados reais": "We test with real data", "Corre em paralelo com o processo atual até dar sempre certo.": "It runs alongside the current process until it always gets it right.",
    "Automações ligadas": "Automations connected", "Menos trabalho repetido": "Less repetitive work",
    "Ferramentas que usam": "Tools you use", "As que já usam: email, folhas, CRM, faturação, agenda. Sem mudar de programas.": "The ones you already use: email, spreadsheets, CRM, invoicing, calendar. No switching programs.",
    "Quem entra percebe logo o que fazem": "Visitors instantly understand what you do", "Cada página tem um objetivo claro e um botão para lá chegar.": "Every page has a clear goal and a button to get there.",
    "Rápido no telemóvel": "Fast on mobile", "Carregam num instante, também no telemóvel.": "They load in an instant, on mobile too.", "Rápido, bonito no telemóvel e com a vossa marca.": "Fast, great on mobile and with your brand.",
    "Formulários que vão direto para o CRM": "Forms that go straight to the CRM", "Formulários para o email ou CRM, assistente de IA, estatísticas e pixel dos anúncios.": "Forms to email or CRM, AI assistant, analytics and the ads pixel.",
    "Uma página por campanha, feita para converter": "One page per campaign, built to convert", "Prontos para o Google": "Ready for Google", "Pronto para anúncios": "Ready for ads",
    "Estrutura, velocidade e textos pensados para aparecer.": "Structure, speed and copy designed to be found.",
    "Escrevemos convosco. Menos texto, mais claro.": "We write it with you. Less text, more clarity.", "Textos e estrutura": "Copy and structure", "Design e construção": "Design and build",
    "Online e a medir": "Live and measuring", "Domínio e alojamento tratados, e um resumo de contactos todos os meses.": "Domain and hosting handled, and a summary of leads every month.",
    "Site antigo que ninguém atualiza": "Old website nobody updates", "Anúncios a mandar para uma página genérica": "Ads sending people to a generic page", "Não temos site": "We don't have a website",
    "Feitos para converter": "Built to convert", "Rápidos": "Fast",
    "Um só ecrã com o que a equipa precisa": "A single screen with what the team needs", "Tudo o que a equipa precisa de ver num só ecrã.": "Everything the team needs to see on one screen.",
    "Portal onde o cliente vê o estado do pedido": "Portal where the client sees the status of their request", "Um processo claro, que não depende de ninguém": "A clear process that doesn't depend on anyone",
    "Código limpo, documentado e vosso.": "Clean, documented code, and yours.", "Código e documentação vossos. Manutenção opcional.": "Code and documentation are yours. Maintenance optional.",
    "Descoberta": "Discovery", "Seguimos o processo de ponta a ponta e desenhamos o que falta.": "We follow the process end to end and design what's missing.",
    "Protótipo clicável": "Clickable prototype", "Vês e experimentas antes de escrevermos código.": "You see and try it before we write code.",
    "Construção por etapas": "Built in stages", "Entregas frequentes, sempre com algo a funcionar.": "Frequent deliveries, always with something working.",
    "Entrega e manutenção": "Delivery and maintenance", "Painéis internos": "Internal dashboards", "Integrações": "Integrations", "Produtos e MVPs": "Products and MVPs",
    "Empresas com processos próprios": "Companies with their own processes", "Equipas de operações": "Operations teams", "Equipas comerciais": "Sales teams", "Startups": "Startups",
    "Feito para durar": "Built to last", "Ligação aos sistemas": "Connection to your systems",

    // como trabalhamos / preço
    "Conversa de 20 minutos": "20-minute conversation", "Percebemos o que querem resolver. Sem compromisso.": "We understand what you want to solve. No commitment.",
    "Construímos com o teu negócio": "We build it with your business", "Construímos um exemplo com o teu negócio: serviços, preços e marca.": "We build an example with your business: services, prices and brand.",
    "Mostramos a funcionar. Se fizer sentido, recebes a proposta por escrito.": "We show it working. If it makes sense, you get the proposal in writing.",
    "Testamos com a tua equipa, ligamos tudo e ficamos por perto.": "We test with your team, connect everything and stay close.", "Testamos convosco, ligamos tudo e ficamos por perto.": "We test with you, connect everything and stay close.",
    "Primeiro mostramos, depois falamos de preço.": "First we show, then we talk price.", "Fazemos a demo primeiro. Ninguém devia comprar automação às cegas.": "We do the demo first. Nobody should buy automation blind.",
    "Preparamos um exemplo real, feito para ti, não um modelo genérico.": "We prepare a real example, made for you, not a generic template.",
    "Antes de pagares alguma coisa, vês a Weld a funcionar com o teu negócio: os teus serviços, os teus preços, a tua marca.": "Before you pay anything, you see Weld working with your business: your services, your prices, your brand.",
    "antes de pagares nada": "before you pay anything", "Sem compromisso. Se não avançares, não pagas nada.": "No commitment. If you don't go ahead, you pay nothing.",
    "Apresentamos em 20 minutos": "We present it in 20 minutes", "Marcamos 20 minutos": "We book 20 minutes", "Apresentação · 20 min": "Presentation · 20 min",
    "Proposta fechada e por escrito": "Fixed proposal, in writing", "Proposta por escrito": "Proposal in writing", "Recebes a proposta": "You get the proposal",
    "Âmbito, prazo e valor": "Scope, deadline and price", "Âmbito, prazo e valor fechados antes de começar.": "Scope, deadline and price agreed before we start.",
    "Âmbito, prazo e valor fechados. Sem surpresas.": "Scope, deadline and price agreed. No surprises.", "Âmbito, prazo e valor por escrito.": "Scope, deadline and price in writing.",
    "Depois de uma conversa de descoberta, com âmbito e prazo por escrito.": "After a discovery conversation, with scope and deadline in writing.",
    "Dias, não meses": "Days, not months", "Dias, não meses. Mostramos o progresso pelo caminho.": "Days, not months. We show progress along the way.",
    "Vês o progresso pelo caminho e dizes o que mudar.": "You see progress along the way and tell us what to change.", "Em poucos dias": "In a few days",
    "Da ideia a uma primeira versão que se pode mostrar.": "From the idea to a first version you can show.",
    "Entrega e acompanhamento": "Delivery and follow-up", "Configuramos, testamos com a equipa do cliente e ligamos tudo.": "We set it up, test it with the client's team and connect everything.",
    "Acompanhamento mensal, se quiseres": "Monthly follow-up, if you want", "Manutenção, melhorias e acompanhamento, mês a mês, sem fidelização longa.": "Maintenance, improvements and follow-up, month by month, with no long lock-in.",
    "Como fechamos negócio.": "How we close a deal.", "Cada projeto tem o modelo que faz mais sentido. Tudo fica num contrato simples, com âmbito, prazos e valores.": "Each project gets the model that makes most sense. Everything goes into a simple contract, with scope, deadlines and prices.",
    "Projeto fechado": "Fixed project", "Um valor fixo por um âmbito definido. Sinal de 50% para arrancar, o resto na entrega.": "A fixed price for a defined scope. 50% deposit to start, the rest on delivery.",
    "Mensalidade": "Monthly fee", "Revenda (agência)": "Resale (agency)", "Percentagem": "Percentage",
    "Um valor por cliente. O que a agência cobrar a mais é margem dela.": "One price per client. Whatever the agency charges on top is its margin.",
    "Em vez de preço fixo, uma percentagem do que o projeto gera ou do contrato da agência. Risco partilhado.": "Instead of a fixed price, a percentage of what the project generates or of the agency's contract. Shared risk.",
    "Como preferem pagar": "How you prefer to pay",

    // FAQ
    "Quanto tempo demora?": "How long does it take?", "Quanto tempo leva a pôr a funcionar?": "How long does it take to get running?",
    "Um assistente simples fica pronto em poucos dias.": "A simple assistant is ready in a few days.",
    "Um assistente simples fica pronto em poucos dias. Projetos maiores têm o prazo escrito na proposta.": "A simple assistant is ready in a few days. Bigger projects have the deadline written in the proposal.",
    "Como se define o preço?": "How is the price set?", "Precisamos de mudar de programas?": "Do we need to change programs?", "Normalmente não. A ideia é ligar o que já existe.": "Usually not. The idea is to connect what already exists.",
    "Que ferramentas usam?": "Which tools do you use?", "As que já têm, sempre que possível. Quando falta alguma peça, usamos n8n ou Make.": "The ones you already have, whenever possible. When a piece is missing, we use n8n or Make.",
    "E se o assistente não souber responder?": "What if the assistant doesn't know the answer?", "E se uma automação falhar?": "What if an automation fails?",
    "Fica registado e avisamos. Na mensalidade, tratamos nós disso.": "It's logged and we let you know. On the monthly plan, we handle it.",
    "A equipa continua a ver as conversas?": "Can the team still see the conversations?", "Sim. Pode entrar em qualquer conversa a meio, e o assistente para de responder.": "Yes. They can step into any conversation midway, and the assistant stops replying.",
    "Usa a API oficial do WhatsApp?": "Does it use the official WhatsApp API?", "Sim. Ligamos pela WhatsApp Business Platform da Meta, com o número do negócio.": "Yes. We connect through Meta's WhatsApp Business Platform, with the business's own number.",
    "Trabalham fora do Porto?": "Do you work outside Porto?", "Sim. Estamos no Porto, mas quase tudo se faz à distância.": "Yes. We're in Porto, but almost everything can be done remotely.",
    "Dão manutenção?": "Do you offer maintenance?", "Sim, numa mensalidade opcional.": "Yes, on an optional monthly plan.",
    "O código fica nosso?": "Is the code ours?", "Sim. Entregamos tudo, com instruções para continuar.": "Yes. We hand everything over, with instructions to carry on.",
    "Quanto custa um site?": "How much does a website cost?", "Podemos editar os textos?": "Can we edit the copy?", "Sim. Fica tudo organizado para mudar textos sem mexer no resto.": "Yes. Everything is set up so you can change the copy without touching the rest.",
    "Tratam do domínio e do alojamento?": "Do you handle the domain and hosting?", "Tratamos, e explicamos cada passo.": "We do, and we explain every step.",
    "Fazem só landing pages?": "Do you only do landing pages?", "Fazemos as duas coisas: páginas únicas para campanhas e sites completos.": "We do both: single pages for campaigns and full websites.",
    "Fazem lojas online?": "Do you build online shops?", "Os clientes da agência sabem que somos nós?": "Do the agency's clients know it's us?",
    "Só se a agência quiser. Em white label trabalhamos com a marca dela e falamos com o cliente final apenas quando nos pedem.": "Only if the agency wants. In white label we work under its brand and only talk to the end client when asked.",
    "APIs oficiais, dados guardados com cuidado, nada de truques.": "Official APIs, data stored carefully, no tricks.", "Só APIs oficiais": "Official APIs only", "Só o que é oficial": "Only what's official",
    "As oficiais: a API do WhatsApp Business e do Instagram, a vossa agenda e o vosso CRM. Nada de contas falsas nem truques.": "The official ones: the WhatsApp Business and Instagram APIs, your calendar and your CRM. No fake accounts and no tricks.",
    "Sem jargão. Explicamos o que fazemos em frases normais.": "No jargon. We explain what we do in plain sentences.",
    "Sem parar o que já funciona. Começamos pequeno, testamos com a equipa e só depois fica a trabalhar sozinho.": "Without stopping what already works. We start small, test with the team and only then leave it working on its own.",
    "A equipa só entra quando é mesmo preciso": "The team only steps in when it's really needed", "A equipa só recebe o que precisa de uma pessoa. Acompanhamos todos os meses.": "The team only gets what needs a person. We follow up every month.",
    "Sem contratar nem formar ninguém": "No hiring or training anyone", "Um ponto de contacto": "One point of contact",

    // agências
    "Agências": "Agencies", "Agência": "Agency", "Para agências de marketing": "For marketing agencies", "Agências de marketing": "Marketing agencies", "Parcerias": "Partnerships",
    "Vendemos nós, fazem vocês": "We sell, you build", "Vocês vendem": "You sell", "Vocês vendem. Nós construímos.": "You sell. We build.", "Nós entregamos": "We deliver", "A agência vende": "The agency sells",
    "A Weld constrói e mantém": "Weld builds and maintains", "A Weld cobra um preço fixo": "Weld charges a fixed price", "A relação é vossa": "The relationship is yours", "Ganham os dois.": "Both win.",
    "Já têm os clientes e a confiança. Juntamos a parte técnica para venderem assistentes de IA e automações com o vosso nome, sem contratar ninguém.": "You already have the clients and their trust. We add the technical side so you can sell AI assistants and automations under your name, without hiring anyone.",
    "Funciona como externalização: vocês vendem, nós fazemos. Ninguém compete com ninguém.": "It works like outsourcing: you sell, we build. Nobody competes with anybody.",
    "Não fazemos marketing: não vos tiramos clientes": "We don't do marketing: we won't take your clients", "Projetos sem andar à procura de clientes": "Projects without hunting for clients",
    "Projetos sem andar à procura de clientes. Não fazemos marketing, por isso não competimos convosco.": "Projects without hunting for clients. We don't do marketing, so we don't compete with you.",
    "Trabalhamos por trás, com a vossa marca": "We work behind the scenes, under your brand", "O cliente vê a vossa marca. Nós ficamos nos bastidores, a não ser que queiram outra coisa.": "The client sees your brand. We stay behind the scenes, unless you want otherwise.",
    "Vocês definem o preço final ao cliente": "You set the final price for the client", "Vocês falam com o cliente e definem o preço final.": "You talk to the client and set the final price.",
    "Vocês falam com o cliente e ficam com a margem. Nós respondemos a vocês.": "You talk to the client and keep the margin. We answer to you.",
    "Um preço fixo por cliente. A agência define o preço final e fica com a margem.": "A fixed price per client. The agency sets the final price and keeps the margin.",
    "Um serviço novo, com margem e mensalidade de manutenção": "A new service, with margin and a monthly maintenance fee",
    "Um serviço novo para vender, com margem e mensalidade de manutenção, e clientes mais ligados a vocês.": "A new service to sell, with margin and a monthly maintenance fee, and clients more attached to you.",
    "Clientes mais ligados à agência": "Clients more attached to the agency", "Um parceiro que conhece o cliente e leva a demo à reunião": "A partner who knows the client and brings the demo to the meeting",
    "Escolhem um cliente": "You pick a client", "Escolhem um cliente, nós preparamos a demo com a marca e os serviços dele, e apresentamos convosco ou só a vocês.": "You pick a client, we prepare the demo with their brand and services, and present it with you or just to you.",
    "Mandam-nos o site e o Instagram de um cliente que recebe muitas mensagens.": "Send us the website and Instagram of a client who gets lots of messages.",
    "Mandem-nos o site e o Instagram dele. Fazemos a demo.": "Send us their website and Instagram. We build the demo.", "Fazemos a demo": "We build the demo",
    "Fazemos a demo para o vosso cliente, de graça.": "We build the demo for your client, for free.", "Fazemos uma demo com o nome e os dados do vosso cliente para levarem à reunião.": "We build a demo with your client's name and details for you to take to the meeting.",
    "Em poucos dias têm uma demo a funcionar com o nome dele.": "In a few days you'll have a working demo with their name.", "Mostram a demo na reunião e fecham, com o vosso preço.": "You show the demo in the meeting and close, at your price.",
    "Como funciona a parceria.": "How the partnership works.", "Como funciona a revenda.": "How resale works.", "Ver como funciona com agências": "See how it works with agencies",
    "Propor uma parceria": "Propose a partnership", "Ser agência parceira": "Become a partner agency", "Quero revender": "I want to resell", "Revenda para agências": "Resale for agencies",
    "Campanhas de agências": "Agency campaigns", "Demo grátis para um cliente": "Free demo for a client", "Marca branca (nome da agência)": "White label (agency name)", "White label": "White label",
    "Pode aparecer a Weld": "Weld can appear", "Cliente da agência": "Agency's client", "Para o cliente da agência": "For the agency's client", "Para a própria agência": "For the agency itself",
    "Agência, para nós": "Agency, for us", "Agência, para um cliente": "Agency, for a client", "Nº de clientes onde isto pode entrar": "No. of clients where this could fit",

    // sobre
    "Sobre a Weld": "About Weld", "Quem somos": "Who we are", "Três pessoas. Um ponto de contacto.": "Three people. One point of contact.",
    "Tudo chega primeiro ao João. Depois dividimos o trabalho, ou fazemos juntos quando o projeto pede.": "Everything reaches João first. Then we split the work, or do it together when the project calls for it.",
    "Fundador": "Founder", "Sócio e builder": "Partner and builder",
    "Primeiro contacto em todos os projetos. Constrói os assistentes e as automações e acompanha cada cliente do início ao fim.": "First contact on every project. Builds the assistants and automations and follows each client from start to finish.",
    "Constrói connosco quando o projeto pede duas cabeças, e divide o trabalho quando é mais rápido assim.": "Builds with us when a project needs two heads, and splits the work when that's faster.",
    "Trata do vídeo e do conteúdo da Weld e publica-o nas nossas redes. É quem mostra o que fazemos, semana a semana.": "Handles Weld's video and content and publishes it on our socials. He's the one who shows what we do, week by week.",
    "Sabem sempre com quem falar.": "You always know who to talk to.", "Negócios e agências": "Businesses and agencies", "Pequenos negócios": "Small businesses", "Profissionais independentes": "Independent professionals",

    // contacto / pedido
    "Conta-nos": "Tell us", "o que precisas.": "what you need.", "O que precisas?": "What do you need?", "Quem és?": "Who are you?", "Quem são?": "Who are you?",
    "Tenho um negócio": "I have a business", "Sou uma agência": "I'm an agency", "Empresa ou agência": "Company or agency", "Para a minha empresa": "For my company",
    "Três passos e fica connosco. Respondemos em 24 horas úteis.": "Three steps and it's with us. We reply within 24 working hours.",
    "Dois minutos: dizes o que fazes e mandas o site ou o Instagram.": "Two minutes: tell us what you do and send your website or Instagram.",
    "Pede a demo grátis": "Ask for the free demo", "Pedes a demo": "You ask for the demo", "Envias o pedido": "You send the request",
    "Fazemos a tua demo, de graça.": "We build your demo, for free.", "Experimenta antes": "Try it first", "Preferes que": "Would you rather",
    "Já sabes o que queres?": "Already know what you want?", "Já sabes o que queres? Faz o pedido.": "Already know what you want? Make a request.",
    "Já sabes o que queres? Salta a demo e faz o pedido": "Already know what you want? Skip the demo and make a request", "Já sei o que quero": "I know what I want",
    "Salta a demo: pedido detalhado para site, automação ou assistente. Ligamos nós, se preferires.": "Skip the demo: a detailed request for a website, automation or assistant. We'll call you, if you prefer.",
    "Sem demo, sem voltas. Conta-nos o projeto com detalhe e respondemos com perguntas certas ou uma proposta. Quanto mais disseres, mais rápido fica.": "No demo, no detours. Tell us about the project in detail and we'll reply with the right questions or a proposal. The more you tell us, the faster it goes.",
    "Pedido detalhado": "Detailed request", "O teu pedido": "Your request", "Resumo do pedido": "Request summary", "Copiar pedido": "Copy request", "Pedido copiado": "Request copied",
    "Pedido enviado.": "Request sent.", "Recebido.": "Received.", "Chega-nos na hora, no telemóvel.": "It reaches us instantly, on our phones.", "Chega-nos na hora. Respondemos em 24 horas úteis.": "It reaches us instantly. We reply within 24 working hours.",
    "Já está connosco. Respondemos em 24 horas úteis.": "It's with us. We reply within 24 working hours.", "Já está connosco. Respondemos por email em 24 horas úteis.": "It's with us. We'll reply by email within 24 working hours.",
    "O pedido também ficou copiado. Se o email não abrir, cola-o numa mensagem para": "The request has also been copied. If the email doesn't open, paste it into a message to",
    "Se o email não abrir, escreve-nos para": "If the email doesn't open, write to us at", "Não deu para copiar": "Couldn't copy", "Email copiado": "Email copied", "copiar": "copy",
    "Nome": "Name", "Nome *": "Name *", "Email": "Email", "Telefone": "Phone", "Telemóvel": "Mobile", "Cargo": "Role", "Setor": "Sector", "Negócio": "Business", "Site ou Instagram": "Website or Instagram",
    "Site ou Instagram do negócio, e o que fazem": "The business's website or Instagram, and what you do", "O teu negócio": "Your business", "O contexto": "The context", "O que querem?": "What do you want?",
    "Em duas linhas, o que querem resolver?": "In two lines, what do you want to solve?", "Descreve o que tens em mente": "Describe what you have in mind", "Mais alguma coisa?": "Anything else?", "Só mais isto.": "Just one more thing.",
    "Como falamos contigo?": "How should we reach you?", "Melhor altura": "Best time", "Preferência": "Preference", "Tanto faz": "Either is fine", "Manhã": "Morning", "Tarde": "Afternoon",
    "Prefiro falar": "I'd rather talk", "Prefiro falar por WhatsApp.": "I'd rather talk on WhatsApp.", "Prefiro que me liguem.": "I'd rather you call me.", "Prefiro resposta por email.": "I'd rather get a reply by email.",
    "Te liguemos": "we call you", "Respondamos por email": "we reply by email",
    "Deixa o teu telemóvel para te ligarmos (ou escolhe email).": "Leave your mobile number so we can call you (or choose email).", "Deixa um email ou um telemóvel.": "Leave an email or a mobile number.",
    "Deixa um telemóvel ou um email para te respondermos.": "Leave a mobile number or an email so we can reply.", "Falta o nome.": "The name is missing.",
    "Escolhe pelo menos uma opção.": "Choose at least one option.", "Podes escolher mais do que um.": "You can choose more than one.",
    "Escolhe acima o que querem e aparecem aqui as perguntas certas.": "Choose above what you want and the right questions appear here.",
    "Orçamento": "Budget", "Orçamento indicativo": "Indicative budget", "Até 1.000 €": "Up to €1,000", "1.000 a 3.000 €": "€1,000 to €3,000", "3.000 a 8.000 €": "€3,000 to €8,000", "Mais de 8.000 €": "Over €8,000",
    "Prazo": "Deadline", "Sem pressa": "No rush", "1 a 3 meses": "1 to 3 months", "Ainda não sei": "Not sure yet", "ainda não sei": "not sure yet", "não indicado": "not given",
    "Outra coisa": "Something else", "Outra": "Other", "Situação": "Situation", "Melhorar o atual": "Improve the current one", "Refazer o atual": "Rebuild the current one",
    "Objetivo e público": "Goal and audience", "Quem tem de entrar, o que tem de perceber e o que queremos que faça.": "Who needs to visit, what they need to understand and what we want them to do.",
    "Site atual ou sites de que gostam": "Current website or websites you like", "Marca e cores": "Brand and colours", "Textos e fotos": "Copy and photos", "As 3 ou 4 coisas principais": "The 3 or 4 main things",
    "O que deve fazer?": "What should it do?", "Que tarefa fazem à mão hoje?": "What task do you do by hand today?", "O que usam hoje para isso": "What you use for it today",
    "Passo a passo, como se explicasses a alguém novo na equipa": "Step by step, as if explaining it to someone new on the team", "Horas por semana nisso": "Hours per week on it",
    "Quantas pessoas vão usar": "How many people will use it", "Mensagens por dia (mais ou menos)": "Messages per day (roughly)", "Onde marcam hoje": "Where you take bookings today",
    "Se isto correr bem, o que muda no vosso dia?": "If this goes well, what changes in your day?",
    "Links, exemplos, ferramentas, o que já tentaram. Ficheiros podes anexar no email.": "Links, examples, tools, what you've already tried. You can attach files in the email.",
    "Olá João,": "Hi João,", "Gostava de ver a demo grátis com o nosso negócio. Quando podemos marcar os 20 minutos?": "I'd like to see the free demo with our business. When can we book the 20 minutes?",
    "Antes de começar": "Before we start", "Data": "Date", "Hora": "Time", "Dia": "Day", "Hoje": "Today", "Fim do dia": "End of day", "Este mês": "This month", "Todos os meses": "Every month",
    "ex.: clínica dentária em Gaia": "e.g. dental clinic in Gaia", "ex.: restauração, clínica, oficina": "e.g. restaurant, clinic, garage", "ex.: sócio, gestor de marketing": "e.g. partner, marketing manager",
    "ex.: 8 na equipa": "e.g. 8 on the team", "ex.: 6 horas, 2 pessoas": "e.g. 6 hours, 2 people", "ex.: 30, sobretudo à noite": "e.g. 30, mostly at night", "ex.: 1 para já, 5 se correr bem": "e.g. 1 for now, 5 if it goes well",
    "ex.: agenda em papel, Google Calendar, software da clínica": "e.g. paper diary, Google Calendar, clinic software", "ex.: folhas de Excel partilhadas, papel, outro programa": "e.g. shared Excel sheets, paper, another program",
    "ex.: temos tudo, só logótipo, precisamos de ajuda": "e.g. we have everything, just a logo, we need help",
    "ex.: deixamos de perder marcações ao fim de semana e a rececionista ganha 2 horas por dia": "e.g. we stop losing weekend bookings and the receptionist gets 2 hours back a day",
    "por preencher": "not filled in", "0% preenchido": "0% complete", "Área de cliente": "Client area", "Equipa": "Team", "Equipa interna": "Internal team", "Clientes": "Clients", "Cliente final": "End client",
    "Cliente final (setor ou nome)": "End client (sector or name)", "Parceiros / fornecedores": "Partners / suppliers", "Quem usa": "Who uses it",
    "Livre": "Free", "Urgente": "Urgent", "Nova": "New", "Novas": "New", "nova": "new", "agora mesmo": "just now", "Estado": "Status", "Total": "Total", "Total do mês": "Month total",

    // laboratório: faturas
    "Fatura para o Excel": "Invoice to Excel", "Arrasta uma fatura para a folha, ou carrega nela.": "Drag an invoice onto the sheet, or click it.", "Arrasta para a folha, ou carrega.": "Drag onto the sheet, or click.",
    "Larga aqui uma fatura": "Drop an invoice here", "À espera de uma fatura": "Waiting for an invoice", "A Weld está a ler a fatura": "Weld is reading the invoice", "A Weld lê a fatura": "Weld reads the invoice",
    "A lançar na folha": "Adding to the sheet", "Lançada": "Added", "Lançamentos": "Entries", "Linha adicionada": "Row added", "Linha no Excel": "Row in Excel", "+1 linha": "+1 row",
    "Fatura": "Invoice", "Faturas": "Invoices", "Fatura recebida": "Invoice received", "Fatura criada": "Invoice created", "Faturado": "Invoiced", "Pago": "Paid", "Fornecedor": "Supplier", "Categoria": "Category",
    "Precisa da tua aprovação": "Needs your approval", "Aprovação da fatura": "Invoice approval", "Aprovar": "Approve", "Recusar": "Reject", "> 500 € pede aprovação": "> €500 needs approval",
    "Aprovada. Fica registado quem aprovou.": "Approved. Who approved it is recorded.", "Recusada. O fornecedor é avisado.": "Rejected. The supplier is notified.",
    "À mão: ~4 min por fatura": "By hand: ~4 min per invoice", "Faturas lidas e lançadas no Excel": "Invoices read and entered in Excel", "Caixa de entrada · faturas@": "Inbox · invoices@",
    "valor, data, NIF": "amount, date, VAT no.", "valida e decide": "validates and decides", "com fatura e prazo": "with invoice and due date", "Energia": "Energy", "Renda": "Rent", "Renda do espaço": "Premises rent",
    "Matéria-prima": "Raw materials", "Equipamento": "Equipment", "Marketing": "Marketing", "Luz · setembro": "Electricity · September", "Cartões de visita": "Business cards", "Flyers A5, 2000 un.": "A5 flyers, 2000 pcs",
    "Forno elétrico 60 L": "Electric oven 60 L", "Laranja do Algarve, 12 kg": "Algarve oranges, 12 kg", "Limão, 6 kg": "Lemons, 6 kg", "Morango, 10 cx.": "Strawberries, 10 boxes", "Outubro": "October",
    "Excel / Google Sheets": "Excel / Google Sheets", "Faturação (Moloni, InvoiceXpress, PHC…)": "Invoicing (Moloni, InvoiceXpress, PHC…)", "IVA": "VAT", "N.º": "No.",

    // laboratório: site antigo vs novo
    "Antes e depois, com reservas": "Before and after, with bookings", "Comparar o site antigo com o novo": "Compare the old website with the new one", "Site antigo": "Old website", "Site novo": "New website",
    "Antes": "Before", "Depois, com a Weld": "After, with Weld", "Restaurante Lareira": "Lareira Restaurant", "Cozinha de brasa · Porto": "Charcoal grill · Porto", "Brasa, vinho": "Charcoal, wine",
    "e mesa para quatro.": "and a table for four.", "Reservar": "Book", "Reservar mesa": "Book a table", "Mesa reservada.": "Table booked.", "Mesa para 2": "Table for 2", "Mesa para 6": "Table for 6",
    "Painel do restaurante · sábado": "Restaurant panel · Saturday", "Cada reserva feita no site aparece aqui, sem ninguém atender o telefone.": "Every booking made on the website shows up here, without anyone answering the phone.",
    "Aniversário · Tiago": "Birthday · Tiago", "Confirmação enviada por SMS.": "Confirmation sent by SMS.", "Ementa": "Menu", "Ementa (PDF 14 MB)": "Menu (PDF 14 MB)", "Almoço": "Lunch",
    "Seg a Sáb 12h-15h e 19h-23h": "Mon to Sat 12-3pm and 7-11pm", "Domingo: ligar antes": "Sunday: call first", "Se não atendermos, tente mais tarde.": "If we don't answer, try again later.",
    "por telefone, das 10h às 12h.": "by phone, from 10am to 12pm.", "HORÁRIO:": "HOURS:", "RESERVAS:": "BOOKINGS:", "Novo!!! Temos francesinha às sextas": "New!!! Francesinha on Fridays",
    "*** BEM-VINDOS AO NOSSO SITE!!! *** RESERVAS SÓ POR TELEFONE *** ABERTO TODOS OS DIAS EXCETO QUANDO FECHADO ***": "*** WELCOME TO OUR WEBSITE!!! *** BOOKINGS BY PHONE ONLY *** OPEN EVERY DAY EXCEPT WHEN CLOSED ***",
    "Visitante n.º 004213 · Última atualização: 12/03/2014 · Melhor visto em Internet Explorer": "Visitor no. 004213 · Last updated: 12/03/2014 · Best viewed in Internet Explorer",
    "4 pessoas · sábado · 20:30": "4 people · Saturday · 20:30",

    // laboratório: pastelaria
    "Pastelaria · encomendas": "Bakery · orders", "Painel de encomendas": "Orders board", "Painel de encomendas e stock": "Orders and stock board", "Encomendas": "Orders", "Nova encomenda": "New order",
    "Por preparar": "To prepare", "A preparar": "Preparing", "No forno": "In the oven", "Prontas": "Ready", "Pronta para apresentar": "Ready to present", "Entregues": "Delivered", "Enviada": "Sent", "Enviadas": "Sent",
    "Passar à coluna seguinte": "Move to the next column", "Arrastar": "Drag", "Stock": "Stock", "Stock baixo": "Low stock", "Repor": "Restock", "Farinha": "Flour", "Ovos": "Eggs", "Chocolate": "Chocolate",
    "Chocolate abaixo de 1 kg. Pedido ao fornecedor preparado, à espera do teu ok.": "Chocolate below 1 kg. Supplier order prepared, waiting for your OK.",
    "Quando uma encomenda fica pronta, o cliente recebe aqui a mensagem.": "When an order is ready, the customer gets the message here.", "Mensagens enviadas sozinhas": "Messages sent automatically",
    "Bolo de aniversário": "Birthday cake", "Bolo de bolacha": "Biscuit cake", "Bolo de cenoura": "Carrot cake", "Bolo de chocolate": "Chocolate cake", "Pastéis de nata": "Custard tarts",
    "Pão de ló": "Sponge cake", "Queques": "Muffins", "Tarte de amêndoa": "Almond tart", "8 fatias": "8 slices", "Aurora": "Aurora",

    // conversas de exemplo e mockups
    "Exemplo de conversa com o assistente": "Example conversation with the assistant", "assistente online · 23:14": "assistant online · 23:14", "À espera de mensagens": "Waiting for messages",
    "Olá! Têm vaga para sábado de manhã?": "Hi! Do you have a slot on Saturday morning?", "Olá! Sábado tenho às 10:00 e às 11:30. Qual prefere?": "Hi! On Saturday I have 10:00 and 11:30. Which do you prefer?",
    "10h, por favor. Sou a Rita.": "10am, please. I'm Rita.", "10h, obrigada!": "10am, thanks!", "Está marcado, Rita! Sábado às 10:00. Na véspera envio um lembrete.": "You're booked, Rita! Saturday at 10:00. I'll send a reminder the day before.",
    "Tenho às 10h00 e às 11h30. Qual prefere?": "I have 10:00 and 11:30. Which do you prefer?", "Têm vaga amanhã de manhã?": "Any slot tomorrow morning?", "Têm vaga sábado de manhã?": "Any slot on Saturday morning?",
    "Fazem limpeza dentária?": "Do you do dental cleanings?", "Têm exemplos de sites?": "Do you have website examples?", "Posso passar para quinta?": "Can I move it to Thursday?",
    "A Weld está a tratar disto": "Weld is handling this", "A Weld processa": "Weld processes", "Mensagem recebida": "Message received", "Mensagens": "Messages", "Mensagem direta": "Direct message",
    "Marcação criada": "Booking created", "Marcação enviada para a agenda": "Booking sent to the calendar", "Marcação feita e lembrete agendado": "Booking made and reminder scheduled", "Marcações": "Bookings",
    "Pedido de marcação": "Booking request", "Pedir marcação": "Request a booking", "Marcar": "Book", "Marcar consulta": "Book an appointment", "Marque pelo site ou pelo WhatsApp, a qualquer hora.": "Book on the website or on WhatsApp, at any hour.",
    "Agenda · sábado": "Calendar · Saturday", "Lead qualificado": "Qualified lead", "Qualificar leads": "Qualify leads", "Enviado para o CRM e para a receção": "Sent to the CRM and to reception", "CRM · novo contacto": "CRM · new contact",
    "Equipa avisada": "Team notified", "Avisos à equipa": "Team alerts", "Passado à Joana": "Handed to Joana", "Email ao cliente": "Email to the customer", "Respostas e follow-ups": "Replies and follow-ups",
    "Relatório de vendas": "Sales report", "Relatório no email todas as segundas": "Report by email every Monday", "Relatório semanal no email todas as segundas": "Weekly report by email every Monday", "Relatórios": "Reports", "Relatórios automáticos": "Automatic reports",
    "Lembretes de pagamento a clientes em atraso": "Payment reminders to late-paying customers", "Sincronizado com a faturação": "Synced with invoicing", "Pedidos de orçamento": "Quote requests", "Pedidos ligados ao CRM": "Requests connected to the CRM",
    "Pedido de urgência": "Urgent request", "Orçamentos": "Quotes", "Tarefas repetidas": "Repetitive tasks", "copiar dados, faturas, relatórios": "copying data, invoices, reports", "Ligações": "Connections", "Integração": "Integration", "Instalação": "Installation",
    "Construção": "Build", "Testes": "Testing", "A funcionar": "Live", "Em preparação": "In preparation", "Demo em preparação": "Demo in preparation", "Fazer outra": "Do another", "Pedir proposta": "Request a proposal",
    "Clínica do Porto": "Porto clinic", "Clínica · site e marcações": "Clinic · website and bookings", "Restaurante · 4 páginas": "Restaurant · 4 pages", "Loja online · 30 produtos": "Online shop · 30 products",
    "Landing page para campanhas de anúncios": "Landing page for ad campaigns", "Página de reservas para restaurantes": "Booking page for restaurants", "Site de clínica com pedido de marcação": "Clinic website with booking requests",
    "Sorrisos cuidados": "Smiles cared for", "Sorrisos cuidados no Porto.": "Smiles cared for in Porto.", "Primeira consulta com avaliação completa e plano por escrito.": "First appointment with a full assessment and a written plan.",
    "Primeira consulta com avaliação completa.": "First appointment with a full assessment.", "1.ª consulta": "1st appointment", "Tratamento": "Treatment", "Tratamentos": "Treatments", "Implantes": "Implants", "Ortodontia": "Orthodontics", "Limpeza": "Cleaning",
    "A tua clínica": "Your clinic", "Escovas": "Brushes", "Filtro de óleo": "Oil filter", "Filtros de óleo · 4 unidades": "Oil filters · 4 units", "Kit de embraiagem": "Clutch kit", "Kit de travões": "Brake kit", "Pastilhas de travão": "Brake pads", "Pastilhas Golf VII": "Golf VII brake pads",
    "Rita · Limpeza": "Rita · Cleaning", "Nuno · Avaliação": "Nuno · Assessment", "Marta · Revisão": "Marta · Check-up", "Sáb · 10:00 · Rita M.": "Sat · 10:00 · Rita M.", "Ter · 09:15 · Inês C.": "Tue · 09:15 · Inês C.", "Qui · 15:30 · Nuno P.": "Thu · 15:30 · Nuno P.",
    "Quinta, de manhã": "Thursday, morning", "hoje · 10:00": "today · 10:00", "hoje · 12:30": "today · 12:30", "hoje · 15:00": "today · 15:00", "hoje · 16:00": "today · 16:00", "hoje · 17:30": "today · 17:30",
    "amanhã · 9:00": "tomorrow · 9:00", "amanhã · 18:00": "tomorrow · 18:00", "sáb · 11:00": "Sat · 11:00", "dom · 10:00": "Sun · 10:00", "Sex": "Fri", "Sáb": "Sat", "Dom": "Sun", "embalar #1042": "pack #1042",
    "Novo pedido · Ana Costa": "New request · Ana Costa", "Ana T.": "Ana T.", "3 canais, 1 assistente": "3 channels, 1 assistant",

    "Com assistente": "With assistant", "O assistente de IA pode viver no site e responder a quem entra.": "The AI assistant can live on the website and reply to visitors.",
    "O que queremos": "What we want", "Precisa de": "Needs", "Precisamos de": "We need", "Sem filtro, nós organizamos": "No filter, we'll sort it out",
    "Aconselhem-nos": "Advise us", "Aqui:": "Here:", "Caminho": "Path", "Fotos": "Photos", "Marca": "Brand", "Pessoas": "People", "Procurar": "Search", "no WhatsApp": "on WhatsApp", "links": "links",
    "Fatura · 312,40 €": "Invoice · €312.40", "Base": "Base",
    // setores
    "Clínicas": "Clinics", "Clínicas e consultórios": "Clinics and practices", "Restaurantes": "Restaurants", "Ginásios": "Gyms", "Ginásios e estúdios": "Gyms and studios", "Imobiliárias": "Real estate agencies",
    "Oficinas": "Garages", "Oficinas e lojas": "Garages and shops", "Lojas online": "Online shops", "Loja online": "Online shop", "Lojas com stock": "Shops with stock", "Escritórios": "Offices",
    "Serviços ao domicílio": "Home services", "Eventos": "Events", "Espaço": "Venue", "Redes sociais e conteúdo": "Social media and content", "Serviços e preços": "Services and prices",
  };

  /* frases montadas pelos scripts com valores no meio */
  var PATTERNS = [
    [/^Olá (.+)! A sua encomenda #(\d+) \((.+)\) está pronta para levantar\. Até já, Pastelaria Aurora\.$/, function (m, a, b, c) { return "Hi " + a + "! Your order #" + b + " (" + c + ") is ready for collection. See you soon, Aurora Bakery."; }],
    [/^Para (.+)$/, function (m, a) { return /^[A-ZÀ-Ú]/.test(a) ? "To " + a : m; }],
    [/^Já está connosco\. (.+) para o (.+) em 24 horas úteis\.$/, function (m, a, b) { return "It's with us. We'll " + (/Lig/i.test(a) ? "call" : "message") + " " + b + " within 24 working hours."; }],
  ];

  var orig = new WeakMap();
  var norm = function (s) { return s.replace(/\s+/g, " ").trim(); };
  function tr(s) {
    var k = norm(s);
    if (!k) return null;
    if (Object.prototype.hasOwnProperty.call(EN, k)) return EN[k];
    for (var i = 0; i < PATTERNS.length; i++) { var m = k.match(PATTERNS[i][0]); if (m) { var r = PATTERNS[i][1].apply(null, m); if (r !== k) return r; } }
    return null;
  }
  function textNode(n) {
    var t = tr(n.nodeValue);
    if (t == null) return;
    if (!orig.has(n)) orig.set(n, n.nodeValue);
    var lead = n.nodeValue.match(/^\s*/)[0], trail = n.nodeValue.match(/\s*$/)[0];
    n.nodeValue = lead + t + trail;
  }
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "data-t", "data-cursor"];
  function element(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], v = el.getAttribute && el.getAttribute(a);
      if (v) { var t = tr(v); if (t != null) el.setAttribute(a, t); }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1) return;
    var tag = root.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return;
    element(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) { return n.nodeType === 1 && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; },
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) textNode(n); else element(n); }
  }

  /* o título gigante da página inicial vem partido letra a letra: refaz-se em inglês com a mesma estrutura */
  function heroTitle() {
    var h = document.querySelector(".h5-title");
    if (!h) return;
    var lines = h.querySelectorAll(".h5-line");
    var EN_LINES = ["We weld AI", "into your business."], HOT = "AI", n = 0;
    if (lines.length !== EN_LINES.length) return;
    lines.forEach(function (line, li) {
      line.innerHTML = EN_LINES[li].split(/(\s+)/).filter(Boolean).map(function (w) {
        if (!w.trim()) return '<span class="sp"> </span>';
        return '<span class="wd' + (w === HOT ? " hot" : "") + '">' + w.split("").map(function (c) { return '<span class="ch" style="--i:' + (n++) + '">' + c + "</span>"; }).join("") + "</span>";
      }).join("");
    });
  }

  function setLang(l) { try { localStorage.setItem(KEY, l); } catch (e) {} location.reload(); }

  function mountToggle() {
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = lang === "en" ? "PT" : "EN";
      b.setAttribute("aria-label", lang === "en" ? "Ver o site em português" : "View the site in English");
      b.setAttribute("lang", lang === "en" ? "pt" : "en");
      b.addEventListener("click", function () { setLang(lang === "en" ? "pt" : "en"); });
    });
  }

  function run() {
    mountToggle();
    if (lang !== "en") return;
    document.documentElement.lang = "en";
    var t = tr(document.title); if (t) document.title = t;
    var md = document.querySelector('meta[name="description"]');
    if (md) { var d = tr(md.getAttribute("content") || ""); if (d) md.setAttribute("content", d); }
    heroTitle();
    walk(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === "characterData") { if (m.target.nodeValue && tr(m.target.nodeValue) != null) textNode(m.target); }
        else if (m.type === "attributes") element(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
