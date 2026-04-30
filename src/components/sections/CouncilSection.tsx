import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, ArrowRight } from "lucide-react";
import { CMS, DEPTS } from "../../data/cms";
import { M3_SPRING, getPath } from "../../utils/physics";
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
  searchQuery?: string;
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
  trackEvent,
  searchQuery = ""
}: CouncilSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMembers = useMemo(() => {
    let filtered = CMS.members.filter(m => m.gen === activeGen);
    if (activeFilter !== "All") filtered = filtered.filter(m => m.dept === activeFilter);
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.role.EN.toLowerCase().includes(q) || 
        m.role.ZH.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeFilter, activeGen, searchQuery]);

  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const checkScrollable = () => {
        setIsScrollable(el.scrollWidth > el.clientWidth + 10);
        if (el.scrollLeft > 20) {
          setHasScrolled(true);
        }
      };
      
      checkScrollable();
      window.addEventListener('resize', checkScrollable);
      el.addEventListener('scroll', checkScrollable, { passive: true });
      
      const timeout = setTimeout(checkScrollable, 500);
      
      return () => {
        window.removeEventListener('resize', checkScrollable);
        el.removeEventListener('scroll', checkScrollable);
        clearTimeout(timeout);
      };
    }
  }, [filteredMembers]);

  return (
    <section id="council" className="relative w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 w-full relative">
        <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-sans font-black text-slate-800 dark:text-slate-200 tracking-tight text-3xl md:text-4xl flex items-center gap-3 cursor-default">
          <Users size={28} className="text-blue-500" /> <LangText content={{ EN: "Council Directory", ZH: "學生會成員" }} lang={lang} inline={true} />
        </motion.h3>
        
        <div className="flex flex-col items-end gap-2 relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl backdrop-blur-sm z-10 cursor-pointer">
            {["7th", "8th"].map(gen => (
              <motion.button key={gen} onClick={() => { setActiveGen(gen); trackEvent("filter_generation", { generation: gen }); }} className={`cursor-pointer relative px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeGen === gen ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                {activeGen === gen && <motion.div layoutId="gen-indicator" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-600/30 z-[-1]" transition={M3_SPRING} />}
                <LangText content={{ EN: `${gen} Council`, ZH: `第 ${gen.replace('th', '')} 屆` }} lang={lang} inline />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative w-[100vw] left-1/2 -translate-x-1/2">
        <div style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))]">
            {["All", ...Object.keys(DEPTS)].map(dept => {
              const isSelected = activeFilter === dept;
              const isAll = dept === "All";
              let bgStyle = {};
              if (isSelected) {
                if (isAll) {
                  bgStyle = { backgroundColor: darkMode ? '#f1f5f9' : '#0f172a', color: darkMode ? '#0f172a' : '#f1f5f9' };
                } else {
                  bgStyle = { backgroundColor: darkMode ? DEPTS[dept].dark : DEPTS[dept].light, color: darkMode ? DEPTS[dept].textDark : DEPTS[dept].textLight };
                }
              }
              return (
                <motion.button 
                  initial={false}
                  animate={{ 
                    borderRadius: isSelected ? "16px" : "9999px",
                    scale: 1
                  }}
                  whileHover={{ scale: 1.04, borderRadius: isSelected ? "12px" : "24px" }} 
                  whileTap={{ scale: 0.96 }} 
                  key={dept} 
                  onClick={() => { setActiveFilter(dept); trackEvent("filter_department", { department: dept }); }} 
                  className={`cursor-pointer px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${isSelected ? "shadow-md" : "bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50"}`}
                  style={bgStyle}
                >
                  <LangText content={isAll ? { EN: "All", ZH: "全部" } : DEPTS[dept].name} lang={lang} inline={true} />
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter + searchQuery + activeGen} 
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04 }
                }
              }}
              className="flex gap-6 sm:gap-10 overflow-x-auto py-12 hide-scrollbar min-h-[280px] w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))]" 
              ref={scrollRef}
            >
              {filteredMembers.map((member, i) => (
                <motion.div 
                  key={member.id} 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0, transition: M3_SPRING }
                  }}
                  className="transition-transform"
                >
                  <MemberBlob index={i} member={member} activeItem={activeItem} onClick={setActiveItem} darkMode={darkMode} lang={lang} rootRef={scrollRef} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!hasScrolled && isScrollable && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ ...M3_SPRING }}
              className="absolute right-2 md:right-6 top-[55%] -translate-y-1/2 z-40 w-16 h-16 pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.button 
                className="w-full h-full relative flex items-center justify-center drop-shadow-xl cursor-pointer"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollBy({ left: window.innerWidth > 768 ? 400 : 250, behavior: 'smooth' });
                  }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <motion.path 
                    fill={darkMode ? "rgba(255,255,255,0.95)" : "rgba(15,23,42,0.95)"} 
                    animate={{ d: [
                      getPath("cookie", 100, 100, 0),
                      getPath("cookie", 100, 100, 2),
                      getPath("cookie", 100, 100, 4),
                      getPath("cookie", 100, 100, 0)
                    ] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 text-slate-100 dark:text-slate-900">
                  <ArrowRight size={24} />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
