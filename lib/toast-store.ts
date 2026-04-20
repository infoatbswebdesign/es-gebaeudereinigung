"use client";

import { create } from "zustand";

export type ToastVariant = "error" | "success" | "info";

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Auto-Dismiss in ms. 0 = kein Auto-Close. */
  duration: number;
  /** Markiert das Item als "im Abgang" – das ToastStack-Item triggert darauf seine Exit-Animation. */
  dismissing: boolean;
};

export type ShowToastOptions = {
  variant?: ToastVariant;
  duration?: number;
};

type ToastStore = {
  toasts: ToastItem[];
  show: (message: string, options?: ShowToastOptions) => string;
  dismiss: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

/** Maximal gleichzeitig sichtbare Toasts. Ältere werden automatisch ausgeblendet. */
export const MAX_TOASTS = 3;

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, options) => {
    const id = generateId();
    const newItem: ToastItem = {
      id,
      message,
      variant: options?.variant ?? "error",
      duration: options?.duration ?? 6000,
      dismissing: false,
    };

    set((state) => {
      const next = [...state.toasts, newItem];

      // Ältere, noch aktive Toasts gezielt markieren, wenn das Limit überschritten wurde.
      const visibleCount = next.reduce(
        (acc, toast) => (toast.dismissing ? acc : acc + 1),
        0,
      );
      let needDismiss = visibleCount - MAX_TOASTS;
      if (needDismiss <= 0) return { toasts: next };

      return {
        toasts: next.map((toast) => {
          if (needDismiss > 0 && !toast.dismissing) {
            needDismiss -= 1;
            return { ...toast, dismissing: true };
          }
          return toast;
        }),
      };
    });

    return id;
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, dismissing: true } : toast,
      ),
    }));
  },
  remove: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clear: () => set({ toasts: [] }),
}));

/**
 * Imperative Helfer fuer Aufrufe ausserhalb von React-Components
 * (z. B. in Event-Handlern oder Utilities).
 */
export const toastApi = {
  show: (message: string, options?: ShowToastOptions) =>
    useToastStore.getState().show(message, options),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
