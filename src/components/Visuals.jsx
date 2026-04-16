import heroImage from "../assets/hero.png";

export default function Visuals() {
  const visuals = [
    { title: "Feature Ceiling Works", image: heroImage },
    { title: "Commercial Interior Fit-out", image: heroImage },
    { title: "Partition & Glazing Coordination", image: heroImage },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="mb-12 max-w-3xl space-y-4">
        <div className={sectionTitle}>Visual Direction</div>
        <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
          Brand-consistent commercial imagery placeholders.
        </h2>
        <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
          I have left the site ready for generated visuals. These can later be replaced with real project photography or stronger AI-generated site imagery once you confirm the final art direction.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visuals.map((item) => (
          <div key={item.title} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
            <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover opacity-75" />
            <div className="p-5">
              <div className="text-lg text-white/85">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}