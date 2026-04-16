import logoImage from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-center sm:px-6 sm:py-10 xl:grid-cols-[1fr_auto] xl:px-10 xl:text-left min-[1700px]:max-w-[92rem]">
        <div className="flex items-center justify-center gap-4 xl:justify-start">
          <img 
            src={logoImage} 
            alt="Ideal Space Solutions" 
            className="h-14 w-14 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16" 
          />
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
  );
}