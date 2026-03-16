import Link from "next/link";

export default function LeistungenPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 md:px-12">
      <h1 className="text-3xl font-bold text-slate-900">
        Leistungen
      </h1>
      <p className="mt-4 text-slate-600">
        Übersicht der Leistungen – Inhalt kann hier ergänzt werden.
      </p>
      <p className="mt-6">
        <Link href="/" className="text-[#E85D2C] underline hover:no-underline">
          ← Zur Startseite
        </Link>
      </p>
    </main>
  );
}
