import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, MessageCircle, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { whatsappLink } from "@/lib/brand";

export const Route = createFileRoute("/admin/pedidos/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Pedido — Administração Salgadjén" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPedidoDetalhe,
});

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function AdminPedidoDetalhe() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const quoteQuery = useQuery({
    queryKey: ["admin", "quote", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, quote_items(id,product_name,quantity,unit)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const quote = quoteQuery.data;
  const atendido = quote?.status === "atendido";

  const toggle = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("quotes")
        .update({ status: atendido ? "novo" : "atendido" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(atendido ? "Pedido marcado como não atendido." : "Pedido marcado como atendido.");
      queryClient.invalidateQueries({ queryKey: ["admin", "quote", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o pedido.");
    },
  });

  if (quoteQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (quoteQuery.error || !quote) {
    return (
      <div className="space-y-4">
        <Link to="/admin/pedidos" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" /> Voltar aos pedidos
        </Link>
        <p className="text-sm text-destructive">Pedido não encontrado.</p>
      </div>
    );
  }

  const items = (quote.quote_items ?? []) as {
    id: string;
    product_name: string;
    quantity: number;
    unit: string | null;
  }[];
  const totalUnidades = items.reduce((sum, i) => sum + Number(i.quantity ?? 0), 0);

  const waMessage = `Olá ${quote.name}, aqui é da Salgadjén. Recebemos sua solicitação de orçamento enviada em ${formatDateTime(quote.created_at)}.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/pedidos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Voltar aos pedidos
          </Link>
          <h1 className="mt-2 text-xl font-semibold text-foreground">{quote.name}</h1>
          <p className="text-sm text-muted-foreground">
            Enviado em {formatDateTime(quote.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={atendido ? "secondary" : "default"}>
            {atendido ? "Atendido" : "Não atendido"}
          </Badge>
          <Button onClick={() => toggle.mutate()} disabled={toggle.isPending}>
            {atendido ? <Undo2 className="mr-2 size-4" /> : <Check className="mr-2 size-4" />}
            {atendido ? "Marcar como não atendido" : "Marcar como atendido"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nome">{quote.name}</Field>
            <Field label="Telefone / WhatsApp">
              <a
                className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                href={whatsappLink(waMessage, onlyDigits(quote.phone).length > 11 ? onlyDigits(quote.phone) : `55${onlyDigits(quote.phone)}`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                {quote.phone}
              </a>
            </Field>
            <Field label="E-mail">
              {quote.email ? (
                <a className="underline-offset-4 hover:underline" href={`mailto:${quote.email}`}>
                  {quote.email}
                </a>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Empresa / buffet">{quote.company || "—"}</Field>
            <Field label="Cidade">{quote.city || "—"}</Field>
            <Field label="Tipo de operação">{quote.event_type || "—"}</Field>
            <Field label="Data do evento">{formatDate(quote.event_date)}</Field>
            <Field label="Convidados">{quote.guests ?? "—"}</Field>
            <Field label="Origem">{quote.source}</Field>
          </dl>

          {quote.message ? (
            <div className="mt-6 rounded-md border border-border bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Observações</p>
              <p className="mt-2 whitespace-pre-line text-sm text-foreground">{quote.message}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Itens do pedido · {items.length} sabor(es) · {totalUnidades.toLocaleString("pt-BR")} unidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Este pedido não tem itens registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto / sabor</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell className="text-right">
                        {Number(item.quantity).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.unit === "pacote_50" ? "pacote de 50" : item.unit || "unidade"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
