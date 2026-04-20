import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectCategories, projectsData } from "../data/projectsData";

export default function Visuals({ view = "projects" }) {
  const MotionDiv = motion.div;
  const isHome = view === "home";
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const featuredProjects = useMemo(() => projectsData.slice(0, 3), []);
  const visibleProjects = useMemo(() => {
    if (isHome) return featuredProjects;
    if (activeCategory === "All") return projectsData;
    return projectsData.filter((item) => item.category === activeCategory);
  }, [activeCategory, featuredProjects, isHome]);

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c19a6b] sm:text-sm sm:tracking-[0.3em]";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className={sectionTitle}>{isHome ? "Featured Visuals" : "Project Archive"}</div>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">SELECTED WORKS</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
          {isHome
            ? "A curated snapshot of commercial fit-out execution, from large public volumes to technical ceiling and partition details."
            : "Browse our complete portfolio by sector to review interior delivery quality, detailing standards, and project execution breadth."}
        </p>
      </div>

      {!isHome && (
        <div className="mb-8 flex flex-wrap gap-2.5">
          {projectCategories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition sm:text-sm ${
                  selected
                    ? "border-[#c19a6b] bg-[#c19a6b]/15 text-[#c19a6b]"
                    : "border-white/10 bg-transparent text-white/75 hover:border-white/30 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {isHome ? (
        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {visibleProjects.map((item, index) => {
            const layoutClass =
              index === 0 ? "lg:col-span-2 lg:row-span-2" : index === 1 ? "lg:col-start-3 lg:row-start-1" : "lg:col-start-3 lg:row-start-2";
            const ratioClass = index === 0 ? "aspect-[16/10] lg:aspect-auto" : "aspect-[4/3]";

            return (
              <MotionDiv
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 ${layoutClass} cursor-pointer`}
                onClick={() => navigate("/projects")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate("/projects");
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full w-full ${ratioClass}`}
                >
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
                </MotionDiv>

                <div className="pointer-events-none absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-7">
                  <div className="text-lg font-medium text-white sm:text-xl">{item.title}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c19a6b] sm:text-sm">View Case</div>
                </div>
              </MotionDiv>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((item, index) => (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40"
            >
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/3] w-full"
              >
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
              </MotionDiv>

              <div className="pointer-events-none absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="text-base font-medium text-white sm:text-lg">{item.title}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c19a6b]">{item.category}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-[#c19a6b] sm:text-sm">View Case</div>
              </div>

              <div className="space-y-3 p-5">
                <div className="text-lg font-medium text-white">{item.title}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#c19a6b]">{item.category}</div>
                <p className="text-sm leading-6 text-white/70">{item.description}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      )}
    </section>
  );
}
