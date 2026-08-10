# Campaign Connect (13)

Absolutely. Below is the master specification I’d use as the single source of truth for building NepCollab as a PWA-first influencer collaboration marketplace, with the core model exactly as you clarified:

> Brands post collaboration opportunities. Influencers discover them and apply. Brands review applicants and select influencers. NepCollab does NOT process payments.



I’ve deliberately removed the service-selling model where influencers list services and brands hire them.

NepCollab — Master Product Specification

1. Product Definition

Product name: NepCollab

Product type: Web application / Progressive Web App (PWA), designed mobile-first.

Primary marketplace model: Brand → Campaign → Influencer Applications → Brand Selection → Collaboration → Submission → Verification/Completion

NepCollab is a marketplace that connects brands/businesses looking for creators with influencers/creators looking for collaboration opportunities.

The marketplace is campaign-first, not influencer-service-first.

A brand does not primarily browse a catalog of influencers and purchase their services.

Instead:

Brand creates a campaign → campaign becomes available to eligible influencers → influencers discover campaign → influencers apply → brand reviews applications → brand selects influencer(s) → collaboration begins.

This distinction is fundamental and must influence the entire UX, database structure, navigation, terminology, notifications, and business logic.


---

2. Core Philosophy

NepCollab should feel like a modern combination of:

Influencer marketplace + collaboration board + campaign management system + creator portfolio network.

The product should be extremely simple for a new user to understand.

A brand should be able to think:

> “I have a product/service. I want creators to promote it. I'll create an opportunity and let creators apply.”



An influencer should be able to think:

> “I want collaborations. I'll browse opportunities that fit me and apply.”



The platform should eliminate unnecessary complexity.

There should initially be:

No payment processing.

No escrow.

No commission handling.

No withdrawal system.

No payment gateway.

No wallet.

No subscription requirement.

No financial transaction between NepCollab and users.

The actual commercial arrangement between brand and influencer happens outside NepCollab unless both parties voluntarily use the platform's communication features.


---

3. Two Primary User Types

NepCollab has two primary marketplace roles.

Brand

A brand represents a business, organization, startup, restaurant, hotel, product, service, agency, event, or other organization looking for creators.

Brands can:

Create campaigns.

Publish campaigns.

Specify campaign requirements.

Specify perks/rewards.

Specify gifts/products.

Specify location.

Specify content requirements.

Set application deadlines.

Review applicants.

View influencer profiles.

Shortlist influencers.

Accept/reject applications.

Communicate with selected influencers.

Track campaign progress.

Review submitted work.

Mark collaboration completed.

Rate/review influencers.

Manage their profile and campaigns.


---

4. Influencer / Creator

An influencer is a creator looking for collaboration opportunities.

Influencers can:

Create a creator profile.

Connect social accounts.

Show follower counts.

Show engagement information where available.

Specify niches.

Specify location.

Specify audience.

Browse campaigns.

Search campaigns.

Filter campaigns.

Save campaigns.

View campaign details.

Apply to campaigns.

Withdraw applications where allowed.

Track applications.

Receive invitations.

Communicate with brands after selection.

Submit collaboration work.

Track campaign status.

Receive reviews.

Build reputation.


---

5. The Most Important Marketplace Flow

This is the heart of NepCollab.

Brand side

Create campaign

↓

Add campaign details

↓

Add perks/rewards/gifts

↓

Publish campaign

↓

Campaign becomes discoverable

↓

Influencers apply

↓

Brand receives applications

↓

Brand reviews applicants

↓

Brand shortlists

↓

Brand selects influencer(s)

↓

Influencer receives notification

↓

Influencer accepts collaboration

↓

Collaboration begins

↓

Influencer submits required content/work

↓

Brand reviews submission

↓

Brand approves / requests changes

↓

Campaign completed

↓

Brand reviews influencer

↓

Influencer's reputation improves


---

6. Campaign Is the Central Object

The campaign should be the most important entity in the entire system.

Everything revolves around it.

A campaign should contain:

Basic information

Campaign title

Campaign description

Brand

Brand logo

Campaign category

Campaign type

Campaign location

Remote/online option

Start date

End date

Application deadline

Number of influencers needed

Campaign status

Created date

Last updated date


---

7. Campaign Types

The system should support multiple collaboration models.

Examples:

Product Promotion

Instagram Reel

Instagram Post

Instagram Story

TikTok Video

YouTube Video

YouTube Short

