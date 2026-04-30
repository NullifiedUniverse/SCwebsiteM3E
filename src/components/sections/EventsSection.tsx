import React from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight } from "lucide-react";
import { CMS } from "../../data/cms";
import { M3_SPRING, getPath } from "../../utils/physics";
import { LangText } from "../LangText";

interface EventsSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
  closingItemId?: string | null;
}

export function EventsSection({
  lang,
  darkMode,
  activeItem,
  setActiveItem,
  closingItemId
}: EventsSectionProps) {
  return (
    <section id="events">
      <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-sans font-black text-slate-800 dark:text-slate-200 tracking-tight text-3xl md:text-4xl mb-8 flex items-center gap-3 cursor-default">
        <Calendar size={28} className="text-blue-500" /> <LangText content={{ EN: "Upcoming Events", ZH: "近期活動資訊" }} lang={lang} inline={true} />
      </motion.h3>
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CMS.events.map((ev: any, index: number) => (
          <motion.div
            key={ev.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: M3_SPRING }
            }}
            animate={{ zIndex: (activeItem?.id === ev.id || closingItemId === ev.id) ? 100 : 1 }}
            style={{ position: 'relative' }}
            className="w-full outline-none focus-visible:ring-4 focus-visible:ring-blue-500 rounded-[48px]"
            tabIndex={0}
            role="button"
            aria-label={`View details for event`}
            onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveItem(ev); } }}
           >
            <motion.div 
              layoutId={`card-${ev.id}`} 
              initial="initial"
              animate="initial"
              whileHover="hover"
              whileTap="tap"
              variants={{ initial: { scale: 1 }, hover: { scale: 1.02, y: -4 }, tap: { scale: 0.97 } }}
              onClick={() => setActiveItem(ev)} 
              className="cursor-pointer overflow-hidden relative w-full h-full min-h-[180px] shadow-lg hover:shadow-xl transition-shadow duration-300 dark:shadow-blue-900/10 border-none group" 
              style={{ backgroundColor: darkMode ? ev.colorDark : ev.colorLight, color: darkMode ? ev.textDark : ev.textLight, borderRadius: 48 }}
            >
              {ev.image && (
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${encodeURI(ev.image)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start justify-between p-8 h-full gap-4 pointer-events-none relative z-10 w-full">
                <div className="flex flex-col gap-2 flex-grow">
                  <motion.span 
                    variants={{ initial: { letterSpacing: '0.05em' }, hover: { letterSpacing: '0.12em' } }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="font-mono font-bold text-sm tracking-widest uppercase opacity-70 leading-tight whitespace-pre-wrap"
                  >{ev.date.replace(/ /g, "\n")}</motion.span>
                  <div className="text-3xl md:text-4xl">
                    <motion.div 
                      variants={{ 
                        initial: { x: 0, fontVariationSettings: '"wght" 800, "slnt" 0, "wdth" 100', fontSize: '100%' }, 
                        hover: { x: 6, fontVariationSettings: '"wght" 900, "slnt" -3, "wdth" 110', fontSize: '90.9%' } 
                      }} 
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <LangText content={ev.title} lang={lang} className="font-sans font-black tracking-tighter leading-tight w-full" inline={false} />
                    </motion.div>
                  </div>
                </div>
                <motion.div variants={{ initial: { rotate: 0, scale: 1 }, hover: { rotate: -45, scale: 1.15 } }} className="w-14 h-14 shrink-0 flex items-center justify-center self-start sm:self-auto relative pointer-events-none" style={{ color: darkMode ? ev.colorDark : ev.colorLight }}>
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                    <motion.path 
                      fill={darkMode ? ev.textDark : ev.textLight}
                      variants={{
                        initial: { d: getPath("cookie", 100, 100, index) },
                        hover: { d: getPath(index % 2 === 0 ? "burst" : "8-leaf clover", 100, 100, index + 10) }
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    />
                  </svg>
                  <ArrowRight size={22} className="relative z-10 stroke-[3px]" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
