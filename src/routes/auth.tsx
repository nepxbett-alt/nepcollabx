import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/AppShell";
import { Logo } from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/types";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — NepCollab" },
      {
        name: "description",
        content: "Join NepCollab as a creator looking for collaborations or a brand publishing campaigns.",
      },
      { property: "og:title", content: "Sign in — NepCollab" },
      { property: "og:description", content: "Creators find opportunities. Brands publish campaigns." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { signIn } = useStore();
  const [role, setRole] = useState<Role>("creator");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(role);
    toast.success(role === "brand" ? "Welcome, brand!" : "Welcome, creator!");
    navigate({ to: "/dashboard" });
  };

  return (
    <Container className="max-w-md py-10">
      <Logo size={40} withWordmark={false} />
      <h1 className="mt-4 text-xl font-bold">Get started</h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Choose how you'll use NepCollab. You can explore the whole app either way.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {([
          { key: "creator", label: "I'm a Creator", body: "Find and apply to campaigns", icon: Sparkles },
          { key: "brand", label: "I'm a Brand", body: "Publish campaigns, pick creators", icon: Briefcase },
        ] as const).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setRole(option.key)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              role === option.key
                ? "border-signal bg-accent/60 shadow-sm"
                : "border-border bg-card hover:border-foreground/30",
            )}
          >
            <option.icon className="size-5" />
            <p className="mt-3 font-semibold">{option.label}</p>
            <p className="text-xs text-muted-foreground">{option.body}</p>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required className="mt-2" placeholder="••••••••" />
        </div>
        <Button type="submit" size="lg" className="w-full rounded-full">
          Continue as {role}
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full rounded-full" onClick={submit}>
          Continue with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        This preview stores your role locally. No account is created yet.
      </p>
    </Container>
  );
}
