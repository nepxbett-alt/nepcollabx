# NepCollab — Production Backend Build

Keep the current design and screens exactly as they are. Replace the local mock store with a real Lovable Cloud backend (Postgres + auth + storage + realtime) so every screen reads and writes real data.

## What changes for you

- Sign in with a magic link sent to your email — no passwords.
- First-time users pick Creator or Brand, then complete a short onboarding.
- Everything you do (campaigns, applications, saves, messages, reviews, portfolio) is stored for real and visible to the right people only.
- The app launches with an empty database and clear "be the first" prompts, not demo data.

## Data model

- `profiles` — one per account: role (creator/brand), display name, username, avatar, bio, location, website.
- `creator_profiles` — headline, category, skills, audience size, engagement rate, social links, verification.
- `brand_profiles` — company name, description, industry, website, logo, location, verification.
- `campaigns` — brand, title, description, category, location, budget/currency, deliverables, requirements, deadline and date range, cover image, status (draft/published/paused/closed/completed/cancelled). No payment fields.
- `applications` — campaign, creator, pitch, proposed rate, status (applied/shortlisted/accepted/rejected/withdrawn/completed); unique per campaign+creator.
- `collaborations` — campaign, creator, brand, status, dates, agreed budget, deliverables, notes.
- `saved_campaigns` — unique per creator+campaign.
- `conversations` + `messages` — one conversation per brand↔creator↔campaign pair, messages with read state.
- `reviews` — one per collaboration+reviewer, rating and comment.
- `portfolio_items` — creator media with sort order.
- `notifications` — typed events with link target and read state.

Every table gets primary/foreign keys, cascade rules, check constraints on all status values, `created_at`/`updated_at` with triggers, and indexes on campaign status/category/location, application campaign/creator/status, collaboration participants, conversation messages by time, saves and notifications.

## Security

Row Level Security on every table:
- Creators read/write only their own profile, portfolio, saves, applications, notifications; they can browse published campaigns and read the campaigns they applied to.
- Brands manage only their own brand profile and campaigns, see applications only for their own campaigns, and change status only there.
- Messages and conversations are readable only by the two participants.
- Reviews only by participants of a completed collaboration.
- Public/anonymous access is limited to published campaigns and public profile fields — never emails, messages, or application contents.

Multi-step business logic runs in database functions so it can't be faked from the browser:
- `accept_application` — verifies campaign ownership, updates the application, creates the collaboration, opens the conversation, notifies the creator, all in one transaction.
- Triggers that create notifications on new applications, status changes, new messages and new reviews.
- A trigger that creates the `profiles` row on signup.

## Storage

Two buckets: `avatars` (public read, owner write) and `portfolio` (public read, owner write), with path-based owner policies. Media is uploaded to storage; only URLs are stored in Postgres.

## Frontend wiring

- Delete `src/lib/store.tsx` and `src/data/mock.ts`; keep `src/data/types.ts` aligned with generated DB types.
- New data layer under `src/lib/services/` (auth, profile, campaign, application, collaboration, messaging, notification, review, portfolio) plus TanStack Query hooks in `src/lib/queries/`. Components never call the database directly.
- `/auth` becomes email magic-link only, with sent/expired/invalid states and a loading state while the session resolves; `/auth/callback` handles the link.
- New `/onboarding` route: role choice then role-specific profile completion.
- Protected screens move under an authenticated layout; signed-in users are bounced off `/auth`.

Screens connected, keeping their existing layout:
- Creator home — real greeting, recommended (category/location match), trending, new campaigns, real profile-completion percentage, real activity feed.
- Discover — server-side search (debounced), category/location/budget filters, sort, result count, infinite loading, published-only.
- Campaign detail — real record, real save/unsave, real apply with all guard rules and error messages, immediate applied state.
- Applications — real records on the existing StatusTimeline, including rejected/withdrawn; brand applicant view with shortlist/accept/reject.
- Brand dashboard and campaign management — real counts, create/draft/edit/publish/pause/close, applicant review, creator selection.
- Profile — real creator/brand profile with avatar/cover upload, portfolio CRUD, saved campaigns, collaborations, reviews; editing persists.
- Messages — realtime conversations, send, read receipts, timestamps, subscription cleanup on unmount.
- Notifications — real events, unread badge, realtime updates, tap-through to the entity.

Every screen gets loading (existing skeletons), empty, error and success handling.

## Testing before I finish

I'll run the full creator flow (magic link → onboarding → discover → save → apply → timeline) and brand flow (onboarding → create/publish campaign → review applicant → accept → collaboration → message → review) in a real browser against the live database, plus authorization checks that one account can't read or modify another's data, and confirm no console errors.

## Technical notes

- Lovable Cloud is enabled for this project; all schema arrives as reproducible SQL migrations including indexes, constraints, RLS policies, storage policies, functions and triggers.
- Only the publishable key is used client-side; no service-role key in frontend code. Supabase config comes from environment variables already managed by the platform, and auth redirect URLs are derived from `window.location.origin` so local, preview and production all work unmodified.
