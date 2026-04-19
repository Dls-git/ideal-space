export default function WhyUs({ summary = false }) {
  const reasons = [
    "Reliable team with steady site attendance",
    "Fast turnaround and flexible manpower scaling",
    "Commercial-only focus for interior fit-out environments",
    "Quality workmanship with site-ready, safety-aware crews",
    "Weekly company-to-company invoicing",
    "Reduced payroll and labour management pressure",
  ];
  const shownReasons = summary ? reasons.slice(0, 3) : reasons;

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";

  return (
    <section id="why-us" className="border-y border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
        <div className="mb-12 max-w-4xl space-y-4">
          <div className={sectionTitle}>Why Contractors Work With Us</div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            {summary
              ? "Why teams choose us for commercial plaster labour support."
              : "Labour support that reduces pressure without lowering standards."}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shownReasons.map((item, index) => (
            <div key={item} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#090909] p-8">
              <span className="pointer-events-none absolute right-5 top-3 text-7xl font-semibold leading-none text-white/[0.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mb-7 h-[2px] w-10 bg-[#c9a35d]" />
              <div className="max-w-[16ch] text-3xl leading-[1.15] tracking-tight text-white md:text-[2rem]">{item}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#060606] p-6 sm:p-7">
          <p className="text-lg italic leading-8 text-white/80 sm:text-[1.375rem]">
            <span className="mr-4 align-middle text-[#c9a35d]">•</span>
            {summary
              ? "Commercial-only focus, scalable crews, and invoice-based labour support for changing project demand."
              : "Hourly-rate labour support. Weekly invoicing. No need to carry permanent plaster employment costs when workforce demand changes from site to site."}
          </p>
        </div>
      </div>
    </section>
  );
}
