import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, ArrowRight } from "lucide-react";
import { CMS, DEPTS } from "../../data/cms";
import { M3_SPATIAL, M3E_SPATIAL, M3E_EFFECTS, M3E_FAST, getPath } from "../../utils/physics";
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
  closingItemId?: string | null;
}

export function CouncilSection({
  lang, darkMode, activeItem, setActiveItem,
  activeGen, setActiveGen, activeFilter, setActiveFilter,
  trackEvent, searchQuery = "", closingItemId
}: CouncilSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTransitioning = activeItem !== null || closingItemId !== null;

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
        if (el.scrollLeft > 20) setHasScrolled(true);
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

  const GENS = ["7th", "8th"] as const;

  return (
    <section id="council" className="relative w-full" aria-labelledby="council-heading">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 w-full">
        <motion.h2
          id="council-heading"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover="hover"
          viewport={{ once: true }}
          transition={M3E_EFFECTS}
          className="md-headline-large flex items-center gap-3 cursor-default"
          style={{ color: 'var(--md-on-surface)' }}
        >
          <motion.div
            variants={{
              hover: {
                rotate: [0, -12, 12, -6, 6, 0],
                scale: 1.15,
                transition: { duration: 0.6 }
              }
            }}
            className="flex items-center justify-center shrink-0"
          >
            <Users size={28} style={{ color: 'var(--md-primary)' }} />
          </motion.div>
          <motion.span
            variants={{
              hover: {
                fontVariationSettings: '"wght" 900, "slnt" -6, "wdth" 110, "opsz" 36, "GRAD" 100',
                letterSpacing: "0.04em",
                textShadow: "0 0 20px color-mix(in srgb, var(--md-primary) 35%, transparent)",
              }
            }}
            initial={{
              fontVariationSettings: '"wght" 700, "slnt" 0, "wdth" 100, "opsz" 24, "GRAD" 0',
              letterSpacing: "0em",
              textShadow: "0 0 0px transparent",
            }}
            transition={M3E_EFFECTS}
          >
            <LangText content={{ EN: "Council Directory", ZH: "學生會成員" }} lang={lang} inline />
          </motion.span>
        </motion.h2>

        {/* ── M3E Segmented Button — Generation Toggle ─────────────
            FIX: indicator is positioned OUTSIDE buttons (not z-index:-1)
            Uses absolute layout indicator that slides between positions.
        ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={M3E_SPATIAL}
          className="relative flex p-1"
          style={{
            backgroundColor: 'var(--md-surface-container-high)',
            borderRadius: 'var(--md-shape-large)',
            border: `1px solid var(--md-outline-variant)`,
          }}
          role="group"
          aria-label="Filter by generation"
        >
          {/* Sliding indicator — positioned absolutely, slides between the two buttons */}
          <motion.div
            layout
            layoutId="gen-indicator-bg"
            className="absolute top-1 bottom-1"
            style={{
              backgroundColor: 'var(--md-secondary-container)',
              // M3E pill → rounded-rect morph: resting = shape.medium (12dp), not pill
              borderRadius: 'var(--md-shape-medium)',
              // Width = 50% of parent minus 2px padding each side
              width: 'calc(50% - 4px)',
              // Left = 4px when 7th, 50% when 8th
              left: activeGen === "7th" ? '4px' : 'calc(50%)',
            }}
            transition={M3_SPATIAL}
          />

          {GENS.map((gen) => (
            <motion.button
              key={gen}
              onClick={() => { setActiveGen(gen); trackEvent("filter_generation", { generation: gen }); }}
              className="cursor-pointer relative z-10 px-5 py-2 md-label-large whitespace-nowrap"
              style={{
                borderRadius: 'var(--md-shape-medium)',
                color: activeGen === gen ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)',
                minWidth: '90px',
                textAlign: 'center',
              }}
              whileHover={{
                color: activeGen !== gen ? 'var(--md-on-surface)' : undefined,
              } as any}
              whileTap={{ scale: 0.97 }}
              transition={M3E_EFFECTS}
              aria-pressed={activeGen === gen}
            >
              <LangText content={{ EN: `${gen} Council`, ZH: `第 ${gen.replace('th', '')} 屆` }} lang={lang} inline />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Full-bleed department filter chips */}
      <div className="relative w-[100vw] left-1/2 -translate-x-1/2">
        <div style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
        }}>
          {/* ── Department Filter Chips — M3 Pill Morph ── */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))]">
            {["All", ...Object.keys(DEPTS)].map(dept => {
              const isSelected = activeFilter === dept;
              const isAll = dept === "All";

              let chipBg: string;
              let chipColor: string;
              if (isSelected) {
                if (isAll) {
                  chipBg = darkMode ? 'var(--md-inverse-surface)' : 'var(--md-on-surface)';
                  chipColor = darkMode ? 'var(--md-inverse-on-surface)' : 'var(--md-surface)';
                } else {
                  chipBg = darkMode ? DEPTS[dept].dark : DEPTS[dept].light;
                  chipColor = darkMode ? DEPTS[dept].textDark : DEPTS[dept].textLight;
                }
              } else {
                chipBg = 'var(--md-surface-container)';
                chipColor = 'var(--md-on-surface-variant)';
              }

              return (
                <motion.button
                  key={dept}
                  // M3 pill morph: pill (resting) → rounded-rect (selected)
                  initial={false}
                  animate={{
                    borderRadius: isSelected ? 'var(--md-shape-large)' : 'var(--md-shape-full)',
                    backgroundColor: chipBg,
                    color: chipColor,
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setActiveFilter(dept); trackEvent("filter_department", { department: dept }); }}
                  className="cursor-pointer px-5 py-2 md-label-medium whitespace-nowrap relative overflow-hidden"
                  style={{
                    border: isSelected ? 'none' : `1px solid var(--md-outline-variant)`,
                    boxShadow: isSelected ? '0 1px 6px var(--md-shadow)' : 'none',
                    fontVariationSettings: isSelected ? '"wght" 700' : '"wght" 500',
                  }}
                  transition={M3_SPATIAL}
                  aria-pressed={isSelected}
                >
                  <LangText content={isAll ? { EN: "All", ZH: "全部" } : DEPTS[dept].name} lang={lang} inline />
                </motion.button>
              );
            })}
          </div>

          {/* ── Member Blobs ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + searchQuery + activeGen}
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.04 } }
              }}
              className={`flex gap-6 sm:gap-10 overflow-x-auto py-12 hide-scrollbar min-h-[300px] w-full px-4 sm:px-8 lg:px-[max(3rem,calc(50vw-720px+3rem))] ${isTransitioning ? 'is-transitioning' : ''}`}
              ref={scrollRef}
              role="list"
              aria-label="Council members"
            >
              {filteredMembers.map((member, i) => {
                const isCurrentActive = activeItem?.id === member.id;
                const isCurrentClosing = closingItemId === member.id;
                return (
                  <motion.div
                    key={member.id}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0, transition: M3E_SPATIAL }
                    }}
                    role="listitem"
                    className="member-scroll-item"
                    style={{
                      position: "relative",
                      zIndex: (isCurrentActive || isCurrentClosing) ? 1000 : 1,
                    }}
                  >
                    <MemberBlob index={i} member={member} activeItem={activeItem} onClick={setActiveItem} darkMode={darkMode} lang={lang} rootRef={scrollRef} closingItemId={closingItemId} />
                  </motion.div>
                );
              })}
              {filteredMembers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center w-full min-h-[200px] gap-4"
                  style={{ color: 'var(--md-on-surface-variant)' }}
                >
                  <motion.svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true">
                    <motion.path
                      fill="currentColor" style={{ opacity: 0.25 }}
                      animate={{ d: [getPath("cookie", 100, 100, 0), getPath("cookie", 100, 100, 3), getPath("cookie", 100, 100, 0)] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.svg>
                  <span className="md-label-large">
                    {searchQuery ? (lang === "ZH" ? "找不到成員" : "No members found") : (lang === "ZH" ? "本屆暫無資料" : "No members for this gen")}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll hint blob */}
        <AnimatePresence>
          {!hasScrolled && isScrollable && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={M3E_SPATIAL}
              className="absolute right-2 md:right-6 top-[55%] -translate-y-1/2 z-40 w-14 h-14 pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.button
                className="w-full h-full relative flex items-center justify-center cursor-pointer"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollBy({ left: window.innerWidth > 768 ? 380 : 240, behavior: 'smooth' });
                  }
                }}
                transition={M3E_FAST}
                aria-label="Scroll to see more members"
              >
                <motion.svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full overflow-visible"
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    fill={darkMode ? 'var(--md-inverse-surface)' : 'var(--md-on-surface)'}
                    d={getPath("cookie", 100, 100, 0)}
                  />
                </motion.svg>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                  style={{ color: darkMode ? 'var(--md-inverse-on-surface)' : 'var(--md-surface)' }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
