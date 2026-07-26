import { buttonVariants } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(`Olá! Gostaria de falar com a ${BRAND.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={buttonVariants({ variant: "primary", size: "lg", className: "fixed bottom-6 right-6 z-40 shadow-raised" })}
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
