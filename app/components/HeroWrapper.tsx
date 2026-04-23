import { getRecentTrips } from "@/lib/mongo/trips";
import Hero from "./Hero";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export default async function HeroWrapper({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  const trips = await getRecentTrips();
  return <Hero trips={trips} lang={lang} dictionary={dictionary.nav} />;
}