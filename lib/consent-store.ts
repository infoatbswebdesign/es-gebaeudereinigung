"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ConsentCategory = "necessary" | "externalMedia";

export type ConsentMeta = {
  version: string;
  timestamp: number | null;
  externalMedia: boolean;
};

export type ConsentState = {
  /** Immer true – nicht verhandelbar (technisch notwendige Speicherung). */
  necessary: true;
  /** Google Maps – optionale Kategorie, Default false. */
  externalMedia: boolean;
  /** Aktuelle Consent-Version, mit der die Entscheidung gespeichert wurde. */
  version: string;
  /** Unix-ms der letzten Entscheidung. */
  timestamp: number | null;
  /** True, sobald der Nutzer eine bewusste Entscheidung getroffen hat. */
  hasDecided: boolean;
  /** UI-State: Modal sichtbar? Wird NICHT persistiert. */
  isModalOpen: boolean;
};

export type ConsentActions = {
  acceptAll: () => void;
  rejectAll: () => void;
  saveSelection: (selection: { externalMedia: boolean }) => void;
  reset: () => void;
  openModal: () => void;
  closeModal: () => void;
};

/**
 * Bei Aenderung der Consent-relevanten Dienste, Texte oder Drittlandgrundlagen
 * MUSS diese Version erhoeht werden. Folge: alle bestehenden Nutzer bekommen
 * das Modal beim naechsten Besuch erneut zu sehen.
 */
export const CURRENT_CONSENT_VERSION = "1.0.0";

export const CONSENT_STORAGE_KEY = "es-gebaeudeservice-consent";

type ConsentStore = ConsentState & ConsentActions;

/**
 * Auf dem Server (SSR) gibt es kein window. Damit das Persist-Middleware
 * waehrend des Server-Renderings keinen Fehler wirft, geben wir dort einen
 * No-Op-Storage zurueck. Erst im Browser wird auf localStorage zurueckgegriffen.
 */
const createSafeStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      necessary: true,
      externalMedia: false,
      version: CURRENT_CONSENT_VERSION,
      timestamp: null,
      hasDecided: false,
      isModalOpen: false,

      acceptAll: () =>
        set({
          necessary: true,
          externalMedia: true,
          version: CURRENT_CONSENT_VERSION,
          timestamp: Date.now(),
          hasDecided: true,
          isModalOpen: false,
        }),

      rejectAll: () =>
        set({
          necessary: true,
          externalMedia: false,
          version: CURRENT_CONSENT_VERSION,
          timestamp: Date.now(),
          hasDecided: true,
          isModalOpen: false,
        }),

      saveSelection: (selection) =>
        set({
          necessary: true,
          externalMedia: selection.externalMedia,
          version: CURRENT_CONSENT_VERSION,
          timestamp: Date.now(),
          hasDecided: true,
          isModalOpen: false,
        }),

      reset: () =>
        set({
          necessary: true,
          externalMedia: false,
          version: CURRENT_CONSENT_VERSION,
          timestamp: null,
          hasDecided: false,
          isModalOpen: true,
        }),

      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    {
      name: CONSENT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => createSafeStorage() as Storage),
      // Nur persistente Felder serialisieren – nie den UI-State.
      partialize: (state) => ({
        necessary: state.necessary,
        externalMedia: state.externalMedia,
        version: state.version,
        timestamp: state.timestamp,
        hasDecided: state.hasDecided,
      }),
      skipHydration: true,
    },
  ),
);

/**
 * Liefert die fuer eine spaetere Nachweisbarkeit relevanten Felder.
 * Wird z.B. dem Kontaktformular als verstecktes Feld mitgegeben.
 */
export function selectConsentMeta(state: ConsentState): ConsentMeta {
  return {
    version: state.version,
    timestamp: state.timestamp,
    externalMedia: state.externalMedia,
  };
}
