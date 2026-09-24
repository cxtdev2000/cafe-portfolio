"use client";

import { about, contact, projects, type SectionId } from "@/content/portfolio";
import { SectionContent } from "./section-content";

const titles: Record<SectionId, string> = {
  about: about.title,
  projects: projects.title,
  contact: contact.title,
};

type SectionPanelProps = {
  section: SectionId | null;
  onClose: () => void;
};

/** Slide-in content card (right side on desktop, bottom sheet on mobile). */
export function SectionPanel({ section, onClose }: SectionPanelProps) {
  const open = section !== null;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed inset-x-3 bottom-3 z-20 max-h-[60vh] overflow-y-auto rounded-3xl bg-cream/95 p-6 shadow-2xl backdrop-blur transition-all duration-700 md:inset-x-auto md:top-24 md:right-8 md:bottom-8 md:max-h-none md:w-[420px] md:p-8 ${
        open ? "translate-y-0 opacity-100 md:translate-x-0" : "pointer-events-none translate-y-8 opacity-0 md:translate-x-8 md:translate-y-0"
      }`}
    >
      {section && (
        <div key={section} className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl text-espresso">{titles[section]}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Quay lại quán"
              className="rounded-full px-3 py-1 text-sm text-espresso/60 transition hover:bg-espresso/10 hover:text-espresso"
            >
              ✕ Đóng
            </button>
          </div>
          <SectionContent id={section} />
        </div>
      )}
    </aside>
  );
}