Facebook Promotion

Event Promotion

Restaurant Visit

Hotel Stay

Product Review

Unboxing

UGC Creation

Photography

Videography

Brand Ambassador

Giveaway Collaboration

Affiliate-style collaboration — without NepCollab handling payments

Other

The brand can select one or multiple content types.


---

8. Campaign Perks

This is particularly important for NepCollab.

Brands should NOT be forced to enter monetary compensation.

Instead, the campaign should prominently support perks.

For example:

Free meal

Free product

Free hotel stay

Free service

Gift hamper

Event access

VIP access

Discount

Brand merchandise

Experience

Exposure

Commission paid directly by brand

Cash compensation arranged privately

Negotiable

Other

The platform should allow multiple perks simultaneously.

Example:

> Free dinner for two + Rs. 2,000 arranged directly with selected creator + gift hamper.



NepCollab simply records/display these terms.

It does not collect the money.


---

9. Gift-Based Campaigns

A brand should be able to explicitly create:

Gift collaboration

For example:

> “We are launching our new skincare product and looking for 10 Pokhara creators.”



Reward:

> Free skincare package worth Rs. 5,000.



Required:

> 1 Instagram Reel
2 Stories
Tag @brand
Keep post live for 30 days



Creators can apply.

This should be a first-class campaign type rather than an afterthought.


---

10. Campaign Requirements

Brands should be able to specify exactly who they want.

Creator requirements

Minimum followers

Maximum followers

Minimum engagement rate

Age range

Gender preference — only if legitimately necessary

Location

Languages

Niche

Platform

Content type

Audience type

Previous experience

Required equipment

Availability

Other requirements

The brand should be able to choose:

No minimum

for requirements it doesn't care about.


---

11. Social Platforms

Creators should be able to add:

Instagram

TikTok

YouTube

Facebook

X

Other relevant platforms

Each platform should have:

Username

Profile URL

Follower count

Following count where relevant

Content count where relevant

Engagement metrics where available

Verification status

Last verified date


---

12. Creator Profile

The creator profile should function like a professional creator portfolio.

It should contain:

Profile photo

Creator name

Username

Bio

Location

Languages

Niches

Social platforms

Follower counts

Engagement information

Audience information

Content samples

Portfolio

Previous collaborations

Completed campaigns

Reviews

Rating

Verification badges

Availability

Preferred collaboration types


---

13. Creator Portfolio

Creators should be able to showcase previous work.

Each portfolio item can contain:

Image

Video

Platform

Campaign/brand name

Description

Link

Date

Category

Performance metrics where available

This allows brands to evaluate creators before selecting them.


---

14. Discovery

The creator's primary discovery experience should be:

“Find Campaigns”

This should be one of the strongest sections of the influencer dashboard.

Campaign cards should show:

Brand logo

Brand name

Campaign title

Category

Location

Deadline

Required platform

Perk/reward

Number of creators wanted

Application count, if appropriate

Campaign type

Relevant tags


---

15. Campaign Card

A campaign card should immediately answer:

Who?

Brand.

What?

Campaign.

Where?

Location.

When?

Deadline.

What do I get?

Perk/reward.

What do I need to do?

Content requirement.

Can I apply?

Clear Apply button.


---

16. Campaign Details Page

The campaign detail page should contain:

Hero section

Brand information

Campaign title

Campaign description

Campaign goals

Content requirements

Deliverables

Platforms

Perks

Gift details

Location

Dates

Application deadline

Creator requirements

Number of creators

Selection process

Important instructions

Terms/notes

Apply button

Save button

Report button


---

17. Application System

The application should be extremely simple.

Click:

Apply Now

The influencer sees an application form.

Possible fields:

Why are you interested?

Why are you a good fit?

Relevant previous work

Content idea

Availability

Additional note

Optional portfolio selection

The creator's profile information should automatically be attached.

The influencer shouldn't repeatedly type information that already exists on their profile.


---

18. Application Statuses

Applications should have clear states.

Applied

Under Review

Shortlisted

Selected

Rejected

Withdrawn

Expired

The creator should always know where they stand.


---

19. Brand Application Management

Brands should have:

Applicants

A dedicated campaign applicant dashboard.

Each applicant card should show:

Profile photo

Creator name

Location

Niche

Followers

Engagement

Platforms

Application message

Portfolio

Previous collaborations

Rating

Verification

Application date


---

20. Applicant Actions

