"use client";

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "development") return;

    const value = typeof metric.value === "number" ? metric.value.toFixed(2) : metric.value;
    // Dev-only Messpunkt: schnell sehen, ob LCP vom Poster, Video oder JS beeinflusst wird.
    console.info("[web-vitals]", metric.name, value, metric.rating, metric.attribution);
  });

  return null;
}
