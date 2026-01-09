import { getAllTrips } from "@/lib/mongo/trips";
import { fetchTripsFromRust } from "@/lib/rust-api";
import FeaturedTrips from "./FeaturedTrips";
import { Locale } from "@/i18n-config";

export default async function FeaturedTripsWrapper({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  // Try Rust Service First
  const rustTrips = await fetchTripsFromRust();

  if (rustTrips && rustTrips.length > 0) {
    return <FeaturedTrips trips={rustTrips} lang={lang} dictionary={dictionary} />;
  }

  // Fallback
  const trips = await getAllTrips();
  if (!trips || trips.length === 0) return null;
  return <FeaturedTrips trips={trips} lang={lang} dictionary={dictionary} />;
}