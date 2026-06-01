// Admin store - persists in memory (use DB for production)
export interface Signal {
  id: string;
  saham: string;
  kode: string;
  action: "BUY" | "SELL" | "HOLD" | "ANTRI";
  entry: string;
  tp: string;
  sl: string;
  notes: string;
  createdAt: string;
  package: string[];
}

export interface UserToken {
  id: string;
  email: string;
  name: string;
  package: string;
  token: string;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  package: string;
  rating: number;
  text: string;
  date: string;
  isApproved: boolean;
}

export interface LiveInfo {
  id: string;
  message: string;
  isActive: boolean;
  updatedAt: string;
}

export const ADMIN_CREDS = {
  username: "admin",
  password: "ritel2025",
};

// Global in-memory stores
export const store = {
  signals: [] as Signal[],
  tokens: [
    {
      id: "demo1",
      email: "demo@ritelcommunity.id",
      name: "Demo User",
      package: "gold",
      token: "RC-GOLD-DEMO1234",
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ] as UserToken[],
  testimonials: [] as Testimonial[],
  liveInfo: {
    id: "1",
    message: "",
    isActive: false,
    updatedAt: new Date().toISOString(),
  } as LiveInfo,
};
