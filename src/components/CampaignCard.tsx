import { Link } from "@tanstack/react-router";
import { Bookmark, Gift, MapPin, Users } from "lucide-react";
import type { Campaign } from "@/data/types";
import { daysLeft, formatDate, getBrand } from "@/lib/lookup";
import { cn } from "@/lib/utils";

export function CampaignCard({
  campaign,
  saved,
  onToggleSave,
  match,
}: {
  campaign: Campaign;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  match?: number;
}) {
  const brand = getBrand(campaign.brandId);
  const left = daysLeft(campaign.deadline);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to="/campaigns/$campaignId"
        params={{ campaignId: campaign.id }}
        className="block"
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <img
            src={campaign.cover}
            alt={`${campaign.title} campaign cover`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <img
              src={brand?.logo}
              alt={`${brand?.name} logo`}
              className="size-9 rounded-full border-2 border-card object-cover"
            />
            <span className="text-sm font-semibold text-ink-foreground">
              {brand?.name}
            </span>
          </div>
          {typeof match === "number" ? (
            <span className="absolute right-3 top-3 rounded-full bg-signal px-2.5 py-1 text-xs font-bold text-signal-foreground">
              {match}% match
            </span>
          ) : null}
        </div>

        <div className="space-y-3 p-4">
          <h3 className="text-lg font-semibold leading-snug">
            {campaign.title}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {campaign.types.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-sm text-accent-foreground">
            <Gift className="mt-0.5 size-4 shrink-0" />
            <span className="font-medium">{campaign.perks.join(" · ")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {campaign.remote ? "Remote" : campaign.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {campaign.creatorsNeeded} creators
            </span>
            <span
              className={cn(
                "font-medium",
                left <= 7 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {left > 0
                ? `${left} days left · closes ${formatDate(campaign.deadline)}`
                : "Closed"}
            </span>
          </div>
        </div>
      </Link>

      {onToggleSave ? (
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save campaign"}
          onClick={() => onToggleSave(campaign.id)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </button>
      ) : null}
    </article>
  );
}
