import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { setLookupData } from "@/lib/lookup";
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  Brand,
  Campaign,
  Collaboration,
  Creator,
  Deliverable,
  DeliverableStatus,
  Platform,
  Role,
  Thread,
} from "@/data/types";

export interface MyProfile {
  id: string;
  role: Role | null;
  displayName: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  website: string;
  onboarded: boolean;
  companyName?: string;
  industry?: string;
  headline?: string;
  category?: string;
  niches?: string[];
  audienceSize?: number;
  engagementRate?: number;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

interface State {
  role: Role | null;
  signedIn: boolean;
  onboarded: boolean;
  profile: MyProfile | null;
  campaigns: Campaign[];
  applications: Application[];
  collaborations: Collaboration[];
  threads: Thread[];
  notifications: AppNotification[];
  saved: string[];
  loading: boolean;
  error: string | null;
}

export interface ProfileInput {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  category?: string;
  niches?: string[];
  audienceSize?: number;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

interface Store extends State {
  currentCreatorId: string;
  currentBrandId: string;
  userId: string;
  refresh: () => Promise<void>;
  requestMagicLink: (email: string, role: Role, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (input?: ProfileInput) => Promise<void>;
  updateProfile: (input: ProfileInput) => Promise<void>;
  toggleSaved: (campaignId: string) => Promise<void>;
  addCampaign: (campaign: Campaign, status?: "draft" | "published") => Promise<string>;
  setCampaignStatus: (
    campaignId: string,
    status: "draft" | "published" | "paused" | "closed" | "completed" | "cancelled",
  ) => Promise<void>;
  applyToCampaign: (input: {
    campaignId: string;
    message: string;
    contentIdea: string;
    availability: string;
    proposedRate?: number;
  }) => Promise<void>;
  withdrawApplication: (id: string) => Promise<void>;
  setApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  setApplicantNote: (id: string, note: string) => Promise<void>;
  submitDeliverable: (
    collaborationId: string,
    deliverableId: string,
    submission: { note: string; link: string },
  ) => Promise<void>;
  reviewDeliverable: (
    collaborationId: string,
    deliverableId: string,
    status: DeliverableStatus,
  ) => Promise<void>;
  startConversation: (campaignId: string, otherUserId: string) => Promise<string>;
  sendMessage: (threadId: string, text: string) => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  uploadFile: (bucket: "avatars" | "portfolio", file: File) => Promise<string>;
}

const initial: State = {
  role: null,
  signedIn: false,
  onboarded: false,
  profile: null,
  campaigns: [],
  applications: [],
  collaborations: [],
  threads: [],
  notifications: [],
  saved: [],
  loading: true,
  error: null,
};

const today = () => new Date().toISOString().slice(0, 10);
const avatarFor = (id: string) =>
  "https://api.dicebear.com/10.x/lorelei/svg?seed=" + encodeURIComponent(id);
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

type Row = Record<string, any>;

const CAMPAIGN_STATUS_UI: Record<string, Campaign["status"]> = {
  draft: "DRAFT",
  published: "APPLICATIONS_OPEN",
  paused: "PAUSED",
  closed: "SELECTION",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const APP_STATUS_UI: Record<string, ApplicationStatus> = {
  applied: "APPLIED",
  shortlisted: "SHORTLISTED",
  accepted: "SELECTED",
  rejected: "REJECTED",
  withdrawn: "WITHDRAWN",
  completed: "EXPIRED",
};

const APP_STATUS_DB: Record<ApplicationStatus, string> = {
  APPLIED: "applied",
  UNDER_REVIEW: "applied",
  SHORTLISTED: "shortlisted",
  SELECTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  EXPIRED: "completed",
};

const COLLAB_STATUS_UI: Record<string, Collaboration["status"]> = {
  active: "ACTIVE",
  work_submitted: "WORK_SUBMITTED",
  revision_requested: "REVISION_REQUESTED",
  completed: "COMPLETED",
  cancelled: "COMPLETED",
};

const DELIVERABLE_STATUS_UI: Record<string, DeliverableStatus> = {
  pending: "PENDING",
  submitted: "SUBMITTED",
  approved: "APPROVED",
  revision_requested: "REVISION_REQUESTED",
};

const DELIVERABLE_STATUS_DB: Record<DeliverableStatus, string> = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REVISION_REQUESTED: "revision_requested",
};

function mapCampaign(r: Row): Campaign {
  const platforms = arr<string>(r.platforms) as Platform[];
  const deliverableTitles = arr<string>(r.deliverables);
  const campaign: Campaign = {
    id: r.id,
    title: r.title,
    brandId: r.brand_id,
    description: r.description ?? "",
    category: r.category ?? "General",
    types: deliverableTitles.length ? deliverableTitles : ["Collaboration"],
    platforms,
    perks: arr<string>(r.perks),
    location: r.location ?? "Remote",
    remote: Boolean(r.remote),
    startDate: r.campaign_start_date ?? today(),
    endDate: r.campaign_end_date ?? r.application_deadline ?? today(),
    deadline: r.application_deadline ?? r.campaign_end_date ?? today(),
    creatorsNeeded: r.creators_needed ?? 1,
    status: CAMPAIGN_STATUS_UI[r.status] ?? "DRAFT",
    cover: r.cover_image || "/app-icon.png",
    requirements: {
      minFollowers: r.min_followers ?? 0,
      niches: r.category ? [r.category] : [],
      languages: [],
      experience: r.requirements ?? "No minimum",
    },
    deliverables: deliverableTitles.map((title, i) => ({
      id: `${r.id}-${i}`,
      title,
      platform: (platforms[0] ?? "Instagram") as Platform,
      contentType: title,
      dueDate: r.campaign_end_date ?? r.application_deadline ?? today(),
      instructions: r.requirements ?? "Follow the campaign brief.",
      status: "PENDING" as const,
    })),
    createdAt: r.created_at?.slice(0, 10) ?? today(),
    views: 0,
  };
  if (r.budget != null) {
    campaign.giftValue = `${r.currency ?? "NPR"} ${Number(r.budget).toLocaleString()}`;
  }
  return campaign;
}

const mapBrand = (p: Row, b: Row | undefined): Brand => ({
  id: p.id,
  name: b?.company_name || p.display_name || "Brand",
  logo: b?.logo_url || p.avatar_url || avatarFor(p.id),
  category: b?.industry || "Brand",
  description: b?.description || p.bio || "",
  location: b?.location || p.location || "Nepal",
  website: b?.website || p.website || "",
  verified: Boolean(b?.verified),
  rating: 0,
  completedCampaigns: 0,
  responseRate: 0,
});

function creatorSocials(c: Row | undefined) {
  if (!c) return [];
  const followers = c.audience_size ?? 0;
  const engagement = Number(c.engagement_rate ?? 0);
  const entries: { platform: Platform; url?: string }[] = [
    { platform: "Instagram", url: c.instagram_url },
    { platform: "TikTok", url: c.tiktok_url },
    { platform: "YouTube", url: c.youtube_url },
    { platform: "Facebook", url: c.facebook_url },
  ];
  return entries
    .filter((e) => Boolean(e.url))
    .map((e) => ({
      platform: e.platform,
      username: String(e.url).replace(/^https?:\/\/(www\.)?/, "").split("/").filter(Boolean).pop() ?? "",
      followers,
      engagement,
      verified: Boolean(c.verified),
    }));
}

const mapCreator = (p: Row, c: Row | undefined, portfolio: Row[], reviews: Row[]): Creator => ({
  id: p.id,
  name: p.display_name || "Creator",
  username: p.username || String(p.id).slice(0, 8),
  avatar: p.avatar_url || avatarFor(p.id),
  bio: p.bio || "",
  location: p.location || "Nepal",
  languages: arr<string>(c?.languages),
  niches: arr<string>(c?.niches),
  socials: creatorSocials(c),
  portfolio: portfolio.map((item) => ({
    id: item.id,
    title: item.title,
    brand: "",
    platform: "Instagram" as Platform,
    image: item.thumbnail_url || item.media_url || "/app-icon.png",
    category: c?.category ?? "",
    date: item.created_at?.slice(0, 10) ?? today(),
  })),
  reviews: reviews.map((r) => ({
    id: r.id,
    author: r.author ?? "Brand",
    authorAvatar: avatarFor(r.reviewer_id),
    rating: r.rating,
    text: r.comment ?? "",
    date: r.created_at?.slice(0, 10) ?? today(),
  })),
  rating: reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0,
  completedCollaborations: 0,
  verified: Boolean(c?.verified),
  available: c?.available !== false,
  preferredTypes: arr<string>(c?.skills),
});

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [userId, setUserId] = useState("");
  const loadingRef = useRef(false);

