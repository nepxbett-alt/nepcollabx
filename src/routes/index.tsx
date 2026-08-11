import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gift, Search, Send, Sparkles, Trophy } from "lucide-react";
import { Container } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { Logo } from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NepCollab — Creator Collaboration Marketplace" },
      {
        name: "description",
        content:
          "Brands post campaigns with perks, gifts and deliverables. Creators discover opportunities and apply. NepCollab connects them.",
      },
      { property: "og:title", content: "NepCollab — Creator Collaboration Marketplace" },
      {
        property: "og:description",
        content:
          "Brands post. Creators connect. Collaborations happen. Find real campaign opportunities across Nepal.",
      },
    ],
  }),
  component: Home,
});

const brandSteps = [
  { icon: Send, title: "Publish a campaign", body: "Describe the collaboration, perks and deliverables in a guided wizard." },
  { icon: Search, title: "Review applicants", body: "Compare creator profiles, portfolios and reputation in one board." },
  { icon: Trophy, title: "Select and collaborate", body: "Pick your creators, track deliverables, approve the work." },
];

const creatorSteps = [
  { icon: Search, title: "Discover opportunities", body: "Browse campaigns filtered by your niche, city and platform." },
  { icon: Send, title: "Apply in seconds", body: "Your profile attaches automatically — just add your idea." },
  { icon: Gift, title: "Get selected", body: "Collaborate, submit your work and build your reputation." },
];

function Home() {
  const { campaigns, saved, toggleSaved } = useStore();
  const featured = campaigns.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-signal/20 blur-3xl" />
        <Container className="relative py-10 md:py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-foreground/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
            <Sparkles className="size-3" /> Nepal's creator collaboration app
          </span>
          <h1 className="mt-4 max-w-2xl text-[26px] font-bold leading-[1.15] tracking-tight sm:text-3xl md:text-4xl">
            Brands post opportunities. Creators apply. Great collaborations
            happen.
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-foreground/75">
            Free meals, gifted products, hotel stays and paid partnerships —
            arranged directly between brands and creators.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button
              asChild
              className="tap h-10 rounded-full bg-signal px-5 text-sm text-signal-foreground hover:bg-signal/90"
            >
              <Link to="/campaigns">
                Explore campaigns <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="tap h-10 rounded-full border-ink-foreground/25 bg-transparent px-5 text-sm text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <Link to="/auth">Post a campaign</Link>
            </Button>
          </div>
          <dl className="mt-8 grid max-w-sm grid-cols-3 gap-4">
            {[
              ["120+", "Creators"],
              ["40+", "Brands"],
              ["0%", "Commission"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-lg font-bold">{value}</dt>
                <dd className="text-[11px] text-ink-foreground/70">{label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="pt-8">
        <div className="flex items-end justify-between pb-3.5">
          <h2 className="text-lg font-bold">Open opportunities</h2>
          <Link
            to="/campaigns"
            className="text-[13px] font-semibold text-signal hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              saved={saved.includes(c.id)}
              onToggleSave={toggleSaved}
            />
          ))}
        </div>
      </Container>

      <Container className="py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold">For brands</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Publish the opportunity, let creators come to you.
            </p>
            <ol className="mt-4 space-y-2.5">
              {brandSteps.map((s, i) => (
                <li
                  key={s.title}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink text-ink-foreground">
                    <s.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold">
                      {i + 1}. {s.title}
                    </p>
                    <p className="text-[12.5px] text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="secondary" className="tap mt-4 h-9 rounded-full text-sm">
              <Link to="/auth">Post a campaign</Link>
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-bold">For creators</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Browse opportunities, not services. Apply in a minute.
            </p>
            <ol className="mt-4 space-y-2.5">
              {creatorSteps.map((s, i) => (
                <li
                  key={s.title}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-signal text-signal-foreground">
                    <s.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold">
                      {i + 1}. {s.title}
                    </p>
                    <p className="text-[12.5px] text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild className="tap mt-4 h-9 rounded-full text-sm">
              <Link to="/campaigns">Find campaigns</Link>
            </Button>
          </div>
        </div>
      </Container>

      <section className="border-t border-border bg-secondary/50">
        <Container className="py-8 text-center text-[12.5px] text-muted-foreground">
          <Logo withWordmark={false} size={32} className="justify-center" />
          <p className="mt-2 font-semibold text-foreground">
            NepCollab does not process payments.
          </p>
          <p className="mt-1">
            Perks, gifts and any compensation are arranged directly between the
            brand and the creator.
          </p>
          <Button asChild className="tap mt-5 h-10 rounded-full px-5 text-sm">
            <Link to="/auth">Join NepCollab</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}

