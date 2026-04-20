"use client";

import { useEffect, useState } from "react";
import {
  CURRENT_CONSENT_VERSION,
  useConsentStore,
} from "@/lib/consent-store";

/**
 * Hydratisiert den Persist-Store auf dem Client und entscheidet, ob das Modal
 * angezeigt werden muss:
 *  - kein hasDecided -> Modal oeffnen
 *  - Version-Mismatch -> reset() (oeffnet Modal mit Defaults)
 *
 * Rendert nichts.
 */
export default function ConsentInitializer() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const rehydratePromise = useConsentStore.persist.rehydrate();
    Promise.resolve(rehydratePromise).finally(() => {
      if (!cancelled) setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const state = useConsentStore.getState();

    if (!state.hasDecided) {
      state.openModal();
      return;
    }

    if (state.version !== CURRENT_CONSENT_VERSION) {
      state.reset();
    }
  }, [isHydrated]);

  return null;
}
