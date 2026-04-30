import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { CMS } from "../../data/cms";
import { M3_SPRING, M3_EXPRESSIVE_SPRING, getPath } from "../../utils/physics";
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

  // Parse all events with dates
  const parsedEvents = useMemo(() =>
    CMS.events.map(ev => ({ ...ev, parsed: parseDate(ev.date) })).filter(e => e.parsed !== null)
  , []);

  // Build event map: month → day → events[]
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

  // Upcoming events sorted
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

  // Calendar grid
  const daysInMonth = new Date(year, viewMonth + 1, 0).getDate();
  const firstDay = new Date(year, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);
  const eventsForDay = useCallback((d: number) => eventMap[viewMonth]?.[d] || [], [eventMap, viewMonth]);
  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth();
  const weekdays = lang === "ZH" ? WKDAY_ZH : WKDAY_EN;

  // All events this month, sorted by day
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

  // Days until next event
  const daysUntil = useMemo(() => {
    if (!nextEvent?.parsed) return null;
    const next = new Date(year, nextEvent.parsed.month, nextEvent.parsed.day);
    return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [nextEvent]);

  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="calendar" className="w-full">
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="font-sans font-black text-slate-800 dark:text-slate-200 tracking-tight text-3xl md:text-4xl mb-8 flex items-center gap-3 cursor-default"
      >
        <Calendar size={28} className="text-blue-500" />
        <LangText content={{ EN: "Event Calendar", ZH: "活動行事曆" }} lang={lang} inline />
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={M3_EXPRESSIVE_SPRING}
        className="rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/50"
      >
        {/* ── Header Bar ── */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.997 }}
          className="w-full flex items-center justify-between px-5 sm:px-7 py-4 cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {nextEvent && (
              <div className="w-8 h-8 relative shrink-0">
                <motion.svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.path
                    fill={darkMode ? nextEvent.colorDark : nextEvent.colorLight}
                    animate={{ d: [
                      getPath("cookie", 100, 100, 0),
                      getPath("cookie", 100, 100, 1.5),
                      getPath("cookie", 100, 100, 0)
                    ] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.svg>
                {daysUntil !== null && daysUntil <= 7 && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            )}
            <div className="flex flex-col items-start min-w-0">
              {nextEvent ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {lang === "ZH" ? "即將到來" : "Next up"}
                    </span>
                    {daysUntil !== null && (
                      <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400">
                        {daysUntil === 0 ? (lang === "ZH" ? "· 今天" : "· Today") :
                         daysUntil === 1 ? (lang === "ZH" ? "· 明天" : "· Tomorrow") :
                         `· ${daysUntil}${lang === "ZH" ? " 天" : "d"}`}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-none">
                    <LangText content={nextEvent.title} lang={lang} inline />
                    <span className="text-slate-400 dark:text-slate-600 font-mono ml-1.5 text-[10px]">{nextEvent.date}</span>
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400">{lang === "ZH" ? "暫無活動" : "No upcoming events"}</span>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={M3_SPRING}
            className="text-slate-400 dark:text-slate-500 w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors shrink-0"
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

        {/* ── Expanded Content ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 28, mass: 0.8, opacity: { duration: 0.15 } }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 dark:border-slate-800/60">
                {/* Split layout: calendar grid left, events right on desktop */}
                <div className="flex flex-col md:flex-row">
                  
                  {/* ── Calendar Grid Side ── */}
                  <div className="flex-1 px-4 sm:px-5 py-3 md:border-r md:border-slate-100 md:dark:border-slate-800/40">
                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-2">
                      <motion.button
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                        onClick={() => navMonth(-1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      ><ChevronLeft size={14} /></motion.button>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={viewMonth}
                          initial={{ opacity: 0, y: direction * 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: direction * -10 }}
                          transition={{ duration: 0.2, ease: [0, 0, 0, 1] }}
                          className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-tight"
                        >
                          {lang === "ZH" ? `${year}年${MONTH_ZH[viewMonth]}` : `${MONTH_EN[viewMonth]} ${year}`}
                        </motion.span>
                      </AnimatePresence>
                      <motion.button
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                        onClick={() => navMonth(1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      ><ChevronRight size={14} /></motion.button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-px mb-px">
                      {weekdays.map((d, i) => (
                        <div key={`${d}-${i}`} className={`text-center text-[9px] font-bold py-1 ${i === 0 || i === 6 ? "text-slate-300 dark:text-slate-700" : "text-slate-400 dark:text-slate-600"}`}>{d}</div>
                      ))}
                    </div>

                    {/* Day grid */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewMonth}
                        initial={{ opacity: 0, x: direction * 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -24 }}
                        transition={{ duration: 0.22, ease: [0, 0, 0, 1] }}
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

                          return (
                            <motion.button
                              key={day}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: dayIdx * 0.008, duration: 0.25, ease: [0, 0, 0, 1] }}
                              onClick={() => has ? setHighlightDay(hl ? null : day) : undefined}
                              whileHover={has ? { scale: 1.2, y: -2, backgroundColor: evColor ? `${evColor}20` : undefined } : {}}
                              whileTap={has ? { scale: 0.85 } : {}}
                              className={`relative h-9 flex items-center justify-center rounded-xl transition-colors duration-150 ${
                                has ? "cursor-pointer" : "cursor-default"
                              } ${
                                hl ? "bg-blue-500 dark:bg-blue-500 text-white shadow-md shadow-blue-500/25"
                                : td ? "text-blue-600 dark:text-blue-400"
                                : has ? "text-slate-800 dark:text-slate-100"
                                : wknd ? "text-slate-300 dark:text-slate-700"
                                : "text-slate-450 dark:text-slate-550"
                              }`}
                            >
                              {td && !hl && (
                                <div className="absolute inset-0.5 rounded-xl border-[1.5px] border-blue-400/30 dark:border-blue-500/25 pointer-events-none" />
                              )}

                              <span className={`text-[11px] relative z-10 leading-none ${
                                hl ? "font-black" : td ? "font-black" : has ? "font-bold" : "font-medium"
                              }`}>{day}</span>

                              {/* Static event dots — clean, no pulsing */}
                              {has && !hl && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
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
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-3 text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer flex items-center gap-1 transition-colors w-full justify-center py-1"
                    >
                      {lang === "ZH" ? "查看活動卡片" : "View event cards"} <span className="text-[12px]">↗</span>
                    </motion.button>
                  </div>

                  {/* ── Events List Side ── */}
                  <div className="flex-1 px-4 sm:px-5 py-3 md:min-w-[280px]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewMonth}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {monthEvents.length > 0 ? (
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1 block mb-2">
                              {monthEvents.length} {lang === "ZH" ? `個活動 · ${MONTH_ZH[viewMonth]}` : `event${monthEvents.length > 1 ? "s" : ""} · ${MONTH_EN[viewMonth]}`}
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
                                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0, 0, 0, 1] }}
                                  onClick={() => setActiveItem?.(ev)}
                                  onHoverStart={() => { setHoveredEvent(ev.id); setHighlightDay(ev.parsed!.day); }}
                                  onHoverEnd={() => { setHoveredEvent(null); setHighlightDay(null); }}
                                  whileTap={{ scale: 0.96 }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-left transition-shadow relative overflow-hidden group"
                                  style={{ backgroundColor: isHl ? (darkMode ? `${evColor}30` : `${evColor}50`) : (darkMode ? `${evColor}12` : `${evColor}25`) }}
                                >
                                  {/* Hover sweep */}
                                  <motion.div
                                    className="absolute inset-0 rounded-xl pointer-events-none"
                                    animate={{ opacity: isHov ? 0.15 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ backgroundColor: evColor }}
                                  />

                                  {/* Day badge */}
                                  <motion.div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative z-10 font-black text-[11px]"
                                    style={{ backgroundColor: darkMode ? `${evColor}40` : `${evColor}60`, color: evText }}
                                    animate={{ scale: isHov ? 1.08 : 1 }}
                                    transition={M3_SPRING}
                                  >
                                    {ev.parsed!.day}
                                  </motion.div>

                                  {/* Event info */}
                                  <div className="flex-1 min-w-0 relative z-10">
                                    <LangText content={ev.title} lang={lang} className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate block" inline />
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{ev.date}</span>
                                  </div>

                                  {/* Arrow with M3E shape */}
                                  <div className="w-5 h-5 relative shrink-0 z-10">
                                    <motion.svg viewBox="0 0 100 100" className="w-full h-full">
                                      <motion.path
                                        fill={darkMode ? ev.textDark : ev.colorLight}
                                        animate={{
                                          d: isHov
                                            ? getPath(SHAPES[(i + 1) % SHAPES.length], 100, 100, i + 5)
                                            : getPath(SHAPES[i % SHAPES.length], 100, 100, i),
                                          opacity: isHov ? 0.8 : 0.3
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                      />
                                    </motion.svg>
                                    <motion.span
                                      className="absolute inset-0 flex items-center justify-center text-[8px] font-black"
                                      style={{ color: darkMode ? ev.colorDark : ev.textLight }}
                                      animate={{ x: isHov ? 1 : 0, scale: isHov ? 1.2 : 1 }}
                                      transition={M3_SPRING}
                                    >→</motion.span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-600">
                            <motion.svg viewBox="0 0 100 100" className="w-12 h-12 mb-2 opacity-30">
                              <motion.path
                                fill="currentColor"
                                animate={{ d: [getPath("cookie", 100, 100, 0), getPath("cookie", 100, 100, 2), getPath("cookie", 100, 100, 0)] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </motion.svg>
                            <span className="text-xs font-bold">{lang === "ZH" ? "本月無活動" : "No events this month"}</span>
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
