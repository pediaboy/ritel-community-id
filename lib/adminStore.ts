// Simple in-memory store for admin data (in production use a real DB)
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

// Default admin credentials
export const ADMIN_CREDS = {
  username: "admin",
  password: "ritel2025",
};
