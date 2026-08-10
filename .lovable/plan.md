# NepCollab — V1 Front-End Build

A mobile-first, campaign-driven marketplace UI built with mock data. No backend, no admin, no payments. Every screen is real and navigable so the flow can be judged before wiring a database.

## The model everything follows

Brand posts a campaign → creators discover it → creators apply → brand shortlists and selects → collaboration workspace → deliverables submitted → approved → completed → both sides review.

## Design direction

No existing branding, so I'll create one: a confident, creator-focused identity — deep ink surfaces with a warm signal accent, large typographic headings, generous campaign cards, rounded soft-edged surfaces, subtle motion on cards and transitions. Not an admin dashboard. All colors as semantic tokens so light/dark both work.

## Screens

Public
- Home: hero ("Brands post. Creators connect. Collaborations happen."), how-it-works for each side, featured campaigns, dual CTAs
- Browse campaigns: search, filters (location, niche, platform, campaign type, perk type, deadline, remote), campaign card grid
- Campaign detail: brand header, description, deliverables, perks/gifts, requirements, dates, creators needed, Apply / Save / Report
- Creator profile: photo, bio, niches, location, social platforms with follower counts, portfolio grid, reviews, badges
- Auth: sign in / sign up, then role picker (I'm a Creator / I'm a Brand) — UI only, role stored locally so the app can switch experiences

Creator
- Dashboard: recommended campaigns, saved, active applications, deadlines, profile completion meter
- Discover (same browse surface, personalized)
- Applications list with statuses: Applied, Under Review, Shortlisted, Selected, Rejected, Withdrawn, Expired
- Application form: short prompts, profile auto-attached, optional portfolio picker
- Collaborations: workspace per collaboration
- Messages, Profile & onboarding wizard

Brand
- Dashboard: Create Campaign as the primary action, active campaigns, applications received, pending submissions
- Campaign creation wizard, 8 steps: basics → what you need → who you're looking for → perks/gifts → location & timeline → deliverables → review → publish
- Campaigns list with lifecycle badges
- Applicants board per campaign: applicant cards, shortlist / accept / reject / message / note, compare view
- Invite a creator to a campaign
- Collaboration workspace: overview, deliverables, submission review (approve / request changes), activity timeline
- Messages, Brand profile & onboarding

Shared
- Notifications panel (event-driven list)
- Mobile bottom nav, role-aware (creator: Home, Discover, Applications, Collabs, Profile; brand: Home, Campaigns, Applicants, Messages, Profile)
- Empty states with an action on every list surface

## Terminology

Campaign, opportunity, creator, brand, application, applicant, selected, collaboration, deliverable, submission, perk, gift. Never service, order, checkout, seller, buyer.

## Technical notes

- TanStack Start routes, one file per surface, each with its own head() metadata
- Mock data in typed modules (`src/data/`) covering campaigns, creators, brands, applications, collaborations, deliverables, submissions, messages, notifications; state changes held in React state/localStorage so applying, shortlisting, selecting and approving actually move items between lists during a session
- Lifecycle enums for campaign / application / collaboration exactly as specified, so the later database maps 1:1
- Semantic tokens in `src/styles.css`; shadcn components restyled to the identity
- Installable PWA: manifest, icons, theme color, mobile layout. No service worker or offline caching in this pass

## Not in this build

Backend, auth persistence, real uploads, admin dashboard, moderation queue, verification workflow, payments of any kind, smart matching scoring.

## Suggested order

1. Design system, tokens, layout shell, mobile nav
2. Home + browse + campaign detail (mock data)
3. Auth screens, role picker, both onboarding wizards
4. Creator dashboard, applications, application form
5. Brand dashboard, campaign wizard, applicants board, selection & invites
6. Collaboration workspace, deliverables, submissions, approvals, reviews
7. Messaging, notifications, empty states, PWA manifest, polish
