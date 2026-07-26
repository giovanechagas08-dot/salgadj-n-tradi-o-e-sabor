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

export const NAV = [
  { label: "A Salgadjén", to: "/quem-somos" as const },
  { label: "História", to: "/historia" as const },
  { label: "Estrutura", to: "/estrutura" as const },
  { label: "Processos", to: "/processos" as const },
  { label: "Parceiros", to: "/parceiros" as const },
  { label: "Grandes Eventos", to: "/grandes-eventos" as const },
  { label: "Produtos", to: "/produtos" as const },
  { label: "Galeria", to: "/galeria" as const },
  { label: "Conteúdos", to: "/conteudos" as const },
];
