import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/pedidos/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Pedidos — Administração Salgadjén" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPedidos,
});

export function isAtendido(status: string | null) {
  return status === "atendido";
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPedidos() {
  const [filter, setFilter] = useState<"todos" | "nao" | "sim">("todos");
  const [search, setSearch] = useState("");

  const quotesQuery = useQuery({
    queryKey: ["admin", "quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(
          "id,created_at,name,company,phone,event_type,status,quote_items(count)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (quotesQuery.data ?? []).filter((q) => {
      const atendido = isAtendido(q.status);
      if (filter === "sim" && !atendido) return false;
      if (filter === "nao" && atendido) return false;
      if (!term) return true;
      return (
        (q.name ?? "").toLowerCase().includes(term) ||
        (q.phone ?? "").toLowerCase().includes(term)
      );
    });
  }, [quotesQuery.data, filter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Orçamentos recebidos pelo site, do mais recente para o mais antigo.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            {quotesQuery.isLoading ? "Carregando…" : `${rows.length} pedido(s)`}
          </CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="nao">Não atendidos</TabsTrigger>
                <TabsTrigger value="sim">Atendidos</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou telefone"
              className="sm:w-64"
            />
          </div>
        </CardHeader>

        <CardContent>
          {quotesQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : quotesQuery.error ? (
            <p className="py-8 text-center text-sm text-destructive">
              Não foi possível carregar os pedidos.
            </p>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {(quotesQuery.data ?? []).length === 0
                ? "Nenhum orçamento recebido ainda. Os pedidos enviados pela página /orcamento aparecem aqui."
                : "Nenhum pedido corresponde ao filtro atual."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recebido em</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Operação</TableHead>
                    <TableHead className="text-right">Itens</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((q) => {
                    const atendido = isAtendido(q.status);
                    const count =
                      (q.quote_items as unknown as { count: number }[])?.[0]?.count ?? 0;
                    return (
                      <TableRow
                        key={q.id}
                        className={cn(
                          "cursor-pointer",
                          !atendido && "bg-primary/5 hover:bg-primary/10",
                        )}
                      >
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          <Link to="/admin/pedidos/$id" params={{ id: q.id }} className="block">
                            {formatDateTime(q.created_at)}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link to="/admin/pedidos/$id" params={{ id: q.id }} className="block">
                            {q.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {q.company || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{q.phone}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {q.event_type || "—"}
                        </TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                        <TableCell>
                          <Badge variant={atendido ? "secondary" : "default"}>
                            {atendido ? "Atendido" : "Não atendido"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
