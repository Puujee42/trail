import { getRecentTrips } from "@/lib/mongo/trips";
import { fetchTripsFromRust } from "@/lib/rust-api";
import Hero from "./Hero";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export default async function HeroWrapper({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  // Try Rust Service First (Faster finding)
  const rustTrips = await fetchTripsFromRust({ limit: 6 });

  if (rustTrips && rustTrips.length > 0) {
    return <Hero trips={rustTrips} lang={lang} dictionary={dictionary.nav} />;
  }

  // Fallback to Node.js
  const trips = await getRecentTrips();
  return <Hero trips={trips} lang={lang} dictionary={dictionary.nav} />;
}