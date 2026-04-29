import React from "react";
import { motion } from "motion/react";
import { CMS } from "../../data/cms";
import { LangText } from "../LangText";

interface HeroSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
}

export function HeroSection({
  lang,
  darkMode,
  activeItem,
  setActiveItem
}: HeroSectionProps) {
  return (
    <>
      <header id="home">
        <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tighter dark:drop-shadow-sm flex flex-wrap transition-colors duration-700">
          {"KCISLK".split("").map((letter, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}>{letter}</motion.span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, letterSpacing: "-0.05em" }} animate={{ opacity: 1, letterSpacing: "0.1em" }} transition={{ duration: 0.8, delay: 0.4 }}>
          <LangText content={{ EN: "Student Council Directory", ZH: "學生會成員指南" }} lang={lang} className="text-slate-600 dark:text-slate-400 transition-colors duration-700 font-mono font-bold uppercase text-sm flex items-center gap-2 mt-2" />
        </motion.div>
      </header>

      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ position: 'relative', zIndex: activeItem?.id === CMS.hero.id ? 100 : 1 }}
         >
          <motion.div 
            layoutId={`card-${CMS.hero.id}`} 
            onClick={() => setActiveItem(CMS.hero)} 
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer relative overflow-hidden group shadow-none dark:shadow-xl dark:shadow-blue-900/10 w-full" 
            style={{ backgroundColor: darkMode ? CMS.hero.colorDark : CMS.hero.colorLight, borderRadius: 32 }}
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
            <motion.div layout className="p-8 sm:p-12 md:p-16 relative z-10 flex flex-col h-[22rem] justify-end pointer-events-none w-full">
              <LangText content={CMS.hero.label} lang={lang} className="font-black text-xs tracking-widest uppercase mb-3 opacity-80 whitespace-nowrap" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
              <LangText content={CMS.hero.title} lang={lang} className="text-4xl md:text-6xl font-black tracking-tighter leading-tight" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
