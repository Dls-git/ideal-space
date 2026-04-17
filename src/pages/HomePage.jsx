import Features from "../components/Features";
import Hero from "../components/Hero";
import Visuals from "../components/Visuals";
import WhyUs from "../components/WhyUs";

export default function HomePage() {
  return (
    <>
      <Hero compact />
      <Features />
      <Visuals view="home" />
      <WhyUs summary />
    </>
  );
}