  const load = useCallback(async (forcedId?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = forcedId ?? sessionData.session?.user?.id ?? "";
      if (!uid) {
        setUserId("");
        setState({ ...initial, loading: false });
        return;
      }
      setUserId(uid);

      const [
        meRes,
        campaignsRes,
        appsRes,
        collabsRes,
        savedRes,
        notificationsRes,
        conversationsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("campaigns").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("applications").select("*").order("applied_at", { ascending: false }).limit(300),
        supabase.from("collaborations").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("saved_campaigns").select("campaign_id").eq("creator_id", uid),
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("conversations")
          .select("*")
          .or(`brand_id.eq.${uid},creator_id.eq.${uid}`)
          .order("last_message_at", { ascending: false })
          .limit(50),
      ]);

      const firstError = [meRes, campaignsRes, appsRes, collabsRes, savedRes, notificationsRes, conversationsRes]
        .map((r) => (r as { error: { message: string } | null }).error)
        .find(Boolean);
      if (firstError) throw new Error(firstError.message);

      const me = meRes.data as Row | null;
      const campaignRows = (campaignsRes.data ?? []) as Row[];
      const appRows = (appsRes.data ?? []) as Row[];
      const collabRows = (collabsRes.data ?? []) as Row[];
      const conversationRows = (conversationsRes.data ?? []) as Row[];

      const collabIds = collabRows.map((c) => c.id);
      const conversationIds = conversationRows.map((c) => c.id);

      const [deliverableRes, messagesRes] = await Promise.all([
        collabIds.length
          ? supabase
              .from("collaboration_deliverables")
              .select("*")
              .in("collaboration_id", collabIds)
              .order("sort_order", { ascending: true })
          : Promise.resolve({ data: [] as Row[], error: null }),
        conversationIds.length
          ? supabase
              .from("messages")
              .select("*")
              .in("conversation_id", conversationIds)
              .order("created_at", { ascending: true })
              .limit(1000)
          : Promise.resolve({ data: [] as Row[], error: null }),
      ]);

      const deliverableRows = (deliverableRes.data ?? []) as Row[];
      const messageRows = (messagesRes.data ?? []) as Row[];

      const applications: Application[] = appRows.map((a) => {
        const application: Application = {
          id: a.id,
          campaignId: a.campaign_id,
          creatorId: a.creator_id,
          status: APP_STATUS_UI[a.status] ?? "APPLIED",
          message: a.message ?? "",
          contentIdea: a.content_idea ?? "",
          availability: a.availability ?? "",
          appliedAt: a.applied_at?.slice(0, 10) ?? today(),
        };
        if (a.brand_note) application.note = a.brand_note;
        return application;
      });

      const collaborations: Collaboration[] = collabRows.map((c) => {
        const mine = deliverableRows.filter((d) => d.collaboration_id === c.id);
        const deliverables: Deliverable[] = mine.map((d) => {
          const deliverable: Deliverable = {
            id: d.id,
            title: d.title,
            platform: "Instagram",
            contentType: d.title,
            dueDate: c.end_date ?? today(),
            instructions: "Deliver as agreed in the campaign brief.",
            status: DELIVERABLE_STATUS_UI[d.status] ?? "PENDING",
          };
          if (d.submitted_at) {
            deliverable.submission = {
              note: d.submission_note ?? "",
              link: d.submission_link ?? "",
              submittedAt: d.submitted_at,
            };
          }
          return deliverable;
        });
        return {
          id: c.id,
          campaignId: c.campaign_id,
          creatorId: c.creator_id,
          status: COLLAB_STATUS_UI[c.status] ?? "ACTIVE",
          startedAt: c.created_at?.slice(0, 10) ?? today(),
          deliverables,
          timeline: [
            {
              id: "created-" + c.id,
              label: "Collaboration started",
              date: c.created_at?.slice(0, 10) ?? today(),
            },
          ],
        };
      });

      const threads: Thread[] = conversationRows.map((c) => ({
        id: c.id,
        campaignId: c.campaign_id ?? "",
        creatorId: c.creator_id,
        messages: messageRows
          .filter((m) => m.conversation_id === c.id)
          .map((m) => ({
            id: m.id,
            threadId: c.id,
            from: (m.sender_id === c.brand_id ? "brand" : "creator") as "brand" | "creator",
            text: m.body,
            at: m.created_at,
          })),
      }));

      const role: Role | null = me?.role === "brand" ? "brand" : me?.role === "creator" ? "creator" : null;

      const notifications: AppNotification[] = ((notificationsRes.data ?? []) as Row[]).map((n) => ({
        id: n.id,
        audience: role ?? "creator",
        title: n.title,
        body: n.body ?? "",
        at: n.created_at?.slice(0, 10) ?? today(),
        read: Boolean(n.read),
      }));

      // Lookup data: everyone referenced on screen, plus the signed-in user.
      const ids = [
        ...new Set<string>(
          [
            uid,
            ...campaignRows.map((r) => r.brand_id),
            ...appRows.map((r) => r.creator_id),
            ...collabRows.map((r) => r.creator_id),
            ...collabRows.map((r) => r.brand_id),
            ...conversationRows.map((r) => r.brand_id),
            ...conversationRows.map((r) => r.creator_id),
          ].filter(Boolean),
        ),
      ];

      const [profilesRes, brandRes, creatorRes, portfolioRes, reviewsRes] = await Promise.all([
        supabase.from("profiles").select("*").in("id", ids),
        supabase.from("brand_profiles").select("*").in("profile_id", ids),
        supabase.from("creator_profiles").select("*").in("profile_id", ids),
        supabase.from("portfolio_items").select("*").in("creator_id", ids).order("sort_order"),
        supabase.from("reviews").select("*").in("reviewee_id", ids),
      ]);

      const profileRows = (profilesRes.data ?? []) as Row[];
      const brandRows = (brandRes.data ?? []) as Row[];
      const creatorRows = (creatorRes.data ?? []) as Row[];
      const portfolioRows = (portfolioRes.data ?? []) as Row[];
      const reviewRows = (reviewsRes.data ?? []) as Row[];

      const bm = new Map(brandRows.map((b) => [b.profile_id as string, b]));
      const cm = new Map(creatorRows.map((c) => [c.profile_id as string, c]));

      setLookupData(
        profileRows.filter((p) => p.role === "brand" || bm.has(p.id)).map((p) => mapBrand(p, bm.get(p.id))),
        profileRows
          .filter((p) => p.role !== "brand")
          .map((p) =>
            mapCreator(
              p,
              cm.get(p.id),
              portfolioRows.filter((i) => i.creator_id === p.id),
              reviewRows.filter((r) => r.reviewee_id === p.id),
            ),
          ),
      );

      const myBrand = bm.get(uid);
      const myCreator = cm.get(uid);

      const profile: MyProfile = {
        id: uid,
        role,
        displayName: me?.display_name ?? "",
        username: me?.username ?? "",
        avatarUrl: me?.avatar_url ?? "",
        coverUrl: me?.cover_url ?? "",
        bio: me?.bio ?? "",
        location: me?.location ?? "",
        website: me?.website ?? "",
        onboarded: Boolean(me?.onboarded),
        companyName: myBrand?.company_name ?? "",
        industry: myBrand?.industry ?? "",
        headline: myCreator?.headline ?? "",
        category: myCreator?.category ?? "",
        niches: arr<string>(myCreator?.niches),
        audienceSize: myCreator?.audience_size ?? 0,
        engagementRate: Number(myCreator?.engagement_rate ?? 0),
        instagramUrl: myCreator?.instagram_url ?? "",
        tiktokUrl: myCreator?.tiktok_url ?? "",
        youtubeUrl: myCreator?.youtube_url ?? "",
      };

      setState({
        role,
        signedIn: true,
        onboarded: Boolean(me?.onboarded),
        profile,
        campaigns: campaignRows.map(mapCampaign),
        applications,
        collaborations,
        threads,
        notifications,
        saved: ((savedRes.data ?? []) as Row[]).map((s) => s.campaign_id),
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("[NepCollab] failed to load data", error);
      setState((s) => ({
        ...s,
        loading: false,
        error: error instanceof Error ? error.message : "Could not load your data.",
      }));
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void load();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUserId("");
        setState({ ...initial, loading: false });
      } else if (
        (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "INITIAL_SESSION") &&
        session?.user?.id
      ) {
        void load(session.user.id);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  // Realtime: only the rows this user can actually see.
  useEffect(() => {
    if (!userId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void load(userId), 400);
    };
    const channel = supabase
      .channel("nepcollab:" + userId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: "user_id=eq." + userId },
        schedule,
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, schedule)
      .subscribe();
    return () => {
      if (timer) clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [userId, load]);

  const value = useMemo<Store>(() => {
    const refresh = async () => {
      await load(userId || undefined);
    };
    const requireUser = () => {
      if (!userId) throw new Error("Please sign in to continue.");
      return userId;
    };

    return {
      ...state,
      userId,
      currentCreatorId: userId,
      currentBrandId: userId,
      refresh,
      requestMagicLink: async (email, role, name) => {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { role, display_name: name, full_name: name },
          },
        });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUserId("");
        setState({ ...initial, loading: false });
      },
      completeOnboarding: async (input) => {
        const uid = requireUser();
        const { error } = await supabase
          .from("profiles")
          .update({
            display_name: input?.name || state.profile?.displayName || "NepCollab user",
            username: input?.username?.replace(/^@/, "") || null,
            bio: input?.bio || null,
            location: input?.location || null,
            website: input?.website || null,
            onboarded: true,
          })
          .eq("id", uid);
        if (error) throw error;

        if (state.role === "brand") {
          const { error: e } = await supabase.from("brand_profiles").upsert(
            {
              profile_id: uid,
              company_name: input?.name || "My brand",
              website: input?.website || null,
              location: input?.location || null,
            },
            { onConflict: "profile_id" },
          );
          if (e) throw e;
        } else {
          const { error: e } = await supabase
            .from("creator_profiles")
            .upsert({ profile_id: uid }, { onConflict: "profile_id" });
          if (e) throw e;
        }
        await refresh();
      },
      updateProfile: async (input) => {
        const uid = requireUser();
        const patch: Row = {};
        if (input.name !== undefined) patch.display_name = input.name;
        if (input.username !== undefined) patch.username = input.username.replace(/^@/, "") || null;
        if (input.bio !== undefined) patch.bio = input.bio || null;
        if (input.location !== undefined) patch.location = input.location || null;
        if (input.website !== undefined) patch.website = input.website || null;
        if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl || null;
        if (Object.keys(patch).length) {
          const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
          if (error) throw error;
        }

        if (state.role === "brand") {
          const { error } = await supabase.from("brand_profiles").upsert(
            {
              profile_id: uid,
              company_name: input.name || state.profile?.displayName || "My brand",
              description: input.bio ?? null,
              industry: input.category ?? null,
              website: input.website ?? null,
              location: input.location ?? null,
              logo_url: input.avatarUrl ?? null,
            },
            { onConflict: "profile_id" },
          );
          if (error) throw error;
        } else {
          const { error } = await supabase.from("creator_profiles").upsert(
            {
              profile_id: uid,
              category: input.category ?? null,
              niches: input.niches ?? [],
              audience_size: Math.max(0, Math.round(input.audienceSize ?? 0)),
              instagram_url: input.instagramUrl || null,
              tiktok_url: input.tiktokUrl || null,
              youtube_url: input.youtubeUrl || null,
            },
            { onConflict: "profile_id" },
          );
          if (error) throw error;
        }
        await refresh();
      },
      toggleSaved: async (campaignId) => {
        const uid = requireUser();
        if (state.saved.includes(campaignId)) {
          const { error } = await supabase
            .from("saved_campaigns")
            .delete()
            .eq("creator_id", uid)
            .eq("campaign_id", campaignId);
          if (error) throw error;
          setState((s) => ({ ...s, saved: s.saved.filter((id) => id !== campaignId) }));
        } else {
          const { error } = await supabase
            .from("saved_campaigns")
            .upsert({ creator_id: uid, campaign_id: campaignId }, { onConflict: "creator_id,campaign_id" });
          if (error) throw error;
          setState((s) => ({ ...s, saved: [...s.saved, campaignId] }));
        }
      },
      addCampaign: async (campaign, status = "published") => {
        const uid = requireUser();
        const { data, error } = await supabase
          .from("campaigns")
          .insert({
            brand_id: uid,
            title: campaign.title,
            description: campaign.description,
            category: campaign.category,
            location: campaign.location,
            remote: campaign.remote,
            perks: campaign.perks,
            platforms: campaign.platforms,
            deliverables: campaign.deliverables.map((d) => d.title),
            requirements: campaign.requirements?.experience ?? null,
            min_followers: campaign.requirements?.minFollowers ?? 0,
            creators_needed: campaign.creatorsNeeded,
            application_deadline: campaign.deadline || null,
            campaign_start_date: campaign.startDate || null,
            campaign_end_date: campaign.endDate || null,
            status,
            cover_image: campaign.cover || null,
          })
          .select("id")
          .single();
        if (error) throw error;
        await refresh();
        return (data as Row).id as string;
      },
      setCampaignStatus: async (campaignId, status) => {
        const uid = requireUser();
        const { error } = await supabase
          .from("campaigns")
          .update({ status })
          .eq("id", campaignId)
          .eq("brand_id", uid);
        if (error) throw error;
        await refresh();
      },
      applyToCampaign: async ({ campaignId, message, contentIdea, availability, proposedRate }) => {
        const uid = requireUser();
        const { error } = await supabase.from("applications").insert({
          campaign_id: campaignId,
          creator_id: uid,
          message,
          content_idea: contentIdea || null,
          availability: availability || null,
          proposed_rate: proposedRate ?? null,
          status: "applied",
        });
        if (error) {
          if (error.code === "23505") throw new Error("You already applied to this campaign.");
          throw error;
        }
        await refresh();
      },
      withdrawApplication: async (id) => {
        const uid = requireUser();
        const { error } = await supabase
          .from("applications")
          .update({ status: "withdrawn" })
          .eq("id", id)
          .eq("creator_id", uid);
        if (error) throw error;
        await refresh();
      },
      setApplicationStatus: async (id, status) => {
        requireUser();
        if (status === "SELECTED") {
          const { error } = await supabase.rpc("accept_application", { _application_id: id });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("applications")
            .update({ status: APP_STATUS_DB[status] })
            .eq("id", id);
          if (error) throw error;
        }
        await refresh();
      },
      setApplicantNote: async (id, note) => {
        requireUser();
        const { error } = await supabase.from("applications").update({ brand_note: note }).eq("id", id);
        if (error) throw error;
        await refresh();
      },
      submitDeliverable: async (collaborationId, deliverableId, submission) => {
        requireUser();
        const { error } = await supabase
          .from("collaboration_deliverables")
          .update({
            status: "submitted",
            submission_note: submission.note || null,
            submission_link: submission.link || null,
            submitted_at: new Date().toISOString(),
          })
          .eq("id", deliverableId)
          .eq("collaboration_id", collaborationId);
        if (error) throw error;
        const { error: collabError } = await supabase
          .from("collaborations")
          .update({ status: "work_submitted" })
          .eq("id", collaborationId);
        if (collabError) throw collabError;
        await refresh();
      },
      reviewDeliverable: async (collaborationId, deliverableId, status) => {
        requireUser();
        const { error } = await supabase
          .from("collaboration_deliverables")
          .update({
            status: DELIVERABLE_STATUS_DB[status],
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", deliverableId)
          .eq("collaboration_id", collaborationId);
        if (error) throw error;

        const { data: remaining, error: readError } = await supabase
          .from("collaboration_deliverables")
          .select("status")
          .eq("collaboration_id", collaborationId);
        if (readError) throw readError;
        const rows = (remaining ?? []) as Row[];
        const allApproved = rows.length > 0 && rows.every((d) => d.status === "approved");
        const { error: collabError } = await supabase
          .from("collaborations")
          .update({
            status: allApproved
              ? "completed"
              : status === "REVISION_REQUESTED"
                ? "revision_requested"
                : "active",
          })
          .eq("id", collaborationId);
        if (collabError) throw collabError;
        await refresh();
      },
      startConversation: async (campaignId, otherUserId) => {
        const uid = requireUser();
        const isBrand = state.role === "brand";
        const payload = {
          campaign_id: campaignId || null,
          brand_id: isBrand ? uid : otherUserId,
          creator_id: isBrand ? otherUserId : uid,
        };
        const { data, error } = await supabase
          .from("conversations")
          .upsert(payload, { onConflict: "campaign_id,brand_id,creator_id" })
          .select("id")
          .single();
        if (error) throw error;
        await refresh();
        return (data as Row).id as string;
      },
      sendMessage: async (threadId, text) => {
        const uid = requireUser();
        const body = text.trim();
        if (!body) return;
        const thread = state.threads.find((t) => t.id === threadId);
        if (!thread) throw new Error("Conversation not found.");
        const { data: conv, error: convError } = await supabase
          .from("conversations")
          .select("brand_id,creator_id")
          .eq("id", threadId)
          .single();
        if (convError) throw convError;
        const row = conv as Row;
        const recipient = row.brand_id === uid ? row.creator_id : row.brand_id;
        const { error } = await supabase.from("messages").insert({
          conversation_id: threadId,
          sender_id: uid,
          recipient_id: recipient,
          body,
        });
        if (error) throw error;
        await refresh();
      },
      markNotificationsRead: async () => {
        const uid = requireUser();
        if (!state.notifications.some((n) => !n.read)) return;
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", uid)
          .eq("read", false);
        if (error) throw error;
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      },
      uploadFile: async (bucket, file) => {
        const uid = requireUser();
        if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
        if (file.size > 5 * 1024 * 1024) throw new Error("Images must be smaller than 5MB.");
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${uid}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
        if (error) throw error;
        const { data, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        if (signError || !data?.signedUrl) throw signError ?? new Error("Could not read the uploaded file.");
        return data.signedUrl;
      },
    };
  }, [state, userId, load]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}
