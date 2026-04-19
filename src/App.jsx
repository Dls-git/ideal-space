import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

const SEO_BY_PATH = {
  "/": {
    title: "Ideal Space Solutions | Plaster Workforce & Project Support Melbourne",
    description:
      "Ideal Space Solutions provides reliable plaster workforce support for commercial and residential projects across Melbourne."
  },
  "/services": {
    title: "Services | Ideal Space Solutions",
    description:
      "Explore plaster workforce and site support services for builders, contractors, and project teams across Melbourne."
  },
  "/projects": {
    title: "Projects | Ideal Space Solutions",
    description:
      "View recent plaster and interior project work delivered by the Ideal Space Solutions team in Melbourne."
  },
  "/contact": {
    title: "Contact | Ideal Space Solutions",
    description:
      "Contact Ideal Space Solutions for plaster workforce support and submit your project inquiry online."
  }
};

function applyMetaTag(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    const seo = SEO_BY_PATH[location.pathname] || SEO_BY_PATH["/"];
    const canonicalUrl = `https://ideal.space.au${location.pathname}`;

    document.title = seo.title;
    applyMetaTag('meta[name="description"]', { name: "description", content: seo.description });
    applyMetaTag('meta[property="og:title"]', { property: "og:title", content: seo.title });
    applyMetaTag('meta[property="og:description"]', { property: "og:description", content: seo.description });
    applyMetaTag('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    applyMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    applyMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });

    let canonicalTag = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);
  }, [location.pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("route-fade-in");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      const timer = window.setTimeout(() => {
        setTransitionStage("route-fade-out");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [location.pathname, displayLocation.pathname]);

  const handleAnimationEnd = () => {
    if (transitionStage === "route-fade-out") {
      setDisplayLocation(location);
      window.setTimeout(() => {
        setTransitionStage("route-fade-in");
      }, 0);
    }
  };

  return (
    <main className={transitionStage} onAnimationEnd={handleAnimationEnd}>
      <Routes location={displayLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <ScrollToTop />
      <div className="min-h-screen bg-[#090909] text-white">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
