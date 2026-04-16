export default function Experience() {
  const sectors = [
    "Commercial Offices",
    "Universities",
    "Hospitals",
    "Education Facilities",
    "Government Buildings",
    "High-end Interior Fit-outs",
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] min-[1700px]:gap-12">
        <div className="space-y-4">
          <div className={sectionTitle}>Experience</div>
          <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
            Used to high-standard commercial environments.
          </h2>
          <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Your positioning should show familiarity with quality-controlled sites, trade coordination, and demanding finish expectations. That is what distinguishes you from a generic plastering business.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectors.map((sector) => (
            <div key={sector} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-lg text-white/85 sm:p-6">
              {sector}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}