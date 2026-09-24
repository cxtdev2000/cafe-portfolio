import { about, contact, projects, shop, type SectionId } from "@/content/portfolio";

/** Renders the HTML body for a café section. Content comes from src/content/portfolio.ts. */
export function SectionContent({ id }: { id: SectionId }) {
  if (id === "about") {
    return (
      <>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-espresso/80">
            {paragraph}
          </p>
        ))}
        <ul className="flex flex-wrap gap-2 pt-2">
          {about.skills.map((skill) => (
            <li key={skill} className="rounded-full bg-latte/60 px-3 py-1 text-sm text-espresso">
              {skill}
            </li>
          ))}
        </ul>
        <h3 className="pt-4 font-display text-xl text-espresso">{about.experienceTitle}</h3>
        <ol className="space-y-3 border-l border-espresso/15 pl-4">
          {about.experience.map((job) => (
            <li key={job.company} className="relative">
              <span className="absolute top-1.5 -left-[1.3rem] h-2 w-2 rounded-full bg-caramel" aria-hidden />
              <p className="font-medium text-espresso">{job.company}</p>
              <p className="text-sm text-espresso/70">
                {job.title} · {job.period}
              </p>
            </li>
          ))}
        </ol>
        <h3 className="pt-4 font-display text-xl text-espresso">{about.educationTitle}</h3>
        <div>
          <p className="font-medium text-espresso">{about.education.school}</p>
          <p className="text-sm text-espresso/70">
            {about.education.degree} · {about.education.period}
          </p>
        </div>
      </>
    );
  }

  if (id === "projects") {
    return (
      <ul className="space-y-4">
        {projects.items.map((project) => (
          <li key={project.name} className="rounded-2xl border border-espresso/10 bg-white/60 p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-lg text-espresso">{project.name}</h3>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-caramel underline-offset-4 hover:underline"
                >
                  Xem →
                </a>
              )}
            </div>
            <p className="mt-0.5 text-xs text-caramel">{project.meta}</p>
            <p className="mt-2 text-sm leading-relaxed text-espresso/75">{project.description}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-latte/60 px-2.5 py-0.5 text-xs text-espresso">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  if (id === "shop") {
    return (
      <>
        <p className="leading-relaxed text-espresso/80">{shop.intro}</p>
        <ul className="grid gap-3 pt-2">
          {shop.aisles.map((aisle) => (
            <li key={aisle.name} className="flex items-start gap-3 rounded-2xl border border-espresso/10 bg-white/60 p-4">
              <span className="text-2xl leading-none" aria-hidden>
                {aisle.icon}
              </span>
              <div>
                <p className="font-medium text-espresso">{aisle.name}</p>
                <p className="text-sm text-espresso/70">{aisle.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="pt-4 font-display text-xl text-espresso">{shop.promisesTitle}</h3>
        <ul className="space-y-2">
          {shop.promises.map((promise) => (
            <li key={promise} className="flex gap-2 text-sm leading-relaxed text-espresso/80">
              <span className="text-caramel" aria-hidden>
                ✓
              </span>
              {promise}
            </li>
          ))}
        </ul>
        <a
          href={shop.cta.href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-caramel px-5 py-3 font-medium text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-espresso"
        >
          {shop.cta.label} →
        </a>
      </>
    );
  }

  return (
    <>
      <p className="leading-relaxed text-espresso/80">{contact.intro}</p>
      <ul className="space-y-3 pt-2">
        {contact.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-espresso/10 bg-white/60 px-4 py-3 transition hover:border-caramel"
            >
              <span className="text-sm text-espresso/60">{link.label}</span>
              <span className="text-espresso">{link.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
