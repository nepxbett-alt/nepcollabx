import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Star } from "lucide-react";
import { Container, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatFollowers, getBrand, getCreator } from "@/lib/lookup";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — NepCollab" },
      { name: "description", content: "Your creator portfolio or brand profile: socials, niches, portfolio and reviews." },
      { property: "og:title", content: "Your profile — NepCollab" },
      { property: "og:description", content: "The profile brands and creators see on NepCollab." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { role, currentCreatorId, currentBrandId, signOut } = useStore();

  if (role === "brand") {
    const brand = getBrand(currentBrandId);
    return (
      <Container className="max-w-3xl">
        <PageHeader title="Brand profile" />
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <img src={brand?.logo} alt={brand?.name} className="size-16 rounded-2xl object-cover" />
            <div>
              <h2 className="flex items-center gap-1.5 text-xl font-bold">
                {brand?.name}
                {brand?.verified ? <BadgeCheck className="size-5 text-signal" /> : null}
              </h2>
              <p className="text-sm text-muted-foreground">
                {brand?.category} · {brand?.location}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{brand?.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              [brand?.completedCampaigns, "Campaigns"],
              [brand?.rating, "Rating"],
              [`${brand?.responseRate}%`, "Response"],
            ].map(([v, l]) => (
              <div key={String(l)} className="rounded-2xl bg-secondary p-3">
                <p className="font-display text-lg font-bold">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="mt-6 rounded-full" onClick={signOut}>
          Sign out
        </Button>
      </Container>
    );
  }

  const creator = getCreator(currentCreatorId);
  return (
    <Container className="max-w-3xl">
      <PageHeader title="Creator profile" />
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <img src={creator?.avatar} alt={creator?.name} className="size-16 rounded-full object-cover" />
          <div>
            <h2 className="flex items-center gap-1.5 text-xl font-bold">
              {creator?.name}
              {creator?.verified ? <BadgeCheck className="size-5 text-signal" /> : null}
            </h2>
            <p className="text-sm text-muted-foreground">
              @{creator?.username} · {creator?.location}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{creator?.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {creator?.niches.map((n) => (
            <span key={n} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              {n}
            </span>
          ))}
        </div>

        <h3 className="mt-6 font-semibold">Platforms</h3>
        <ul className="mt-2 space-y-2">
          {creator?.socials.map((s) => (
            <li key={s.platform} className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm">
              <span className="font-medium">
                {s.platform} · @{s.username}
              </span>
              <span className="text-muted-foreground">
                {formatFollowers(s.followers)} · {s.engagement}% eng.
              </span>
            </li>
          ))}
        </ul>

        {creator && creator.portfolio.length > 0 ? (
          <>
            <h3 className="mt-6 font-semibold">Portfolio</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {creator.portfolio.map((p) => (
                <figure key={p.id} className="overflow-hidden rounded-2xl border border-border">
                  <img src={p.image} alt={p.title} loading="lazy" className="aspect-video w-full object-cover" />
                  <figcaption className="p-3 text-sm">
                    <span className="font-medium">{p.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {p.brand} · {p.platform}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {creator && creator.reviews.length > 0 ? (
          <>
            <h3 className="mt-6 font-semibold">Reviews</h3>
            <ul className="mt-2 space-y-3">
              {creator.reviews.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border p-4 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <Star className="size-4 fill-current text-signal" />
                    {r.rating} · {r.author}
                  </div>
                  <p className="mt-1 text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <Button variant="outline" className="mt-6 rounded-full" onClick={signOut}>
        Sign out
      </Button>
    </Container>
  );
}
