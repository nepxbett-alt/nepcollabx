import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, PageHeader } from "@/components/AppShell";
import { CampaignCard } from "@/components/CampaignCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOCATIONS, NICHES, PLATFORMS } from "@/data/types";
import { getBrand, matchScore } from "@/lib/lookup";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campaigns/")({
  head: () => ({
    meta: [
      { title: "Find Campaigns — NepCollab" },
      {
        name: "description",
        content:
          "Browse open brand campaigns across Nepal. Filter by city, niche, platform and perk, then apply in minutes.",
      },
      { property: "og:title", content: "Find Campaigns — NepCollab" },
      {
        property: "og:description",
        content: "Open collaboration opportunities from brands looking for creators.",
      },
    ],
  }),
  component: BrowseCampaigns,
});

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ink bg-ink text-ink-foreground"
          : "border-border bg-card text-muted-foreground hover:border-foreground/30",
      )}
    >
      {label}
    </button>
  );
}

function BrowseCampaigns() {
  const { campaigns, saved, toggleSaved, currentCreatorId } = useStore();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [niche, setNiche] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(
    () =>
      campaigns.filter((c) => {
        const brand = getBrand(c.brandId);
        const haystack =
          `${c.title} ${c.description} ${brand?.name ?? ""} ${c.types.join(" ")} ${c.perks.join(" ")}`.toLowerCase();
        if (query && !haystack.includes(query.toLowerCase())) return false;
        if (location && c.location !== location && !(location === "Remote" && c.remote))
          return false;
        if (niche && !c.requirements.niches.includes(niche)) return false;
        if (platform && !c.platforms.includes(platform as never)) return false;
        return true;
      }),
    [campaigns, query, location, niche, platform],
  );

  const hasFilters = Boolean(location || niche || platform);

  return (
    <Container>
      <PageHeader
        title="Find campaigns"
        subtitle="Opportunities from brands looking for creators right now."
      />

      <div className="sticky top-16 z-30 -mx-4 mb-6 space-y-3 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns, brands, perks"
              className="h-11 rounded-full pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            className="h-11 rounded-full"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {showFilters ? (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((l) => (
                  <Chip
                    key={l}
                    label={l}
                    active={location === l}
                    onClick={() => setLocation(location === l ? null : l)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Niche
              </p>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <Chip
                    key={n}
                    label={n}
                    active={niche === n}
                    onClick={() => setNiche(niche === n ? null : n)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Platform
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Chip
                    key={p}
                    label={p}
                    active={platform === p}
                    onClick={() => setPlatform(platform === p ? null : p)}
                  />
                ))}
              </div>
            </div>
            {hasFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocation(null);
                  setNiche(null);
                  setPlatform(null);
                }}
              >
                <X className="size-4" /> Clear filters
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "opportunity" : "opportunities"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="No campaigns match your filters yet."
          body="Try widening your search — new opportunities are posted every week."
          actionLabel="Explore all campaigns"
          onAction={() => {
            setQuery("");
            setLocation(null);
            setNiche(null);
            setPlatform(null);
          }}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              saved={saved.includes(c.id)}
              onToggleSave={toggleSaved}
              match={matchScore(c, currentCreatorId)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