Brand can:

View profile

Shortlist

Accept

Reject

Message

Compare

Add note

Report

Remove from shortlist


---

21. Selection System

The brand selects creators directly.

Example:

Campaign requires:

5 creators

Brand receives:

42 applications

Brand shortlists:

12

Brand selects:

5

The remaining applicants automatically receive the appropriate status.

The brand should be able to select multiple creators from one campaign.


---

22. Invitation System

Brands should also be able to directly invite creators to campaigns.

This creates a secondary flow:

Brand discovers creator → Invite to campaign → Creator receives invitation → Creator accepts/declines

This does NOT replace the primary marketplace flow.

Primary:

Campaign → Creator applies

Secondary:

Brand → Creator invitation


---

23. Messaging

Messaging should primarily become available once there is a legitimate collaboration relationship.

Possible states:

Before selection:

Limited messaging or no direct messaging.

After selection:

Full collaboration chat.

The chat should support:

Text

Images

Files

Links

Campaign references

Submission references

System messages


---

24. Collaboration Workspace

Once a creator is selected, the campaign should transition from a marketplace listing into a collaboration workspace.

This is one of the areas that can make NepCollab much stronger than a basic campaign marketplace.

Workspace should show:

Campaign overview

Requirements

Deliverables

Deadline

Brand contact

Selected creator

Messages

Submission area

Status

Activity timeline


---

25. Deliverables

Brands should be able to define individual deliverables.

Example:

Deliverable 1

Instagram Reel

Due:

August 20

Status:

Pending

Deliverable 2

Instagram Story

Due:

August 22

Status:

Pending

Deliverable 3

Google review

Due:

August 23

Status:

Pending

Each deliverable can have:

Description

Platform

Content type

Deadline

Instructions

Reference files

Status

Submission

Approval

Revision request


---

26. Submission System

Creator clicks:

Submit Work

They can upload:

Images

Videos

Documents

Links

Social media URLs

Screenshots

Text

The submission should be associated with the relevant campaign and deliverable.


---

27. Review / Approval

Brand sees:

Submission received

Actions:

Approve

Request changes

Reject

Ask question

The creator can resubmit if changes are requested.


---

28. Campaign Completion

Once all required deliverables are approved:

Campaign becomes:

Completed

The creator gets a completed collaboration record.

The brand gets a completed campaign record.


---

29. Reviews

After completion:

Brand reviews creator.

Possible criteria:

Communication

Quality

Reliability

Creativity

Professionalism

Overall rating

The creator can also review the brand.

This creates a two-sided reputation system.


---

30. Trust & Verification

Trust should be extremely important.

Creator verification can include:

Email verification

Phone verification

Social account verification

Profile verification

Manual admin verification

Brands can also be verified.

Badges:

Verified Creator

Verified Brand

Top Creator

Experienced Creator

Potentially:

Trusted Brand


---

31. Admin Platform

NepCollab requires a powerful admin dashboard.

Admin should be able to manage:

Users

Creators

Brands

Campaigns

Applications

Collaborations

Submissions

Reviews

Reports

Categories

Niches

Locations

Social platforms

Verification requests

Notifications

Content

Featured campaigns

Featured creators

Homepage

Settings


---

32. Admin Dashboard

Dashboard should display:

Total creators

Total brands

Active campaigns

Pending campaigns

Applications

Active collaborations

Completed collaborations

Pending verifications

Reported content

New users

Campaign growth

Creator growth

Brand growth


---

33. Campaign Moderation

Before publication, the system should optionally support:

Draft

↓

Pending Review

↓

Approved

↓

Published

or:

Rejected

This prevents spam and fraudulent campaigns.

Admin should be able to:

Approve

Reject

Request changes

Edit

Hide

Feature

Delete


---

34. Reporting System

Users should be able to report:

Fake brand

Fake creator

Scam campaign

Inappropriate campaign

Misleading reward

Spam

Harassment

Copyright issue

Fraud

Other

Admin investigates reports.


---

35. Notifications

Notifications should be event-driven.

Creator notifications:

New campaign matching interests

Application submitted

Application viewed

Shortlisted

Selected

Rejected

Invitation received

Message received

Submission approved

Revision requested

Campaign deadline approaching

Campaign completed

Review received

Verification approved

Brand notifications:

New application

Application withdrawn

Creator accepted invitation

Creator submitted work

Revision submitted

Campaign deadline approaching

Campaign completed

