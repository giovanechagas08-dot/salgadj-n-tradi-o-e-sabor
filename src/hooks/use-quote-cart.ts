import { useCallback, useEffect, useState } from "react";

export type CartLine = {
  product_id: string;
  product_name: string;
  slug: string;
  unit: string;
  quantity: number;
};

const KEY = "salgadjen:quote-cart";

function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent("salgadjen:cart"));
}

/** Carrinho de orçamento persistido no navegador (salvar e continuar depois). */
export function useQuoteCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(read());
    setHydrated(true);
    const sync = () => setLines(read());
    window.addEventListener("salgadjen:cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("salgadjen:cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setQuantity = useCallback((line: Omit<CartLine, "quantity">, quantity: number) => {
    const current = read().filter((l) => l.product_id !== line.product_id);
    if (quantity > 0) current.push({ ...line, quantity });
    write(current);
  }, []);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 100) => {
    const current = read();
    const existing = current.find((l) => l.product_id === line.product_id);
    if (existing) existing.quantity += quantity;
    else current.push({ ...line, quantity });
    write(current);
  }, []);

  const remove = useCallback((productId: string) => {
    write(read().filter((l) => l.product_id !== productId));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { lines, hydrated, add, setQuantity, remove, clear };
}
