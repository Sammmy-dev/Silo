"use client";

import axios, { type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/store/auth.store";

const STORAGE_KEY = "silo-auth";

const getPersistedToken = (): string | null => {
  const persistedStore = window.localStorage.getItem(STORAGE_KEY);

  if (!persistedStore) {
    return null;
  }

  try {
    const parsedStore = JSON.parse(persistedStore) as {
      state?: {
        token?: string | null;
      };
    };

    return parsedStore.state?.token ?? null;
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token ?? getPersistedToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default api;