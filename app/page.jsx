
import { HeroSection } from "../components/Hero/hero-section";
import FeaturedStudio from "../components/Home/FeaturedStudio";
import StudioCategories from "../components/Home/StudioCategories";
import HowItWorks from "../components/Home/HowItWorks";
import ForHosts from "../components/Home/ForHosts"

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturedStudio />
      <StudioCategories />
      <HowItWorks />
      <ForHosts />
      
    </main>
  )
}
