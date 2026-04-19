/**
 * Page-context resolver for Otto.
 * Returns proactive opener configuration per route.
 */
export type OttoPageKey =
  | "home"
  | "listing-detail"
  | "sell"
  | "find-broker"
  | "auctions"
  | "cash-deals"
  | "default";

export interface OttoOpenerConfig {
  delayMs: number;
  message: string;
  quickReplies: string[];
}

const STATIC_OPENERS: Record<Exclude<OttoPageKey, "listing-detail">, OttoOpenerConfig> = {
  home: {
    delayMs: 8000,
    message:
      "Hey! 👋 I'm Otto, your AutoWurx assistant. Looking for a specific vehicle, or just browsing? I can find you deals in seconds.",
    quickReplies: ["Find me a car", "Show cash deals", "What's AutoWurx?", "Browse events"],
  },
  sell: {
    delayMs: 6000,
    message:
      "Ready to sell? I can help you price it right and get your listing in front of the right buyers. What are you selling?",
    quickReplies: ["Help me price my car", "What info do I need?", "How fast can I sell?"],
  },
  "find-broker": {
    delayMs: 5000,
    message:
      "Looking for a broker? Tell me what you're shopping for and I'll match you with the best broker for your specific needs in your area.",
    quickReplies: ["I need a cash deal", "Shopping for a truck", "First-time buyer", "I need something ASAP"],
  },
  auctions: {
    delayMs: 8000,
    message:
      "Eyeing any of these auctions? I can give you a quick market value check on any vehicle before you bid. Just tell me which one.",
    quickReplies: ["Check market value", "How does bidding work?", "Find no-reserve auctions"],
  },
  "cash-deals": {
    delayMs: 6000,
    message:
      "Cash deals move fast. Tell me your budget and what you're looking for — I'll pull the best current matches for you.",
    quickReplies: ["Under $10K", "Under $15K", "Trucks only", "Show best deal scores"],
  },
  default: {
    delayMs: 12000,
    message: "Need a hand finding something? I know every listing on AutoWurx — just ask.",
    quickReplies: ["Find me a vehicle", "Connect with a broker", "Show cash deals"],
  },
};

export function resolvePageKey(pathname: string): OttoPageKey {
  if (pathname === "/") return "home";
  if (pathname === "/sell") return "sell";
  if (pathname === "/find-my-broker") return "find-broker";
  if (pathname === "/auctions") return "auctions";
  if (pathname === "/cash-deals") return "cash-deals";
  if (
    /^\/cars-for-sale\/[^/]+$/.test(pathname) ||
    /^\/rentals\/[^/]+$/.test(pathname) ||
    /^\/experts\/[^/]+$/.test(pathname)
  ) {
    return "listing-detail";
  }
  return "default";
}

export function getOpenerConfig(
  key: OttoPageKey,
  listingTitle?: string,
): OttoOpenerConfig {
  if (key === "listing-detail") {
    const title = listingTitle ?? "this listing";
    return {
      delayMs: 10000,
      message: `I see you're checking out the ${title}. Want me to run a quick report, find similar listings, or connect you with a broker who knows this area?`,
      quickReplies: [
        "Run Auto Report",
        "Find similar listings",
        "Connect with a broker",
        "What's the market price?",
      ],
    };
  }
  return STATIC_OPENERS[key];
}

/** Routes where Otto should NOT mount at all */
export function shouldHideOtto(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname === "/auth" ||
    pathname === "/login" ||
    pathname === "/signup"
  );
}

const DISMISS_KEY = "otto_dismissed_at";
const DISMISS_COOLDOWN_MS = 10 * 60 * 1000;

export function recordDismissal() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function isDismissedRecently(): boolean {
  try {
    const ts = Number(localStorage.getItem(DISMISS_KEY) ?? "0");
    return Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

const VOICE_KEY = "otto_voice_enabled";

export function getVoiceEnabled(): boolean {
  try {
    return localStorage.getItem(VOICE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setVoiceEnabled(enabled: boolean) {
  try {
    localStorage.setItem(VOICE_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}

const SESSION_KEY = "otto_session_id";

export function getOrCreateSessionId(): string {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `otto-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `otto-${Date.now()}`;
  }
}
