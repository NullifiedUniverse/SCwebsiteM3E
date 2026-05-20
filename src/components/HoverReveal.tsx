import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LangText } from "./LangText";
import { M3E_SPATIAL, M3E_EFFECTS, M3E_FAST, getPath } from "../utils/physics";

/**
 * HoverReveal — M3E Filled Tonal Card (Instagram link)
 *
 * M3E corrections:
 * - Uniform shape.extra-large (28dp) always — no asymmetric radius on hover
 * - Hover state uses M3E hover overlay (8% primaryContainer tint) not full background swap
 * - Uses surfaceContainerLow base with primaryContainer tint on hover
 */
export function HoverReveal({ lang }: { lang: string }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href="https://www.instagram.com/kcis_2steps_ahead/"
      target="_blank"
      rel="noreferrer noopener"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileTap={{ scale: 0.98 }}
      transition={M3E_EFFECTS}
      className="relative cursor-pointer overflow-hidden flex items-center justify-between h-full w-full min-h-[200px] p-8 group"
      style={{
        // M3E shape.extra-large — uniform, no asymmetric hack
        borderRadius: 'var(--md-shape-extra-large)',
        backgroundColor: 'var(--md-surface-container-highest)',
      }}
      aria-label="Visit official KCISLK Student Council Instagram page"
    >
      {/* M3E decorative corner shape */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute -left-4 -bottom-4 w-24 h-24 pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0.06 }}
      >
        <motion.path
          fill="currentColor"
          style={{ color: 'var(--md-primary)' }}
          animate={{ d: [getPath("8-leaf clover", 100, 100, 0), getPath("8-leaf clover", 100, 100, 2), getPath("8-leaf clover", 100, 100, 0)] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* M3E hover overlay — primaryContainer at 8% (hover state spec) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: 'inherit', backgroundColor: 'var(--md-primary-container)' }}
        animate={{ opacity: hover ? 0.35 : 0 }}
        transition={M3E_EFFECTS}
        aria-hidden="true"
      />

      {/* Text */}
      <div className="z-10 flex-1">
        <span className="md-label-small uppercase tracking-widest block mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>
          {lang === "ZH" ? "官方帳號" : "Follow us"}
        </span>
        <span className="md-title-medium font-bold" style={{ color: 'var(--md-on-surface)' }}>
          <LangText content={{ EN: "Official Instagram", ZH: "官方 Instagram" }} lang={lang} inline />
        </span>
      </div>

      {/* M3E FAB-style action indicator */}
      <motion.div
        animate={{ x: hover ? 0 : 16, opacity: hover ? 1 : 0, scale: hover ? 1 : 0.8 }}
        transition={M3E_SPATIAL}
        className="relative w-12 h-12 flex items-center justify-center shrink-0 z-10"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <motion.path
            fill="var(--md-primary)"
            animate={{ d: [getPath("cookie", 100, 100, 0), getPath("cookie", 100, 100, 1.5), getPath("cookie", 100, 100, 0)] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <ArrowUpRight size={18} className="relative z-10" style={{ color: 'var(--md-on-primary)' }} strokeWidth={2.5} />
      </motion.div>
    </motion.a>
  );
}
