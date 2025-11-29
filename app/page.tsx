import Image from "next/image";
import BentoCategories from "./components/WhyChooseUs";
import Hero from "./components/Hero";
import HeroSection from "./components/HeroSection";
import FeaturedTrips from "./components/FeaturedTrips";
import WhyChooseUs from "./components/WhyChooseUs";
import TripReviews from "./components/TripReviews";
import { getFeaturedTrips } from "@/lib/mongo/trips";
export default async function Home() {
  const featuredTrips = await getFeaturedTrips();
  return (
    <>
      <Hero trips={featuredTrips}/>
      <FeaturedTrips trips={featuredTrips} />
      <WhyChooseUs />
      <TripReviews />
    </>
  );
}
