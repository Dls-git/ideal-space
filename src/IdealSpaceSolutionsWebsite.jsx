import { useState } from "react";
import heroImage from "./assets/hero.png";

export default function IdealSpaceSolutionsWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#why-us", label: "Why Us" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  const stats = [
    { value: "30+", label: "Experienced plaster workers available" },
    { value: "Commercial", label: "Interior fit-out focus only" },
    { value: "Flexible", label: "Crew scaling when required" },
  ];

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

  const reasons = [
    "Reliable team with steady site attendance",
    "Fast turnaround and flexible manpower scaling",
    "Commercial-only focus for interior fit-out environments",
    "Quality workmanship with site-ready, safety-aware crews",
    "Weekly company-to-company invoicing",
    "Reduced payroll and labour management pressure",
  ];

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

  const sectors = [
    "Commercial Offices",
    "Universities",
    "Hospitals",
    "Education Facilities",
    "Government Buildings",
    "High-end Interior Fit-outs",
  ];

  const inquiryFields = [
    { label: "Company Name", type: "text", placeholder: "Your company name" },
    { label: "Contact Person", type: "text", placeholder: "Full name" },
    { label: "Phone", type: "tel", placeholder: "Best contact number" },
    { label: "Email", type: "email", placeholder: "Work email" },
    { label: "Site Location", type: "text", placeholder: "Project address or suburb" },
    { label: "Number of Workers Required", type: "number", placeholder: "e.g. 2" },
    { label: "Start Date", type: "text", placeholder: "MM / DD / YYYY" },
  ];

  const visuals = [
    { title: "Feature Ceiling Works", image: heroImage },
    { title: "Commercial Interior Fit-out", image: heroImage },
    { title: "Partition & Glazing Coordination", image: heroImage },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";
  const cardClass =
    "rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6";

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-10 min-[1700px]:max-w-[92rem]">
          <a href="#top" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c9a35d]/30 bg-[#c9a35d]/10 text-sm font-semibold tracking-[0.28em] text-[#e6c47d] sm:h-12 sm:w-12">
              IS
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold tracking-[0.18em] text-white sm:text-lg sm:tracking-[0.22em]">
                IDEAL SPACE
              </div>
              <div className="truncate text-[11px] tracking-[0.35em] text-white/65 sm:text-xs sm:tracking-[0.45em]">
                SOLUTIONS
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-white/75 xl:flex 2xl:gap-8 min-[1700px]:gap-10">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="touch-target flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 transition hover:bg-white/10 xl:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="space-y-1.5">
              <div
                className={`h-0.5 w-5 bg-white transition ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <div className={`h-0.5 w-5 bg-white transition ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <div
                className={`h-0.5 w-5 bg-white transition ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-black/95 backdrop-blur xl:hidden">
            <nav className="grid gap-1 p-4 sm:grid-cols-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="touch-target rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

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

      <section id="why-us" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
          <div className="mb-12 max-w-3xl space-y-4">
            <div className={sectionTitle}>Why Contractors Work With Us</div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              Labour support that reduces pressure without lowering standards.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {reasons.map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6">
                <div className="mb-4 h-1.5 w-12 rounded-full bg-[#c9a35d]" />
                <div className="text-base leading-7 text-white/85">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-[#c9a35d]/20 bg-[#c9a35d]/10 p-6 text-white/85 sm:p-8">
            <p className="text-base leading-7 sm:text-lg sm:leading-8">
              Hourly-rate labour support. Weekly invoicing. No need to carry permanent plaster employment costs when workforce demand changes from site to site.
            </p>
          </div>
        </div>
      </section>

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

      <section id="projects" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
          <div className="mb-12 max-w-3xl space-y-4">
            <div className={sectionTitle}>Selected Project Experience</div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              A portfolio aligned with commercial interiors and institutional environments.
            </h2>
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

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
        <div className="grid gap-6 rounded-[2rem] border border-[#c9a35d]/20 bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-5 sm:gap-8 sm:p-8 md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:p-14 min-[1700px]:gap-12">
          <div className="space-y-5">
            <div className={sectionTitle}>Contact</div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              Need reliable plaster manpower for your next project?
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Contact Ideal Space Solutions directly, or submit a short manpower inquiry. The form is intentionally minimal so contractors can send the essential information fast.
            </p>

            <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-black/30 p-6 sm:p-8">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Phone</div>
                <a href="tel:0434082628" className="mt-2 block text-2xl font-medium text-white">
                  0434 082 628
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Email</div>
                <a href="mailto:hello@idealspace.au" className="mt-2 block break-all text-xl text-white sm:break-normal">
                  hello@idealspace.au
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Service Area</div>
                <div className="mt-2 text-xl text-white">Melbourne</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.25em] text-[#c9a35d]">Quick Inquiry</div>
              <p className="mt-3 text-white/70">
                Company name, contact details, site location, worker numbers, and start date. Nothing unnecessary.
              </p>
            </div>

            <form className="grid gap-4 md:grid-cols-2">
              {inquiryFields.map((field, index) => (
                <div key={field.label} className={index === inquiryFields.length - 1 ? "md:col-span-2" : ""}>
                  <label className="mb-2 block text-sm uppercase tracking-[0.15em] text-white/55">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a35d]/50"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="w-full rounded-2xl bg-[#c9a35d] px-6 py-3.5 font-medium text-black transition hover:opacity-90"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-center sm:px-6 sm:py-10 xl:grid-cols-[1fr_auto] xl:px-10 xl:text-left min-[1700px]:max-w-[92rem]">
          <div className="flex items-center justify-center gap-4 xl:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#c9a35d]/30 bg-[#c9a35d]/10 text-xs font-semibold tracking-[0.28em] text-[#e6c47d] sm:h-12 sm:w-12 sm:text-sm">
              IS
            </div>
            <div>
              <div className="text-base font-semibold tracking-[0.18em] text-white sm:text-lg sm:tracking-[0.22em]">
                IDEAL SPACE
              </div>
              <div className="text-[11px] tracking-[0.35em] text-white/65 sm:text-xs sm:tracking-[0.45em]">
                SOLUTIONS
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-white/60 xl:text-right">
            <div>Commercial fit-out plaster labour support in Melbourne</div>
            <div>0434 082 628 | hello@idealspace.au | idealspace.au</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