New message

Review reminder

Admin notifications:

New brand

New creator

Verification request

Campaign awaiting moderation

Reported user

Reported campaign


---

36. Search

Creators should search campaigns.

Brands should search creators.

Search should support:

Keyword

Location

Category

Niche

Platform

Follower range

Engagement

Campaign type

Perk type

Deadline

Remote/on-site

Verification


---

37. Smart Matching

Later, NepCollab can introduce intelligent matching.

For example:

Campaign:

> Restaurant promotion in Pokhara



Creator:

> Food creator in Pokhara



The system can calculate:

92% Match

Reasons:

✓ Location match

✓ Food niche match

✓ Instagram match

✓ Audience match

✓ Engagement requirement met

This should be presented as a recommendation rather than an absolute judgment.


---

38. Homepage

The homepage should immediately explain the marketplace.

Hero:

> Brands post. Creators connect. Collaborations happen.



Secondary explanation:

> Discover real collaboration opportunities from brands looking for creators like you.



Primary actions:

Find Campaigns

Post a Campaign

Secondary:

I'm a Creator

I'm a Brand


---

39. Creator Homepage

Creator dashboard should prioritize:

Discover campaigns

Then:

Recommended campaigns

New campaigns

Saved campaigns

Applications

Active collaborations

Upcoming deadlines

Completed collaborations

Messages

Profile completion


---

40. Brand Homepage

Brand dashboard should prioritize:

Create Campaign

Then:

Active campaigns

Applications received

Creators selected

Active collaborations

Pending submissions

Completed campaigns


---

41. Brand Campaign Creation Wizard

Instead of a huge form, use a multi-step wizard.

Step 1

Campaign basics.

Step 2

What do you need?

Step 3

Who are you looking for?

Step 4

Perks / gifts / compensation.

Step 5

Location & timeline.

Step 6

Deliverables.

Step 7

Review.

Step 8

Publish.

This will dramatically improve usability.


---

42. Campaign Creation Example

A restaurant could create:

Title

Food Creator Collaboration — Pokhara

Description

We're launching our new menu and looking for local food creators.

Looking for

Food / Lifestyle creators

Platform

Instagram + TikTok

Followers

2,000+

Location

Pokhara

Deliverables

1 Reel
2 Stories

Perks

Free dinner for two
Gift voucher

Application deadline

August 25

Campaign date

August 28–September 5

Creators required

5

Then:

Publish Campaign


---

43. Creator Application Example

Creator sees:

> Food Creator Collaboration — Pokhara



Reward:

🎁 Free dinner for two
🎁 Gift voucher

Requirements:

2,000+ followers

Food/lifestyle niche

Pokhara

Instagram

Then:

Apply

Application:

> “I'm a Pokhara-based food creator with an audience interested in local restaurants. I'd love to create a cinematic Reel showcasing the new menu.”



Then:

Submit Application

Done.


---

44. No Payment Architecture

This is extremely important.

The initial version should contain zero payment infrastructure.

Do not build:

Wallet

Balance

Deposit

Withdrawal

Escrow

Payment gateway

Transaction fees

Platform commission

Invoice system

Payment processing

The platform can simply display:

Compensation / Perks

and:

Payment arrangements are made directly between the brand and creator.

This keeps the initial product dramatically simpler.


---

45. Future Monetization

NepCollab can monetize later.

Potential future models:

Featured campaign

Promoted campaign

Creator verification

Brand verification

Premium brand account

Advanced analytics

Campaign boosts

Creator discovery tools

Sponsored placement

Subscription

Platform commission — only if you later decide to handle payments.

None of this needs to exist in V1.


---

46. PWA Requirements

The first version should be a PWA, not a native app.

It should work beautifully on:

Android

iPhone

Desktop

Tablet

Mobile browser

It should be installable from the browser.

It should have:

App icon

Splash experience

Offline shell

Responsive layout

Mobile navigation

Push notifications where supported

Fast loading

Deep links

Share functionality


---

47. Mobile Navigation

Creator:

Home

Discover

Applications

Collaborations

Messages

Profile

Brand:

Home

Campaigns

Applicants

Messages

Profile

Some sections can be consolidated if necessary.


---

48. Design Direction

NepCollab should feel:

Premium

Modern

Clean

Trustworthy

Young

Creator-focused

Professional

Avoid making it look like a generic admin dashboard.

Use strong visual hierarchy.

Large campaign cards.

