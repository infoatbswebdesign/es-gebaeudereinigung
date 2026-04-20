"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  useToastStore,
  type ToastItem as ToastItemData,
  type ToastVariant,
} from "@/lib/toast-store";

gsap.registerPlugin(useGSAP);

const VARIANT_CLASS: Record<ToastVariant, string> = {
  error: "bg-red-600 text-white",
  success: "bg-emerald-600 text-white",
  info: "bg-slate-800 text-white",
};

/**
 * ToastStack – globaler Container, der die aktiven Toasts aus dem Zustand-Store
 * rendert und per Portal an document.body haengt.
 *
 * Positionierung (Mobile wie Desktop identisch):
 * - unten mittig, Abstand `1.5rem` zum unteren Rand + Safe-Area-Bottom.
 * - Breite passt sich dem Inhalt an (`items-center` + Items ohne fixe Breite),
 *   wird aber durch `max-w-[calc(100%-1rem)]` (Mobile) bzw. `md:max-w-md`
 *   (Desktop) gedeckelt → kurze Meldungen sind nur so breit wie der Text,
 *   lange Meldungen brechen sauber um.
 * - `flex-col`: juengster Toast unten, aeltere werden nach oben geschoben.
 */
export default function ToastStack() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);
  const remove = useToastStore((state) => state.remove);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed left-1/2 z-200 flex max-w-[calc(100%-1rem)] -translate-x-1/2 flex-col items-center gap-2 md:max-w-md"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
    >
      {toasts.map((toast) => (
        <ToastStackItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismiss(toast.id)}
          onRemove={() => remove(toast.id)}
        />
      ))}
    </div>,
    document.body,
  );
}

type ToastStackItemProps = {
  toast: ToastItemData;
  onDismiss: () => void;
  onRemove: () => void;
};

/**
 * Ein einzelner Stack-Toast.
 *
 * - Die Komponente ist in zwei Ebenen geteilt:
 *   1. `outerRef` = Layout-Wrapper (animiert `height` → Stack-Nachbarn
 *      rutschen beim Enter/Exit smooth nach).
 *   2. `innerRef` = sichtbare Toast-Pille (animiert `y`, `scale`, `autoAlpha`).
 * - Enter: slide + fade + leichter Scale-Up mit `expo.out`.
 * - Exit: fade + scale-down + Height-Collapse, `power3.inOut`.
 * - `useGSAP` + `gsap.matchMedia` liefern die richtige Slide-Richtung
 *   fuer Mobile (von oben) / Desktop (von unten) und raeumen automatisch auf.
 */
function ToastStackItem({ toast, onDismiss, onRemove }: ToastStackItemProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Auto-Dismiss-Timer laeuft nur solange der Toast nicht bereits im Abgang ist.
  useEffect(() => {
    if (toast.dismissing || !toast.duration) return;
    const handle = window.setTimeout(onDismiss, toast.duration);
    return () => window.clearTimeout(handle);
  }, [toast.dismissing, toast.duration, onDismiss]);

  // Enter-Animation: laeuft einmal beim Mount (aber nicht, wenn der Toast
  // direkt im dismissing-Zustand ankommt – dann uebernimmt die Exit-Animation).
  useGSAP(
    () => {
      if (toast.dismissing) return;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const targetHeight = inner.getBoundingClientRect().height;

      // Enter: kein Slide-In von unten – Toast soll an Ort und Stelle
      // "entstehen" (Fade + sanftes Scale-Up). `outer` animiert nur die
      // Hoehe, damit die anderen Stack-Items smooth nachruecken.
      gsap.set(outer, { height: 0, overflow: "hidden" });
      gsap.set(inner, { y: 0, autoAlpha: 0, scale: 0.94 });

      const tl = gsap.timeline();
      tl.to(
        outer,
        {
          height: targetHeight,
          duration: 0.45,
          ease: "expo.out",
        },
        0,
      );
      tl.to(
        inner,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        0.05,
      );
      tl.set(outer, { height: "auto", overflow: "visible" });
    },
    { dependencies: [] },
  );

  // Exit-Animation: laeuft, sobald `dismissing` auf true wechselt.
  useGSAP(
    () => {
      if (!toast.dismissing) return;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      // Falls noch eine Enter-Timeline laeuft: killen, damit sie nicht
      // gegen die Exit-Animation ankaempft.
      gsap.killTweensOf([outer, inner]);

      const currentHeight =
        outer.getBoundingClientRect().height || inner.getBoundingClientRect().height;
      gsap.set(outer, { height: currentHeight, overflow: "hidden" });

      const tl = gsap.timeline({ onComplete: onRemove });
      tl.to(
        inner,
        {
          autoAlpha: 0,
          scale: 0.92,
          duration: 0.32,
          ease: "power3.in",
        },
        0,
      );
      tl.to(
        outer,
        {
          height: 0,
          // Negative Margins kompensieren das Container-`gap` zu beiden
          // Nachbarn – ohne das blieben waehrend der Exit-Animation bis zu
          // 16px „Geisterlücke" zwischen den verbleibenden Toasts stehen.
          marginTop: "-0.5rem",
          marginBottom: "-0.5rem",
          duration: 0.4,
          ease: "power3.inOut",
        },
        0.04,
      );
    },
    { dependencies: [toast.dismissing] },
  );

  return (
    <div ref={outerRef} className="pointer-events-none max-w-full">
      <div
        ref={innerRef}
        role="alert"
        className={[
          "pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3",
          VARIANT_CLASS[toast.variant],
        ].join(" ")}
        style={{ opacity: 0, visibility: "hidden", willChange: "transform, opacity" }}
      >
        <span className="flex-1 text-sm leading-snug">{toast.message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Meldung schließen"
          className="shrink-0 rounded-md p-1 text-white/90 transition hover:bg-white/15 hover:text-white"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export type { ToastVariant };
