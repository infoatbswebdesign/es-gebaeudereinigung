import Link from "next/link";

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 md:px-12">
      <h1 className="text-3xl font-bold text-slate-900">
        Kontakt
      </h1>
      <p className="mt-4 text-slate-600">
        Kontaktseite – Formular und Angaben können Sie hier ergänzen.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="text-slate-900 underline hover:no-underline"
        >
          ← Zur Startseite
        </Link>
      </p>
    </main>
  );
}
