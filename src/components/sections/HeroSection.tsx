import React from "react";
import { motion } from "motion/react";
import { CMS } from "../../data/cms";
import { getPath } from "../../utils/physics";
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
      <header id="home" className="mb-12">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-sans font-black tracking-tighter dark:drop-shadow-sm flex flex-wrap transition-colors duration-700 leading-none">
          {"KCISLK".split("").map((letter, i) => {
            const hoverColorsLight = ['#005CBB', '#B02B68', '#7A40CE', '#984715', '#006783', '#206B38'];
            const hoverColorsDark = ['#D7E3FF', '#FFD9E2', '#EADDFF', '#FFDBCC', '#BCE9FF', '#A5F5B2'];
            return (
              <motion.span 
                key={i} 
                variants={{
                  initial: { opacity: 0, y: 40, fontVariationSettings: '"wght" 100, "wdth" 50, "slnt" 0' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    fontVariationSettings: '"wght" 900, "wdth" 100, "slnt" 0',
                    transition: { type: "spring", stiffness: 300, damping: 18, delay: i * 0.04 + 0.1 } 
                  },
                  hover: { 
                    fontVariationSettings: '"wght" 1000, "wdth" 130, "slnt" -8', 
                    scale: 1.1, 
                    y: -12,
                    color: darkMode ? hoverColorsDark[i] : hoverColorsLight[i],
                    transition: { type: "spring", stiffness: 500, damping: 12 } 
                  }
                }}
                initial="initial"
                animate="visible"
                whileHover="hover"
                className="cursor-default origin-bottom inline-block drop-shadow-sm hover:drop-shadow-lg transition-shadow duration-300"
              >
                {letter}
              </motion.span>
            );
          })}
        </h1>
        <motion.div initial={{ opacity: 0, letterSpacing: "-0.05em" }} animate={{ opacity: 1, letterSpacing: "0.1em" }} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
          <LangText content={{ EN: "Student Council Directory", ZH: "學生會成員指南" }} lang={lang} className="text-slate-600 dark:text-slate-400 transition-colors duration-700 font-mono font-bold uppercase text-sm flex items-center gap-2 mt-2 relative z-10" />
        </motion.div>
      </header>

      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ position: 'relative', zIndex: (activeItem?.id === CMS.hero.id || closingItemId === CMS.hero.id) ? 100 : 1 }}
         >
          <motion.div 
            layoutId={`card-${CMS.hero.id}`} 
            onClick={() => setActiveItem(CMS.hero)} 
            initial="initial"
            animate="initial"
            whileHover="hover"
            whileTap="tap"
            variants={{ initial: { scale: 1, y: 0 }, hover: { y: -8, scale: 1.02 }, tap: { scale: 0.96 } }}
            className="cursor-pointer relative overflow-hidden group shadow-2xl dark:shadow-2xl dark:shadow-blue-900/20 w-full transition-shadow duration-500 hover:shadow-blue-500/20 outline-none focus-visible:ring-4 focus-visible:ring-blue-500" 
            style={{ backgroundColor: darkMode ? CMS.hero.colorDark : CMS.hero.colorLight, borderRadius: 48 }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${CMS.hero.title.EN}`}
            onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveItem(CMS.hero); } }}
          >
            {CMS.hero.image && (
              <motion.div 
                initial={{ scale: 1, backgroundPosition: "0% 50%" }}
                animate={{ scale: 1.05, backgroundPosition: "100% 50%" }}
                transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none mix-blend-overlay" 
                style={{ backgroundImage: `url("${encodeURI(CMS.hero.image)}")`, backgroundSize: 'cover', maskImage: 'linear-gradient(to right, transparent, black)' }} 
              />
            )}
            <motion.div layout className="p-8 sm:p-12 md:p-16 lg:p-20 relative z-10 flex flex-col h-[28rem] md:h-[32rem] justify-end pointer-events-none w-full">
              <LangText content={CMS.hero.label} lang={lang} className="font-bold text-sm tracking-widest uppercase mb-4 opacity-90 whitespace-nowrap" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
              <div className="text-5xl md:text-7xl lg:text-8xl">
                <motion.div variants={{ initial: { fontVariationSettings: '"wght" 700, "slnt" 0, "wdth" 100', fontSize: '100%', x: 0 }, hover: { fontVariationSettings: '"wght" 900, "slnt" -5, "wdth" 110', fontSize: '90.9%', x: 8 } }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <LangText content={CMS.hero.title} lang={lang} className="font-black tracking-tighter leading-none" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
