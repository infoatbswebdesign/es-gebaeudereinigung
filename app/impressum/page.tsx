import type { Metadata } from "next";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import { SITE_NAME, buildPageMetadata } from "@/lib/seo";

const PAGE_PATH = "/impressum";
const PAGE_TITLE = `Impressum | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Impressum und Anbieterkennzeichnung gemäß § 5 DDG von ES-Gebäudeservice in Esslingen am Neckar.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
});

const INHABER_NAME = "Irem Tokmak";
const STEUERNUMMER = "59454/30670";
const WEBSITE_DOMAIN = "www.es-gebäudeservice.de";
const STAND_DATUM = "20. April 2026";

export default function ImpressumPage() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="impressum-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h1
            id="impressum-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Impressum
          </h1>
          <p className="mt-4 text-sm text-white/90 md:text-base">
            Stand: {STAND_DATUM}
          </p>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-label="Rechtliche Angaben"
      >
        <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-slate-700 md:text-lg">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
            </h2>
            <address className="mt-4 not-italic">
              <span className="block font-semibold text-slate-900">
                ES-Gebäudeservice
              </span>
              <span className="block">Inhaber: {INHABER_NAME}</span>
              {CONTACT_ADDRESS_LINES.slice(1).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">Deutschland</span>
            </address>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Kontakt
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-slate-600">Telefon: </span>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="text-slate-600">E-Mail: </span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <span className="text-slate-600">Website: </span>
                <span className="font-medium text-slate-900">
                  {WEBSITE_DOMAIN}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Steuernummer
            </h2>
            <p className="mt-4">
              Steuernummer:
              <br />
              <span className="font-medium text-slate-900">
                {STEUERNUMMER}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Berufsbezeichnung und Gewerbeverzeichnis
            </h2>
            <p className="mt-4">
              <span className="font-semibold text-slate-900">
                Ausgeübte Tätigkeiten:
              </span>{" "}
              Gebäudereinigung (Unterhalts-, Grund-, Glas- und
              Baugrobreinigung), Hausmeisterservice, Winterdienst, Kehrwochen,
              Grünanlagenpflege und Entrümpelung.
            </p>
            <p className="mt-4">
              <span className="font-semibold text-slate-900">
                Berufsbezeichnung des Hauptgewerbes:
              </span>{" "}
              Gebäudereiniger (zulassungsfreies Handwerk nach Anlage B1 Nr. 33
              der Handwerksordnung)
              <br />
              <span className="font-semibold text-slate-900">
                Verliehen in:
              </span>{" "}
              Bundesrepublik Deutschland
            </p>
            <div className="mt-4">
              <p className="font-semibold text-slate-900">
                Eintragung im Gewerbeverzeichnis:
              </p>
              <address className="mt-2 not-italic">
                <span className="block">Handwerkskammer Region Stuttgart</span>
                <span className="block">Heilbronner Straße 43</span>
                <span className="block">70191 Stuttgart</span>
                <span className="block">
                  <span className="text-slate-600">Telefon: </span>
                  <a
                    href="tel:+4971116570"
                    className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                  >
                    0711 1657-0
                  </a>
                </span>
                <span className="block">
                  <span className="text-slate-600">Website: </span>
                  <a
                    href="https://www.hwk-stuttgart.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                  >
                    www.hwk-stuttgart.de
                  </a>
                </span>
              </address>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="mt-4">
              Wir sind nicht bereit und nicht verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Haftung für Inhalte
            </h2>
            <p className="mt-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden
              wir diese Inhalte umgehend entfernen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Haftung für Links
            </h2>
            <p className="mt-4">
              Unser Angebot enthält ggf. Links zu externen Websites Dritter,
              auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir
              für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p className="mt-4">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Links umgehend entfernen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Urheberrecht
            </h2>
            <p className="mt-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten,
              nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="mt-4">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
              wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
              werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
              trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
              bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden
              von Rechtsverletzungen werden wir derartige Inhalte umgehend
              entfernen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
