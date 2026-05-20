import React, { useState } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { M3E_SPATIAL, M3E_EFFECTS } from "../utils/physics";

/**
 * ActionPill — M3E Filled Button (always pill shape, never morphs border-radius)
 *
 * States:
 *  • Inactive: M3E primaryContainer fill (tonal button)
 *  • Active/Confirmed: M3E primary fill (filled button)
 *
 * M3E rule: Button shape is always shape.full (pill). Shape must NOT morph on interaction.
 */
export function ActionPill({ lang }: { lang: string }) {
  const [active, setActive] = useState(false);

  return (
    <motion.button
      onClick={() => setActive(!active)}
      initial={false}
      whileHover="hover"
      whileTap="tap"
      className="relative h-12 cursor-pointer flex items-center justify-center overflow-hidden px-6 min-w-[160px] self-start"
      // M3E shape.full — always pill, never changes
      style={{
        borderRadius: 'var(--md-shape-full)',
        backgroundColor: active ? 'var(--md-primary)' : 'var(--md-primary-container)',
      }}
      transition={M3E_EFFECTS}
      aria-label={active ? "Proposal submitted" : "Submit a proposal"}
      aria-pressed={active}
    >
      {/* M3E hover state overlay — 8% on-color tint */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          backgroundColor: active ? 'var(--md-on-primary)' : 'var(--md-on-primary-container)',
        }}
        variants={{ hover: { opacity: 0.08 }, tap: { opacity: 0.12 } }}
        initial={{ opacity: 0 }}
        transition={M3E_EFFECTS}
        aria-hidden="true"
      />

      <motion.span
        layout="position"
        className="md-label-large font-bold whitespace-nowrap relative z-10 flex items-center gap-2"
        style={{ color: active ? 'var(--md-on-primary)' : 'var(--md-on-primary-container)' }}
        variants={{
          hover: { fontVariationSettings: '"wght" 700, "wdth" 110' },
          tap: { fontVariationSettings: '"wght" 500, "wdth" 95', scale: 0.97 }
        }}
        transition={M3E_EFFECTS}
      >
        <LangText
          content={active ? { EN: "✓ Confirmed", ZH: "✓ 已確認" } : { EN: "Submit Proposal", ZH: "提交提案" }}
          lang={lang}
          inline
        />
      </motion.span>
    </motion.button>
  );
}
