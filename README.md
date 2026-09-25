# Site da Weld

Site da Weld (automação com IA para agências e negócios), feito em Astro e publicado no Vercel.

## Mudar textos, contactos ou a equipa

Tudo o que se lê no site está num só ficheiro: **`src/content.ts`**.

- Mudar uma frase: edita o texto entre aspas.
- Pôr o LinkedIn do Duarte: preenche `linkedin: ""` no bloco do Duarte (o botão aparece sozinho).
- Mudar o email de contacto: muda `email` em `contacts` e no bloco do João.

Depois de guardar, é só fazer commit e push para o GitHub. O Vercel publica sozinho em cerca de um minuto.

## Ver o site no computador

```bash
npm install
npm run dev
```

Abre http://localhost:4321.

## Onde está cada coisa

| Ficheiro | O que tem |
|---|---|
| `src/content.ts` | Todos os textos, contactos e equipa |
| `src/pages/index.astro` | A estrutura da página (secções) |
| `src/styles/global.css` | Cores, letras, espaços e animações |
| `src/scripts/site.js` | Conversa animada, separadores, formulário e botão de copiar email |
| `public/favicon.svg` | Ícone do separador |
| `public/demos/` | As 3 demos públicas (Oriva Dental, Pistão Peças, Pulso), com marcas inventadas |
| `public/videos/` | Vídeos curtos das demos que passam no site |
| `public/logos/` | Logótipos das ferramentas (Simple Icons) |

## Regras da marca

- Cores: forest `#0A2119`, forest mid `#1B3E30`, paper `#F4F7F4`, mint `#3FA47A` só em detalhes.
- Letras: IBM Plex Mono (títulos) e Inter (texto).
- Tom: direto, casual e sem linguagem de empresa. **Nunca usar travessões (—).**
- Nunca pôr no site nomes ou logótipos de clientes reais sem autorização escrita deles. As demos públicas usam marcas inventadas.

## Demos

As demos em `public/demos/` são geradas a partir do molde em `~/Desktop/demos-agencias/_molde/` (script `anon.py`, que troca os nomes reais por marcas inventadas). Os vídeos são gravados com `gravar.mjs` do mesmo molde.
