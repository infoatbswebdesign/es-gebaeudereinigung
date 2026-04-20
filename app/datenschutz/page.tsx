import type { Metadata } from "next";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import PrivacySettingsLink from "@/app/components/PrivacySettingsLink";
import { SITE_NAME, buildPageMetadata } from "@/lib/seo";

const PAGE_PATH = "/datenschutz";
const PAGE_TITLE = `Datenschutz- und Cookie-Richtlinie | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Datenschutzerklärung und Cookie-Richtlinie von ES-Gebäudeservice – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO und TDDDG.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
});

const INHABER_NAME = "Irem Tokmak";
const STEUERNUMMER = "59454/30670";
const WEBSITE_DOMAIN = "www.es-gebäudeservice.de";
const STAND_DATUM = "20. April 2026";
const SPEICHERDAUER_KONTAKT = "6 Monaten";

const linkClass =
  "font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900";

export default function DatenschutzPage() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="datenschutz-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h1
            id="datenschutz-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Datenschutz- und Cookie-Richtlinie
          </h1>
          <p className="mt-4 text-sm text-white/90 md:text-base">
            Stand: {STAND_DATUM}
          </p>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-label="Datenschutzerklärung"
      >
        <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-slate-700 md:text-lg">
          {/* 1. Verantwortlicher */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              1. Verantwortlicher
            </h2>
            <p className="mt-4">
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO)
              und anderer nationaler Datenschutzgesetze sowie sonstiger
              datenschutzrechtlicher Bestimmungen ist:
            </p>
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
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-slate-600">E-Mail: </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <span className="text-slate-600">Telefon: </span>
                <a href={`tel:${CONTACT_PHONE_TEL}`} className={linkClass}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
            <p className="mt-4">Steuernummer: {STEUERNUMMER}</p>
          </div>

          {/* 2. Allgemeine Hinweise */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              2. Allgemeine Hinweise und Begriffsbestimmungen
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              2.1 Geltungsbereich
            </h3>
            <p className="mt-3">
              Diese Datenschutzerklärung gilt für die Verarbeitung
              personenbezogener Daten im Zusammenhang mit unserer Website{" "}
              <span className="font-medium text-slate-900">
                {WEBSITE_DOMAIN}
              </span>{" "}
              sowie für alle darüber angebotenen Funktionen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              2.2 Definitionen
            </h3>
            <p className="mt-3">
              Wir verwenden in dieser Datenschutzerklärung die Begriffe, wie
              sie die DSGVO in Art. 4 definiert. Insbesondere sind
              „personenbezogene Daten" alle Informationen, die sich auf eine
              identifizierte oder identifizierbare natürliche Person beziehen.
              Hierzu zählen je nach Kontext auch IP-Adressen, weil diese nach
              der Rechtsprechung des Europäischen Gerichtshofs (EuGH, Urteil
              vom 19. Oktober 2016, C-582/14 – Breyer) typischerweise als
              personenbezogene Daten zu behandeln sind.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              2.3 Grundsätzliches zur Datenverarbeitung
            </h3>
            <p className="mt-3">
              Wir verarbeiten personenbezogene Daten nur auf Grundlage der
              gesetzlichen Bestimmungen (insbesondere DSGVO, TDDDG, DDG).
              Soweit wir für Verarbeitungsvorgänge personenbezogener Daten
              eine Einwilligung der betroffenen Person einholen, dient Art. 6
              Abs. 1 lit. a DSGVO als Rechtsgrundlage. Bei der Verarbeitung
              personenbezogener Daten, die zur Erfüllung eines Vertrages oder
              zur Durchführung vorvertraglicher Maßnahmen erforderlich sind,
              dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Soweit eine
              Verarbeitung personenbezogener Daten zur Erfüllung einer
              rechtlichen Verpflichtung erforderlich ist, der unser
              Unternehmen unterliegt, dient Art. 6 Abs. 1 lit. c DSGVO als
              Rechtsgrundlage. Ist die Verarbeitung zur Wahrung unserer
              berechtigten Interessen oder eines Dritten erforderlich und
              überwiegen die Interessen, Grundrechte und Grundfreiheiten der
              betroffenen Person nicht, so dient Art. 6 Abs. 1 lit. f DSGVO
              als Rechtsgrundlage.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              2.4 SSL-/TLS-Verschlüsselung
            </h3>
            <p className="mt-3">
              Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw.
              TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
              daran, dass die Adresszeile des Browsers von „http://" auf
              „https://" wechselt und an dem Schloss-Symbol in Ihrer
              Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert
              ist, können die Daten, die Sie an uns übermitteln, nicht von
              Dritten mitgelesen werden.
            </p>
          </div>

          {/* 3. Hosting: Vercel */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              3. Hosting: Vercel
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.1 Anbieter und Rolle
            </h3>
            <p className="mt-3">
              Wir hosten unsere Website bei der Vercel Inc., 440 N Barranca
              Avenue #4133, Covina, CA 91723, USA.
            </p>
            <p className="mt-4">
              Vercel verarbeitet personenbezogene Daten in unserem Auftrag,
              soweit es um die Bereitstellung der von uns genutzten Hosting-
              und Anwendungsfunktionen („Customer Data") geht. Mit Vercel
              haben wir hierzu einen Vertrag über Auftragsverarbeitung (Data
              Processing Addendum) im Sinne des Art. 28 DSGVO geschlossen.
            </p>
            <p className="mt-4">
              Nach der öffentlich dokumentierten Vertragslage verarbeitet
              Vercel darüber hinaus bestimmte servicebezogene Metadaten
              („Service-Generated Data") sowie Kontaktdaten („Contact Data")
              in eigener datenschutzrechtlicher Verantwortlichkeit. Weitere
              Informationen hierzu finden Sie in der Datenschutzerklärung von
              Vercel unter{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                vercel.com/legal/privacy-policy
              </a>
              .
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.2 Verarbeitete Daten
            </h3>
            <p className="mt-3">
              Bei Aufruf unserer Website verarbeitet Vercel technisch
              erforderliche Verbindungsdaten, insbesondere:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>angeforderte Inhalte (konkrete Seite/Datei)</li>
              <li>Statuscode des Zugriffs</li>
              <li>übertragene Datenmenge</li>
              <li>Referrer-URL</li>
              <li>Browser-Typ und -Version</li>
              <li>Betriebssystem</li>
              <li>
                aus der IP-Adresse abgeleitete ungefähre Standortinformationen
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.3 Zweck und Rechtsgrundlage
            </h3>
            <p className="mt-3">
              Die Verarbeitung erfolgt zum Zweck der technischen Bereitstellung
              der Website, der Sicherstellung der Stabilität und Sicherheit
              des Betriebs, der Lastverteilung, der Fehleranalyse sowie der
              Abwehr von Missbrauch und Angriffen.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser
              berechtigtes Interesse liegt in einem sicheren, stabilen und
              effizienten Betrieb unserer Website.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.4 Region der Datenverarbeitung
            </h3>
            <p className="mt-3">
              Wir haben die Server-Region für serverseitige Funktionen (Vercel
              Functions) auf{" "}
              <span className="font-semibold text-slate-900">
                Frankfurt am Main (<code>fra1</code>)
              </span>{" "}
              konfiguriert. Dies gilt insbesondere für die serverseitige
              Verarbeitung von Kontaktformular-Eingaben. Antworten auf
              personenbezogene Anfragen werden nicht über das CDN
              zwischengespeichert (<code>Cache-Control: private, no-store</code>
              ).
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.5 Datenübermittlung in Drittländer
            </h3>
            <p className="mt-3">
              Vercel ist ein US-amerikanisches Unternehmen. Eine Verarbeitung
              personenbezogener Daten in den USA oder in weiteren Drittstaaten
              kann daher nicht vollständig ausgeschlossen werden. Vercel
              dokumentiert in seiner DPA ausdrücklich, dass primäre
              Verarbeitungsanlagen in den USA liegen und Verarbeitungen auch
              weltweit erfolgen können (z. B. im Rahmen des globalen CDN und
              globaler Backup-Replikation).
            </p>
            <p className="mt-4">
              Die Übermittlung stützen wir – soweit anwendbar – auf den
              Angemessenheitsbeschluss der Europäischen Kommission vom 10.
              Juli 2023 zum EU-U.S. Data Privacy Framework (Art. 45 DSGVO),
              sofern der konkrete Empfänger unter dem Data Privacy Framework
              aktiv zertifiziert ist. Vercel Inc. erklärt in seiner Privacy
              Notice die Einhaltung des EU-U.S. DPF, der UK Extension sowie
              des Swiss-U.S. DPF.
            </p>
            <p className="mt-4">
              Ergänzend enthält die mit Vercel abgeschlossene Data Processing
              Addendum Standardvertragsklauseln der Europäischen Kommission
              (Durchführungsbeschluss 2021/914) als vertragliche
              Transfer-Garantie nach Art. 46 Abs. 2 lit. c DSGVO.
            </p>
            <p className="mt-4">
              Trotz dieser Schutzmechanismen kann nicht vollständig
              ausgeschlossen werden, dass US-Behörden unter bestimmten
              Voraussetzungen auf Daten zugreifen oder dass Daten im Rahmen
              global verteilter Infrastruktur außerhalb der Europäischen Union
              verarbeitet werden. Eine Kopie der vereinbarten Garantien
              erhalten Sie auf Anfrage unter den oben genannten Kontaktdaten.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              3.6 Speicherdauer
            </h3>
            <p className="mt-3">
              Die von Vercel automatisch erhobenen Logdaten werden nur in
              einem datensparsamen Umfang erhoben und nach Maßgabe der von
              Vercel vorgehaltenen Retention-Fristen gelöscht. Für
              Runtime-Logs gelten laut Vercel-Dokumentation tarifabhängige
              Fristen (bei Pro in der Regel 1 Tag, bei Enterprise 3 Tage). Wir
              haben Log Drains und IP-Adressen auf Team-Ebene so konfiguriert,
              dass IP-Adressen in Monitoring und Log Drains möglichst nicht
              sichtbar sind.
            </p>
          </div>

          {/* 4. Server-Logfiles */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              4. Erfassung allgemeiner Daten beim Besuch der Website
              (Server-Logfiles)
            </h2>
            <p className="mt-4">
              Unser Provider Vercel erhebt und speichert automatisch
              Informationen in sog. Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind die unter Ziffer 3.2
              genannten Daten.
            </p>
            <p className="mt-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen durch
              uns wird nicht vorgenommen. Die Daten werden nicht gemeinsam mit
              anderen personenbezogenen Daten von Ihnen gespeichert.
            </p>
            <p className="mt-4">
              IP-Adressen und vergleichbare Identifikatoren werden von uns{" "}
              <span className="font-semibold text-slate-900">
                nicht zu Analysezwecken im Klartext protokolliert
              </span>
              . Wir erheben in unserer Anwendung keine Forminhalte, Header
              oder IP-Adressen in Klartextprotokollen.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser
              berechtigtes Interesse liegt in der technisch fehlerfreien
              Darstellung und der Optimierung unserer Website – hierzu müssen
              die Server-Log-Dateien erfasst werden.
            </p>
          </div>

          {/* 5. Cookies */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              5. Cookies, LocalStorage und ähnliche Technologien
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              5.1 Grundsatz
            </h3>
            <p className="mt-3">
              Unsere Website verwendet nur Cookies und vergleichbare
              Technologien (wie LocalStorage), die für den Betrieb der Website
              technisch unbedingt erforderlich sind, es sei denn, Sie haben
              einer weitergehenden Nutzung ausdrücklich zugestimmt.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              5.2 Technisch erforderliche Speicherung
            </h3>
            <p className="mt-3">Technisch erforderlich sind insbesondere:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                ein Cookie bzw. LocalStorage-Eintrag zur Speicherung Ihrer
                Einwilligungsentscheidung (Consent-Cookie). Empfohlene
                Speicherdauer: 6 Monate.
              </li>
              <li>
                ggf. Session-Cookies für die Aufrechterhaltung einer Sitzung
                bei Formulareingaben.
              </li>
            </ul>
            <p className="mt-4">
              Die Rechtsgrundlage für den Einsatz dieser technisch
              erforderlichen Speichertechnologien ergibt sich aus § 25 Abs. 2
              Nr. 2 TDDDG (technisch unbedingt erforderlich). Soweit hiermit
              personenbezogene Daten verarbeitet werden, ist Rechtsgrundlage
              Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ergibt
              sich aus der Dokumentation Ihrer Einwilligungsentscheidung.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              5.3 Einwilligungspflichtige Technologien
            </h3>
            <p className="mt-3">
              Für alle nicht technisch erforderlichen Cookies sowie für die
              Einbindung von Drittinhalten, die Informationen auf Ihrem
              Endgerät speichern oder darauf zugreifen, holen wir Ihre
              vorherige Einwilligung gemäß § 25 Abs. 1 TDDDG und – soweit
              hierbei personenbezogene Daten verarbeitet werden – gemäß Art. 6
              Abs. 1 lit. a DSGVO ein.
            </p>
            <p className="mt-4">
              Sie können Ihre Einwilligung jederzeit mit Wirkung für die
              Zukunft über den Link{" "}
              <PrivacySettingsLink className={linkClass}>
                Datenschutzeinstellungen
              </PrivacySettingsLink>{" "}
              im Footer unserer Website widerrufen oder anpassen.
            </p>
          </div>

          {/* 6. Kontaktformular */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              6. Kontaktformular und Microsoft-365-Anbindung
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.1 Erhobene Daten
            </h3>
            <p className="mt-3">
              Wenn Sie uns über das Kontaktformular kontaktieren, verarbeiten
              wir die von Ihnen eingegebenen Daten, um Ihre Anfrage zu
              bearbeiten und ggf. Rückfragen zu beantworten. Verarbeitet
              werden dabei insbesondere:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Name (soweit angegeben)</li>
              <li>E-Mail-Adresse</li>
              <li>Betreff / Gegenstand der Anfrage</li>
              <li>Inhalt Ihrer Nachricht</li>
              <li>
                ggf. freiwillig von Ihnen angegebene weitere Daten (z. B.
                Telefonnummer, Firma)
              </li>
              <li>Zeitstempel der Übermittlung</li>
            </ul>
            <p className="mt-4">
              Pflichtangaben sind im Formular als solche gekennzeichnet. Die
              Bereitstellung weiterer Angaben erfolgt freiwillig. Bitte
              übermitteln Sie über das Kontaktformular keine besonderen
              Kategorien personenbezogener Daten im Sinne des Art. 9 DSGVO
              (z. B. Gesundheitsdaten) oder sonstige vertrauliche
              Informationen, sofern dies nicht zwingend erforderlich ist.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.2 Technischer Ablauf
            </h3>
            <p className="mt-3">
              Ihre Eingaben aus dem Kontaktformular werden in einer
              verschlüsselten Verbindung (HTTPS) an unseren Server bei Vercel
              (Region Frankfurt, <code>fra1</code>) übermittelt und dort
              serverseitig verarbeitet. Wir leiten die Anfrage anschließend
              über die Microsoft Graph API als Nachricht in ein Postfach
              unseres Microsoft-365-Business-Tenants weiter. Dort wird Ihre
              Anfrage zur Bearbeitung gespeichert.
            </p>
            <p className="mt-4">
              Die Zugangsdaten zur Microsoft Graph API sind ausschließlich
              serverseitig hinterlegt und werden nicht an Ihren Browser
              übertragen. Die Berechtigungen der eingesetzten Anwendung sind
              auf das notwendige Minimum beschränkt (gezielt auf das konkrete
              Zielpostfach) und werden regelmäßig überprüft.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.3 Empfänger und Auftragsverarbeitung (Microsoft)
            </h3>
            <p className="mt-3">
              Empfänger der Nachricht ist die Microsoft Ireland Operations
              Limited, One Microsoft Place, South County Business Park,
              Leopardstown, Dublin 18, Irland, als Vertragspartner für unseren
              Microsoft-365-Business-Tenant, sowie – soweit einschlägig – die
              Microsoft Corporation, One Microsoft Way, Redmond, WA 98052,
              USA.
            </p>
            <p className="mt-4">
              Mit Microsoft besteht über die Microsoft Product Terms ein
              Auftragsverarbeitungsvertrag (Microsoft Products and Services
              DPA) im Sinne des Art. 28 DSGVO. Microsoft agiert für die in
              unserem Microsoft-365-Tenant verarbeiteten Daten („Customer
              Data") vertraglich als Auftragsverarbeiter.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.4 Speicherort und EU Data Boundary
            </h3>
            <p className="mt-3">
              Unser Microsoft-365-/Exchange-Online-Tenant ist in der
              Europäischen Union bereitgestellt. Microsoft verpflichtet sich
              vertraglich, Exchange-Online-Postfachinhalte – also E-Mail-Body,
              Kalendereinträge und Anhangsinhalte – at rest innerhalb des
              EU-Geo zu speichern. Exchange Online gehört zudem zu den „EU
              Data Boundary Services".
            </p>
            <p className="mt-4">
              <span className="font-semibold text-slate-900">
                Wichtiger Hinweis:
              </span>{" "}
              Microsoft dokumentiert ausdrücklich, dass trotz EU Data Boundary{" "}
              <span className="font-semibold text-slate-900">
                begrenzte Übermittlungen oder Zugriffe außerhalb der EU/EFTA
              </span>{" "}
              stattfinden können. Hierzu zählen insbesondere:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Remote-Zugriff durch Microsoft-Personal außerhalb der EU zu
                Betriebs-, Troubleshooting-, Support- und Sicherheitszwecken
              </li>
              <li>
                kundeninitiierte Transfers (z. B. wenn wir selbst aus dem
                Ausland auf das Postfach zugreifen oder die Nachricht an
                Empfänger außerhalb der EU weiterleiten)
              </li>
              <li>
                begrenzte Übermittlungen zur Abwehr von Sicherheitsbedrohungen
              </li>
              <li>
                Replikation bestimmter Directory-Daten (z. B. Benutzername,
                E-Mail-Adresse)
              </li>
              <li>variable Netzpfade</li>
              <li>
                pseudonymisierte Daten für Servicequalität, Resilienz und
                Management
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.5 Drittlandtransfer Microsoft
            </h3>
            <p className="mt-3">
              Soweit im Zuge der genannten Konstellationen personenbezogene
              Daten in die USA oder andere Drittstaaten übermittelt werden,
              stützen wir diese Übermittlung – soweit einschlägig – auf den
              Angemessenheitsbeschluss der Europäischen Kommission zum
              EU-U.S. Data Privacy Framework (Art. 45 DSGVO). Microsoft
              Corporation ist unter dem EU-U.S. DPF aktiv zertifiziert.
            </p>
            <p className="mt-4">
              Ergänzend enthält das Microsoft Products and Services DPA
              Standardvertragsklauseln der Europäischen Kommission (Art. 46
              Abs. 2 lit. c DSGVO) sowie weitere geeignete Garantien. Eine
              Kopie dieser Garantien erhalten Sie auf Anfrage.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.6 Rechtsgrundlage
            </h3>
            <p className="mt-3">
              Die Verarbeitung Ihrer über das Kontaktformular übermittelten
              Daten erfolgt:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                auf Grundlage von{" "}
                <span className="font-semibold text-slate-900">
                  Art. 6 Abs. 1 lit. b DSGVO
                </span>
                , soweit Ihre Anfrage auf die Anbahnung oder Durchführung
                eines Vertrages mit uns gerichtet ist (z. B. Angebots- oder
                Projektanfragen);
              </li>
              <li>
                im Übrigen auf Grundlage von{" "}
                <span className="font-semibold text-slate-900">
                  Art. 6 Abs. 1 lit. f DSGVO
                </span>
                . Unser berechtigtes Interesse liegt in der effizienten
                Bearbeitung allgemeiner Kommunikationsanfragen, die an uns
                gerichtet werden (z. B. Presseanfragen, Kooperationsanfragen,
                sonstige Rückfragen).
              </li>
            </ul>
            <p className="mt-4">
              Sie können der auf Art. 6 Abs. 1 lit. f DSGVO gestützten
              Verarbeitung jederzeit widersprechen (siehe Ziffer 12).
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              6.7 Speicherdauer
            </h3>
            <p className="mt-3">
              Die im Zusammenhang mit einer Kontaktanfrage anfallenden Daten
              speichern wir grundsätzlich nur so lange, wie dies zur
              Bearbeitung Ihrer Anfrage und für etwaige Anschlussfragen
              erforderlich ist. Soweit der Sachverhalt abgeschlossen ist,
              löschen wir Kontaktanfragen in der Regel nach{" "}
              <span className="font-semibold text-slate-900">
                {SPEICHERDAUER_KONTAKT}
              </span>
              .
            </p>
            <p className="mt-4">
              Soweit gesetzliche Aufbewahrungspflichten bestehen (z. B.
              handels- oder steuerrechtliche Aufbewahrungsfristen nach §§ 147
              AO, 257 HGB) oder die Kommunikation Bestandteil eines
              Vertragsverhältnisses wird, speichern wir die Daten für die
              Dauer der jeweiligen gesetzlichen Fristen.
            </p>
          </div>

          {/* 7. Google Maps */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              7. Google Maps
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.1 Einbindung nur nach Einwilligung
            </h3>
            <p className="mt-3">
              Wir binden interaktive Karten von Google Maps{" "}
              <span className="font-semibold text-slate-900">
                ausschließlich nach Ihrer ausdrücklichen Einwilligung
              </span>{" "}
              ein. Beim ersten Aufruf einer Seite mit Kartenfunktion sehen Sie
              zunächst einen lokalen Platzhalter mit der Schaltfläche „Externe
              Karte laden". Erst mit einem Klick darauf wird eine Verbindung
              zu Servern von Google aufgebaut und die Karte nachgeladen
              („Two-Click-Lösung").
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.2 Anbieter
            </h3>
            <p className="mt-3">
              Anbieter ist die Google Ireland Limited, Gordon House, Barrow
              Street, Dublin 4, Irland, ggf. unter Einbeziehung der Google
              LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.3 Rollenverteilung (Controller-Controller)
            </h3>
            <p className="mt-3">
              Für die Nutzung der Google-Maps-APIs gelten die Google Maps
              Platform EEA Terms of Service. Nach der aktuellen Einordnung von
              Google zählen Google Maps APIs zu den{" "}
              <span className="font-semibold text-slate-900">
                Controller Services
              </span>
              ; es gelten die{" "}
              <span className="font-semibold text-slate-900">
                Google Controller-Controller Data Protection Terms
              </span>
              . Google ist insoweit{" "}
              <span className="font-semibold text-slate-900">
                selbst datenschutzrechtlich Verantwortlicher
              </span>{" "}
              für die Verarbeitung der im Zuge der Kartennutzung bei Google
              anfallenden Daten. Es handelt sich{" "}
              <span className="font-semibold text-slate-900">nicht</span> um
              Auftragsverarbeitung nach Art. 28 DSGVO.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.4 Verarbeitete Daten
            </h3>
            <p className="mt-3">
              Beim Laden der Karte werden nach Angaben von Google insbesondere
              folgende Daten verarbeitet:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit</li>
              <li>Browser- und Geräteinformationen</li>
              <li>Referrer</li>
              <li>die aufgerufene Seite</li>
              <li>
                je nach Nutzung Karten-, Standort- und Suchparameter (z. B.
                Koordinaten, Suchbegriffe)
              </li>
              <li>
                ggf. in Ihrem Browser oder in einem bestehenden Google-Konto
                gespeicherte Cookies oder ähnliche Identifier
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.5 Zwecke
            </h3>
            <p className="mt-3">
              Darstellung interaktiver Karten, Standortsuche, technische
              Bereitstellung des Kartendienstes, Missbrauchs- und
              Sicherheitsfunktionen sowie weitere Verarbeitung nach den
              Google-Datenschutzhinweisen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.6 Rechtsgrundlagen
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Für den Zugriff auf Informationen auf Ihrem Endgerät bzw. die
                Speicherung von Informationen darauf:{" "}
                <span className="font-semibold text-slate-900">
                  § 25 Abs. 1 TDDDG
                </span>{" "}
                (Einwilligung).
              </li>
              <li>
                Für die damit verbundene Verarbeitung personenbezogener Daten:{" "}
                <span className="font-semibold text-slate-900">
                  Art. 6 Abs. 1 lit. a DSGVO
                </span>{" "}
                (Einwilligung).
              </li>
            </ul>
            <p className="mt-4">
              Mit Klick auf „Externe Karte laden" willigen Sie zugleich in den
              Zugriff auf Informationen auf Ihrem Endgerät gemäß § 25 Abs. 1
              TDDDG sowie in die Verarbeitung personenbezogener Daten gemäß
              Art. 6 Abs. 1 lit. a DSGVO ein.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.7 Drittlandtransfer
            </h3>
            <p className="mt-3">
              Soweit Google personenbezogene Daten in die USA überträgt,
              stützen wir dies – soweit anwendbar – auf den
              Angemessenheitsbeschluss der Europäischen Kommission zum
              EU-U.S. Data Privacy Framework (Art. 45 DSGVO). Google LLC und
              zahlreiche ihrer US-Tochtergesellschaften sind unter dem EU-U.S.
              DPF aktiv zertifiziert.
            </p>
            <p className="mt-4">
              Soweit im Einzelfall ein Transfer nicht vom
              Angemessenheitsbeschluss abgedeckt ist, greifen die zwischen
              Google und uns geltenden Controller-to-Controller-
              Standardvertragsklauseln nach Art. 46 DSGVO.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.8 Speicherdauer
            </h3>
            <p className="mt-3">
              Wir laden den Dienst erst nach Ihrer Einwilligung. Ihre
              Einwilligungsentscheidung speichern wir in einem
              First-Party-Cookie für{" "}
              <span className="font-semibold text-slate-900">6 Monate</span>{" "}
              oder bis zum Widerruf. Die weitere Speicherdauer bei Google
              bestimmt sich nach den Datenschutzhinweisen von Google (
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                policies.google.com/privacy
              </a>
              ).
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.9 Widerruf
            </h3>
            <p className="mt-3">
              Sie können Ihre Einwilligung jederzeit mit Wirkung für die
              Zukunft über den Link{" "}
              <PrivacySettingsLink className={linkClass}>
                Datenschutzeinstellungen
              </PrivacySettingsLink>{" "}
              im Footer widerrufen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              7.10 Weitere Informationen
            </h3>
            <p className="mt-3">
              Die Nutzung von Google Maps unterliegt den
              Google-Maps-Endnutzerbedingungen (
              <a
                href="https://www.google.com/intl/de/help/terms_maps/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                google.com/intl/de/help/terms_maps
              </a>
              ) sowie der Google-Datenschutzerklärung (
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                policies.google.com/privacy
              </a>
              ).
            </p>
          </div>

          {/* 8. Google-Bewertungen */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              8. Google-Bewertungen (Google Places API, serverseitig)
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              8.1 Funktionsweise
            </h3>
            <p className="mt-3">
              Wir zeigen auf unserer Website öffentliche Bewertungen unseres
              Google-Business-Eintrags an. Diese Bewertungen werden{" "}
              <span className="font-semibold text-slate-900">
                ausschließlich serverseitig
              </span>{" "}
              über die Google Places API abgerufen. Beim reinen Aufruf unserer
              Website wird{" "}
              <span className="font-semibold text-slate-900">
                keine unmittelbare Verbindung Ihres Browsers zu Google
              </span>{" "}
              hergestellt; der Abruf erfolgt durch unseren Server.
            </p>
            <p className="mt-4">
              Der Abruf erfolgt mit einer auf das notwendige Minimum
              beschränkten Feldauswahl (Field Mask). Wir rufen regelmäßig
              ausschließlich folgende Inhalte ab:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Gesamtbewertung (Durchschnittsstern-Rating)</li>
              <li>Anzahl der abgegebenen Bewertungen</li>
              <li>
                einzelne öffentliche Rezensionstexte mit Autorenname und
                Zeitpunkt
              </li>
            </ul>
            <p className="mt-4">
              Profilfotos und weitergehende Nutzerdaten werden bewusst nicht
              verarbeitet.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              8.2 Rechtsgrundlage
            </h3>
            <p className="mt-3">
              Rechtsgrundlage ist{" "}
              <span className="font-semibold text-slate-900">
                Art. 6 Abs. 1 lit. f DSGVO
              </span>
              . Unser berechtigtes Interesse liegt in einer nutzerfreundlichen,
              aktuellen und transparenten Darstellung der öffentlichen
              Kundenbewertung unseres Angebots bei gleichzeitig datensparsamer
              technischer Umsetzung ohne clientseitige Drittverbindung beim
              Seitenaufruf.
            </p>
            <p className="mt-4">
              Weil der Abruf serverseitig erfolgt und beim Seitenbesuch keine
              Informationen auf Ihrem Endgerät gespeichert oder ausgelesen
              werden, ist für diese Art der Einbindung{" "}
              <span className="font-semibold text-slate-900">
                keine Einwilligung nach § 25 TDDDG
              </span>{" "}
              erforderlich.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              8.3 Empfänger
            </h3>
            <p className="mt-3">
              Empfänger ist – im Rahmen der serverseitigen API-Abfrage – die
              Google Ireland Limited bzw. Google LLC, USA. Google ist für die
              Verarbeitung im Rahmen der Places API selbst
              datenschutzrechtlich Verantwortlicher (Controller-Controller).
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              8.4 Drittlandtransfer
            </h3>
            <p className="mt-3">
              Die Übermittlung in die USA stützen wir – soweit einschlägig –
              auf den Angemessenheitsbeschluss der Europäischen Kommission zum
              EU-U.S. Data Privacy Framework (Art. 45 DSGVO); im Übrigen auf
              Standardvertragsklauseln nach Art. 46 DSGVO.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              8.5 Speicherung
            </h3>
            <p className="mt-3">
              Wir speichern die abgerufenen Bewertungsinhalte nicht dauerhaft
              in eigenen Datenbanken. Von Google vertraglich zugelassen ist
              lediglich die dauerhafte Speicherung der Place-ID;
              Review-Inhalte, Business-Namen und -Adressen werden von uns
              nicht außerhalb des technisch und vertraglich zulässigen
              Umfangs persistiert.
            </p>
            <p className="mt-4">
              Dauerhaft gespeichert wird ausschließlich die Place-ID unseres
              Google-Business-Eintrags.
            </p>
          </div>

          {/* 9. GoDaddy */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              9. Domain-Registrierung bei GoDaddy
            </h2>
            <p className="mt-4">
              Unsere Domain ist bei der GoDaddy.com, LLC bzw. einer ihrer
              Tochtergesellschaften registriert. Für den Abruf der Website
              selbst verwenden wir{" "}
              <span className="font-semibold text-slate-900">
                nicht die Nameserver von GoDaddy
              </span>
              , sondern die autoritativen Nameserver von Vercel. GoDaddy liegt
              damit beim normalen Besuch unserer Website{" "}
              <span className="font-semibold text-slate-900">
                nicht im technischen Request-Pfad
              </span>{" "}
              und ist kein Empfänger Ihrer Besucherdaten.
            </p>
            <p className="mt-4">
              GoDaddy verarbeitet im Zusammenhang mit der Domainregistrierung
              personenbezogene Registrar- und Inhaberdaten (z. B.
              Inhaberkontakt, administrative und technische Kontakte,
              Abrechnungsdaten) sowie ggf. an Registries (bei .de: DENIC eG,
              bei gTLDs: jeweilige Registry) weiterzugebende Daten. Für diese
              Verarbeitung ist GoDaddy datenschutzrechtlich überwiegend selbst
              Verantwortlicher im Rahmen seiner registrarspezifischen
              Pflichten (ICANN-, Registry- und
              Registration-Data-Policy-Pflichten).
            </p>
            <p className="mt-4">
              Für die Kommunikation gegenüber Registries und ggf. im
              WHOIS/RDAP verwenden wir bevorzugt funktionsbezogene Kontakte
              (z. B. eine zentrale E-Mail-Adresse), um die Offenlegung
              persönlicher Daten zu minimieren.
            </p>
          </div>

          {/* 10. Sichere Kontaktaufnahme */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              10. Sichere Kontaktaufnahme per E-Mail
            </h2>
            <p className="mt-4">
              Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zwecks
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei
              uns gespeichert. Die Verarbeitung erfolgt je nach Anlass auf
              Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
              oder Art. 6 Abs. 1 lit. f DSGVO (Bearbeitung allgemeiner
              Anfragen). Der technische Rahmen (Microsoft-365-Tenant, EU Data
              Boundary, SCC/DPF) entspricht Ziffer 6.
            </p>
          </div>

          {/* 11. Pflicht zur Bereitstellung */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              11. Pflicht zur Bereitstellung von Daten
            </h2>
            <p className="mt-4">
              Die Bereitstellung personenbezogener Daten ist weder gesetzlich
              noch vertraglich vorgeschrieben. Sie sind nicht verpflichtet,
              uns personenbezogene Daten zur Verfügung zu stellen. Allerdings
              ist die Bereitstellung der als Pflichtangaben gekennzeichneten
              Daten im Kontaktformular erforderlich, damit wir Ihre Anfrage
              bearbeiten können. Ohne diese Angaben können wir Ihre Anfrage
              nicht beantworten.
            </p>
          </div>

          {/* 12. Rechte der betroffenen Personen */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              12. Rechte der betroffenen Personen
            </h2>
            <p className="mt-4">
              Sie haben uns gegenüber folgende Rechte hinsichtlich der Sie
              betreffenden personenbezogenen Daten:
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.1 Auskunftsrecht (Art. 15 DSGVO)
            </h3>
            <p className="mt-3">
              Sie haben das Recht, von uns eine Bestätigung darüber zu
              verlangen, ob wir Sie betreffende personenbezogene Daten
              verarbeiten. Liegt eine solche Verarbeitung vor, können Sie von
              uns u. a. Auskunft über die Verarbeitungszwecke, die Kategorien
              der verarbeiteten Daten, die Empfänger oder Kategorien von
              Empfängern, die geplante Speicherdauer sowie über das Bestehen
              der weiteren Betroffenenrechte verlangen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.2 Recht auf Berichtigung (Art. 16 DSGVO)
            </h3>
            <p className="mt-3">
              Sie haben das Recht, die Berichtigung unrichtiger oder die
              Vervollständigung unvollständiger personenbezogener Daten zu
              verlangen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.3 Recht auf Löschung (Art. 17 DSGVO)
            </h3>
            <p className="mt-3">
              Sie können die Löschung der Sie betreffenden personenbezogenen
              Daten verlangen, soweit die Verarbeitung für die in Art. 17 Abs.
              1 DSGVO genannten Voraussetzungen (z. B. Zweckfortfall, Widerruf
              der Einwilligung, erfolgreicher Widerspruch) zutrifft und kein
              Ausschlussgrund nach Art. 17 Abs. 3 DSGVO greift.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.4 Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
            </h3>
            <p className="mt-3">
              Sie haben das Recht, eine Einschränkung der Verarbeitung zu
              verlangen, wenn die Voraussetzungen des Art. 18 Abs. 1 DSGVO
              vorliegen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.5 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
            </h3>
            <p className="mt-3">
              Soweit die Verarbeitung auf Ihrer Einwilligung (Art. 6 Abs. 1
              lit. a DSGVO) oder auf einem Vertrag (Art. 6 Abs. 1 lit. b
              DSGVO) beruht und automatisiert erfolgt, haben Sie das Recht,
              die Sie betreffenden Daten in einem strukturierten, gängigen und
              maschinenlesbaren Format zu erhalten bzw. an einen anderen
              Verantwortlichen zu übertragen.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.6 Widerspruchsrecht (Art. 21 DSGVO)
            </h3>
            <p className="mt-3">
              Soweit die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht,
              haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen
              Situation ergeben, jederzeit Widerspruch gegen die Verarbeitung
              einzulegen.
            </p>
            <p className="mt-4 font-semibold text-slate-900">
              Wir weisen Sie auf Ihr Widerspruchsrecht nach Art. 21 DSGVO
              besonders hin:
            </p>
            <blockquote className="mt-3 border-l-4 border-[#7596AE] bg-slate-50 px-4 py-3 text-slate-700">
              Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen
              Situation ergeben, jederzeit gegen die Verarbeitung Sie
              betreffender personenbezogener Daten, die aufgrund von Art. 6
              Abs. 1 lit. f DSGVO erfolgt, Widerspruch einzulegen. Wir
              verarbeiten die personenbezogenen Daten dann nicht mehr, es sei
              denn, wir können zwingende schutzwürdige Gründe für die
              Verarbeitung nachweisen, die Ihre Interessen, Rechte und
              Freiheiten überwiegen, oder die Verarbeitung dient der
              Geltendmachung, Ausübung oder Verteidigung von
              Rechtsansprüchen.
            </blockquote>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.7 Widerrufsrecht bei Einwilligungen (Art. 7 Abs. 3 DSGVO)
            </h3>
            <p className="mt-3">
              Sie können eine einmal erteilte Einwilligung jederzeit mit
              Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis
              zum Widerruf erfolgten Verarbeitung bleibt hiervon unberührt.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.8 Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)
            </h3>
            <p className="mt-3">
              Unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe haben Sie das Recht auf Beschwerde
              bei einer Datenschutz-Aufsichtsbehörde, insbesondere in dem
              Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder
              des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind,
              dass die Verarbeitung der Sie betreffenden personenbezogenen
              Daten gegen die DSGVO verstößt.
            </p>
            <p className="mt-4">Die für uns zuständige Aufsichtsbehörde ist:</p>
            <address className="mt-3 not-italic">
              <span className="block font-semibold text-slate-900">
                Der Landesbeauftragte für den Datenschutz und die
                Informationsfreiheit Baden-Württemberg
              </span>
              <span className="block">Lautenschlagerstraße 20</span>
              <span className="block">70173 Stuttgart</span>
              <span className="block">
                <span className="text-slate-600">Telefon: </span>
                <a href="tel:+49711615541-0" className={linkClass}>
                  +49 711 61 55 41-0
                </a>
              </span>
              <span className="block">
                <span className="text-slate-600">E-Mail: </span>
                <a href="mailto:poststelle@lfdi.bwl.de" className={linkClass}>
                  poststelle@lfdi.bwl.de
                </a>
              </span>
              <span className="block">
                <span className="text-slate-600">Web: </span>
                <a
                  href="https://www.baden-wuerttemberg.datenschutz.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  www.baden-wuerttemberg.datenschutz.de
                </a>
              </span>
            </address>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
              12.9 Ausübung der Rechte
            </h3>
            <p className="mt-3">
              Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die
              unter Ziffer 1 angegebenen Kontaktdaten. Wir werden Ihre Anfrage
              ohne unangemessene Verzögerung, in jedem Fall aber binnen eines
              Monats ab Eingang des Antrags bearbeiten.
            </p>
          </div>

          {/* 13. Automatisierte Entscheidungsfindung */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              13. Automatisierte Entscheidungsfindung und Profiling
            </h2>
            <p className="mt-4">
              Wir setzen keine automatisierte Entscheidungsfindung im Sinne
              des Art. 22 DSGVO einschließlich Profiling ein.
            </p>
          </div>

          {/* 14. Änderungen */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              14. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="mt-4">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
              damit sie stets den aktuellen rechtlichen Anforderungen
              entspricht oder um Änderungen unserer Leistungen in der
              Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer
              Services. Für Ihren erneuten Besuch gilt dann die neue
              Datenschutzerklärung.
            </p>
            <p className="mt-4">
              Die jeweils aktuelle Fassung finden Sie stets unter{" "}
              <span className="font-medium text-slate-900">
                {WEBSITE_DOMAIN}/datenschutz
              </span>
              .
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 text-sm text-slate-500">
            Stand dieser Datenschutzerklärung: {STAND_DATUM}
          </div>
        </div>
      </section>
    </main>
  );
}
