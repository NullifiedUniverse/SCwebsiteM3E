import React from "react";
import { motion } from "motion/react";
import { CMS } from "../../data/cms";
import { M3E_SPATIAL, M3E_EFFECTS } from "../../utils/physics";
import { LangText } from "../LangText";

interface HeroSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
  closingItemId?: string | null;
}

export function HeroSection({
  lang,
  darkMode,
  activeItem,
  setActiveItem,
  closingItemId
}: HeroSectionProps) {
  return (
    <>
      {/* ── Display Headline ──────────────────────────────────── */}
      <header id="home" className="mb-4">
        <h1
          className="flex flex-wrap transition-colors duration-700 leading-none cursor-default"
          style={{ fontSize: 'clamp(52px, 10vw, 96px)', lineHeight: 1.0 }}
        >
          {"KCISLK".split("").map((letter, i) => {
            const hoverColorsLight = ['#005CBB', '#B02B68', '#7A40CE', '#984715', '#006783', '#206B38'];
            const hoverColorsDark  = ['#ADC6FF', '#FFD9E2', '#EADDFF', '#FFDBCC', '#BCE9FF', '#A5F5B2'];
            return (
              <motion.span
                key={i}
                variants={{
                  initial: {
                    opacity: 0,
                    y: 40,
                    fontVariationSettings: '"wght" 100, "wdth" 50, "slnt" 0, "opsz" 72, "GRAD" 0'
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    fontVariationSettings: '"wght" 900, "wdth" 100, "slnt" 0, "opsz" 72, "GRAD" 50',
                    transition: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.045 + 0.08 }
                  },
                  hover: {
                    fontVariationSettings: '"wght" 1000, "wdth" 130, "slnt" -8, "opsz" 72, "GRAD" 150',
                    scale: 1.1,
                    y: -10,
                    color: darkMode ? hoverColorsDark[i] : hoverColorsLight[i],
                    transition: { type: "spring", stiffness: 480, damping: 14 }
                  }
                }}
                initial="initial"
                animate="visible"
                whileHover="hover"
                className="origin-bottom inline-block"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {letter}
              </motion.span>
            );
          })}
        </h1>

        <motion.div
          initial={{ opacity: 0, letterSpacing: "-0.05em" }}
          animate={{ opacity: 1, letterSpacing: "0.1em" }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <LangText
            content={{ EN: "Student Council Directory", ZH: "學生會成員指南" }}
            lang={lang}
            className="md-label-large uppercase tracking-widest mt-2 flex items-center gap-2"
            style={{ color: 'var(--md-on-surface-variant)', fontFamily: 'var(--font-mono)' }}
          />
        </motion.div>
      </header>

      {/* ── Hero Card — M3E Extra-Extra-Large shape (32dp) ──── */}
      <section aria-labelledby="hero-card-title">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          style={{
            position: 'relative',
            zIndex: (activeItem?.id === CMS.hero.id || closingItemId === CMS.hero.id) ? 100 : 1
          }}
        >
          <motion.div
            layoutId={`card-${CMS.hero.id}`}
            onClick={() => setActiveItem(CMS.hero)}
            initial="initial"
            animate="initial"
            whileHover="hover"
            whileTap="tap"
            variants={{
              initial: { scale: 1, y: 0 },
              hover: { y: -6, scale: 1.015 },
              tap: { scale: 0.97 }
            }}
            transition={M3E_SPATIAL}
            className="cursor-pointer relative overflow-hidden group w-full outline-none"
            style={{
              backgroundColor: darkMode ? CMS.hero.colorDark : CMS.hero.colorLight,
              borderRadius: 'var(--md-shape-extra-extra-large)',
              // M3E Elevation 1 tonal shadow
              boxShadow: `0 2px 8px var(--md-shadow), 0 6px 20px var(--md-shadow)`,
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${CMS.hero.title.EN}`}
            onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveItem(CMS.hero); } }}
          >
            {/* Subtle image overlay — mix-blend-overlay */}
            {CMS.hero.image && (
              <motion.div
                initial={{ scale: 1, backgroundPosition: "0% 50%" }}
                animate={{ scale: 1.04, backgroundPosition: "100% 50%" }}
                transition={{ duration: 28, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute top-0 right-0 w-1/2 h-full opacity-25 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("${encodeURI(CMS.hero.image)}")`,
                  backgroundSize: 'cover',
                  maskImage: 'linear-gradient(to right, transparent, black)'
                }}
              />
            )}

            {/* Hover tonal overlay — M3E hover state = 8% primary overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ borderRadius: 'inherit' }}
              variants={{ initial: { opacity: 0 }, hover: { opacity: 0.08 } }}
              transition={M3E_EFFECTS}
              aria-hidden="true"
            />

            <motion.div
              layout
              className="p-8 sm:p-12 md:p-16 lg:p-20 relative z-10 flex flex-col h-[26rem] md:h-[30rem] justify-end pointer-events-none w-full"
            >
              {/* Overline / label */}
              <LangText
                content={CMS.hero.label}
                lang={lang}
                className="md-label-large uppercase tracking-widest mb-4 opacity-80 whitespace-nowrap"
                style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }}
              />

              {/* Card headline */}
              <div id="hero-card-title" style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.1 }}>
                <motion.div
                  variants={{
                    initial: { fontVariationSettings: '"wght" 700, "slnt" 0, "wdth" 100, "opsz" 48', x: 0 },
                    hover: { fontVariationSettings: '"wght" 900, "slnt" -4, "wdth" 108, "opsz" 48', x: 6 }
                  }}
                  transition={M3E_EFFECTS}
                >
                  <LangText
                    content={CMS.hero.title}
                    lang={lang}
                    className="font-black tracking-tighter leading-tight"
                    style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
