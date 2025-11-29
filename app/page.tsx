import Image from "next/image";
import BentoCategories from "./components/WhyChooseUs";
import Hero from "./components/Hero";
import HeroSection from "./components/HeroSection";
import FeaturedTrips from "./components/FeaturedTrips";
import WhyChooseUs from "./components/WhyChooseUs";
import TripReviews from "./components/TripReviews";

export default function Home() {
  return (
    <>
      <Hero/>
      <FeaturedTrips />
      <WhyChooseUs />
      <TripReviews />
    </>
  );
}
