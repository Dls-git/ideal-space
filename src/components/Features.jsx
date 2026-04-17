const featureItems = [
  { value: "Commercial", label: "Interior fit-out specialists" },
  { value: "Reliable", label: "Dependable labour response" },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 xl:px-10 min-[1700px]:max-w-[92rem]">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {featureItems.map((item) => (
          <div
            key={item.value}
            className="rounded-3xl border border-[#c19a6b]/30 bg-black/45 px-6 py-5 backdrop-blur-md"
          >
            <div className="text-[1.85rem] font-semibold leading-none text-[#c19a6b] sm:text-3xl">
              {item.value}
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
