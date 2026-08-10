import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as seed from "@/data/mock";
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  Campaign,
  Collaboration,
  DeliverableStatus,
  Invitation,
  Role,
  Thread,
} from "@/data/types";

const STORAGE_KEY = "nepcollab:state:v1";

interface PersistedState {
  role: Role | null;
  signedIn: boolean;
  onboarded: boolean;
  campaigns: Campaign[];
  applications: Application[];
  collaborations: Collaboration[];
  threads: Thread[];
  invitations: Invitation[];
  notifications: AppNotification[];
  saved: string[];
}

const initialState: PersistedState = {
  role: null,
  signedIn: false,
  onboarded: false,
  campaigns: seed.campaigns,
  applications: seed.applications,
  collaborations: seed.collaborations,
  threads: seed.threads,
  invitations: [],
  notifications: seed.notifications,
  saved: [],
};

interface Store extends PersistedState {
  currentCreatorId: string;
  currentBrandId: string;
  setRole: (role: Role) => void;
  signIn: (role?: Role) => void;
  signOut: () => void;
  completeOnboarding: () => void;
  toggleSaved: (campaignId: string) => void;
  addCampaign: (campaign: Campaign) => void;
  applyToCampaign: (input: {
    campaignId: string;
    message: string;
    contentIdea: string;
    availability: string;
  }) => void;
  withdrawApplication: (id: string) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  setApplicantNote: (id: string, note: string) => void;
  inviteCreator: (campaignId: string, creatorId: string) => void;
  submitDeliverable: (
    collaborationId: string,
    deliverableId: string,
    submission: { note: string; link: string },
  ) => void;
  reviewDeliverable: (
    collaborationId: string,
    deliverableId: string,
    status: DeliverableStatus,
  ) => void;
  sendMessage: (threadId: string, text: string) => void;
  markNotificationsRead: () => void;
}

const StoreContext = createContext<Store | null>(null);

