import React, { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users } from "lucide-react";
import { CMS, DEPTS } from "../../data/cms";
import { M3_SPRING } from "../../utils/physics";
import { LangText } from "../LangText";
import { MemberBlob } from "../MemberBlob";

interface CouncilSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
  activeGen: string;
  setActiveGen: (gen: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  trackEvent: (action: string, details?: any) => void;
}

export function CouncilSection({
  lang,
  darkMode,
  activeItem,
  setActiveItem,
  activeGen,
  setActiveGen,
  activeFilter,
  setActiveFilter,
  trackEvent
}: CouncilSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMembers = useMemo(() => {
    let filtered = CMS.members.filter(m => m.gen === activeGen);
    if (activeFilter !== "All") filtered = filtered.filter(m => m.dept === activeFilter);
    return filtered;
  }, [activeFilter, activeGen]);

  return (
    <section id="council" className="relative w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 w-full">
        <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-600 uppercase tracking-widest text-xs flex items-center gap-2 cursor-default">
          <Users size={14} /> <LangText content={{ EN: "Council Directory", ZH: "學生會成員" }} lang={lang} inline={true} />
        </motion.h3>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full backdrop-blur-sm z-10 cursor-pointer">
          {["7th", "8th"].map(gen => (
            <motion.button key={gen} onClick={() => { setActiveGen(gen); trackEvent("filter_generation", { generation: gen }); }} className={`cursor-pointer relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeGen === gen ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
              {activeGen === gen && <motion.div layoutId="gen-indicator" className="cursor-pointer absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-none dark:shadow-sm border border-slate-200/50 dark:border-transparent z-[-1]" transition={M3_SPRING} />}
              <LangText content={{ EN: `${gen} Council`, ZH: `第 ${gen.replace('th', '')} 屆` }} lang={lang} inline />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="relative w-[100vw] left-1/2 -translate-x-1/2" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))]">
          {["All", ...Object.keys(DEPTS)].map(dept => (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={dept} onClick={() => { setActiveFilter(dept); trackEvent("filter_department", { department: dept }); }} className={`cursor-pointer px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === dept ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-none dark:shadow-md" : "bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50"}`}>
              <LangText content={dept === "All" ? { EN: "All", ZH: "全部" } : DEPTS[dept].name} lang={lang} inline={true} />
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            transition={{ duration: 0.3 }} 
            className="flex gap-6 sm:gap-10 overflow-x-auto py-12 hide-scrollbar min-h-[280px] w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))]" 
            ref={scrollRef}
          >
            {filteredMembers.map((member, i) => (
              <div key={member.id} className="transition-transform">
                <MemberBlob index={i} member={member} activeItem={activeItem} onClick={setActiveItem} darkMode={darkMode} lang={lang} rootRef={scrollRef} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
