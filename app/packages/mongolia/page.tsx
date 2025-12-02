import { getMongoliaTrips } from "@/lib/mongo/trips";
import PackagesList from "../PackagesList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mongolia Tours | Packages",
};

export default async function MongoliaPackagesPage() {
  const trips = await getMongoliaTrips();

  return (
    <PackagesList 
      packages={trips} 
      // 👇 PASS OBJECTS, NOT STRINGS
      title={{
        mn: "Монгол Аялал",
        en: "Mongolia Tours",
        ko: "몽골 여행"
      }}
      subtitle={{
        mn: "Өргөн уудам тал нутаг, нүүдэлчдийн соёлтой танилцаарай.",
        en: "Discover the vast steppes and nomadic culture.",
        ko: "광활한 초원과 유목민 문화를 발견하세요."
      }}
    />
  );
}