export default function Services() {
  const services = [
    {
      title: "Commercial Fit-out Plastering Subcontractor",
      text: "Flexible labour support for commercial interiors contractors needing reliable plaster crews on active fit-out projects.",
      image: "/service-commercial-fitout.png",
      imageAlt: "Commercial interior fit-out plastering work area with structured installation workflow",
    },
    {
      title: "Suspended Ceilings",
      text: "Support for suspended ceiling installation in commercial interior environments with programme and coordination pressure.",
      image: "/service-suspended-ceilings.png",
      imageAlt: "Suspended ceiling framework installation in a premium commercial corridor",
    },
    {
      title: "Partition Walls",
      text: "Labour capability for partition wall installation across offices, education, healthcare, and mixed-use fit-outs.",
      image: "/service-partition-walls.png",
      imageAlt: "Partition wall framing and plasterboard setup across commercial interior zones",
    },
    {
      title: "Fire-rated Systems",
      text: "Experienced support for fire-rated plasterboard systems where specification compliance and finish quality matter.",
      image: "/service-fire-rated-systems.png",
      imageAlt: "Fire-rated plasterboard wall system assembly with compliance-focused detailing",
    },
    {
      title: "Bulkheads & Feature Ceilings",
      text: "Execution support for curved, stepped, and detailed bulkhead and ceiling elements in premium interior projects.",
      image: "/service-bulkheads-feature-ceilings.png",
      imageAlt: "Curved and stepped bulkheads with feature ceiling construction elements",
    },
    {
      title: "Insulation, Patch & Repair, Defect Rectification",
      text: "Practical labour coverage for final-stage repairs, defect closing, and quality-driven finishing work.",
      image: "/service-insulation-patch-repair.png",
      imageAlt: "Final-stage insulation patch repair and defect rectification in commercial interiors",
    },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";
  const cardClass = "overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]";

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="mb-12 max-w-3xl space-y-4">
        <div className={sectionTitle}>Services</div>
        <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
          Commercial fit-out plastering support, structured for contractors.
        </h1>
        <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
          The site is deliberately positioned around labour subcontracting for commercial interiors. The message is direct: you supply experienced plaster subcontractor where project teams need dependable delivery support.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div key={service.title} className={cardClass}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={service.image}
                alt={service.imageAlt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover brightness-[0.8]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-black/10" />
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-4 h-1.5 w-12 rounded-full bg-[#c9a35d]" />
              <h3 className="text-xl font-medium">{service.title}</h3>
              <p className="mt-3 leading-7 text-white/70">{service.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
