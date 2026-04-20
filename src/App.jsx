import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { projectsData } from "./data/projectsData";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const SITE_URL = "https://idealspace.au";
const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
const MAX_JSON_LD_SCRIPTS = 5;

const SEO_BY_PATH = {
  "/": {
    title: "Ideal Space Solutions | Plaster Workforce & Project Support Melbourne",
    description:
      "Ideal Space Solutions provides reliable plaster workforce support for commercial and residential projects across Melbourne.",
    ogImage: "/og/home.svg",
    robots: "index,follow,max-image-preview:large",
    pageName: "Home",
  },
  "/services": {
    title: "Services | Ideal Space Solutions",
    description:
      "Explore plaster workforce and site support services for builders, contractors, and project teams across Melbourne.",
    ogImage: "/og/services.svg",
    robots: "index,follow,max-image-preview:large",
    pageName: "Services",
  },
  "/projects": {
    title: "Projects | Ideal Space Solutions",
    description:
      "View recent plaster and interior project work delivered by the Ideal Space Solutions team in Melbourne.",
    ogImage: "/og/projects.svg",
    robots: "index,follow,max-image-preview:large",
    pageName: "Projects",
  },
  "/contact": {
    title: "Contact | Ideal Space Solutions",
    description:
      "Contact Ideal Space Solutions for plaster workforce support and submit your project inquiry online.",
    ogImage: "/og/contact.svg",
    robots: "index,follow,max-image-preview:large",
    pageName: "Contact",
  },
  "/404": {
    title: "Page Not Found | Ideal Space Solutions",
    description: "The requested page could not be found. Return to the Ideal Space Solutions homepage.",
    ogImage: "/og/home.svg",
    robots: "noindex, follow",
    pageName: "404",
  },
};

function applyMetaTag(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertJsonLdScript(scriptId, schema) {
  let scriptTag = document.getElementById(scriptId);
  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.id = scriptId;
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schema);
}

function removeJsonLdScript(scriptId) {
  const scriptTag = document.getElementById(scriptId);
  if (scriptTag?.parentNode) {
    scriptTag.parentNode.removeChild(scriptTag);
  }
}

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function getCanonicalUrl(pathname) {
  if (!pathname || pathname === "/") return `${SITE_URL}/`;
  const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return `${SITE_URL}${normalizedPath}`;
}

function buildBreadcrumbSchema(pathname, pageName) {
  const crumbs = [{ name: "Home", item: `${SITE_URL}/` }];

  if (pathname === "/services") {
    crumbs.push({ name: "Services", item: `${SITE_URL}/services` });
  } else if (pathname === "/projects") {
    crumbs.push({ name: "Projects", item: `${SITE_URL}/projects` });
  } else if (pathname === "/contact") {
    crumbs.push({ name: "Contact", item: `${SITE_URL}/contact` });
  } else if (pathname === "/404") {
    crumbs.push({ name: "404", item: `${SITE_URL}/404` });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
    ...(pageName === "404" ? { name: "404 Breadcrumb" } : {}),
  };
}

function buildSchemas(pathname, seo, canonicalUrl) {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: canonicalUrl,
  };

  const breadcrumbSchema = buildBreadcrumbSchema(pathname, seo.pageName);

  if (pathname === "/") {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": LOCAL_BUSINESS_ID,
      name: "Ideal Space Solutions",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/og/home.svg`,
      email: "hello@idealspace.au",
      telephone: "0434 082 628",
      areaServed: "Melbourne",
      description: "Plaster workforce and project support services in Melbourne.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Melbourne CBD",
        addressLocality: "Melbourne",
        addressRegion: "VIC",
        postalCode: "3000",
        addressCountry: "AU",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -37.8136,
        longitude: 144.9631,
      },
      openingHours: ["Mo-Fr 07:00-18:00", "Sa 08:00-13:00"],
      priceRange: "$$",
      sameAs: [`${SITE_URL}/`],
    };
    return [localBusinessSchema, pageSchema, breadcrumbSchema];
  }

  if (pathname === "/services") {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Commercial Plastering Services",
      description:
        "Flexible commercial plaster workforce support including suspended ceilings, partition walls, fire-rated systems, and defect rectification.",
      provider: {
        "@type": "LocalBusiness",
        "@id": LOCAL_BUSINESS_ID,
        name: "Ideal Space Solutions",
        url: `${SITE_URL}/`,
      },
      areaServed: {
        "@type": "City",
        name: "Melbourne",
      },
      url: `${SITE_URL}/services`,
    };
    return [serviceSchema, pageSchema, breadcrumbSchema];
  }

  if (pathname === "/projects") {
    const projectsSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Ideal Space Solutions Project Portfolio",
      itemListElement: projectsData.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${SITE_URL}/projects#${project.id}`,
      })),
    };
    return [projectsSchema, pageSchema, breadcrumbSchema];
  }

  return [pageSchema, breadcrumbSchema];
}

function RouteLoading() {
  return (
    <div className="mx-auto flex min-h-[45vh] w-full max-w-7xl items-center justify-center px-4 sm:px-6 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="rounded-2xl border border-[#c19a6b]/30 bg-black/40 px-6 py-4 text-sm tracking-[0.12em] text-[#e6c47d]">
        LOADING
      </div>
    </div>
  );
}

function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    const seoPath = SEO_BY_PATH[location.pathname] ? location.pathname : "/404";
    const seo = SEO_BY_PATH[seoPath];
    const canonicalUrl = getCanonicalUrl(seoPath);
    const ogImageUrl = toAbsoluteUrl(seo.ogImage);

    document.title = seo.title;
    applyMetaTag('meta[name="description"]', { name: "description", content: seo.description });
    applyMetaTag('meta[name="robots"]', { name: "robots", content: seo.robots });
    applyMetaTag('meta[property="og:title"]', { property: "og:title", content: seo.title });
    applyMetaTag('meta[property="og:description"]', { property: "og:description", content: seo.description });
    applyMetaTag('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    applyMetaTag('meta[property="og:image"]', { property: "og:image", content: ogImageUrl });
    applyMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    applyMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
    applyMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: ogImageUrl });

    let canonicalTag = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    const schemas = buildSchemas(seoPath, seo, canonicalUrl);
    schemas.forEach((schema, index) => {
      upsertJsonLdScript(`route-seo-schema-${index}`, schema);
    });
    for (let index = schemas.length; index < MAX_JSON_LD_SCRIPTS; index += 1) {
      removeJsonLdScript(`route-seo-schema-${index}`);
    }

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
      <Suspense fallback={<RouteLoading />}>
        <Routes location={displayLocation}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
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
