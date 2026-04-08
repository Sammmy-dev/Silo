"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = Record<string, unknown> | null;

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set(initialState);
      },
    }),
    {
      name: "silo-auth",
    },
  ),
);