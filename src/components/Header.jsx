import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoImage from "../assets/logo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
  ];

  const navItemClass = ({ isActive }) =>
    `transition ${isActive ? "text-white" : "text-white/75 hover:text-white"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-10 min-[1700px]:max-w-[92rem]">
        <Link to="/" className="flex min-w-0 items-center gap-3 sm:gap-4" onClick={() => setMobileMenuOpen(false)}>
          <img src={logoImage} alt="Ideal Space Solutions" className="h-14 w-14 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold tracking-[0.18em] text-white sm:text-lg sm:tracking-[0.22em]">
              IDEAL SPACE
            </div>
            <div className="truncate text-[11px] tracking-[0.35em] text-white/65 sm:text-xs sm:tracking-[0.45em]">
              SOLUTIONS
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/75 xl:flex 2xl:gap-8 min-[1700px]:gap-10">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navItemClass}>
              {item.label}
            </NavLink>
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
              <NavLink
                key={item.to}
                to={item.to}
                className="touch-target rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
