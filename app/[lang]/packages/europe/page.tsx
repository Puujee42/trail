import { getEuropeTrips } from "@/lib/mongo/trips";
import PackagesList from "../PackagesList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Europe Tours | Packages",
};

export default async function EuropePackagesPage() {
  const trips = await getEuropeTrips();

  return (
    <PackagesList 
      packages={trips} 
      // 👇 PASS OBJECTS, NOT STRINGS
      title={{
        mn: "Европ Аялал",
        ko: "유럽 여행",
        en: "Europe Tours"
      }}
      subtitle={{
        mn: "Эртний түүх, соёл, урлагийн өлгий нутгаар аялаарай.",
        en: "Explore the cradle of ancient history, culture, and art.",
        ko: "고대 역사, 문화 및 예술의 요람을 탐험하세요."
      }}
    />
  );
}