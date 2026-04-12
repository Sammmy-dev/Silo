"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const AUTH_STORAGE_KEY = "silo-auth";
export const AUTH_COOKIE_NAME = "silo_access_token";

export type AuthUser = {
  id: string;
  email: string;
  organizationId: string | null;
  role: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
} | null;

type AuthState = {
  user: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const syncAuthCookie = (token: string | null) => {
  if (typeof document === "undefined") {
    return;
  }

  if (!token) {
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (user, token) => {
        syncAuthCookie(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        syncAuthCookie(null);
        set(initialState);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
    },
  ),
);