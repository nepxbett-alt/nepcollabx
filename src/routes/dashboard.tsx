import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Container, PageHeader } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate, getCreator, matchScore } from "@/lib/lookup";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — NepCollab" },
      { name: "description", content: "Track recommended campaigns, applications, collaborations and deadlines in one place." },
      { property: "og:title", content: "Your dashboard — NepCollab" },
      { property: "og:description", content: "Everything happening across your NepCollab collaborations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const store = useStore();
  const {
    role,
    campaigns,
    applications,
    collaborations,
    saved,
    toggleSaved,
    currentCreatorId,
    currentBrandId,
  } = store;

  if (role === "brand") {
    const mine = campaigns.filter((c) => c.brandId === currentBrandId);
    const received = applications.filter((a) =>
      mine.some((c) => c.id === a.campaignId),
    );
    return (
      <Container>
        <PageHeader
          title="Brand home"
          subtitle="Publish opportunities and pick the creators you want."
          action={
            <Button asChild className="rounded-full bg-signal text-signal-foreground hover:bg-signal/90">
              <Link to="/brand/campaigns/new">
                <Plus className="size-4" /> Create campaign
              </Link>
            </Button>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Active campaigns", mine.length],
            ["Applications", received.length],
            ["Shortlisted", received.filter((a) => a.status === "SHORTLISTED").length],
            ["Collaborations", collaborations.length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-display text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold">Your campaigns</h2>
        {mine.length === 0 ? (
          <EmptyState
            title="Your first collaboration starts here."
            body="Publish a campaign and let creators come to you."
            actionLabel="Create campaign"
            actionTo="/brand/campaigns/new"
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mine.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </Container>
    );
  }

  const creator = getCreator(currentCreatorId);
  const mine = applications.filter((a) => a.creatorId === currentCreatorId);
  const recommended = [...campaigns]
    .sort((a, b) => matchScore(b, currentCreatorId) - matchScore(a, currentCreatorId))
    .slice(0, 3);
  const savedCampaigns = campaigns.filter((c) => saved.includes(c.id));

  return (
    <Container>
      <PageHeader
        title={`Hi ${creator?.name.split(" ")[0] ?? "there"}`}
        subtitle="Here are the opportunities that fit you best right now."
      />

      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Profile 80% complete</span>
          <Link to="/profile" className="text-signal hover:underline">
            Finish profile
          </Link>
        </div>
        <Progress value={80} className="mt-3" />
      </div>

      <h2 className="mb-4 text-lg font-bold">Recommended for you</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {recommended.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            saved={saved.includes(c.id)}
            onToggleSave={toggleSaved}
            match={matchScore(c, currentCreatorId)}
          />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Your applications</h2>
      {mine.length === 0 ? (
        <EmptyState
          title="You haven't applied to any campaigns yet."
          body="Browse open opportunities and apply — it takes about a minute."
          actionLabel="Find opportunities"
          actionTo="/campaigns"
        />
      ) : (
        <ul className="space-y-3">
          {mine.slice(0, 4).map((a) => {
            const campaign = campaigns.find((c) => c.id === a.campaignId);
            return (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{campaign?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Applied {formatDate(a.appliedAt)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mb-3 mt-8 text-lg font-bold">Saved campaigns</h2>
      {savedCampaigns.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the bookmark on any campaign to keep it here for later."
          actionLabel="Explore campaigns"
          actionTo="/campaigns"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {savedCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              saved
              onToggleSave={toggleSaved}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
