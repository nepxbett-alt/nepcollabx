import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  FileText,
  Handshake,
  Home,
  LayoutGrid,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const creatorNav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/campaigns", label: "Discover", icon: Compass },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/collaborations", label: "Collabs", icon: Handshake },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const brandNav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/brand/campaigns", label: "Campaigns", icon: LayoutGrid },
  { to: "/brand/applicants", label: "Applicants", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { role, signedIn, notifications } = useStore();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const nav = role === "brand" ? brandNav : creatorNav;
  const unread = notifications.filter(
    (n) => n.audience === (role ?? "creator") && !n.read,
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-ink text-sm font-bold text-ink-foreground">
              N
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              NepCollab
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {signedIn ? (
              nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="/campaigns"
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Find campaigns
                </Link>
                <Link
                  to="/auth"
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Post a campaign
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
              >
                <Bell className="size-5" />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-signal" />
                ) : null}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-10">{children}</main>

      {signedIn ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto flex max-w-lg items-stretch">
            {nav.map((item) => {
              const active =
                pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                      active ? "text-signal" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-6", className)}>
      {children}
    </div>
  );
}
