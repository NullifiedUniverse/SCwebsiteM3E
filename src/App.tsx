import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, LayoutGroup, useScroll, useMotionValueEvent } from "motion/react";
import { Moon, Sun, Calendar, Users, Home, Languages, Search, X } from "lucide-react";
import { M3_SPRING, M3_EXPRESSIVE_SPRING, getPath } from "./utils/physics";
import { ExpandedModal } from "./components/ExpandedModal";
import { HeroSection, EventsSection, CalendarSection, CouncilSection, QuickActionsSection } from "./components/sections";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useAnalytics } from "./hooks/useAnalytics";
import { useScrollNav } from "./hooks/useScrollNav";
import { useSystemTheme } from "./hooks/useSystemTheme";

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
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventRightClick);
    trackEvent("page_view", { path: window.location.pathname });
    
    // Easter Egg #5: Secret console message
    console.log("%c WAHOO! %c", "padding: 10px; background: #0284c7; color: white; border-radius: 5px; font-weight: bold; font-size: 24px;", "");
    console.log("Looks like you found the console. You're a true developer... or just a very lost student.");

    return () => document.removeEventListener("contextmenu", preventRightClick);
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

  return (
    <div className={`min-h-screen selection:bg-blue-300 transition-colors duration-700 relative z-0 overflow-x-hidden ${partyMode ? 'bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 animate-pulse' : 'bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'}`}>
      
      {/* ORBS */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: partyMode ? [0, 360] : 0 }} transition={{ duration: partyMode ? 2 : 20, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${partyMode ? 'bg-pink-500/50' : 'bg-blue-400/20 dark:bg-blue-600/20'} rounded-full blur-[100px]`} />
        <motion.div animate={{ x: [0, -100, 0], y: [0, -50, 0], rotate: partyMode ? [360, 0] : 0 }} transition={{ duration: partyMode ? 2 : 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[20%] right-[-10%] w-[40%] h-[40%] ${partyMode ? 'bg-yellow-500/50' : 'bg-purple-400/20 dark:bg-purple-600/20'} rounded-full blur-[100px]`} />
      </div>

      {/* M3 Scroll Elevation App Bar */}
      <motion.header 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 transition-all duration-500 ${isScrolled ? "bg-slate-50/95 dark:bg-slate-950/95 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]" : "bg-transparent"}`}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <motion.img 
            src={darkMode ? "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-W.png" : "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-B.png"}
            alt="KCISLK Logo" 
            onClick={() => {
              setLogoClicks(c => c + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            animate={logoClicks > 4 ? { rotate: 360 * (logoClicks - 4) } : {}}
            whileTap={{ scale: 0.9 }}
            style={{ filter: darkMode ? 'brightness(1) opacity(0.9)' : undefined, cursor: logoClicks > 4 ? 'crosshair' : 'pointer' }}
            className="h-8 sm:h-10 object-contain dark:drop-shadow-sm transition-all duration-700" 
          />
        </div>

        {/* Right: Controls & Search */}
        <div className="flex items-center justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden h-10">
            
            {/* Search button — always visible, icon morphs */}
            <motion.button
              onClick={() => { 
                if (isSearchOpen) { setIsSearchOpen(false); setSearchQuery(""); } 
                else { setIsSearchOpen(true); } 
              }}
              className="flex items-center justify-center w-10 h-10 shrink-0 cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSearchOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Search size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Search input — expands when open */}
            <motion.div 
              initial={false}
              animate={{ width: isSearchOpen ? 260 : 0, opacity: isSearchOpen ? 1 : 0 }}
              transition={M3_EXPRESSIVE_SPRING}
              className="overflow-hidden flex items-center"
            >
              <input 
                ref={(el) => { if (el && isSearchOpen) el.focus(); }}
                type="text" 
                placeholder={lang === "ZH" ? "搜尋成員..." : "Search members..."} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery(""); } }}
                className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full pr-3"
              />
            </motion.div>

            {/* Divider + Lang + Divider + Theme — collapse when search open */}
            <motion.div 
              initial={false}
              animate={{ width: isSearchOpen ? 0 : "auto", opacity: isSearchOpen ? 0 : 1 }}
              transition={M3_EXPRESSIVE_SPRING}
              className="flex items-center overflow-hidden shrink-0"
            >
              <div className="w-px h-5 bg-slate-300/70 dark:bg-slate-700 shrink-0" />
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => { setLangClicks(c => c + 1); if (langClicks === 6) setLang("PIRATE"); else setLang(lang === "EN" ? "ZH" : "EN"); trackEvent("toggle_lang", { to: lang === "EN" ? "ZH" : "EN" }); }} 
                className="flex items-center gap-1.5 px-3 py-1.5 font-bold cursor-pointer text-slate-700 dark:text-slate-300 text-sm rounded-xl shrink-0 whitespace-nowrap" 
                aria-label="Toggle Language"
              ><Languages size={15} />{lang}</motion.button>
              <div className="w-px h-5 bg-slate-300/70 dark:bg-slate-700 shrink-0" />
              <motion.button 
                initial={false}
                animate={darkMode ? { rotate: 180 } : { rotate: 0 }}
                whileHover={{ scale: 1.1, backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }} 
                whileTap={{ scale: 0.85 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => { setDarkMode(!darkMode); trackEvent("toggle_theme", { to: !darkMode ? "dark" : "light" }); }} 
                className="flex items-center justify-center w-9 h-9 cursor-pointer text-slate-700 dark:text-slate-300 rounded-xl shrink-0" 
                aria-label="Toggle Dark Mode"
              >{darkMode ? <Sun size={17} /> : <Moon size={17} />}</motion.button>
            </motion.div>

          </div>
        </div>
      </motion.header>

      <LayoutGroup id="main-content">
        <LayoutGroup id="navbar">
          <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <motion.nav 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.4 }} 
              className="bg-white dark:bg-slate-900 p-2 rounded-full flex gap-1 shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-200/40 dark:border-slate-800/60 pointer-events-auto" 
              aria-label="Main Navigation"
            >
              {[
                { id: 'home', icon: Home, label: { EN: 'Home', ZH: '首頁', PIRATE: 'Yer Ship' } }, 
                { id: 'events', icon: Calendar, label: { EN: 'Events', ZH: '活動資訊', PIRATE: 'Mutinies' } }, 
                { id: 'council', icon: Users, label: { EN: 'Council', ZH: '學生會成員', PIRATE: 'Crew' } }
              ].map((nav) => {
                const isActive = activeNav === nav.id;
                return (
                  <motion.button 
                    key={nav.id} 
                    layout
                    whileHover="hover"
                    whileTap="tap"
                    transition={M3_SPRING}
                    onClick={() => { scrollTo(nav.id); setActiveNav(nav.id); trackEvent("nav_click", { destination: nav.id }); }} 
                    aria-label={`Navigate to ${nav.id}`}
                    className={`cursor-pointer relative flex items-center justify-center h-12 rounded-full transition-colors z-10 overflow-hidden ${isActive ? 'text-blue-600 dark:text-blue-400 px-5 sm:px-6' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-4'}`}
                  >
                    {isActive && <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-blue-100/80 dark:bg-blue-900/30 rounded-full shadow-sm shadow-blue-200/50 dark:shadow-none z-[-1]" transition={M3_SPRING} />}
                    <motion.div layout className="flex items-center">
                      <motion.div variants={{ initial: { scale: 1, y: 0 }, hover: { scale: 1.1, y: -2 }, tap: { scale: 0.95 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                        <nav.icon size={20} className={`shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                      </motion.div>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div 
                            key={lang} 
                            initial={{ opacity: 0, width: 0 }} 
                            animate={{ opacity: 1, width: "auto" }} 
                            exit={{ opacity: 0, width: 0 }} 
                            transition={M3_SPRING} 
                            className="overflow-hidden whitespace-nowrap flex items-center text-xs"
                          >
                            <motion.span 
                              variants={{ 
                                initial: { fontVariationSettings: '"wght" 700', x: 0 }, 
                                hover: { fontVariationSettings: '"wght" 900', x: 1 }, 
                                tap: { fontVariationSettings: '"wght" 500', x: -1 } 
                              }} 
                              transition={{ type: "spring", stiffness: 500, damping: 25 }} 
                              className="pl-2 uppercase tracking-widest font-bold block" 
                              style={{ fontSize: (lang === 'ZH') ? '0.65rem' : undefined }}
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

        <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 space-y-32 pt-40 md:pt-48 pb-48 relative z-10">
          
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
          />

          <QuickActionsSection 
            lang={lang} 
          />

        </main>

        <AnimatePresence onExitComplete={() => setClosingItemId(null)}>
          {activeItem && <ExpandedModal activeItem={activeItem} setActiveItem={(item: any) => { if (!item && activeItem) setClosingItemId(activeItem.id); setActiveItem(item); }} darkMode={darkMode} lang={lang} />}
        </AnimatePresence>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
