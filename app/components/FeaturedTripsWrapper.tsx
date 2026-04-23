import { getAllTrips } from "@/lib/mongo/trips";
import FeaturedTrips from "./FeaturedTrips";
import { Locale } from "@/i18n-config";

export default async function FeaturedTripsWrapper({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const trips = await getAllTrips();
  if (!trips || trips.length === 0) return null;
  return <FeaturedTrips trips={trips} lang={lang} dictionary={dictionary} />;
}