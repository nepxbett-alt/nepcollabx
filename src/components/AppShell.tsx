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
import { Logo } from "@/components/Logo";
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
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center" aria-label="NepCollab home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {signedIn ? (
              nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="tap rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="/campaigns"
                  className="tap rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Discover
                </Link>
                <Link
                  to="/auth"
                  className="tap rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Post a campaign
                </Link>
              </>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            {signedIn ? (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="tap relative flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
              >
                <Bell className="size-[18px]" />
                {unread > 0 ? (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-signal ring-2 ring-background" />
                ) : null}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="tap rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-ink-foreground hover:opacity-90"
              >
                Get started
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-10">
        {children}
      </main>

      {signedIn ? (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
        >
          <ul className="mx-auto flex max-w-lg items-stretch">
            {nav.map((item) => {
              const active =
                pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "tap flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                      active ? "text-signal" : "text-muted-foreground",
                    )}
                  >
                    <Icon className={cn("size-[19px]", active && "stroke-[2.4]")} />
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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-5">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
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
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-5", className)}>
      {children}
    </div>
  );
}

