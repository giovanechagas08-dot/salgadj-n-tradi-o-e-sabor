import logoBranca from "@/assets/Salgadjen_Branca-01.png.asset.json";
import logoRoxo from "@/assets/Salgadjen_Roxo-01.png.asset.json";
import avatarAmarelo from "@/assets/Avatar_Amarelo.png.asset.json";

export const LOGO_LIGHT = logoBranca.url;
export const LOGO_DARK = logoRoxo.url;
export const AVATAR = avatarAmarelo.url;

export const BRAND = {
  name: "Salgadjén",
  founded: 1988,
  years: new Date().getFullYear() - 1988,
  tagline: "Há 38 anos fazendo parte dos melhores momentos.",
  whatsapp: "5511999999999",
  phone: "(11) 99999-9999",
  email: "contato@salgadjen.com.br",
  city: "São Paulo — SP",
};

export function whatsappLink(message: string, number = BRAND.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const NAV_PRIMARY = [
  {
    label: "A Salgadjén",
    to: "/quem-somos" as const,
    children: [
      { label: "Quem somos", to: "/quem-somos" as const, description: "Nossa essência e posicionamento" },
      { label: "História", to: "/historia" as const, description: "Uma trajetória iniciada em 1988" },
      { label: "Estrutura", to: "/estrutura" as const, description: "Capacidade produtiva e logística" },
      { label: "Processos", to: "/processos" as const, description: "Como garantimos consistência" },
      { label: "Parceiros", to: "/parceiros" as const, description: "Cases com buffets e empresas" },
      { label: "Grandes Eventos", to: "/grandes-eventos" as const, description: "Operações de alto volume" },
    ],
  },
  { label: "Produtos", to: "/produtos" as const },
  { label: "Galeria", to: "/galeria" as const },
  { label: "Conteúdos", to: "/conteudos" as const },
];

export const NAV = NAV_PRIMARY.flatMap((item) =>
  "children" in item && item.children ? item.children : [{ label: item.label, to: item.to }],
);

