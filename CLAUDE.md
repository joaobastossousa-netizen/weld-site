# Weld site

Astro site for Weld, a Porto AI automation studio run by João Sousa (founder, first contact) and Duarte (partner and builder).

- All copy lives in `src/content.ts`. Change text there, not in `index.astro`.
- Copy is European Portuguese, direct and casual. Never use em dashes (—) or en dashes as separators.
- Brand: forest #0A2119, forest mid #1B3E30, paper #F4F7F4, mint #3FA47A (accent only, never large backgrounds). IBM Plex Mono for headings, Inter for body.
- Never add real client names or logos without written permission. Public demos in `public/demos/` use invented brands (Oriva Dental, Pistão Peças, Pulso) and are labelled as examples.
- Prices are not shown on the site; only the partnership models (projeto fechado, mensalidade, revenda, percentagem).
- Deploys automatically on Vercel from the main branch. Domain: https://weldstudio.pt (registered at Dominios.pt, nameservers pointed to Vercel DNS, so DNS records are managed with `vercel dns`). weld-site.vercel.app still works.
- Look: light workshop theme (paper background, forest ink, hairline rules, numbered section heads `.idx`), with `.dark` bands. The W is a clean line mark (`src/components/WeldMark.astro`), no particle effects. Keep it clearly distinct from rlagency.pt (no dark navy, no particle shapes, no round logo bubbles, no floating chat button).
- Motion uses GSAP (npm) in `src/scripts/site.js`; always respect prefers-reduced-motion.
- Two ways in: `/contacto` (3-step brief, demo grátis) and `/pedido` (detailed request for people who skip the demo; questions per service live in `order` in content.ts). Both build a mailto, no backend. `site.phone` empty = no Weld number shown; the client leaves theirs and we call back.