Beautiful creator profiles.

Clear CTAs.

Modern typography.

Smooth transitions.

Subtle animations.

Excellent empty states.

Strong mobile UX.


---

49. Brand Identity

The existing official NepCollab branding should be retained consistently throughout the application.

The same visual language should be used across:

Landing

Authentication

Creator dashboard

Brand dashboard

Campaigns

Applications

Profiles

Messaging

Admin

Notifications

Settings

Onboarding


---

50. Authentication

Support:

Email/password

Google login

Potential future social login.

After registration:

User chooses:

I'm a Creator

or

I'm a Brand

The role should determine the experience.


---

51. Creator Onboarding

Creator onboarding should collect:

Name

Profile photo

Bio

Location

Niche

Platforms

Follower information

Portfolio

Languages

Preferred collaboration types

Availability

Then:

Complete Profile

The system should show a profile completion percentage.

Example:

Profile 80% complete


---

52. Brand Onboarding

Brand onboarding:

Brand name

Logo

Business category

Description

Location

Website

Social links

Contact information

Business verification

Then:

Create your first campaign


---

53. Empty States

Do not leave blank screens.

Examples:

No campaigns:

> “No campaigns match your filters yet.”



Button:

Explore All Campaigns

No applications:

> “You haven't applied to any campaigns yet.”



Button:

Find Opportunities

No campaigns for brand:

> “Your first collaboration starts here.”



Button:

Create Campaign


---

54. Security

The system must protect:

Passwords

User data

Private messages

Campaign information

Uploaded files

Admin access

Verification information.

Users must only be able to access resources they are authorized to access.

Brands must not be able to modify another brand's campaigns.

Creators must not modify other creators' applications.

Admin privileges must be isolated.


---

55. File Uploads

Uploads should support:

Profile photos

Campaign images

Campaign documents

Portfolio images

Portfolio videos/links

Submission files

Chat attachments

Admin media

Uploads should have:

File-size limits

Type validation

Secure storage

Access control

Virus/security considerations


---

56. Analytics

V1 basic analytics:

Campaign views

Applications

Shortlisted creators

Selected creators

Completed collaborations

Creator profile views

Campaign performance.

Later:

Audience demographics

Engagement analytics

ROI

Conversion

Reach

Content performance


---

57. Admin CMS

Admin should be able to manage:

Homepage hero

Featured campaigns

Featured creators

Categories

Niches

FAQs

Terms

Privacy

About

Contact

Help center

Announcements

Banners


---

58. Core Database Concepts

Regardless of technology, the application should logically contain entities such as:

Users

Creator Profiles

Brand Profiles

Social Accounts

Campaigns

Campaign Requirements

Campaign Perks

Campaign Deliverables

Applications

Shortlists

Invitations

Collaborations

Submissions

Messages

Notifications

Reviews

Reports

Verifications

Categories

Niches

Locations

Portfolio Items

Saved Campaigns

Admin Users

Settings

The actual implementation technology can be selected by the development AI.


---

59. Campaign Lifecycle

The lifecycle should be explicit.

DRAFT
  ↓
PENDING_REVIEW
  ↓
APPROVED
  ↓
PUBLISHED
  ↓
APPLICATIONS_OPEN
  ↓
SELECTION
  ↓
COLLABORATION_ACTIVE
  ↓
SUBMISSION_REVIEW
  ↓
COMPLETED

Alternative states:

REJECTED
CANCELLED
EXPIRED
PAUSED


---

60. Application Lifecycle

SUBMITTED
 ↓
UNDER_REVIEW
 ↓
SHORTLISTED
 ↓
SELECTED
 ↓
COLLABORATION
 ↓
COMPLETED

Alternative:

REJECTED
WITHDRAWN
EXPIRED


---

61. Collaboration Lifecycle

INVITED / SELECTED
        ↓
    ACCEPTED
        ↓
      ACTIVE
        ↓
  WORK_SUBMITTED
        ↓
     REVIEWING
      ↙      ↘
APPROVED   REVISION_REQUESTED
               ↓
           RESUBMITTED
               ↓
            APPROVED
               ↓
           COMPLETED


---

62. Anti-Scam Features

Because NepCollab does not handle payments, trust is extremely important.

The system should provide:

Verified brand badges

Verified creator badges

Report buttons

Admin moderation

Campaign moderation

Review history

Profile history

Application history

Suspicious behavior detection

Account restrictions

Blocking

