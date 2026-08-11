import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, getBrand } from "@/lib/lookup";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Your applications — NepCollab" },
      { name: "description", content: "Track every campaign you applied to: applied, shortlisted, selected or closed." },
      { property: "og:title", content: "Your applications — NepCollab" },
      { property: "og:description", content: "Always know where you stand with each brand." },
    ],
  }),
  component: Applications,
});

function Applications() {
  const {
    applications,
    campaigns,
    currentCreatorId,
    withdrawApplication,
  } = useStore();
  const mine = applications.filter((a) => a.creatorId === currentCreatorId);

  return (
    <Container>
      <PageHeader title="Applications" subtitle="Every opportunity you've pursued." />

      {mine.length === 0 ? (
        <EmptyState
          title="You haven't applied to any campaigns yet."
          body="Find a campaign that fits your niche and send your first application."
          actionLabel="Find opportunities"
          actionTo="/campaigns"
        />
      ) : (
        <ul className="space-y-4">
          {mine.map((a) => {
            const campaign = campaigns.find((c) => c.id === a.campaignId);
            const brand = campaign ? getBrand(campaign.brandId) : undefined;
            return (
              <li key={a.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{brand?.name}</p>
                    <Link
                      to="/campaigns/$campaignId"
                      params={{ campaignId: a.campaignId }}
                      className="font-semibold hover:underline"
                    >
                      {campaign?.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied {formatDate(a.appliedAt)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {a.message}
                </p>
                {["APPLIED", "UNDER_REVIEW", "SHORTLISTED"].includes(a.status) ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      withdrawApplication(a.id);
                      toast.success("Application withdrawn");
                    }}
                  >
                    Withdraw application
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
