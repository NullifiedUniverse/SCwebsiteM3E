import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { CMS } from "../../data/cms";
import { M3E_SPATIAL, M3E_EFFECTS, M3E_FAST, getPath } from "../../utils/physics";
import { LangText } from "../LangText";

interface CalendarSectionProps {
  lang: string;
  darkMode: boolean;
  activeItem?: any;
  setActiveItem?: (item: any) => void;
}

const MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_ZH = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const WKDAY_EN = ["S","M","T","W","T","F","S"];
const WKDAY_ZH = ["日","一","二","三","四","五","六"];
const MMAP: Record<string, number> = { JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11 };

function parseDate(s: string) {
  const p = s.split(" ");
  if (p.length < 2) return null;
  const m = MMAP[p[0]];
  const d = parseInt(p[1]);
  return m !== undefined && !isNaN(d) ? { month: m, day: d } : null;
}

const SHAPES = ["cookie", "squircle", "flower", "diamond"] as const;

export function CalendarSection({ lang, darkMode, setActiveItem }: CalendarSectionProps) {
  const today = new Date();
  const year = today.getFullYear();
  const [expanded, setExpanded] = useState(false);
  const [highlightDay, setHighlightDay] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const parsedEvents = useMemo(() =>
    CMS.events.map(ev => ({ ...ev, parsed: parseDate(ev.date) })).filter(e => e.parsed !== null)
  , []);

  const eventMap = useMemo(() => {
    const map: Record<number, Record<number, typeof parsedEvents>> = {};
    parsedEvents.forEach(ev => {
      const p = ev.parsed!;
      if (!map[p.month]) map[p.month] = {};
      if (!map[p.month][p.day]) map[p.month][p.day] = [];
      map[p.month][p.day].push(ev);
    });
    return map;
  }, [parsedEvents]);

  const upcomingEvents = useMemo(() =>
    parsedEvents
      .sort((a, b) => (a.parsed!.month * 100 + a.parsed!.day) - (b.parsed!.month * 100 + b.parsed!.day))
      .filter(ev => {
        const d = ev.parsed!;
        return d.month > today.getMonth() || (d.month === today.getMonth() && d.day >= today.getDate());
      })
  , [parsedEvents]);

  const nextEvent = upcomingEvents[0];
  const startMonth = nextEvent?.parsed?.month ?? today.getMonth();
  const [viewMonth, setViewMonth] = useState(startMonth);

  const daysInMonth = new Date(year, viewMonth + 1, 0).getDate();
  const firstDay = new Date(year, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);
  const eventsForDay = useCallback((d: number) => eventMap[viewMonth]?.[d] || [], [eventMap, viewMonth]);
  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth();
  const weekdays = lang === "ZH" ? WKDAY_ZH : WKDAY_EN;

  const monthEvents = useMemo(() =>
    parsedEvents
      .filter(ev => ev.parsed!.month === viewMonth)
      .sort((a, b) => a.parsed!.day - b.parsed!.day)
  , [parsedEvents, viewMonth]);

  const navMonth = (dir: number) => {
    setDirection(dir);
    setHighlightDay(null);
    setViewMonth(p => { const n = p + dir; return n < 0 ? 11 : n > 11 ? 0 : n; });
  };

  const daysUntil = useMemo(() => {
    if (!nextEvent?.parsed) return null;
    const next = new Date(year, nextEvent.parsed.month, nextEvent.parsed.day);
    return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [nextEvent]);

  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="calendar" className="w-full" aria-labelledby="calendar-heading">
      <motion.h2
        id="calendar-heading"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover="hover"
        viewport={{ once: true }}
        transition={M3E_EFFECTS}
        className="md-headline-large mb-8 flex items-center gap-3 cursor-default"
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
        >
          <LangText content={{ EN: "Event Calendar", ZH: "活動行事曆" }} lang={lang} inline />
        </motion.span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={M3E_SPATIAL}
        className="overflow-hidden @container"
        style={{
          borderRadius: 'var(--md-shape-extra-large)',
          backgroundColor: 'var(--md-surface-container-low)',
          border: `1px solid var(--md-outline-variant)`,
          boxShadow: `0 2px 6px var(--md-shadow)`,
        }}
      >
        {/* ── Collapsed Header ── */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.998 }}
          className="w-full flex items-center justify-between px-5 sm:px-7 py-4 cursor-pointer group"
          aria-expanded={expanded}
          aria-controls="calendar-content"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated M3E shape icon for next event */}
            {nextEvent && (
              <div className="w-8 h-8 relative shrink-0" aria-hidden="true">
                <motion.svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    fill={darkMode ? nextEvent.colorDark : nextEvent.colorLight}
                    d={getPath("cookie", 100, 100, 0)}
                  />
                </motion.svg>
                {daysUntil !== null && daysUntil <= 7 && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ backgroundColor: 'var(--md-error)', borderColor: 'var(--md-surface-container-low)' }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    aria-label="Event within 7 days"
                  />
                )}
              </div>
            )}

            <div className="flex flex-col items-start min-w-0">
              {nextEvent ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="md-label-small uppercase tracking-widest" style={{ color: 'var(--md-on-surface-variant)' }}>
                      {lang === "ZH" ? "即將到來" : "Next up"}
                    </span>
                    {daysUntil !== null && (
                      <span className="md-label-small font-mono" style={{ color: 'var(--md-primary)' }}>
                        {daysUntil === 0 ? (lang === "ZH" ? "· 今天" : "· Today") :
                         daysUntil === 1 ? (lang === "ZH" ? "· 明天" : "· Tomorrow") :
                         `· ${daysUntil}${lang === "ZH" ? " 天" : "d"}`}
                      </span>
                    )}
                  </div>
                  <span className="md-title-small font-bold truncate max-w-[220px] sm:max-w-none" style={{ color: 'var(--md-on-surface)' }}>
                    <LangText content={nextEvent.title} lang={lang} inline />
                    <span className="md-label-small font-mono ml-1.5 opacity-50">{nextEvent.date}</span>
                  </span>
                </>
              ) : (
                <span className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
                  {lang === "ZH" ? "暫無活動" : "No upcoming events"}
                </span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={M3E_FAST}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0"
            style={{ color: 'var(--md-on-surface-variant)' }}
            aria-hidden="true"
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

        {/* ── Expanded Content ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              id="calendar-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              // Effects spring for height (layout change, but no spatial bounce needed here)
              transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9, opacity: { duration: 0.12 } }}
              className="overflow-hidden"
            >
              <div style={{ borderTop: `1px solid var(--md-outline-variant)` }}>
                <div className="flex flex-col @md:flex-row">

                  {/* ── Calendar Grid ── */}
                  <div
                    className="flex-1 px-4 sm:px-5 py-4"
                    style={{ borderRight: undefined }}
                  >
                    {/* Month navigator */}
                    <div className="flex items-center justify-between mb-3">
                      <motion.button
                        whileHover={{ scale: 1.15, backgroundColor: 'var(--md-surface-container-high)' } as any}
                        whileTap={{ scale: 0.85 }}
                        transition={M3E_FAST}
                        onClick={() => navMonth(-1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        style={{ color: 'var(--md-on-surface-variant)' }}
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={14} />
                      </motion.button>

                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={viewMonth}
                          initial={{ opacity: 0, y: direction * 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: direction * -10 }}
                          transition={M3E_EFFECTS}
                          className="md-title-small font-bold"
                          style={{ color: 'var(--md-on-surface)' }}
                        >
                          {lang === "ZH" ? `${year}年${MONTH_ZH[viewMonth]}` : `${MONTH_EN[viewMonth]} ${year}`}
                        </motion.span>
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.15, backgroundColor: 'var(--md-surface-container-high)' } as any}
                        whileTap={{ scale: 0.85 }}
                        transition={M3E_FAST}
                        onClick={() => navMonth(1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        style={{ color: 'var(--md-on-surface-variant)' }}
                        aria-label="Next month"
                      >
                        <ChevronRight size={14} />
                      </motion.button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-px mb-1">
                      {weekdays.map((d, i) => (
                        <div
                          key={`${d}-${i}`}
                          className="text-center md-label-small py-1"
                          style={{ color: (i === 0 || i === 6) ? 'var(--md-outline)' : 'var(--md-on-surface-variant)', opacity: (i === 0 || i === 6) ? 0.5 : 1 }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day grid */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewMonth}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -20 }}
                        transition={M3E_EFFECTS}
                        className="grid grid-cols-7 gap-px"
                      >
                        {padding.map(i => <div key={`p-${i}`} className="h-9" />)}
                        {days.map((day, dayIdx) => {
                          const dayEv = eventsForDay(day);
                          const has = dayEv.length > 0;
                          const hl = highlightDay === day;
                          const td = isToday(day);
                          const dow = new Date(year, viewMonth, day).getDay();
                          const wknd = dow === 0 || dow === 6;
                          const evColor = has ? (darkMode ? dayEv[0].colorDark : dayEv[0].colorLight) : undefined;

                          // Determine text color using M3E color roles
                          let dayColor: string;
                          if (hl) dayColor = 'var(--md-on-primary-container)';
                          else if (td) dayColor = 'var(--md-primary)';
                          else if (has) dayColor = 'var(--md-on-surface)';
                          else if (wknd) dayColor = 'var(--md-on-surface-variant)';
                          else dayColor = 'var(--md-on-surface-variant)';

                          return (
                            <motion.button
                              key={day}
                              initial={{ opacity: 0, scale: 0.75 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: dayIdx * 0.006, ...M3E_EFFECTS }}
                              onClick={() => has ? setHighlightDay(hl ? null : day) : undefined}
                              whileHover={has ? { scale: 1.18, y: -1 } : {}}
                              whileTap={has ? { scale: 0.88 } : {}}
                              className={`relative h-9 flex items-center justify-center day-cell-morph ${has ? "cursor-pointer has-event" : "cursor-default"}`}
                              // M3E shape.full for day cells (date picker spec)
                              style={{
                                borderRadius: hl ? 'var(--md-shape-large)' : '50%',
                                color: dayColor,
                                backgroundColor: hl ? 'var(--md-primary-container)' : 'transparent',
                                opacity: wknd && !has && !td ? 0.45 : 1,
                              }}
                              aria-label={has ? `${day}, ${dayEv.length} event${dayEv.length > 1 ? 's' : ''}` : `${day}`}
                              aria-pressed={hl || undefined}
                            >
                              {/* Today border ring */}
                              {td && !hl && (
                                <div
                                  className="absolute inset-0.5 rounded-full pointer-events-none"
                                  style={{ border: `1.5px solid var(--md-primary)`, opacity: 0.4 }}
                                  aria-hidden="true"
                                />
                              )}

                              <span className={`md-label-small relative z-10 leading-none ${hl || td ? 'font-black' : has ? 'font-bold' : 'font-medium'}`}>
                                {day}
                              </span>

                              {/* Event indicator dots */}
                              {has && !hl && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5" aria-hidden="true">
                                  {dayEv.slice(0, 3).map(ev => (
                                    <div
                                      key={ev.id}
                                      className="w-1 h-1 rounded-full"
                                      style={{ backgroundColor: darkMode ? ev.textDark : ev.colorLight }}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>

                    {/* Link to event cards */}
                    <motion.button
                      onClick={scrollToEvents}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={M3E_EFFECTS}
                      className="mt-4 md-label-small uppercase tracking-widest cursor-pointer flex items-center gap-1 w-full justify-center py-1.5 transition-colors"
                      style={{ color: 'var(--md-primary)' }}
                      aria-label="Scroll to event cards section"
                    >
                      {lang === "ZH" ? "查看活動卡片" : "View event cards"} <span className="text-xs">↗</span>
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <div className="hidden @md:block w-px self-stretch" style={{ backgroundColor: 'var(--md-outline-variant)', opacity: 0.5 }} />
                  <div className="@md:hidden h-px mx-5" style={{ backgroundColor: 'var(--md-outline-variant)', opacity: 0.5 }} />

                  {/* ── Event List ── */}
                  <div className="flex-1 px-4 sm:px-5 py-4 @md:min-w-[260px]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewMonth}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={M3E_EFFECTS}
                      >
                        {monthEvents.length > 0 ? (
                          <div className="space-y-1.5">
                            <span className="md-label-small uppercase tracking-widest px-1 block mb-3" style={{ color: 'var(--md-on-surface-variant)' }}>
                              {monthEvents.length} {lang === "ZH"
                                ? `個活動 · ${MONTH_ZH[viewMonth]}`
                                : `event${monthEvents.length > 1 ? "s" : ""} · ${MONTH_EN[viewMonth]}`}
                            </span>

                            {monthEvents.map((ev, i) => {
                              const isHl = highlightDay === ev.parsed!.day;
                              const isHov = hoveredEvent === ev.id;
                              const evColor = darkMode ? ev.colorDark : ev.colorLight;
                              const evText = darkMode ? ev.textDark : ev.textLight;

                              return (
                                <motion.button
                                  key={ev.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.04, ...M3E_EFFECTS }}
                                  onClick={() => setActiveItem?.(ev)}
                                  onHoverStart={() => { setHoveredEvent(ev.id); setHighlightDay(ev.parsed!.day); }}
                                  onHoverEnd={() => { setHoveredEvent(null); setHighlightDay(null); }}
                                  whileTap={{ scale: 0.97 }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer text-left relative overflow-hidden group"
                                  style={{
                                    borderRadius: 'var(--md-shape-large)',
                                    // M3E: event row uses low-opacity container tint
                                    backgroundColor: isHl
                                      ? `color-mix(in srgb, ${evColor} 40%, transparent)`
                                      : `color-mix(in srgb, ${evColor} 20%, transparent)`,
                                  }}
                                  aria-label={`Open ${ev.title.EN} event details`}
                                >
                                  {/* Hover overlay */}
                                  <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ borderRadius: 'inherit', backgroundColor: evColor }}
                                    animate={{ opacity: isHov ? 0.12 : 0 }}
                                    transition={M3E_EFFECTS}
                                    aria-hidden="true"
                                  />

                                  {/* Day badge — M3E shape.medium (12dp) */}
                                  <motion.div
                                    className="w-8 h-8 flex items-center justify-center shrink-0 relative z-10 font-black md-label-medium"
                                    style={{
                                      borderRadius: 'var(--md-shape-medium)',
                                      backgroundColor: `color-mix(in srgb, ${evColor} 50%, transparent)`,
                                      color: evText,
                                    }}
                                    animate={{ scale: isHov ? 1.08 : 1 }}
                                    transition={M3E_FAST}
                                  >
                                    {ev.parsed!.day}
                                  </motion.div>

                                  {/* Event info */}
                                  <div className="flex-1 min-w-0 relative z-10">
                                    <LangText content={ev.title} lang={lang} className="md-label-large font-bold truncate block" style={{ color: 'var(--md-on-surface)' }} inline />
                                    <span className="md-label-small font-mono" style={{ color: 'var(--md-on-surface-variant)' }}>{ev.date}</span>
                                  </div>

                                  {/* Arrow badge — M3E shape morph */}
                                  <div className="w-5 h-5 relative shrink-0 z-10" aria-hidden="true">
                                    <motion.svg
                                      viewBox="0 0 100 100"
                                      className="w-full h-full"
                                      animate={{ rotate: isHov ? 90 : 0, scale: isHov ? 1.15 : 1 }}
                                      transition={M3E_FAST}
                                    >
                                      <path
                                        fill={darkMode ? ev.textDark : ev.colorLight}
                                        d={getPath(SHAPES[i % SHAPES.length], 100, 100, 0)}
                                        style={{ opacity: isHov ? 0.85 : 0.35 }}
                                      />
                                    </motion.svg>
                                    <motion.span
                                      className="absolute inset-0 flex items-center justify-center text-[9px] font-black"
                                      style={{ color: darkMode ? ev.colorDark : ev.textLight }}
                                      animate={{ x: isHov ? 1 : 0, scale: isHov ? 1.2 : 1 }}
                                      transition={M3E_FAST}
                                    >→</motion.span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>
                            <motion.svg
                              viewBox="0 0 100 100"
                              className="w-12 h-12 mb-3"
                              aria-hidden="true"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                            >
                              <path
                                fill="currentColor"
                                d={getPath("cookie", 100, 100, 0)}
                              />
                            </motion.svg>
                            <span className="md-label-medium font-bold">
                              {lang === "ZH" ? "本月無活動" : "No events this month"}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
