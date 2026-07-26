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

export type NavLeaf = {
  label: string;
  to: string;
  description?: string;
};

export type NavItem = NavLeaf & { children?: NavLeaf[] };

export const NAV_PRIMARY: NavItem[] = [
  {
    label: "A Salgadjén",
    to: "/quem-somos",
    children: [
      { label: "Quem somos", to: "/quem-somos", description: "Nossa essência e posicionamento" },
      { label: "História", to: "/historia", description: "Uma trajetória iniciada em 1988" },
      { label: "Parceiros", to: "/parceiros", description: "Cases com buffets e empresas" },
    ],
  },
  { label: "Produtos", to: "/produtos" },
  { label: "Galeria", to: "/galeria" },
  { label: "Conteúdos", to: "/conteudos" },
];

export const NAV: NavLeaf[] = NAV_PRIMARY.flatMap((item) =>
  item.children ? item.children : [{ label: item.label, to: item.to }],
);


