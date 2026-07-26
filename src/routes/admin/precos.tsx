import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const TABLE_SLUGS = ["varejo", "revenda-fritos", "revenda-assados"] as const;

export const Route = createFileRoute("/admin/precos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Preços — Administração Salgadjén" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPrecos,
});

type ProductRow = {
  id: string;
  name: string;
  is_group: boolean;
  parent_id: string | null;
  flavor_name: string | null;
  quote_unit: string | null;
  display_order: number;
};

function unitLabel(quoteUnit: string | null) {
  if (quoteUnit === "pacote_50") return "pacote de 50";
  if (quoteUnit === "unidade") return "unidade";
  return "unidade de venda";
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseInput(raw: string): number | null {
  const normalized = raw.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (normalized === "") return null;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return Number.NaN;
  return Math.round(n * 100) / 100;
}

function AdminPrecos() {
  const queryClient = useQueryClient();
  const [tableSlug, setTableSlug] = useState<string>(TABLE_SLUGS[0]);

  const tablesQuery = useQuery({
    queryKey: ["admin", "price-tables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_tables")
        .select("id,name,slug,is_public,is_active")
        .in("slug", TABLE_SLUGS as unknown as string[])
        .eq("is_active", true);
      if (error) throw error;
      return (data ?? []).sort(
        (a, b) => TABLE_SLUGS.indexOf(a.slug as never) - TABLE_SLUGS.indexOf(b.slug as never),
      );
    },
  });

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,is_group,parent_id,flavor_name,quote_unit,display_order")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProductRow[];
    },
  });

  const activeTable = tablesQuery.data?.find((t) => t.slug === tableSlug) ?? null;

  const pricesQuery = useQuery({
    enabled: Boolean(activeTable?.id),
    queryKey: ["admin", "prices", activeTable?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_prices")
        .select("product_id,price")
        .eq("price_table_id", activeTable!.id);
      if (error) throw error;
      const map: Record<string, number> = {};
      for (const row of data ?? []) map[row.product_id] = Number(row.price);
      return map;
    },
  });

  const groups = useMemo(() => {
    const rows = productsQuery.data ?? [];
    const parents = rows.filter((r) => r.is_group);
    return parents.map((parent) => ({
      parent,
      flavors: rows.filter((r) => r.parent_id === parent.id),
    }));
  }, [productsQuery.data]);

  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    setDraft({});
  }, [activeTable?.id]);

  function currentValue(productId: string) {
    if (productId in draft) return draft[productId];
    const price = pricesQuery.data?.[productId];
    return price === undefined ? "" : String(price).replace(".", ",");
  }

  function isDirty(productId: string) {
    if (!(productId in draft)) return false;
    const parsed = parseInput(draft[productId]);
    const original = pricesQuery.data?.[productId];
    if (Number.isNaN(parsed)) return true;
    if (parsed === null) return false;
    return parsed !== original;
  }

  async function save(productIds: string[], scope: string) {
    if (!activeTable) return;
    const rows: { product_id: string; price_table_id: string; price: number; unit: string }[] = [];

    for (const id of productIds) {
      if (!isDirty(id)) continue;
      const parsed = parseInput(draft[id]);
      if (parsed === null) continue;
      if (Number.isNaN(parsed)) {
        toast.error("Preço inválido. Use apenas números maiores ou iguais a zero.");
        return;
      }
      const product = (productsQuery.data ?? []).find((p) => p.id === id);
      const parent = (productsQuery.data ?? []).find((p) => p.id === product?.parent_id);
      rows.push({
        product_id: id,
        price_table_id: activeTable.id,
        price: parsed,
        unit: parent?.quote_unit ?? product?.quote_unit ?? "unidade",
      });
    }

    if (rows.length === 0) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    setSaving(scope);
    const { error } = await supabase
      .from("product_prices")
      .upsert(rows, { onConflict: "product_id,price_table_id" });
    setSaving(null);

    if (error) {
      toast.error("Não foi possível salvar os preços.", { description: error.message });
      return;
    }

    setDraft((prev) => {
      const next = { ...prev };
      for (const row of rows) delete next[row.product_id];
      return next;
    });
    await queryClient.invalidateQueries({ queryKey: ["admin", "prices", activeTable.id] });
    toast.success(`${rows.length} preço(s) salvos.`);
  }

  const allDirtyIds = Object.keys(draft).filter(isDirty);
  const loading = tablesQuery.isLoading || productsQuery.isLoading || pricesQuery.isLoading;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Preços</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os preços de cada sabor por tabela. O histórico é registrado automaticamente.
        </p>
      </div>

      <Tabs value={tableSlug} onValueChange={setTableSlug}>
        <TabsList>
          {(tablesQuery.data ?? []).map((t) => (
            <TabsTrigger key={t.slug} value={t.slug}>
              {t.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ parent, flavors }) => {
            const ids = flavors.map((f) => f.id);
            const dirtyCount = ids.filter(isDirty).length;
            return (
              <Card key={parent.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-base">{parent.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Preço por {unitLabel(parent.quote_unit)} · {flavors.length} sabor(es)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={dirtyCount === 0 || saving !== null}
                    onClick={() => save(ids, parent.id)}
                  >
                    {saving === parent.id ? "Salvando…" : `Salvar${dirtyCount ? ` (${dirtyCount})` : ""}`}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {flavors.map((flavor) => {
                    const raw = currentValue(flavor.id);
                    const parsed = parseInput(raw);
                    const invalid = Number.isNaN(parsed);
                    return (
                      <div
                        key={flavor.id}
                        className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-foreground">
                            {flavor.flavor_name ?? flavor.name}
                          </p>
                          {pricesQuery.data?.[flavor.id] !== undefined ? (
                            <p className="text-xs text-muted-foreground">
                              Atual: {formatBRL(pricesQuery.data[flavor.id])}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">Sem preço nesta tabela</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">R$</span>
                          <Input
                            inputMode="decimal"
                            className={`w-28 ${invalid ? "border-destructive" : ""}`}
                            value={raw}
                            placeholder="0,00"
                            aria-invalid={invalid}
                            aria-label={`Preço de ${flavor.flavor_name ?? flavor.name}`}
                            onChange={(e) =>
                              setDraft((prev) => ({ ...prev, [flavor.id]: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  {flavors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum sabor vinculado.</p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {allDirtyIds.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {allDirtyIds.length} alteração(ões) pendente(s)
            </span>
            <Button disabled={saving !== null} onClick={() => save(allDirtyIds, "all")}>
              {saving === "all" ? "Salvando…" : "Salvar tudo"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
