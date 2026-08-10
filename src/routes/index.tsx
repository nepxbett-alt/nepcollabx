import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gift, Search, Send, Sparkles, Trophy } from "lucide-react";
import { Container } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
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
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-signal/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-signal/10 blur-3xl" />
        <Container className="relative py-16 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" /> Nepal's creator collaboration board
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Brands post. Creators connect. Collaborations happen.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-foreground/75 md:text-lg">
            Discover real collaboration opportunities from brands looking for
            creators like you — free meals, gifted products, hotel stays and
            paid partnerships arranged directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-signal text-signal-foreground hover:bg-signal/90">
              <Link to="/campaigns">
                Find campaigns <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <Link to="/auth">Post a campaign</Link>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {[
              ["120+", "Active creators"],
              ["40+", "Brands"],
              ["0%", "Platform commission"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-bold">{value}</dt>
                <dd className="text-xs text-ink-foreground/70">{label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">I'm a Brand</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish the opportunity, let creators come to you.
            </p>
            <ol className="mt-6 space-y-4">
              {brandSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink text-ink-foreground">
                    <s.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {i + 1}. {s.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="secondary" className="mt-5 rounded-full">
              <Link to="/auth">Post a campaign</Link>
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold">I'm a Creator</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse opportunities, not services. Apply in a minute.
            </p>
            <ol className="mt-6 space-y-4">
              {creatorSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal text-signal-foreground">
                    <s.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {i + 1}. {s.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/campaigns">Find campaigns</Link>
            </Button>
          </div>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="flex items-end justify-between pb-6">
          <h2 className="text-2xl font-bold">Open opportunities</h2>
          <Link
            to="/campaigns"
            className="text-sm font-semibold text-signal hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

      <section className="border-t border-border bg-secondary/40">
        <Container className="py-10 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            NepCollab does not process payments.
          </p>
          <p className="mt-1">
            Perks, gifts and any compensation are arranged directly between the
            brand and the creator.
          </p>
        </Container>
      </section>
    </div>
  );
}
