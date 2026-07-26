import { MessageCircle } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(`Olá! Gostaria de falar com a ${BRAND.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand-purple px-5 py-3.5 text-sm font-semibold text-brand-cream shadow-raised transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
