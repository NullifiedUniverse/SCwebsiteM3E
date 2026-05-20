import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, LayoutGroup, useScroll, useMotionValueEvent } from "motion/react";
import { Moon, Sun, Calendar, Users, Home, Languages, Search, X } from "lucide-react";
import { M3_SPATIAL, M3E_SPATIAL, M3E_EFFECTS, M3E_EFFECTS_FAST, M3E_FAST } from "./utils/physics";
import { ExpandedModal } from "./components/ExpandedModal";
import { HeroSection, EventsSection, CalendarSection, CouncilSection, QuickActionsSection } from "./components/sections";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useAnalytics } from "./hooks/useAnalytics";
import { useScrollNav } from "./hooks/useScrollNav";
import { useSystemTheme } from "./hooks/useSystemTheme";
import { AmbientParticles } from "./components/AmbientParticles";

export default function App() {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [closingItemId, setClosingItemId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useSystemTheme();
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;
    if (typeof navigator !== "undefined" && navigator.language.toLowerCase().includes("zh")) return "ZH";
    return "EN";
  });
  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const [activeFilter, setActiveFilterState] = useState(() => localStorage.getItem("activeFilter") || "All");
  const setActiveFilter = (filter: string) => {
    setActiveFilterState(filter);
    localStorage.setItem("activeFilter", filter);
  };

  const [activeGen, setActiveGenState] = useState(() => localStorage.getItem("activeGen") || "7th");
  const setActiveGen = (gen: string) => {
    setActiveGenState(gen);
    localStorage.setItem("activeGen", gen);
  };

  const { logoClicks, setLogoClicks, langClicks, setLangClicks, partyMode } = useEasterEggs();
  const { activeNav, setActiveNav, scrollTo } = useScrollNav();
  const trackEvent = useAnalytics(lang, darkMode);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 20));

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });

    // Easter Egg #5: Secret console message
    console.log("%c WAHOO! %c", "padding: 10px; background: #005CBB; color: white; border-radius: 5px; font-weight: bold; font-size: 24px;", "");
    console.log("Looks like you found the console. You're a true developer... or just a very lost student.");
  }, []);

  // Compositor scroll progress JS fallback for unsupported browsers
  useEffect(() => {
    if (typeof window !== "undefined" && !CSS.supports("animation-timeline", "scroll()")) {
      const progress = document.getElementById("scroll-progress");
      if (!progress) return;
      const handleScroll = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const scrolled = window.scrollY;
        const progressPercentage = Math.min(Math.max(scrolled / scrollable, 0), 1);
        progress.style.transform = `scaleX(${progressPercentage})`;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Run once initially to capture load state
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useLayoutEffect(() => {
    if (activeItem) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto";
    };
  }, [activeItem]);

  useEffect(() => {
    if (activeItem) {
      trackEvent("view_item", { id: activeItem.id, name: activeItem.name || activeItem.title?.EN, type: activeItem.type });
    }
  }, [activeItem]);

  const NAV_ITEMS = [
    { id: 'home', icon: Home, label: { EN: 'Home', ZH: '首頁', PIRATE: 'Ship' } },
    { id: 'events', icon: Calendar, label: { EN: 'Events', ZH: '活動', PIRATE: 'Raids' } },
    { id: 'council', icon: Users, label: { EN: 'Council', ZH: '成員', PIRATE: 'Crew' } }
  ] as const;

  return (
    <div
      className={`min-h-screen relative z-0 overflow-x-hidden transition-colors duration-700 ${
        partyMode
          ? 'bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 animate-pulse'
          : ''
      }`}
      style={{ backgroundColor: partyMode ? undefined : 'var(--md-surface)', color: 'var(--md-on-surface)' }}
    >
      <AmbientParticles darkMode={darkMode} partyMode={partyMode} />
      {/* ── Ambient Tonal Orbs ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0], rotate: partyMode ? [0, 360] : 0 }}
          transition={{ duration: partyMode ? 2 : 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-12%] left-[-8%] w-[48%] h-[48%] rounded-full blur-[120px]"
          style={{ backgroundColor: partyMode ? 'rgba(236,72,153,0.45)' : 'color-mix(in srgb, var(--md-primary) 18%, transparent)' }}
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -40, 0], rotate: partyMode ? [360, 0] : 0 }}
          transition={{ duration: partyMode ? 2 : 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[18%] right-[-8%] w-[38%] h-[38%] rounded-full blur-[120px]"
          style={{ backgroundColor: partyMode ? 'rgba(234,179,8,0.45)' : 'color-mix(in srgb, var(--md-tertiary) 15%, transparent)' }}
        />
      </div>

      {/* ── M3E Top App Bar ──────────────────────────────────────
          States:
          • Flat   (top):     surface bg, no elevation
          • Scroll (≥20px):   surfaceContainer + Elevation 2 shadow
          Height: 64dp (var(--md-top-app-bar-height))
      ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 transition-all duration-300"
        style={{
          height: 'var(--md-top-app-bar-height)',
          backgroundColor: isScrolled ? 'var(--md-surface-container)' : 'var(--md-surface)',
          boxShadow: isScrolled
            ? `0 1px 2px var(--md-shadow), 0 2px 6px 2px var(--md-shadow), inset 0 0 0 9999px var(--md-elevation-2)`
            : 'none',
        }}
        role="banner"
      >
        {/* Leading: Logo */}
        <div className="flex items-center">
          <motion.img
            src={darkMode
              ? "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-W.png"
              : "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-B.png"
            }
            alt="KCISLK Logo"
            onClick={() => {
              setLogoClicks(c => c + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            animate={logoClicks > 4 ? { rotate: 360 * (logoClicks - 4) } : {}}
            whileTap={{ scale: 0.92 }}
            style={{
              filter: darkMode ? 'brightness(0.95) opacity(0.92)' : undefined,
              cursor: logoClicks > 4 ? 'crosshair' : 'pointer',
            }}
            className="h-8 sm:h-9 object-contain transition-all duration-500"
            loading="eager"
            // @ts-ignore
            fetchPriority="high"
          />
        </div>

        {/* Trailing: Controls — restructured to avoid overflow-hidden clipping issues */}
        <div className="flex items-center gap-1.5">

          {/* ── Search pill — expands independently ── */}
          <motion.div
            layout
            className="flex items-center rounded-full h-10"
            style={{
              backgroundColor: 'var(--md-surface-container-high)',
              border: `1px solid var(--md-outline-variant)`,
              overflow: 'hidden',
            }}
          >
            {/* Search icon toggle */}
            <motion.button
              id="search-toggle"
              onClick={() => {
                if (isSearchOpen) { setIsSearchOpen(false); setSearchQuery(""); }
                else { setIsSearchOpen(true); }
              }}
              className="flex items-center justify-center w-10 h-10 shrink-0 cursor-pointer"
              style={{ color: isSearchOpen ? 'var(--md-primary)' : 'var(--md-on-surface-variant)' }}
              whileHover={{ backgroundColor: 'color-mix(in srgb, var(--md-primary-container) 60%, transparent)' } as any}
              whileTap={{ scale: 0.88 }}
              transition={M3E_EFFECTS}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSearchOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.7 }} transition={M3E_EFFECTS_FAST}>
                    <X size={17} />
                  </motion.div>
                ) : (
                  <motion.div key="s" initial={{ rotate: 90, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.7 }} transition={M3E_EFFECTS_FAST}>
                    <Search size={17} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Expanding search text field */}
            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? 200 : 0 }}
              transition={M3E_SPATIAL}
              className="flex items-center overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <input
                id="search-input"
                ref={(el) => { if (el && isSearchOpen) setTimeout(() => el.focus(), 120); }}
                type="text"
                placeholder={lang === "ZH" ? "搜尋成員…" : "Search members…"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery(""); } }}
                className="bg-transparent border-none outline-none w-full pl-1 pr-4 md-label-medium"
                style={{ color: 'var(--md-on-surface)', minWidth: 0 }}
                aria-label="Search council members"
              />
            </motion.div>
          </motion.div>

          {/* ── Lang + Theme controls group — separate pill, slides away on search ── */}
          <motion.div
            initial={false}
            animate={{ opacity: isSearchOpen ? 0 : 1, x: isSearchOpen ? 12 : 0, scale: isSearchOpen ? 0.9 : 1 }}
            transition={M3E_EFFECTS}
            style={{ pointerEvents: isSearchOpen ? 'none' : 'auto' }}
            className="flex items-center rounded-full h-10"
          >
            {/* Language toggle */}
            <motion.button
              id="lang-toggle"
              whileHover={{ backgroundColor: 'color-mix(in srgb, var(--md-primary-container) 70%, transparent)' } as any}
              whileTap={{ scale: 0.92 }}
              animate={{ borderRadius: 'var(--md-shape-full)' }}
              transition={M3E_EFFECTS}
              onClick={() => {
                setLangClicks(c => c + 1);
                if (langClicks === 6) setLang("PIRATE");
                else setLang(lang === "EN" ? "ZH" : "EN");
                trackEvent("toggle_lang", { to: lang === "EN" ? "ZH" : "EN" });
              }}
              className="flex items-center gap-1.5 h-10 px-4 cursor-pointer shrink-0 whitespace-nowrap md-label-large"
              style={{
                color: 'var(--md-on-surface-variant)',
                backgroundColor: 'var(--md-surface-container-high)',
                border: `1px solid var(--md-outline-variant)`,
                borderRadius: 'var(--md-shape-full)',
              }}
              aria-label="Toggle Language"
            >
              <Languages size={14} />
              <motion.span key={lang} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={M3E_EFFECTS}>
                {lang}
              </motion.span>
            </motion.button>

            <div className="w-2" />

            {/* Theme toggle */}
            <motion.button
              id="theme-toggle"
              initial={false}
              whileHover={{ backgroundColor: 'color-mix(in srgb, var(--md-primary-container) 70%, transparent)' } as any}
              whileTap={{ scale: 0.88 }}
              transition={M3E_EFFECTS}
              onClick={() => { setDarkMode(!darkMode); trackEvent("toggle_theme", { to: !darkMode ? "dark" : "light" }); }}
              className="flex items-center justify-center w-10 h-10 cursor-pointer shrink-0"
              style={{
                color: 'var(--md-on-surface-variant)',
                backgroundColor: 'var(--md-surface-container-high)',
                border: `1px solid var(--md-outline-variant)`,
                borderRadius: 'var(--md-shape-full)',
              }}
              aria-label="Toggle Dark Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                  transition={M3E_EFFECTS_FAST}
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
        {/* ── Scroll Progress Indicator (M3E expressive) ── */}
        <div
          id="scroll-progress"
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[var(--md-primary)] via-[var(--md-tertiary)] to-[var(--md-primary)] transition-transform duration-75 ease-out"
          style={{ transform: 'scaleX(0)' }}
        />
      </motion.header>

      <LayoutGroup id="main-content">
        {/* ── M3E Navigation Bar ────────────────────────────────────
            Desktop: Floating pill (expressive) at bottom-6
            Mobile:  Full-width surface, flush at bottom
            Active indicator: 64×32dp pill behind icon only (M3E spec)
        ─────────────────────────────────────────────────────────── */}
        <LayoutGroup id="navbar">
          {/* Mobile: Full-width bottom nav bar (≤ 640px) */}
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.35 }}
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-end sm:hidden"
            style={{
              backgroundColor: 'var(--md-surface-container)',
              boxShadow: `0 -1px 2px var(--md-shadow), inset 0 0 0 9999px var(--md-elevation-2)`,
              paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
              paddingTop: '12px',
            }}
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((nav) => {
              const isActive = activeNav === nav.id;
              return (
                <motion.button
                  key={nav.id}
                  layout
                  onClick={() => { scrollTo(nav.id); setActiveNav(nav.id); trackEvent("nav_click", { destination: nav.id }); }}
                  className="cursor-pointer flex flex-col items-center gap-1 px-4 py-1 relative min-w-[64px]"
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={`Navigate to ${nav.label.EN}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* M3E active indicator: 64×32dp pill behind icon */}
                  <div className="relative w-16 h-8 flex items-center justify-center">
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator-mobile"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'var(--md-secondary-container)' }}
                        transition={M3E_FAST}
                      />
                    )}
                    <motion.div
                      variants={{ hover: { y: -2, scale: 1.1 }, tap: { scale: 0.88 } }}
                      transition={M3E_FAST}
                      className="relative z-10"
                      style={{ color: isActive ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)' }}
                    >
                      <nav.icon size={22} strokeWidth={isActive ? 2 : 1.75} />
                    </motion.div>
                  </div>
                  {/* Label — always visible on mobile nav bar per M3E spec */}
                  <span
                    className="md-label-medium text-center transition-colors duration-200"
                    style={{ color: isActive ? 'var(--md-on-surface)' : 'var(--md-on-surface-variant)', fontVariationSettings: isActive ? '"wght" 700' : '"wght" 500' }}
                  >
                    {nav.label[lang as keyof typeof nav.label] || nav.label.EN}
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>

          {/* Desktop: Floating pill nav (≥ 640px) — M3E Expressive variant */}
          <div className="hidden sm:flex fixed bottom-6 left-0 right-0 z-40 justify-center pointer-events-none">
            <motion.nav
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.4 }}
              className="p-1.5 rounded-full flex gap-0.5 pointer-events-auto"
              style={{
                backgroundColor: 'var(--md-surface-container-high)',
                boxShadow: `0 4px 24px var(--md-shadow), 0 1px 4px var(--md-shadow), inset 0 0 0 9999px var(--md-elevation-2)`,
                border: `1px solid var(--md-outline-variant)`,
              }}
              aria-label="Main Navigation"
            >
              {NAV_ITEMS.map((nav) => {
                const isActive = activeNav === nav.id;
                return (
                  <motion.button
                    key={nav.id}
                    whileHover="hover"
                    whileTap="tap"
                    transition={M3_SPATIAL}
                    onClick={() => { scrollTo(nav.id); setActiveNav(nav.id); trackEvent("nav_click", { destination: nav.id }); }}
                    aria-label={`Navigate to ${nav.label.EN}`}
                    aria-current={isActive ? "page" : undefined}
                    className="cursor-pointer relative flex items-center justify-center h-12 rounded-full overflow-hidden transition-colors z-10"
                    style={{
                      paddingLeft: isActive ? '20px' : '16px',
                      paddingRight: isActive ? '20px' : '16px',
                      color: isActive ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator-desktop"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'var(--md-secondary-container)' }}
                        transition={M3E_FAST}
                      />
                    )}
                    <motion.div className="flex items-center gap-0">
                      <motion.div
                        variants={{ hover: { scale: 1.12, y: -2 }, tap: { scale: 0.9 } }}
                        transition={M3E_FAST}
                        className="relative z-10"
                      >
                        <nav.icon size={20} strokeWidth={isActive ? 2 : 1.75} />
                      </motion.div>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            key={lang}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={M3E_SPATIAL}
                            className="overflow-hidden whitespace-nowrap flex items-center relative z-10"
                          >
                            <motion.span
                              variants={{
                                hover: { fontVariationSettings: '"wght" 750' },
                                tap: { fontVariationSettings: '"wght" 500' }
                              }}
                              transition={M3E_EFFECTS}
                              className="pl-2 md-label-large uppercase tracking-widest block"
                              style={{
                                fontSize: lang === 'ZH' ? '0.65rem' : undefined,
                                fontVariationSettings: '"wght" 700',
                              }}
                            >
                              {nav.label[lang as keyof typeof nav.label] || nav.label.EN}
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.nav>
          </div>
        </LayoutGroup>

        <main
          className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-40 md:pt-44 pb-40 sm:pb-24 relative z-10"
          style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}
        >
          <HeroSection
            lang={lang}
            darkMode={darkMode}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            closingItemId={closingItemId}
          />

          <EventsSection
            lang={lang}
            darkMode={darkMode}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            closingItemId={closingItemId}
          />

          <CalendarSection
            lang={lang}
            darkMode={darkMode}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />

          <CouncilSection
            lang={lang}
            darkMode={darkMode}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            activeGen={activeGen}
            setActiveGen={setActiveGen}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            trackEvent={trackEvent}
            searchQuery={searchQuery}
            closingItemId={closingItemId}
          />

          <QuickActionsSection lang={lang} />
        </main>

        <AnimatePresence onExitComplete={() => setClosingItemId(null)}>
          {activeItem && (
            <motion.div
              key={`modal-wrapper-${activeItem.id}`}
              className="fixed inset-0"
              style={{ zIndex: 49, pointerEvents: activeItem ? "auto" : "none" }}
            >
              <ExpandedModal
                activeItem={activeItem}
                setActiveItem={(item: any) => {
                  if (!item && activeItem) setClosingItemId(activeItem.id);
                  setActiveItem(item);
                }}
                darkMode={darkMode}
                lang={lang}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}


