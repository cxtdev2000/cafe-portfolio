"use client";

import { about, contact, profile, projects, shop, type SectionId } from "@/content/portfolio";

const navItems: { id: SectionId; label: string }[] = [
  { id: "about", label: about.title },
  { id: "projects", label: projects.title },
  { id: "shop", label: shop.title },
  { id: "contact", label: contact.title },
];

type SiteNavProps = {
  visible: boolean;
  active: SectionId | null;
  onSelect: (id: SectionId) => void;
  onHome: () => void;
};

/** Top bar: café name returns to overview, links jump straight to a section. */
export function SiteNav({ visible, active, onSelect, onHome }: SiteNavProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-opacity delay-700 duration-700 md:px-8 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button type="button" onClick={onHome} className="text-left">
        <span className="block font-display text-xl text-cream md:text-2xl">{profile.cafeName}</span>
        <span className="block text-xs tracking-wider text-cream/60">
          {profile.name} · {profile.role}
        </span>
      </button>
      <nav className="flex gap-1 rounded-full bg-espresso/60 p-1 backdrop-blur">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active === item.id ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] sm:px-3 sm:text-sm transition md:px-4 ${
              active === item.id ? "bg-cream text-espresso" : "text-cream/80 hover:text-cream"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
