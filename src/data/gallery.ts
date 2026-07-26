import foto0 from "@/assets/fotos/_MRQ1779.webp.asset.json";
import foto1 from "@/assets/fotos/_MRQ1820.webp.asset.json";
import foto2 from "@/assets/fotos/_MRQ1840.webp.asset.json";
import foto3 from "@/assets/fotos/_MRQ1855.webp.asset.json";
import foto4 from "@/assets/fotos/_MRQ1873.webp.asset.json";
import foto5 from "@/assets/fotos/_MRQ1901.webp.asset.json";
import foto6 from "@/assets/fotos/_MRQ1934.webp.asset.json";
import foto7 from "@/assets/fotos/_MRQ1951.webp.asset.json";
import foto8 from "@/assets/fotos/_MRQ1971.webp.asset.json";
import foto9 from "@/assets/fotos/_MRQ2000.webp.asset.json";
import foto10 from "@/assets/fotos/_MRQ2016.webp.asset.json";
import foto11 from "@/assets/fotos/_MRQ2036.webp.asset.json";
import foto12 from "@/assets/fotos/_MRQ2570.webp.asset.json";
import foto13 from "@/assets/fotos/_MRQ2608.webp.asset.json";
import foto14 from "@/assets/fotos/_MRQ2647.webp.asset.json";
import foto15 from "@/assets/fotos/_MRQ2694.webp.asset.json";
import foto16 from "@/assets/fotos/_MRQ2710.webp.asset.json";
import foto17 from "@/assets/fotos/_MRQ2722.webp.asset.json";
import foto18 from "@/assets/fotos/_MRQ2742.webp.asset.json";
import foto19 from "@/assets/fotos/_MRQ2749.webp.asset.json";
import foto20 from "@/assets/fotos/_MRQ2769.webp.asset.json";
import foto21 from "@/assets/fotos/_MRQ2093.webp.asset.json";
import foto22 from "@/assets/fotos/_MRQ2099.webp.asset.json";
import foto23 from "@/assets/fotos/_MRQ2105.webp.asset.json";
import foto24 from "@/assets/fotos/_MRQ2122.webp.asset.json";
import foto25 from "@/assets/fotos/_MRQ2132.webp.asset.json";
import foto26 from "@/assets/fotos/_MRQ2155.webp.asset.json";
import foto27 from "@/assets/fotos/_MRQ2165.webp.asset.json";
import foto28 from "@/assets/fotos/_MRQ2222.webp.asset.json";
import foto29 from "@/assets/fotos/_MRQ2351.webp.asset.json";
import foto30 from "@/assets/fotos/_MRQ2379.webp.asset.json";
import foto31 from "@/assets/fotos/_MRQ2389.webp.asset.json";
import foto32 from "@/assets/fotos/_MRQ2428.webp.asset.json";
import foto33 from "@/assets/fotos/_MRQ2432.webp.asset.json";
import foto34 from "@/assets/fotos/_MRQ2436.webp.asset.json";
import foto35 from "@/assets/fotos/_MRQ2454.webp.asset.json";
import foto36 from "@/assets/fotos/_MRQ1825.webp.asset.json";
import foto37 from "@/assets/fotos/_MRQ2044.webp.asset.json";
import foto38 from "@/assets/fotos/_MRQ2055.webp.asset.json";
import foto39 from "@/assets/fotos/_MRQ2064.webp.asset.json";
import foto40 from "@/assets/fotos/_MRQ2076.webp.asset.json";
import foto41 from "@/assets/fotos/_MRQ2197.webp.asset.json";
import foto42 from "@/assets/fotos/_MRQ2202.webp.asset.json";
import foto43 from "@/assets/fotos/_MRQ2215.webp.asset.json";
import foto44 from "@/assets/fotos/_MRQ2239.webp.asset.json";
import foto45 from "@/assets/fotos/_MRQ2253.webp.asset.json";
import foto46 from "@/assets/fotos/_MRQ2261.webp.asset.json";
import foto47 from "@/assets/fotos/_MRQ2271.webp.asset.json";
import foto48 from "@/assets/fotos/_MRQ2282.webp.asset.json";
import foto49 from "@/assets/fotos/_MRQ2294.webp.asset.json";
import foto50 from "@/assets/fotos/_MRQ2310.webp.asset.json";
import foto51 from "@/assets/fotos/_MRQ2321.webp.asset.json";
import foto52 from "@/assets/fotos/_MRQ2482.webp.asset.json";
import foto53 from "@/assets/fotos/_MRQ2494.webp.asset.json";
import foto54 from "@/assets/fotos/_MRQ2517.webp.asset.json";
import foto55 from "@/assets/fotos/_MRQ2529.webp.asset.json";
import foto56 from "@/assets/fotos/_MRQ2797.webp.asset.json";
import foto57 from "@/assets/fotos/_MRQ2184.webp.asset.json";
import foto58 from "@/assets/fotos/_MRQ2823 1.webp.asset.json";
import foto59 from "@/assets/fotos/_MRQ2831.webp.asset.json";
import foto60 from "@/assets/fotos/_MRQ2840.webp.asset.json";
import foto61 from "@/assets/fotos/_MRQ2853.webp.asset.json";
import foto62 from "@/assets/fotos/_MRQ2863.webp.asset.json";
import foto63 from "@/assets/fotos/_MRQ2874.webp.asset.json";

export type GalleryCategory = "celebracoes" | "convivio" | "mesas" | "produtos";

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string; description: string }[] = [
  { id: "celebracoes", label: "Celebrações", description: "Festas, confraternizações e os encontros que marcam." },
  { id: "convivio", label: "Convívio", description: "O dia a dia em casa, entre família e amigos." },
  { id: "mesas", label: "Mesas & Eventos", description: "Mesas montadas, buffets e produção para eventos." },
  { id: "produtos", label: "Produtos", description: "Nossos salgados em detalhe, recheio a recheio." },
];

export type GalleryItem = { src: string; category: GalleryCategory; alt: string };

export const GALLERY: GalleryItem[] = [
  { src: foto0.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto1.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto2.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto3.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto4.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto5.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto6.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto7.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto8.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto9.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto10.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto11.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto12.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto13.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto14.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto15.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto16.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto17.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto18.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto19.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto20.url, category: "celebracoes", alt: "Momento de celebração com salgados Salgadjén" },
  { src: foto21.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto22.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto23.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto24.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto25.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto26.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto27.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto28.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto29.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto30.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto31.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto32.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto33.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto34.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto35.url, category: "convivio", alt: "Família e amigos compartilhando salgados Salgadjén" },
  { src: foto36.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto37.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto38.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto39.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto40.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto41.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto42.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto43.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto44.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto45.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto46.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto47.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto48.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto49.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto50.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto51.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto52.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto53.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto54.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto55.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto56.url, category: "mesas", alt: "Mesa de evento montada com salgados Salgadjén" },
  { src: foto57.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto58.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto59.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto60.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto61.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto62.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
  { src: foto63.url, category: "produtos", alt: "Salgado Salgadjén em detalhe" },
];