const today = () => new Date().toISOString().slice(0, 10);
const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const patch = useCallback(
    (fn: (prev: PersistedState) => PersistedState) => setState(fn),
    [],
  );

  const notify = (
    prev: PersistedState,
    audience: Role,
    title: string,
    body: string,
  ): AppNotification[] => [
    { id: uid("n"), audience, title, body, at: today(), read: false },
    ...prev.notifications,
  ];

  const value = useMemo<Store>(
    () => ({
      ...state,
      currentCreatorId: seed.currentCreatorId,
      currentBrandId: seed.currentBrandId,
      setRole: (role) => patch((p) => ({ ...p, role })),
      signIn: (role) =>
        patch((p) => ({ ...p, signedIn: true, role: role ?? p.role })),
      signOut: () =>
        patch((p) => ({ ...p, signedIn: false, role: null, onboarded: false })),
      completeOnboarding: () => patch((p) => ({ ...p, onboarded: true })),
      toggleSaved: (campaignId) =>
        patch((p) => ({
          ...p,
          saved: p.saved.includes(campaignId)
            ? p.saved.filter((id) => id !== campaignId)
            : [...p.saved, campaignId],
        })),
      addCampaign: (campaign) =>
        patch((p) => ({
          ...p,
          campaigns: [campaign, ...p.campaigns],
          notifications: notify(
            p,
            "creator",
            "New campaign published",
            `${campaign.title} is now open for applications.`,
          ),
        })),
      applyToCampaign: ({ campaignId, message, contentIdea, availability }) =>
        patch((p) => ({
          ...p,
          applications: [
            {
              id: uid("a"),
              campaignId,
              creatorId: seed.currentCreatorId,
              status: "APPLIED",
              message,
              contentIdea,
              availability,
              appliedAt: today(),
            },
            ...p.applications,
          ],
          notifications: notify(
            p,
            "brand",
            "New application",
            "A creator applied to your campaign.",
          ),
        })),
      withdrawApplication: (id) =>
        patch((p) => ({
          ...p,
          applications: p.applications.map((a) =>
            a.id === id ? { ...a, status: "WITHDRAWN" } : a,
          ),
        })),
      setApplicationStatus: (id, status) =>
        patch((p) => {
          const application = p.applications.find((a) => a.id === id);
          const applications = p.applications.map((a) =>
            a.id === id ? { ...a, status } : a,
          );
          let collaborations = p.collaborations;
          let threads = p.threads;
          if (status === "SELECTED" && application) {
            const campaign = p.campaigns.find(
              (c) => c.id === application.campaignId,
            );
            const collabId = uid("co");
            collaborations = [
              {
                id: collabId,
                campaignId: application.campaignId,
                creatorId: application.creatorId,
                status: "ACCEPTED",
                startedAt: today(),
                deliverables: (campaign?.deliverables ?? []).map((d) => ({
                  ...d,
                  id: uid("cd"),
                  status: "PENDING" as DeliverableStatus,
                })),
                timeline: [
                  { id: uid("t"), label: "Application submitted", date: application.appliedAt },
                  { id: uid("t"), label: "Selected by brand", date: today() },
                ],
              },
              ...p.collaborations,
            ];
            threads = [
              {
                id: uid("th"),
                campaignId: application.campaignId,
                creatorId: application.creatorId,
                messages: [
                  {
                    id: uid("m"),
                    threadId: "new",
                    from: "system",
                    text: "Collaboration started. You can now message each other.",
                    at: today(),
                  },
                ],
              },
              ...p.threads,
            ];
          }
          return {
            ...p,
            applications,
            collaborations,
            threads,
            notifications: notify(
              p,
              "creator",
              status === "SELECTED"
                ? "You were selected"
                : status === "SHORTLISTED"
                  ? "You were shortlisted"
                  : "Application update",
              `Your application status is now ${status.toLowerCase().replace("_", " ")}.`,
            ),
          };
        }),
      setApplicantNote: (id, note) =>
        patch((p) => ({
          ...p,
          applications: p.applications.map((a) =>
            a.id === id ? { ...a, note } : a,
          ),
        })),
      inviteCreator: (campaignId, creatorId) =>
        patch((p) => ({
          ...p,
          invitations: [
            { id: uid("i"), campaignId, creatorId, status: "SENT", sentAt: today() },
            ...p.invitations,
          ],
          notifications: notify(
            p,
            "creator",
            "Invitation received",
            "A brand invited you to a campaign.",
          ),
        })),
      submitDeliverable: (collaborationId, deliverableId, submission) =>
        patch((p) => ({
          ...p,
          collaborations: p.collaborations.map((c) =>
            c.id !== collaborationId
              ? c
              : {
                  ...c,
                  status: "WORK_SUBMITTED",
                  deliverables: c.deliverables.map((d) =>
                    d.id === deliverableId
                      ? {
                          ...d,
                          status: "SUBMITTED" as DeliverableStatus,
                          submission: { ...submission, submittedAt: today() },
                        }
                      : d,
                  ),
                  timeline: [
                    ...c.timeline,
                    { id: uid("t"), label: "Work submitted", date: today() },
                  ],
                },
          ),
          notifications: notify(
            p,
            "brand",
            "Work submitted",
            "A creator submitted a deliverable for review.",
          ),
        })),
      reviewDeliverable: (collaborationId, deliverableId, status) =>
        patch((p) => ({
          ...p,
          collaborations: p.collaborations.map((c) => {
            if (c.id !== collaborationId) return c;
            const deliverables = c.deliverables.map((d) =>
              d.id === deliverableId ? { ...d, status } : d,
            );
            const allApproved = deliverables.every(
              (d) => d.status === "APPROVED",
            );
            return {
              ...c,
              deliverables,
              status: allApproved
                ? "COMPLETED"
                : status === "REVISION_REQUESTED"
                  ? "REVISION_REQUESTED"
                  : "REVIEWING",
              timeline: [
                ...c.timeline,
                {
                  id: uid("t"),
                  label:
                    status === "APPROVED"
                      ? "Deliverable approved"
                      : "Revision requested",
                  date: today(),
                },
              ],
            };
          }),
          notifications: notify(
            p,
            "creator",
            status === "APPROVED" ? "Submission approved" : "Revision requested",
            "Your brand reviewed your submission.",
          ),
        })),
      sendMessage: (threadId, text) =>
        patch((p) => ({
          ...p,
          threads: p.threads.map((t) =>
            t.id !== threadId
              ? t
              : {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      id: uid("m"),
                      threadId,
                      from: p.role === "brand" ? "brand" : "creator",
                      text,
                      at: today(),
                    },
                  ],
                },
          ),
        })),
      markNotificationsRead: () =>
        patch((p) => ({
          ...p,
          notifications: p.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    [state, patch],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}
