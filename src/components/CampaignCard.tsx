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
    <article className="tap group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md">
      <Link
        to="/campaigns/$campaignId"
        params={{ campaignId: campaign.id }}
        className="block"
      >
        <div className="relative aspect-16/9 overflow-hidden">
          <img
            src={campaign.cover}
            alt={`${campaign.title} campaign cover`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 to-transparent" />
          <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
            <img
              src={brand?.logo}
              alt={`${brand?.name} logo`}
              className="size-7 rounded-full border border-card/80 object-cover"
            />
            <span className="text-[13px] font-semibold text-ink-foreground">
              {brand?.name}
            </span>
          </div>
          {typeof match === "number" ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-signal px-2 py-0.5 text-[11px] font-bold text-signal-foreground">
              {match}% match
            </span>
          ) : null}
        </div>

        <div className="space-y-2.5 p-3.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">
            {campaign.title}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {campaign.types.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-accent px-2.5 py-2 text-[12px] text-accent-foreground">
            <Gift className="mt-px size-3.5 shrink-0" />
            <span className="line-clamp-1 font-medium">
              {campaign.perks.join(" · ")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {campaign.remote ? "Remote" : campaign.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" />
              {campaign.creatorsNeeded} creators
            </span>
            <span
              className={cn(
                "font-medium",
                left <= 7 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {left > 0
                ? `${left}d left · ${formatDate(campaign.deadline)}`
                : "Closed"}
            </span>
          </div>
        </div>
      </Link>

      {onToggleSave ? (
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save campaign"}
          aria-pressed={saved}
          onClick={() => onToggleSave(campaign.id)}
          className="tap absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur hover:bg-card"
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </button>
      ) : null}
    </article>
  );
}

