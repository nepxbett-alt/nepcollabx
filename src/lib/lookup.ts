import { brands, creators } from "@/data/mock";
import type { Campaign } from "@/data/types";

export const getBrand = (id: string) => brands.find((b) => b.id === id);
export const getCreator = (id: string) => creators.find((c) => c.id === id);

export function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysLeft(deadline: string) {
  const diff =
    new Date(deadline).getTime() - new Date("2026-08-10").getTime();
  return Math.ceil(diff / 86_400_000);
}

export function totalFollowers(creatorId: string) {
  const creator = getCreator(creatorId);
  if (!creator) return 0;
  return creator.socials.reduce((sum, s) => sum + s.followers, 0);
}

export function matchScore(campaign: Campaign, creatorId: string) {
  const creator = getCreator(creatorId);
  if (!creator) return 0;
  let score = 40;
  if (creator.location === campaign.location || campaign.remote) score += 20;
  if (creator.niches.some((n) => campaign.requirements.niches.includes(n)))
    score += 20;
  if (creator.socials.some((s) => campaign.platforms.includes(s.platform)))
    score += 12;
  if (totalFollowers(creatorId) >= campaign.requirements.minFollowers)
    score += 8;
  return Math.min(score, 99);
}
