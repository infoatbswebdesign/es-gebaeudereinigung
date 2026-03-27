import { redirect } from "next/navigation";

/** Hero Variante 2 ist jetzt die Startseite – alte /hero-v2-Links leiten dorthin um. */
export default function HeroV2RedirectPage() {
  redirect("/");
}
