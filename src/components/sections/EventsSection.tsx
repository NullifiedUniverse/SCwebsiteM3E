import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { CMS } from "../../data/cms";
import { M3_SPATIAL, M3E_SPATIAL, M3E_EFFECTS, M3E_FAST, getPath } from "../../utils/physics";
import { LangText } from "../LangText";

// Palette of distinct symmetrical shapes — each event card gets a unique FAB
const FAB_SHAPE_PALETTE = ["cookie", "4-sided cookie", "8-leaf clover", "flower", "soft burst", "squircle"] as const;

const MMAP: Record<string, number> = { JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11 };

function parseDate(s: string) {
  const p = s.split(" ");
  if (p.length < 2) return null;
  const m = MMAP[p[0]];
  const d = parseInt(p[1]);
  return m !== undefined && !isNaN(d) ? { month: m, day: d } : null;
}

interface EventsSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
  closingItemId?: string | null;
}

export function EventsSection({
  lang, darkMode, activeItem, setActiveItem, closingItemId
}: EventsSectionProps) {

  const events = CMS.events;
  const [filter, setFilter] = useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");

  const today = useMemo(() => new Date(), []);

  const parsedEvents = useMemo(() => {
    return events.map(ev => ({
      ...ev,
      parsed: parseDate(ev.date)
    }));
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return parsedEvents.filter(ev => {
      if (!ev.parsed) return true;
      const m = ev.parsed.month;
      const d = ev.parsed.day;
      return m > today.getMonth() || (m === today.getMonth() && d >= today.getDate());
    });
  }, [parsedEvents, today]);

  const pastEvents = useMemo(() => {
    return parsedEvents.filter(ev => {
      if (!ev.parsed) return false;
      const m = ev.parsed.month;
      const d = ev.parsed.day;
      return m < today.getMonth() || (m === today.getMonth() && d < today.getDate());
    });
  }, [parsedEvents, today]);

  const sortedUpcoming = useMemo(() => {
    return [...upcomingEvents].sort((a, b) => {
      const valA = a.parsed ? (a.parsed.month * 100 + a.parsed.day) : 0;
      const valB = b.parsed ? (b.parsed.month * 100 + b.parsed.day) : 0;
      return valA - valB;
    });
  }, [upcomingEvents]);

  const sortedPast = useMemo(() => {
    return [...pastEvents].sort((a, b) => {
      const valA = a.parsed ? (a.parsed.month * 100 + a.parsed.day) : 0;
      const valB = b.parsed ? (b.parsed.month * 100 + b.parsed.day) : 0;
      return valB - valA; // Newest past first
    });
  }, [pastEvents]);

  const sortedAll = useMemo(() => {
    return [...parsedEvents].sort((a, b) => {
      const valA = a.parsed ? (a.parsed.month * 100 + a.parsed.day) : 0;
      const valB = b.parsed ? (b.parsed.month * 100 + b.parsed.day) : 0;
      return valA - valB;
    });
  }, [parsedEvents]);

  const filteredEvents = useMemo(() => {
    if (filter === "UPCOMING") return sortedUpcoming;
    if (filter === "PAST") return sortedPast;
    return sortedAll;
  }, [filter, sortedUpcoming, sortedPast, sortedAll]);

  const FILTERS = ["UPCOMING", "PAST", "ALL"] as const;
  const showSignatureLayout = filteredEvents.length === 6;

  return (
    <section id="events" aria-labelledby="events-heading">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 w-full">
        <motion.h2
          id="events-heading"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover="hover"
          viewport={{ once: true }}
          transition={M3E_EFFECTS}
          className="md-headline-large flex items-center gap-3 cursor-default animate-none"
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
            <CalendarDays size={28} style={{ color: 'var(--md-primary)' }} />
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
            className="transition-all duration-200"
          >
            <LangText content={{ EN: "School Events", ZH: "活動資訊與行事曆" }} lang={lang} inline />
          </motion.span>
        </motion.h2>

        {/* ── M3E Segmented Button — Events Filter ──────────────── */}
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
          aria-label="Filter events"
        >
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className="cursor-pointer relative px-4 py-2 md-label-large whitespace-nowrap overflow-hidden transition-colors"
              style={{
                borderRadius: 'var(--md-shape-medium)',
                color: filter === f ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)',
                minWidth: '85px',
                textAlign: 'center',
              }}
              whileHover={{
                color: filter !== f ? 'var(--md-on-surface)' : undefined,
              } as any}
              whileTap={{ scale: 0.97 }}
              transition={M3E_EFFECTS}
              aria-pressed={filter === f}
            >
              {filter === f && (
                <motion.div
                  layoutId="event-filter-indicator"
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'var(--md-secondary-container)',
                    borderRadius: 'var(--md-shape-medium)',
                    zIndex: 0,
                  }}
                  transition={M3_SPATIAL}
                />
              )}
              <span className="relative z-10">
                <LangText
                  content={
                    f === "UPCOMING" ? { EN: "Upcoming", ZH: "即將到來" } :
                    f === "PAST" ? { EN: "Past", ZH: "歷屆回顧" } :
                    { EN: "All", ZH: "全部活動" }
                  }
                  lang={lang}
                  inline
                />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial="hidden"
          whileInView="show"
          exit="exit"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
            exit: { opacity: 0, transition: { duration: 0.15 } }
          }}
          className="flex flex-col gap-4"
        >
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center" style={{ color: 'var(--md-on-surface-variant)' }}>
              <CalendarDays size={48} className="opacity-25 mb-4 animate-pulse" />
              <p className="md-title-medium font-bold">
                <LangText content={{ EN: "No events found", ZH: "目前無此類別活動" }} lang={lang} inline />
              </p>
            </div>
          ) : showSignatureLayout ? (
            <>
              {/* Row 1: Featured + Sidebar */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <EventCard ev={filteredEvents[0]} index={0} isFeatured lang={lang} darkMode={darkMode}
                  activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                  className="md:col-span-3"
                  minHeight="280px"
                />
                <EventCard ev={filteredEvents[1]} index={1} lang={lang} darkMode={darkMode}
                  activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                  className="md:col-span-2"
                  minHeight="220px"
                />
              </div>

              {/* Row 2: Three equal cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredEvents.slice(2, 5).map((ev, i) => (
                  <EventCard key={ev.id} ev={ev} index={i + 2} lang={lang} darkMode={darkMode}
                    activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                    minHeight="160px"
                  />
                ))}
              </div>

              {/* Row 3: Final card full-width */}
              {filteredEvents[5] && (
                <EventCard ev={filteredEvents[5]} index={5} isWide lang={lang} darkMode={darkMode}
                  activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                  minHeight="140px"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Bento Dynamic Layout for other sizes */}
              {filteredEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Card 0: Featured */}
                  <EventCard ev={filteredEvents[0]} index={0} isFeatured lang={lang} darkMode={darkMode}
                    activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                    className="md:col-span-3"
                    minHeight="280px"
                  />
                  {/* Card 1: Secondary (if exists) */}
                  {filteredEvents[1] && (
                    <EventCard ev={filteredEvents[1]} index={1} lang={lang} darkMode={darkMode}
                      activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                      className="md:col-span-2"
                      minHeight="220px"
                    />
                  )}
                </div>
              )}

              {/* Cards 2+: Grid */}
              {filteredEvents.length > 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.slice(2).map((ev, i) => (
                    <EventCard key={ev.id} ev={ev} index={i + 2} lang={lang} darkMode={darkMode}
                      activeItem={activeItem} setActiveItem={setActiveItem} closingItemId={closingItemId}
                      minHeight="160px"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ── Individual Event Card ─────────────────────────────────────────────────────
interface EventCardProps {
  key?: string | number;
  ev: any;
  index: number;
  lang: string;
  darkMode: boolean;
  activeItem: any;
  setActiveItem: (item: any) => void;
  closingItemId?: string | null;
  isFeatured?: boolean;
  isWide?: boolean;
  className?: string;
  minHeight?: string;
}

function EventCard({ ev, index, lang, darkMode, activeItem, setActiveItem, closingItemId, className = "", minHeight = "180px" }: EventCardProps) {
  const bgColor = darkMode ? ev.colorDark : ev.colorLight;
  const textColor = darkMode ? ev.textDark : ev.textLight;
  const fabShape = FAB_SHAPE_PALETTE[index % FAB_SHAPE_PALETTE.length];

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: M3E_SPATIAL }
      }}
      animate={{ zIndex: (activeItem?.id === ev.id || closingItemId === ev.id) ? 100 : 1 }}
      style={{ position: 'relative' }}
      className={`w-full @container ${className}`}
    >
      <motion.div
        layoutId={`card-${ev.id}`}
        initial="initial"
        animate="initial"
        whileHover="hover"
        whileTap="tap"
        variants={{
          initial: { scale: 1, y: 0 },
          hover: { scale: 1.012, y: -4 },
          tap: { scale: 0.975 }
        }}
        transition={M3E_SPATIAL}
        onClick={() => setActiveItem(ev)}
        onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveItem(ev); } }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${ev.title.EN}`}
        className="cursor-pointer overflow-hidden relative w-full h-full group"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: 'var(--md-shape-extra-large)',
          boxShadow: `0 2px 8px var(--md-shadow)`,
          minHeight,
        }}
      >
        {/* Background image overlay */}
        {ev.image && (
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${encodeURI(ev.image)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-hidden="true"
          />
        )}

        {/* M3E hover tonal overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', backgroundColor: textColor }}
          variants={{ initial: { opacity: 0 }, hover: { opacity: 0.07 } }}
          transition={M3E_EFFECTS}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-7 @4xl:flex-row @4xl:items-center @4xl:gap-8 @4xl:px-8 @4xl:py-5"
          style={{ minHeight: 'inherit' }}
        >
          {/* Left side (or top) */}
          <div className="flex flex-col gap-1.5 @4xl:flex-1">
            {/* Date overline */}
            <motion.span
              variants={{ initial: { letterSpacing: '0.06em' }, hover: { letterSpacing: '0.1em' } }}
              transition={M3E_EFFECTS}
              className="md-label-small uppercase font-mono opacity-60"
            >
              {ev.date}
            </motion.span>

            {/* Title */}
            <motion.div
              variants={{
                initial: { x: 0, fontVariationSettings: '"wght" 800, "slnt" 0, "wdth" 100, "opsz" 28' },
                hover: { x: 3, fontVariationSettings: '"wght" 900, "slnt" -3, "wdth" 108, "opsz" 28' }
              }}
              transition={M3E_EFFECTS}
              className="text-[18px] font-black tracking-tight leading-tight block w-full @lg:text-[20px] @2xl:text-[24px] @4xl:text-[22px] @5xl:text-[26px]"
            >
              <LangText
                content={ev.title}
                lang={lang}
                className="block w-full"
              />
            </motion.div>

            {/* Description — toggled via container query */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...M3E_EFFECTS, delay: 0.1 }}
              className="mt-1 hidden @md:block @md:opacity-70"
            >
              <LangText
                content={ev.desc}
                lang={lang}
                className="md-body-small leading-relaxed line-clamp-2"
              />
            </motion.div>
          </div>

          {/* Action badge — morphing M3E shape */}
          <motion.div
            variants={{ initial: { rotate: 0, scale: 1 }, hover: { rotate: 45, scale: 1.15 } }}
            transition={M3E_FAST}
            className="relative flex items-center justify-center shrink-0 w-11 h-11 self-end @4xl:w-14 @4xl:h-14 @4xl:self-auto"
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <motion.path
                fill={textColor}
                d={getPath(fabShape, 100, 100, 0)}
              />
            </svg>
            <ArrowUpRight
              className="relative z-10 stroke-[2.5px] w-4 h-4 @4xl:w-5 @4xl:h-5"
              style={{ color: bgColor }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  );
}

