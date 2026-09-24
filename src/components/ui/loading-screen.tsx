"use client";

type LoadingScreenProps = {
  ready: boolean;
  started: boolean;
  onStart: () => void;
};

/** Intro overlay: a steaming cup while WebGL boots, then the "Vào quán" button. Fades out after start. */
export function LoadingScreen({ ready, started, onStart }: LoadingScreenProps) {
  return (
    <div
      aria-hidden={started}
      className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-espresso transition-opacity duration-1000 ${
        started ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex h-24 w-24 items-end justify-center" aria-hidden>
        <span className="loader-steam left-7" />
        <span className="loader-steam left-11 [animation-delay:0.5s]" />
        <span className="loader-steam left-15 [animation-delay:1s]" />
        <span className="h-12 w-16 rounded-b-[1.75rem] bg-cream" />
        <span className="absolute bottom-3 -right-1 h-6 w-5 rounded-r-full border-4 border-l-0 border-cream" />
      </div>

      <div className="h-14">
        {ready ? (
          <button
            type="button"
            onClick={onStart}
            className="animate-fade-in rounded-full border border-cream/40 px-10 py-3 font-display text-xl tracking-[0.3em] text-cream uppercase transition hover:bg-cream hover:text-espresso"
          >
            Vào quán
          </button>
        ) : (
          <p className="font-display text-lg tracking-widest text-cream/70">Đang pha cà phê…</p>
        )}
      </div>
    </div>
  );
}
