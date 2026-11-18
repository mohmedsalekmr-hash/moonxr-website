"use client";

/** Opens the interactive 3D headset in the hero. */
export default function ExploreButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("mx-explore"))} className="btn btn-ghost">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky" />
      </span>
      {label}
    </button>
  );
}
