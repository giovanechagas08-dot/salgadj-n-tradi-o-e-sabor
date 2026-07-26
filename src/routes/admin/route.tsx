import { createFileRoute, Outlet, redirect, Link, useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Tags, ClipboardList, Package } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administração — Salgadjén" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    // A rota de login precisa ficar FORA do gate: sem esta exceção o layout
    // redireciona /admin/login para si mesmo (loop → tela branca).
    if (location.pathname.startsWith("/admin/login")) {
      return { user: null, canEdit: false, isLogin: true as const };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/admin/login" });
    }
    const { data: canEdit } = await supabase.rpc("can_edit", { _user_id: data.user.id });
    return { user: data.user, canEdit: canEdit === true, isLogin: false as const };
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/precos", label: "Preços", icon: Tags, ready: true },
  { to: "/admin/precos", label: "Pedidos", icon: ClipboardList, ready: false },
  { to: "/admin/precos", label: "Produtos", icon: Package, ready: false },
];

function AdminLayout() {
  const { user, canEdit, isLogin } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLogin || !user) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }


  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  if (!canEdit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md rounded-lg border border-border bg-background p-8 text-center">
          <h1 className="text-lg font-semibold text-foreground">Acesso não autorizado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A conta {user.email} não tem permissão de administrador ou editor.
          </p>
          <Button className="mt-6" variant="outline" onClick={signOut}>
            <LogOut className="mr-2 size-4" />
            Sair
          </Button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <span className="text-sm font-semibold text-foreground">Salgadjén · Admin</span>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
          <Button size="sm" variant="outline" onClick={signOut}>
            <LogOut className="mr-2 size-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6">
        <nav className="hidden w-52 shrink-0 md:block">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.label}>
                {item.ready ? (
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent",
                      pathname.startsWith(item.to) && "bg-accent font-medium text-foreground",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/60">
                    <item.icon className="size-4" />
                    {item.label}
                    <span className="ml-auto text-[10px] uppercase">em breve</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
