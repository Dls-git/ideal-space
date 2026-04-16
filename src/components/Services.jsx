export default function Services() {
  const services = [
    {
      title: "Commercial Fit-out Plastering Manpower",
      text: "Flexible labour support for commercial interiors contractors needing reliable plaster crews on active fit-out projects.",
    },
    {
      title: "Suspended Ceilings",
      text: "Support for suspended ceiling installation in commercial interior environments with programme and coordination pressure.",
    },
    {
      title: "Partition Walls",
      text: "Labour capability for partition wall installation across offices, education, healthcare, and mixed-use fit-outs.",
    },
    {
      title: "Fire-rated Systems",
      text: "Experienced support for fire-rated plasterboard systems where specification compliance and finish quality matter.",
    },
    {
      title: "Bulkheads & Feature Ceilings",
      text: "Execution support for curved, stepped, and detailed bulkhead and ceiling elements in premium interior projects.",
    },
    {
      title: "Insulation, Patch & Repair, Defect Rectification",
      text: "Practical labour coverage for final-stage repairs, defect closing, and quality-driven finishing work.",
    },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";
  const cardClass = "rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6";

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="mb-12 max-w-3xl space-y-4">
        <div className={sectionTitle}>Services</div>
        <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
          Commercial fit-out plastering support, structured for contractors.
        </h2>
        <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
          The site is deliberately positioned around labour subcontracting for commercial interiors. The message is direct: you supply experienced plaster manpower where project teams need dependable delivery support.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div key={service.title} className={cardClass}>
            <div className="mb-4 h-1.5 w-12 rounded-full bg-[#c9a35d]" />
            <h3 className="text-xl font-medium">{service.title}</h3>
            <p className="mt-3 leading-7 text-white/70">{service.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}