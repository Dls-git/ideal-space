import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="w-full rounded-[2rem] border border-[#c9a35d]/25 bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-8 text-center sm:p-12">
        <p className="text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]">404</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">Page Not Found</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-[#c19a6b] px-6 py-3.5 text-center font-medium text-black transition hover:brightness-95"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
