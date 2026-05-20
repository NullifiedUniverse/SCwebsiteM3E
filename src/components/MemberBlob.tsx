import React, { useState, useEffect, useMemo, useId } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { DEPTS } from "../data/cms";
import { Code, Star } from "lucide-react";
import { getPath, M3E_SPATIAL, M3E_EFFECTS, M3E_FAST } from "../utils/physics";

const getAlphaColor = (hex: string, alpha: number) => {
  if (hex && hex.startsWith("#")) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

export const MemberBlob = React.memo(({ member, activeItem, onClick, darkMode, lang, index, rootRef, closingItemId }: any) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Unique SVG ID per instance — fixes the shared gradient bug
  // where #glass-gradient bleeds across multiple mounted blobs
  const uid = useId().replace(/:/g, "_");

  const theme = DEPTS[member.dept];
  const isAndrew = member.name.includes("Andrew");
  const isLeader = member.role.EN.includes("Dir") || member.role.EN.includes("President") || member.role.EN.includes("Pres");

  const handleInteraction = () => {
    onClick(member);
  };

  const bgColor = isAndrew
    ? (darkMode ? "#082f49" : "#0284c7")
    : (darkMode ? theme.dark : theme.light);
  const textColor = isAndrew
    ? (darkMode ? "#e0f2fe" : "#ffffff")
    : (darkMode ? theme.textDark : theme.textLight);

  const isExpanded = activeItem?.id === member.id;
  const imageUrl = member.image;

  // Symmetrical static path with dynamic rotation
  const staticPath = useMemo(() => getPath(theme.shape, 100, 100, 0), [theme.shape]);

  return (
    <motion.div
      tabIndex={0}
      role="button"
      aria-label={`View details for ${member.name}, ${member.role.EN}`}
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInteraction(); } }}
      initial={{ opacity: 0, x: 28, filter: "blur(4px)", scale: 0.82 }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ root: rootRef, margin: "0px -48px", once: true }}
      transition={M3E_SPATIAL}
      className={`flex flex-col items-center gap-4 shrink-0 group relative w-60 outline-none cursor-pointer`}
      animate={{ zIndex: (isExpanded || closingItemId === member.id) ? 100 : (isAndrew ? 20 : 1) }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -10,
        scale: 1.04
      }}
      whileTap={{ scale: 0.94, y: 0 }}
      onClick={handleInteraction}
    >
      <motion.div
        layoutId={`card-${member.id}`}
        className="relative flex items-center justify-center w-[200px] h-[200px]"
        style={{
          borderRadius: 100,
          backgroundColor: getAlphaColor(bgColor, 0),
        }}
        transition={M3E_SPATIAL}
      >
        {/* Andrew animated border ring */}
        {isAndrew && (
          <motion.div
            layout
            animate={{
              rotate: 360,
              opacity: isExpanded ? 0 : 0.6
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              opacity: M3E_EFFECTS
            }}
            className="absolute -inset-2 border-[3px] border-cyan-400 border-dashed pointer-events-none group-hover:scale-110 transition-transform duration-500"
            style={{ borderRadius: 80, filter: 'drop-shadow(0 0 15px rgba(34,211,238,0.8))' }}
          />
        )}

        <motion.div
          layout
          animate={{ opacity: isExpanded ? 0 : 1 }}
          transition={M3E_EFFECTS}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full overflow-visible"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {/* Unique gradient IDs per instance — prevents bleed across siblings */}
              <linearGradient id={`glass-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.75" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
              <clipPath id={`clip-img-${uid}`}>
                <motion.path
                  d={staticPath}
                  style={{ transformOrigin: "50px 50px" }}
                  animate={{ rotate: 360, scale: hovered ? 1.05 : 1 }}
                  transition={{
                    rotate: { repeat: Infinity, duration: hovered ? 8 : 16 + (member.seed % 5), ease: "linear" },
                    scale: M3E_EFFECTS,
                  }}
                />
              </clipPath>
            </defs>

            {/* Blob fill */}
            <motion.path
              fill={bgColor}
              d={staticPath}
              style={{ transformOrigin: "50px 50px" }}
              animate={{ rotate: 360, scale: hovered ? 1.05 : 1 }}
              transition={{
                rotate: { repeat: Infinity, duration: hovered ? 8 : 16 + (member.seed % 5), ease: "linear" },
                scale: M3E_EFFECTS,
              }}
            />

            {/* Glass sheen on hover — effects transition, no bounce */}
            <motion.path
              fill={`url(#glass-grad-${uid})`}
              d={staticPath}
              className="mix-blend-overlay"
              style={{ transformOrigin: "50px 50px" }}
              animate={{
                opacity: hovered ? 0.28 : 0,
                rotate: 360,
                scale: hovered ? 1.05 : 1
              }}
              transition={{
                opacity: M3E_EFFECTS,
                rotate: { repeat: Infinity, duration: hovered ? 8 : 16 + (member.seed % 5), ease: "linear" },
                scale: M3E_EFFECTS,
              }}
            />

            {/* Member image */}
            {imageUrl && !imgFailed && (
              <g transform="translate(4, 4) scale(0.92)" clipPath={`url(#clip-img-${uid})`}>
                <motion.image
                  animate={{ scale: hovered ? 1.04 : 1, x: hovered ? -2 : 0, y: hovered ? -2 : 0 }}
                  transition={M3E_EFFECTS}
                  href={encodeURI(imageUrl)}
                  x="0" y="0" width="100" height="100"
                  preserveAspectRatio="xMidYMid slice"
                  onError={() => setImgFailed(true)}
                  // @ts-ignore
                  loading="lazy"
                />
                {/* Image sheen */}
                <motion.rect
                  x="0" y="0" width="100" height="100"
                  fill={`url(#glass-grad-${uid})`}
                  clipPath={`url(#clip-img-${uid})`}
                  className="mix-blend-overlay"
                  animate={{ opacity: hovered ? 1 : 0 }}
                  transition={M3E_EFFECTS}
                />
              </g>
            )}
          </svg>

          {/* Fallback initial */}
          <span
            className="absolute font-black text-3xl z-10"
            style={{ color: textColor, display: (imageUrl && !imgFailed) ? 'none' : 'block' }}
          >
            {member.name.charAt(0)}
          </span>
        </motion.div>
      </motion.div>

      {/* Name + role label */}
      <div className="text-center px-1 flex flex-col items-center w-full relative z-10 mt-1">
        <motion.span
          animate={hovered
            ? { fontVariationSettings: '"wght" 900, "wdth" 100', scale: isAndrew ? 1.08 : 1.04 }
            : { fontVariationSettings: '"wght" 700, "wdth" 100', scale: 1 }
          }
          transition={M3E_EFFECTS}
          className={`font-serif font-black w-full text-center leading-tight line-clamp-2 cursor-default md-title-medium transition-colors duration-200 ${
            isAndrew && hovered
              ? "text-cyan-500"
              : ""
          }`}
          style={{
            color: isAndrew && hovered ? undefined : hovered ? 'var(--md-primary)' : 'var(--md-on-surface)',
            filter: isAndrew && hovered ? 'drop-shadow(0 0 8px rgba(0,255,255,0.8))' : undefined,
          }}
        >
          {member.name.split(" ")[0]}
        </motion.span>

        {/* Role chip */}
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1, y: hovered ? -1 : 0 }}
          transition={M3E_EFFECTS}
          className="md-label-small uppercase tracking-widest mt-2 px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm backdrop-blur-none border border-black/5 dark:border-white/10"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {isAndrew ? <Code size={12} className="shrink-0" /> : (isLeader && <Star size={11} fill="currentColor" className="shrink-0" />)}
          <LangText content={member.role} lang={lang} className="truncate cursor-default whitespace-nowrap" inline />
        </motion.div>
      </div>
    </motion.div>
  );
});
