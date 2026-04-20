"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Wird gerendert, wenn ein Fehler im Root-Layout auftritt. Ersetzt das komplette
 * <html>/<body>, weshalb hier alle Tags lokal gesetzt werden muessen und
 * keine Client-Kontexte (Provider, SmoothScroll) zur Verfuegung stehen.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#7596AE",
          color: "#FFFFFF",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 560, width: "100%" }}>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: 12,
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            Schwerer Fehler
          </p>
          <h1
            style={{
              margin: "12px 0 0",
              fontSize: 40,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            Die Seite kann derzeit nicht geladen werden.
          </h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 18,
              lineHeight: 1.55,
              opacity: 0.95,
            }}
          >
            Bitte versuchen Sie es in einem Moment erneut. Falls das Problem
            bestehen bleibt, rufen Sie uns direkt an.
          </p>
          {error?.digest ? (
            <p style={{ marginTop: 16, fontSize: 12, opacity: 0.75 }}>
              Fehler-ID:{" "}
              <code style={{ fontFamily: "monospace" }}>{error.digest}</code>
            </p>
          ) : null}
          <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 9999,
                background: "#FFFFFF",
                color: "#0F172A",
                fontSize: 16,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Erneut laden
            </button>
            <a
              href="/"
              style={{
                height: 48,
                display: "inline-flex",
                alignItems: "center",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              Zur Startseite →
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
