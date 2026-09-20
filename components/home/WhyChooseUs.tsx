import Image from "next/image";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { HomeWhyChooseUs } from "@/types/content";

export function WhyChooseUs({ section }: { section: HomeWhyChooseUs }) {
  const image = resolveMediaUrl(section.image);
  const advantages = (section.advantages ?? []).slice(0, 4);

  return <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#f7fafc_0%,#eef5f8_52%,#f8fbfc_100%)] py-16 sm:py-20 lg:py-24" aria-label={section.title}>
    <div aria-hidden="true" className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />
    <div aria-hidden="true" className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
    <div className="relative mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_80px_rgba(15,45,70,0.14)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
      <div className="group relative min-h-[420px] overflow-hidden bg-brand-ink sm:min-h-[540px] lg:min-h-[700px]">
        {image ? <Image src={image} alt={section.imageAlt ?? section.image?.alternativeText ?? section.title} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" /> : null}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(5,30,50,0.02)_42%,rgba(5,30,50,0.28)_100%)]" />
        <div className="pointer-events-none absolute inset-5 rounded-[1.4rem] border border-white/25 sm:inset-7" />
      </div>
      <div className="flex flex-col px-6 py-12 sm:px-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16">
        <header className="relative max-w-2xl border-l-4 border-brand-teal pl-6">
          <h2 className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl xl:text-5xl">{section.title}</h2>
          {section.subtitle ? <p className="mt-4 text-base leading-7 text-brand-muted sm:text-lg">{section.subtitle}</p> : null}
        </header>
        {advantages.length ? <div className="mt-10 grid flex-1 gap-4 sm:grid-cols-2 lg:mt-12 xl:gap-5">
          {advantages.map((advantage, index) => {
            const icon = resolveMediaUrl(advantage.icon);
            return <article key={advantage.id ?? `${advantage.title}-${index}`} className="group relative flex min-h-52 flex-col justify-center overflow-hidden rounded-2xl border border-brand-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(244,249,251,0.92))] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-teal/50 hover:shadow-[0_16px_35px_rgba(15,75,100,0.12)] sm:p-7 xl:min-h-56 xl:p-8">
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-2 text-6xl font-semibold leading-none text-brand-blue/[0.055]">{String(index + 1).padStart(2, "0")}</span>
              {icon ? <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-blue/8 transition duration-300 group-hover:bg-brand-blue/12"><div className="relative h-8 w-8"><Image src={icon} alt={advantage.iconAlt ?? advantage.icon?.alternativeText ?? ""} fill sizes="32px" className="object-contain" /></div></div> : null}
              <h3 className="relative mt-5 text-lg font-semibold text-brand-ink xl:text-xl">{advantage.title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-brand-muted">{advantage.description}</p>
            </article>;
          })}
        </div> : null}
      </div>
      </div>
    </div>
  </section>;
}
