import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, Loader2, Minus, Plus, Search, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getQuoteCatalog, submitQuote } from "@/lib/site.functions";
import { useQuoteCart } from "@/hooks/use-quote-cart";
import { whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/utils";

const CANONICAL = "https://salgadjen.lovable.app/orcamento";

export const Route = createFileRoute("/orcamento")({
  loader: () => getQuoteCatalog(),
  head: () => ({
    meta: [
      { title: "Orçamento de atacado — Salgadjén" },
      {
        name: "description",
        content:
          "Monte seu orçamento de atacado Salgadjén: escolha os sabores de cada grupo, veja os preços de revenda e envie sua solicitação. Pedido mínimo de 1.000 unidades.",
      },
      { property: "og:title", content: "Orçamento de atacado — Salgadjén" },
      {
        property: "og:description",
        content:
          "Distribua as quantidades entre os sabores, acompanhe o valor estimado e solicite seu orçamento de revenda.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  errorComponent: () => (
    <Section tone="white">
      <p className="type-body-lg text-muted-foreground">
        Não foi possível carregar o catálogo agora. Atualize a página ou fale conosco pelo WhatsApp.
      </p>
    </Section>
  ),
  notFoundComponent: () => (
    <Section tone="white">
      <p className="type-body-lg text-muted-foreground">Catálogo indisponível.</p>
    </Section>
  ),
  component: OrcamentoPage,
});

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUM = new Intl.NumberFormat("pt-BR");

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  company: z.string().trim().max(160).optional(),
  city: z.string().trim().max(120).optional(),
  event_type: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
});

type Flavor = {
  id: string;
  name: string;
  slug: string;
  flavor_name: string | null;
};

type Group = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  quote_unit: string | null;
  qty_step: number | null;
  min_qty_per_flavor: number | null;
  flavors: Flavor[];
};

/** Subtotal conforme a unidade de cotação: pacote de 50 x preço, ou unidade x preço. */
function lineTotal(quantity: number, price: number, quoteUnit: string | null) {
  return quoteUnit === "pacote_50" ? (quantity / 50) * price : quantity * price;
}

function unitLabel(quoteUnit: string | null) {
  return quoteUnit === "pacote_50" ? "/ pacote de 50" : "/ unidade";
}

function OrcamentoPage() {
  const data = Route.useLoaderData();
  const { lines, hydrated, setQuantity, clear } = useQuoteCart();
  const send = useServerFn(submitQuote);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    city: "",
    event_type: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<null | "site" | "whatsapp">(null);
  const [done, setDone] = useState(false);

  const groups = (data.groups ?? []) as unknown as Group[];
  const prices = (data.prices ?? {}) as Record<string, number>;
  const minPerFlavor = data.rules?.minPerFlavor ?? 200;
  const minTotalUnits = data.rules?.minTotalUnits ?? 1000;

  const qty = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of lines) map[l.product_id] = l.quantity;
    return map;
  }, [lines]);

  const categories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data.categories ?? [])
      .map((cat) => ({
        ...cat,
        groups: groups
          .filter((g) => g.category_id === cat.id)
          .map((g) => ({
            ...g,
            flavors: term
              ? g.flavors.filter(
                  (f) =>
                    (f.flavor_name ?? f.name).toLowerCase().includes(term) ||
                    g.name.toLowerCase().includes(term),
                )
              : g.flavors,
          }))
          .filter((g) => g.flavors.length > 0),
      }))
      .filter((cat) => cat.groups.length > 0);
  }, [data.categories, groups, query]);

  const summary = useMemo(() => {
    const perGroup = groups
      .map((g) => {
        const items = g.flavors
          .map((f) => ({
            flavor: f,
            quantity: qty[f.id] ?? 0,
            price: prices[f.id] ?? 0,
          }))
          .filter((i) => i.quantity > 0)
          .map((i) => ({ ...i, total: lineTotal(i.quantity, i.price, g.quote_unit) }));
        return {
          group: g,
          items,
          units: items.reduce((s, i) => s + i.quantity, 0),
          total: items.reduce((s, i) => s + i.total, 0),
        };
      })
      .filter((g) => g.items.length > 0);

    return {
      perGroup,
      units: perGroup.reduce((s, g) => s + g.units, 0),
      total: perGroup.reduce((s, g) => s + g.total, 0),
      itemCount: perGroup.reduce((s, g) => s + g.items.length, 0),
    };
  }, [groups, qty, prices]);

  const belowMin = summary.perGroup.flatMap((g) =>
    g.items.filter((i) => i.quantity < (g.group.min_qty_per_flavor ?? minPerFlavor)),
  );
  const missingUnits = Math.max(0, minTotalUnits - summary.units);
  const canSubmit =
    hydrated &&
    summary.units >= minTotalUnits &&
    belowMin.length === 0 &&
    summary.itemCount > 0 &&
    summary.itemCount <= 200;

  function change(group: Group, flavor: Flavor, next: number) {
    const step = group.qty_step ?? 1;
    const min = group.min_qty_per_flavor ?? minPerFlavor;
    let value = Math.max(0, Math.round(next));
    if (value > 0) {
      value = Math.round(value / step) * step;
      if (value < min) value = Math.ceil(min / step) * step;
    }
    setQuantity(
      {
        product_id: flavor.id,
        product_name: `${group.name} — ${flavor.flavor_name ?? flavor.name}`,
        slug: flavor.slug,
        unit: group.quote_unit ?? "unidade",
      },
      value,
    );
  }

  function buildItems() {
    return summary.perGroup.flatMap((g) =>
      g.items.map((i) => ({
        product_id: i.flavor.id,
        product_name: `${g.group.name} — ${i.flavor.flavor_name ?? i.flavor.name}`,
        quantity: i.quantity,
        unit: g.group.quote_unit ?? "unidade",
      })),
    );
  }

  function buildMessage() {
    const linesText = summary.perGroup
      .map(
        (g) =>
          `*${g.group.name}*\n` +
          g.items
            .map(
              (i) =>
                `• ${i.flavor.flavor_name ?? i.flavor.name}: ${NUM.format(i.quantity)} un — ${BRL.format(i.total)}`,
            )
            .join("\n"),
      )
      .join("\n\n");
    return [
      "Olá! Gostaria de um orçamento de atacado.",
      "",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      form.company ? `Empresa: ${form.company}` : "",
      form.city ? `Cidade: ${form.city}` : "",
      form.event_type ? `Tipo de operação: ${form.event_type}` : "",
      "",
      linesText,
      "",
      `Total: ${NUM.format(summary.units)} unidades`,
      `Valor estimado: ${BRL.format(summary.total)} (sujeito a confirmação)`,
      form.message ? `\nObservações: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function handleSubmit(mode: "site" | "whatsapp") {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Revise os dados de contato.");
      return;
    }
    setErrors({});
    setSending(mode);
    const link = mode === "whatsapp" ? whatsappLink(buildMessage()) : null;
    try {
      await send({ data: { ...parsed.data, items: buildItems() } });
      if (link) window.open(link, "_blank", "noopener,noreferrer");
      toast.success("Solicitação enviada! Entraremos em contato em breve.");
      clear();
      setDone(true);
    } catch {
      toast.error("Não conseguimos enviar agora. Tente novamente ou chame no WhatsApp.");
    } finally {
      setSending(null);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Atacado e revenda"
        title="Monte seu orçamento de atacado"
        subtitle="Escolha os grupos, distribua as quantidades entre os sabores e envie sua solicitação. Nossa equipe confirma prazos, frete e condições comerciais."
      >
        <ul className="flex flex-wrap gap-3 text-sm">
          {[
            `Pedido mínimo de ${NUM.format(minTotalUnits)} unidades`,
            `Mínimo de ${NUM.format(minPerFlavor)} unidades por sabor`,
            "Fritos em múltiplos de 50 · assados de 1 em 1",
          ].map((rule) => (
            <li
              key={rule}
              className="rounded-full border border-brand-cream/30 px-4 py-2 text-brand-cream/90"
            >
              {rule}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="relative mb-8">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar grupo ou sabor (ex.: coxinha, frango)"
                aria-label="Buscar grupo ou sabor"
                className="pl-11"
              />
            </div>

            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h2 className="type-title text-brand-purple-deep">{cat.name}</h2>
                  <div className="mt-6 space-y-4">
                    {cat.groups.map((group) => {
                      const expanded = open[group.id] ?? Boolean(query.trim());
                      const step = group.qty_step ?? 1;
                      const min = group.min_qty_per_flavor ?? minPerFlavor;
                      const groupUnits = group.flavors.reduce((s, f) => s + (qty[f.id] ?? 0), 0);

                      return (
                        <Reveal key={group.id}>
                          <div className="overflow-hidden rounded-xl border border-border bg-surface">
                            <button
                              type="button"
                              onClick={() => setOpen((o) => ({ ...o, [group.id]: !expanded }))}
                              aria-expanded={expanded}
                              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                              <span>
                                <span className="type-body-lg font-medium text-brand-purple-deep">
                                  {group.name}
                                </span>
                                <span className="block text-sm text-muted-foreground">
                                  {group.flavors.length} sabores · preço {unitLabel(group.quote_unit)}
                                  {groupUnits > 0
                                    ? ` · ${NUM.format(groupUnits)} un selecionadas`
                                    : ""}
                                </span>
                              </span>
                              <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                  "size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
                                  expanded && "rotate-180",
                                )}
                              />
                            </button>

                            {expanded ? (
                              <ul className="divide-y divide-border border-t border-border">
                                {group.flavors.map((flavor) => {
                                  const value = qty[flavor.id] ?? 0;
                                  const price = prices[flavor.id];
                                  const invalid = value > 0 && value < min;
                                  return (
                                    <li
                                      key={flavor.id}
                                      className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                                    >
                                      <div className="min-w-[10rem] flex-1">
                                        <p className="font-medium text-foreground">
                                          {flavor.flavor_name ?? flavor.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {price != null
                                            ? `${BRL.format(price)} ${unitLabel(group.quote_unit)}`
                                            : "Preço sob consulta"}
                                        </p>
                                        {invalid ? (
                                          <p className="mt-1 text-sm text-error">
                                            mínimo {NUM.format(min)}
                                          </p>
                                        ) : null}
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          aria-label={`Diminuir ${flavor.flavor_name ?? flavor.name}`}
                                          onClick={() =>
                                            change(
                                              group,
                                              flavor,
                                              value <= min ? 0 : value - step,
                                            )
                                          }
                                        >
                                          <Minus />
                                        </Button>
                                        <Input
                                          inputMode="numeric"
                                          aria-label={`Quantidade de ${flavor.flavor_name ?? flavor.name}`}
                                          value={value === 0 ? "" : String(value)}
                                          placeholder="0"
                                          onChange={(e) =>
                                            change(
                                              group,
                                              flavor,
                                              Number(e.target.value.replace(/\D/g, "")) || 0,
                                            )
                                          }
                                          className="h-11 w-24 text-center"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          aria-label={`Aumentar ${flavor.flavor_name ?? flavor.name}`}
                                          onClick={() =>
                                            change(group, flavor, value === 0 ? min : value + step)
                                          }
                                        >
                                          <Plus />
                                        </Button>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : null}
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              ))}
              {categories.length === 0 ? (
                <p className="type-body-lg text-muted-foreground">
                  Nenhum sabor encontrado para “{query}”.
                </p>
              ) : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-border bg-surface-raised p-6">
              <h2 className="flex items-center gap-2 type-title text-brand-purple-deep">
                <ShoppingBasket aria-hidden="true" className="size-5" /> Resumo
              </h2>

              {!hydrated ? (
                <p className="mt-4 text-sm text-muted-foreground">Carregando suas escolhas…</p>
              ) : summary.perGroup.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nenhum sabor selecionado ainda.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {summary.perGroup.map((g) => (
                    <li key={g.group.id}>
                      <p className="text-sm font-medium text-brand-purple-deep">{g.group.name}</p>
                      <ul className="mt-1 space-y-1">
                        {g.items.map((i) => (
                          <li
                            key={i.flavor.id}
                            className="flex justify-between gap-3 text-sm text-muted-foreground"
                          >
                            <span>
                              {i.flavor.flavor_name ?? i.flavor.name} · {NUM.format(i.quantity)} un
                            </span>
                            <span>{BRL.format(i.total)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 flex justify-between text-sm text-foreground">
                        <span>Subtotal do grupo</span>
                        <span>{BRL.format(g.total)}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 border-t border-border pt-4">
                <p className="flex justify-between text-sm text-muted-foreground">
                  <span>Unidades</span>
                  <span>{NUM.format(summary.units)}</span>
                </p>
                <p className="mt-2 flex justify-between type-body-lg font-medium text-brand-purple-deep">
                  <span>Total estimado</span>
                  <span>{BRL.format(summary.total)}</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Valor estimado, sujeito a confirmação. Frete, prazos e condições comerciais são
                  fechados no atendimento.
                </p>
              </div>

              {missingUnits > 0 ? (
                <p className="mt-4 rounded-lg bg-brand-yellow/20 px-4 py-3 text-sm text-brand-purple-deep">
                  Faltam {NUM.format(missingUnits)} unidades para o pedido mínimo de{" "}
                  {NUM.format(minTotalUnits)}.
                </p>
              ) : belowMin.length > 0 ? (
                <p className="mt-4 rounded-lg bg-brand-yellow/20 px-4 py-3 text-sm text-brand-purple-deep">
                  Alguns sabores estão abaixo do mínimo de {NUM.format(minPerFlavor)} unidades.
                </p>
              ) : (
                <p className="mt-4 rounded-lg bg-success/15 px-4 py-3 text-sm text-foreground">
                  Pedido mínimo atingido.
                </p>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="cream" id="dados">
        <div className="mx-auto max-w-3xl">
          {done ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <h2 className="type-display text-brand-purple-deep">Solicitação recebida</h2>
              <p className="type-body-lg mt-4 text-muted-foreground">
                Obrigado! Nossa equipe comercial entra em contato para confirmar quantidades, prazos
                e condições.
              </p>
              <a
                href={whatsappLink("Olá! Acabei de enviar um orçamento de atacado pelo site.")}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
              >
                Falar no WhatsApp
              </a>
            </div>
          ) : (
            <>
              <h2 className="type-display text-brand-purple-deep">Seus dados</h2>
              <p className="type-body-lg mt-4 text-muted-foreground">
                Como o pedido é de atacado, precisamos de alguns dados da sua operação.
              </p>

              <form
                className="mt-8 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSubmit("site");
                }}
              >
                <Field
                  id="name"
                  label="Nome *"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
                <Field
                  id="phone"
                  label="Telefone / WhatsApp *"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
                <Field
                  id="company"
                  label="Empresa / buffet"
                  value={form.company}
                  onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                />
                <Field
                  id="city"
                  label="Cidade"
                  value={form.city}
                  onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                />

                <div className="sm:col-span-2">
                  <Label htmlFor="event_type">Tipo de operação</Label>
                  <select
                    id="event_type"
                    value={form.event_type}
                    onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-md border border-border bg-surface px-3 text-foreground"
                  >
                    <option value="">Selecione</option>
                    <option value="Buffet">Buffet</option>
                    <option value="Casa de festa">Casa de festa</option>
                    <option value="Revenda">Revenda</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="message">Observações</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    maxLength={4000}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                {!canSubmit ? (
                  <p className="text-sm text-muted-foreground sm:col-span-2">
                    {summary.itemCount === 0
                      ? "Selecione os sabores desejados para habilitar o envio."
                      : missingUnits > 0
                        ? `Faltam ${NUM.format(missingUnits)} unidades para o pedido mínimo de ${NUM.format(minTotalUnits)}.`
                        : "Ajuste os sabores abaixo do mínimo por sabor para enviar."}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-4 sm:col-span-2">
                  <Button type="submit" size="lg" disabled={!canSubmit || sending !== null}>
                    {sending === "site" ? <Loader2 className="animate-spin" /> : null}
                    Enviar solicitação
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={!canSubmit || sending !== null}
                    onClick={() => void handleSubmit("whatsapp")}
                  >
                    {sending === "whatsapp" ? <Loader2 className="animate-spin" /> : null}
                    Enviar pelo WhatsApp
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Section>
    </>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        maxLength={160}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
      />
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}
