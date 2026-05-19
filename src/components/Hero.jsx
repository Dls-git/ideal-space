import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const heroImage = "/hero-home.webp";

export default function Hero({ compact = false }) {
  const MotionH1 = motion.h1;
  const MotionDiv = motion.div;

  const riseIn = {
    hidden: { opacity: 0, y: 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="top" className="relative min-h-[90vh] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Commercial plaster fit-out background"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center brightness-[0.7] contrast-[1.1]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_bottom_right,rgba(201,163,93,0.18),transparent_58%)] xl:block min-[1700px]:w-[38%]" />
      </div>

      <div
        className={`relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:gap-10 sm:px-6 sm:py-16 xl:gap-12 xl:px-10 xl:py-24 min-[1700px]:max-w-[92rem] min-[1700px]:gap-16 ${
          compact
            ? "2xl:grid-cols-1"
            : "2xl:grid-cols-[minmax(0,1.05fr)_minmax(21rem,0.85fr)] 2xl:items-end min-[1700px]:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.78fr)]"
        } min-h-[90vh] items-end`}
      >
        <div className="space-y-6 pb-14 md:space-y-8 md:pb-20 xl:pb-24">
          <div className="inline-flex max-w-full rounded-full border border-[#8a6a45] bg-black/35 px-4 py-2 text-xs tracking-[0.14em] text-[#e6c47d] sm:text-sm sm:tracking-normal">
            Melbourne Commercial Plaster Labour Subcontractor
          </div>

          <div className="space-y-3 sm:space-y-4">
            <MotionH1
              variants={riseIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-4xl text-[clamp(2.65rem,7vw,5.85rem)] font-bold leading-tight tracking-tighter min-[1700px]:max-w-[11ch] min-[1700px]:text-[clamp(5rem,5vw,6.6rem)]"
            >
              Reliable plaster subcontractor for your commercial project.
            </MotionH1>
            <p className="max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
              Precision plaster Subcontractor for premium commercial interiors.
            </p>
          </div>

          <MotionDiv
            variants={riseIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:gap-6"
          >
            <Link
              to="/contact"
              className="rounded-2xl bg-[#c19a6b] px-6 py-3.5 text-center font-medium text-black transition hover:brightness-95 sm:min-w-[14rem]"
            >
              Contact Us
            </Link>
            <Link
              to="/projects"
              className="rounded-2xl border border-white bg-transparent px-6 py-3.5 text-center font-medium text-white transition hover:bg-white/10 sm:min-w-[16rem]"
            >
              View Projects
            </Link>
          </MotionDiv>
        </div>

        {!compact && (
          <div className="max-w-2xl self-end rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur sm:p-8 2xl:ml-auto">
            <div className="mb-5 text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:mb-6 sm:text-sm sm:tracking-[0.25em]">
              Why This Works
            </div>
            <div className="space-y-4 text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              <p>Built for interiors contractors that need labour support, not general retail traffic.</p>
              <p>Positioned around reliability, subcontractor flexibility, and commercial site familiarity.</p>
              <p>Structured to convert fast: clear offer, strong project references, direct contact path.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
