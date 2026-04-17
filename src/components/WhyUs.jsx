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
    <section id="why-us" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
        <div className="mb-12 max-w-3xl space-y-4">
          <div className={sectionTitle}>Why Contractors Work With Us</div>
          <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
            {summary
              ? "Why teams choose us for commercial plaster labour support."
              : "Labour support that reduces pressure without lowering standards."}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shownReasons.map((item) => (
            <div key={item} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6">
              <div className="mb-4 h-1.5 w-12 rounded-full bg-[#c9a35d]" />
              <div className="text-base leading-7 text-white/85">{item}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#c9a35d]/20 bg-[#c9a35d]/10 p-6 text-white/85 sm:p-8">
          <p className="text-base leading-7 sm:text-lg sm:leading-8">
            {summary
              ? "Commercial-only focus, scalable crews, and invoice-based labour support for changing project demand."
              : "Hourly-rate labour support. Weekly invoicing. No need to carry permanent plaster employment costs when workforce demand changes from site to site."}
          </p>
        </div>
      </div>
    </section>
  );
}
