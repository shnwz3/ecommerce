import React from "react";

/**
 * Traditional Indian Royal Lotus Blossom Medallion SVG
 */
export const LotusMedallion: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#DFB873]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Center High Petal */}
    <path d="M12 2C11 6 10 9 12 14C14 9 13 6 12 2Z" />
    {/* Left Inner Petal */}
    <path d="M12 14C9.5 10.5 7 8 5.5 5C6.5 8.5 9 11.5 12 14Z" opacity="0.9" />
    {/* Right Inner Petal */}
    <path d="M12 14C14.5 10.5 17 8 18.5 5C17.5 8.5 15 11.5 12 14Z" opacity="0.9" />
    {/* Left Outer Petal */}
    <path d="M12 14C8 12 4.5 11 2 9.5C4.5 12.5 8 14 12 14Z" opacity="0.8" />
    {/* Right Outer Petal */}
    <path d="M12 14C16 12 19.5 11 22 9.5C19.5 12.5 16 14 12 14Z" opacity="0.8" />
    {/* Pedestal Arch */}
    <path d="M7 16.5C10 15.5 14 15.5 17 16.5C15 18 9 18 7 16.5Z" />
    <circle cx="12" cy="18.5" r="1" />
  </svg>
);

/**
 * Symmetrical Royal Section Divider with Lotus & Filigree Flourishes
 */
export const RoyalDivider: React.FC<{
  title?: string;
  subtitle?: string;
  kicker?: string;
  light?: boolean;
  className?: string;
}> = ({ title, subtitle, kicker, light = false, className = "" }) => (
  <div className={`text-center max-w-2xl mx-auto mb-10 sm:mb-14 ${className}`}>
    {kicker && (
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#C59A4E]/60" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C59A4E]">
          {kicker}
        </span>
        <span className="w-8 h-[1px] bg-[#C59A4E]/60" />
      </div>
    )}

    {title && (
      <h2
        className={`font-serif-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
          light ? "text-[#FCF3ED]" : "text-[#341B09]"
        }`}
      >
        {title}
      </h2>
    )}

    {subtitle && (
      <p
        className={`text-xs sm:text-sm md:text-base mt-2.5 max-w-lg mx-auto ${
          light ? "text-[#FCF3ED]/75 font-light" : "text-[#341B09]/75"
        }`}
      >
        {subtitle}
      </p>
    )}

    {/* Symmetrical Ornamental Filigree Flourish */}
    <div className="flex items-center justify-center gap-3 mt-4">
      <div className="flex items-center gap-1.5">
        <span className={`w-8 sm:w-16 h-[1px] ${light ? "bg-gradient-to-r from-transparent to-[#DFB873]" : "bg-gradient-to-r from-transparent to-[#7B3D14]/50"}`} />
        <span className={`w-1.5 h-1.5 rotate-45 ${light ? "bg-[#DFB873]" : "bg-[#7B3D14]"}`} />
      </div>

      <div className="flex items-center gap-2 text-[#C59A4E]">
        <span className="text-xs">✦</span>
        <LotusMedallion className="w-4 h-4 text-[#C59A4E]" />
        <span className="text-xs">✦</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rotate-45 ${light ? "bg-[#DFB873]" : "bg-[#7B3D14]"}`} />
        <span className={`w-8 sm:w-16 h-[1px] ${light ? "bg-gradient-to-l from-transparent to-[#DFB873]" : "bg-gradient-to-l from-transparent to-[#7B3D14]/50"}`} />
      </div>
    </div>
  </div>
);

/**
 * Ornate Corner Filigree Accent
 */
export const CornerFiligree: React.FC<{
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}> = ({ position, className = "w-8 h-8 text-[#C59A4E]/60" }) => {
  const rotationClass =
    position === "top-left"
      ? ""
      : position === "top-right"
      ? "rotate-90"
      : position === "bottom-right"
      ? "rotate-180"
      : "-rotate-90";

  return (
    <div className={`pointer-events-none absolute ${position === "top-left" ? "top-3 left-3" : position === "top-right" ? "top-3 right-3" : position === "bottom-left" ? "bottom-3 left-3" : "bottom-3 right-3"} ${rotationClass} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M2 38 V12 C2 6.477 6.477 2 12 2 H38" />
        <path d="M6 38 V14 C6 9.582 9.582 6 14 6 H38" opacity="0.6" />
        <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        <path d="M2 2 L10 10" />
      </svg>
    </div>
  );
};

/**
 * Traditional Royal Wax Seal Badge (Silk Mark / Master Loom Authentic)
 */
export const RoyalWaxSeal: React.FC<{ text?: string; subtext?: string; className?: string }> = ({
  text = "SILK MARK",
  subtext = "100% PURE",
  className = "",
}) => (
  <div
    className={`relative inline-flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#8E4718] via-[#7B3D14] to-[#4A0E17] text-[#DFB873] border-2 border-[#DFB873]/60 shadow-lg shadow-black/25 select-none ${className}`}
  >
    <div className="absolute inset-0.5 rounded-full border border-dashed border-[#DFB873]/40" />
    <span className="text-[7px] font-extrabold uppercase tracking-tighter text-[#DFB873] leading-none">
      {text}
    </span>
    <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873] my-0.5" />
    <span className="text-[6px] font-bold uppercase tracking-widest text-[#FCF3ED]/80 leading-none">
      {subtext}
    </span>
  </div>
);
