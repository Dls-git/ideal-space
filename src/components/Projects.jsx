export default function Projects() {
  const projects = [
    "555 Collins St, Melbourne CBD",
    "664 Collins St, Docklands",
    "505 Little Collins St, Melbourne CBD",
    "412 St Kilda Rd, St Kilda",
    "Victoria University",
    "RMIT University",
    "Footscray Hospital",
    "Sandringham Hospital",
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";

  return (
    <section id="projects" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
        <div className="mb-12 max-w-3xl space-y-4">
          <div className={sectionTitle}>Selected Project Experience</div>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            A portfolio aligned with commercial interiors and institutional environments.
          </h1>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <div key={project} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5 sm:p-6">
              <div className="mb-3 text-sm uppercase tracking-[0.2em] text-[#c9a35d]">Project</div>
              <div className="text-lg leading-7 text-white/85">{project}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