Fraud reporting.


---

63. Brand Reputation

Brands should eventually have:

Rating

Reviews

Completed campaigns

Creator satisfaction

Response rate

Average response time

Verification

Account age

This helps creators decide whether to apply.


---

64. Creator Reputation

Creators can have:

Rating

Completed campaigns

Reviews

Successful collaborations

Response rate

Reliability

Profile verification

Portfolio

Campaign history

This helps brands choose confidently.


---

65. Matching Rules

The system should prioritize campaigns based on:

Creator location

Niche

Platform

Follower range

Engagement

Content type

Campaign requirements

Availability

Previous performance

The matching system should never automatically reject someone unless the campaign explicitly requires a mandatory criterion.


---

66. Important UX Rule

Do not make the creator feel like they're shopping for influencer services.

That was the fundamental problem with the InfluMedia-style model.

NepCollab should make the creator feel like they're browsing:

> Opportunities



not:

> Services.



Similarly, the brand should feel like they're publishing:

> Campaigns



not:

> Buying influencer services.




---

67. Terminology

Use:

Campaign

Opportunity

Creator

Brand

Application

Applicant

Selected

Collaboration

Deliverable

Submission

Perk

Gift

Reward

Avoid:

Service

Service provider

Order

Product listing

Checkout

Cart

Seller

Buyer

unless there is a specific future feature requiring them.


---

68. V1 Must-Have Features

The first production-ready PWA should prioritize:

Authentication

Creator onboarding

Brand onboarding

Creator profiles

Brand profiles

Campaign creation

Campaign publishing

Campaign discovery

Campaign search

Campaign filtering

Campaign details

Applications

Application management

Shortlisting

Creator selection

Invitations

Basic messaging

Collaboration workspace

Deliverables

Submissions

Approval/revision

Campaign completion

Reviews

Notifications

Verification

Admin dashboard

Campaign moderation

User management

Reporting

CMS

Responsive PWA


---

69. V1 Explicitly Excluded

Do not waste development time initially on:

Payment gateways

Wallet

Escrow

Withdrawals

Subscriptions

Commission calculations

Affiliate payment tracking

Complex financial reporting

Native iOS application

Native Android application

Advanced AI matching

Advanced social API analytics

Complex CRM

Enterprise billing


---

70. V2

After the marketplace proves demand:

AI campaign matching

Creator recommendations

Brand recommendations

Social account automatic verification

Instagram/TikTok analytics

Campaign performance analytics

Advanced messaging

Creator media kit generator

Campaign templates

Recurring campaigns

Brand favorites

Creator favorites

Advanced search

Featured campaigns

Featured creators

Premium accounts


---

71. V3

Potential long-term platform:

Automated social analytics

AI campaign creation

AI creator matching

Audience authenticity scoring

Fraud detection

Campaign ROI analytics

Creator CRM

Brand CRM

Automated reporting

Contracts

Optional payment infrastructure

Escrow

Subscriptions

Enterprise accounts


---

72. The One-Sentence Product Definition

The entire application should be understandable from this:

> NepCollab is a creator collaboration marketplace where brands publish campaigns with requirements, perks, gifts and deliverables, and creators discover those opportunities, apply to them, and get selected by brands.




---

73. The Golden Rule

Whenever an AI developer, designer, or engineer is unsure how something should work, use this rule:

> The brand creates the opportunity; the creator pursues the opportunity.



Therefore:

Brand → Post

Creator → Discover

Creator → Apply

Brand → Review

Brand → Select

Creator → Collaborate

Creator → Submit

Brand → Approve

Both → Review

That is the fundamental NepCollab model.


---

Final Build Priority

If the goal is to get the first usable NepCollab PWA online quickly, I would build it in this order:

Phase 1: Authentication + roles + profiles

Phase 2: Brand campaign creation + campaign marketplace

Phase 3: Creator applications + brand applicant management

Phase 4: Selection + invitations + notifications

Phase 5: Collaboration workspace + messaging

Phase 6: Deliverables + submissions + approval

Phase 7: Reviews + reputation

Phase 8: Admin moderation + verification + CMS

Phase 9: PWA polish + performance + mobile UX

Phase 10: Testing, security, deployment and launch

This gives you a genuinely useful campaign-first NepCollab MVP, rather than spending months modifying a fundamentally incompatible influencer-service marketplace.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://creator-trail.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95071958-86b9-40ef-8470-648beea411c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
