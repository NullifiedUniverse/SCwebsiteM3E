import React from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight } from "lucide-react";
import { CMS } from "../../data/cms";
import { BOUNCE_SPRING } from "../../utils/physics";
import { LangText } from "../LangText";

interface EventsSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
}

export function EventsSection({
  lang,
  darkMode,
  activeItem,
  setActiveItem
}: EventsSectionProps) {
  return (
    <section id="events">
      <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-600 uppercase tracking-widest text-xs mb-5 flex items-center gap-2 cursor-default">
        <Calendar size={14} /> <LangText content={{ EN: "Upcoming Events", ZH: "近期活動資訊" }} lang={lang} inline={true} />
      </motion.h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CMS.events.map((ev, index) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, ...BOUNCE_SPRING }}
            style={{ position: 'relative', zIndex: activeItem?.id === ev.id ? 100 : 1 }}
            className="w-full"
           >
            <motion.div 
              layoutId={`card-${ev.id}`} 
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveItem(ev)} 
              className="cursor-pointer overflow-hidden relative w-full h-full min-h-[160px] shadow-none border border-black/5 dark:border-white/10" 
              style={{ backgroundColor: darkMode ? ev.colorDark : ev.colorLight, color: darkMode ? ev.textDark : ev.textLight, borderRadius: 32 }}
            >
              {ev.image && (
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("${encodeURI(ev.image)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <motion.div layout className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start justify-between p-8 h-full gap-4 pointer-events-none relative z-10 w-full">
                <div className="flex flex-col gap-2 flex-grow">
                  <span className="font-mono font-bold text-sm tracking-widest uppercase opacity-70 leading-tight whitespace-pre-wrap">{ev.date.replace(/ /g, "\n")}</span>
                  <LangText content={ev.title} lang={lang} className="font-serif font-black text-2xl tracking-tight leading-tight w-full" inline={false} />
                </div>
                <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black opacity-80 self-start sm:self-auto overflow-hidden" style={{ backgroundColor: darkMode ? ev.textDark : ev.textLight, color: darkMode ? ev.colorDark : ev.colorLight }}>
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
