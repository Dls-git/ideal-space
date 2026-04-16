import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Visuals from "./components/Visuals";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function IdealSpaceSolutionsWebsite() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <Experience />
      <Projects />
      <Visuals />
      <Contact />
      <Footer />
    </div>
  );
}
