export default function Contact() {
  const inquiryFields = [
    { label: "Company Name", type: "text", placeholder: "Your company name" },
    { label: "Contact Person", type: "text", placeholder: "Full name" },
    { label: "Phone", type: "tel", placeholder: "Best contact number" },
    { label: "Email", type: "email", placeholder: "Work email" },
    { label: "Site Location", type: "text", placeholder: "Project address or suburb" },
    { label: "Number of Workers Required", type: "number", placeholder: "e.g. 2" },
    { label: "Start Date", type: "text", placeholder: "MM / DD / YYYY" },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";

  return (
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
  );
}