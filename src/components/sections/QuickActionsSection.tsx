import React from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { M3E_SPATIAL, getPath } from "../../utils/physics";
import { LangText } from "../LangText";
import { ActionPill } from "../ActionPill";
import { HoverReveal } from "../HoverReveal";

interface QuickActionsSectionProps {
  lang: string;
}

export function QuickActionsSection({ lang }: QuickActionsSectionProps) {
  return (
    <section className="w-full" aria-labelledby="quick-actions-heading">
      <motion.h2
        id="quick-actions-heading"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={M3E_SPATIAL}
        className="md-label-large uppercase tracking-widest mb-6 flex items-center gap-2 cursor-default"
        style={{ color: 'var(--md-on-surface-variant)' }}
      >
        <Info size={14} style={{ color: 'var(--md-on-surface-variant)' }} />
        <LangText content={{ EN: "Quick Actions", ZH: "快速操作" }} lang={lang} inline />
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* ── New Proposal Card — M3E Filled Card ────────────── */}
        {/* M3E Filled Card: surfaceContainerHighest fill, no border, no shadow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={M3E_SPATIAL}
          whileHover={{ scale: 1.008, y: -2 }}
          className="relative p-8 flex flex-col justify-center min-h-[200px] overflow-hidden w-full"
          style={{
            backgroundColor: 'var(--md-surface-container-highest)',
            borderRadius: 'var(--md-shape-extra-large)',
          }}
        >
          {/* M3E decorative shape — low opacity, uses primaryContainer color */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute -right-6 -top-6 w-32 h-32 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0.08 }}
          >
            <motion.path
              style={{ color: 'var(--md-primary)' }}
              fill="currentColor"
              animate={{ d: [getPath("flower", 100, 100, 0), getPath("flower", 100, 100, 2), getPath("flower", 100, 100, 0)] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>

          <h3 className="md-title-large font-bold mb-2 relative z-10 w-full" style={{ color: 'var(--md-on-surface)' }}>
            <LangText content={{ EN: "New Proposal", ZH: "新提案" }} lang={lang} inline />
          </h3>
          <p className="md-body-medium relative z-10 w-full mb-4" style={{ color: 'var(--md-on-surface-variant)' }}>
            <LangText
              content={{
                EN: "Submit your ideas for the upcoming winter gala directly to the council.",
                ZH: "將您對近期與未來活動的想法提意給我們吧。"
              }}
              lang={lang}
            />
          </p>
          <ActionPill lang={lang} />
        </motion.div>

        {/* ── Instagram Link — M3E Filled Tonal Card ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...M3E_SPATIAL, delay: 0.08 }}
          className="h-full w-full"
        >
          <HoverReveal lang={lang} />
        </motion.div>
      </div>
    </section>
  );
}
