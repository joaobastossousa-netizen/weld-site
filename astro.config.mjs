import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://weldstudio.pt",
  // páginas pré-carregadas ao passar o rato: a transição entre páginas fica instantânea
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
});
