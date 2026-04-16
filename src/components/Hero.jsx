import heroImage from "../assets/hero.png";

export default function Hero() {
  const stats = [
    { value: "30+", label: "Experienced plaster workers available" },
    { value: "Commercial", label: "Interior fit-out focus only" },
    { value: "Flexible", label: "Crew scaling when required" },
  ];

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Commercial plaster fit-out background"
          className="h-full w-full object-cover object-center opacity-18"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/65" />
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_bottom_right,rgba(201,163,93,0.18),transparent_58%)] xl:block min-[1700px]:w-[38%]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:gap-10 sm:px-6 sm:py-16 xl:gap-12 xl:px-10 xl:py-24 2xl:grid-cols-[minmax(0,1.05fr)_minmax(21rem,0.85fr)] 2xl:items-end min-[1700px]:max-w-[92rem] min-[1700px]:gap-16 min-[1700px]:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.78fr)]">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-flex max-w-full rounded-full border border-[#c9a35d]/40 bg-[#c9a35d]/10 px-4 py-2 text-xs tracking-[0.14em] text-[#e6c47d] sm:text-sm sm:tracking-normal">
            Melbourne Commercial Plaster Labour Subcontractor
          </div>

          <div className="space-y-4 sm:space-y-5">
            <h1 className="max-w-4xl text-[clamp(2.65rem,7vw,5.85rem)] font-semibold leading-[1.04] tracking-[-0.03em] min-[1700px]:max-w-[11ch] min-[1700px]:text-[clamp(5rem,5vw,6.6rem)]">
              Reliable plaster manpower for commercial interiors contractors.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Ideal Space Solutions provides professional plaster labour support for commercial fit-out projects across Melbourne. We help interiors contractors and project managers maintain programme momentum with dependable crews, flexible manpower, and quality-focused site execution.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#contact"
              className="rounded-2xl bg-[#c9a35d] px-6 py-3.5 text-center font-medium text-black transition hover:opacity-90 sm:min-w-[14rem]"
            >
              Request Manpower
            </a>
            <a
              href="#projects"
              className="rounded-2xl border border-white/15 px-6 py-3.5 text-center font-medium text-white transition hover:border-white/35 sm:min-w-[16rem]"
            >
              View Project Experience
            </a>
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-2 2xl:grid-cols-3 min-[1700px]:gap-5">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-[1.85rem] font-semibold text-[#c9a35d] sm:text-3xl">{item.value}</div>
                <div className="mt-2 text-sm leading-6 text-white/70">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl self-end rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur sm:p-8 2xl:ml-auto">
          <div className="mb-5 text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:mb-6 sm:text-sm sm:tracking-[0.25em]">
            Why This Works
          </div>
          <div className="space-y-4 text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            <p>Built for interiors contractors that need labour support, not general retail traffic.</p>
            <p>Positioned around reliability, manpower flexibility, and commercial site familiarity.</p>
            <p>Structured to convert fast: clear offer, strong project references, direct contact path.</p>
          </div>
        </div>
      </div>
    </section>
  );
}