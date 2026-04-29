import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Moon, Sun, Calendar, Users, Home, Languages } from "lucide-react";
import { M3_SPRING } from "./utils/physics";
import { ExpandedModal } from "./components/ExpandedModal";
import { HeroSection, EventsSection, CouncilSection, QuickActionsSection } from "./components/sections";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useAnalytics } from "./hooks/useAnalytics";
import { useScrollNav } from "./hooks/useScrollNav";
import { useSystemTheme } from "./hooks/useSystemTheme";

export default function App() {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [darkMode, setDarkMode] = useSystemTheme();
  const [lang, setLang] = useState("EN");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeGen, setActiveGen] = useState("7th");

  const { logoClicks, setLogoClicks, langClicks, setLangClicks, partyMode } = useEasterEggs();
  const { activeNav, setActiveNav, scrollTo } = useScrollNav();
  const trackEvent = useAnalytics(lang, darkMode);

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

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="fixed top-6 left-6 z-50 pointer-events-auto">
        <motion.img 
          src={darkMode ? "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-W.png" : "https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-B.png"}
          alt="KCISLK Logo" 
          onClick={() => setLogoClicks(c => c + 1)}
          animate={logoClicks > 4 ? { rotate: 360 * (logoClicks - 4) } : {}}
          whileTap={{ scale: 0.9 }}
          style={{ filter: darkMode ? 'brightness(1) opacity(0.9)' : undefined, cursor: logoClicks > 4 ? 'crosshair' : 'pointer' }}
          className="h-8 sm:h-10 object-contain dark:drop-shadow-sm transition-all duration-700" 
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="fixed top-6 right-6 z-40 flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg dark:shadow-xl dark:shadow-slate-900/50">
        <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => { setLangClicks(c => c + 1); if (langClicks === 6) setLang("PIRATE"); else setLang(lang === "EN" ? "ZH" : "EN"); trackEvent("toggle_lang", { to: lang === "EN" ? "ZH" : "EN" }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors text-sm font-bold cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60" aria-label="Toggle Language"><Languages size={16} />{lang}</motion.button>
        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 transition-colors duration-700" />
        <motion.button animate={{ rotate: darkMode ? 180 : 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} onClick={() => { setDarkMode(!darkMode); trackEvent("toggle_theme", { to: !darkMode ? "dark" : "light" }); }} className="p-2.5 rounded-full transition-colors mr-0.5 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60" aria-label="Toggle Dark Mode">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</motion.button>
      </motion.div>

      <LayoutGroup>
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <motion.nav initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }} layout className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-full flex gap-1 shadow-2xl dark:shadow-xl dark:shadow-slate-900/50 border border-slate-200/50 dark:border-white/10 pointer-events-auto backdrop-blur-xl" aria-label="Main Navigation">
            {[
              { id: 'home', icon: Home, label: { EN: 'Home', ZH: '首頁', PIRATE: 'Yer Ship' } }, 
              { id: 'events', icon: Calendar, label: { EN: 'Events', ZH: '活動資訊', PIRATE: 'Mutinies' } }, 
              { id: 'council', icon: Users, label: { EN: 'Council', ZH: '學生會成員', PIRATE: 'Crew' } }
            ].map((nav) => {
              const isActive = activeNav === nav.id;
              return (
                <motion.button 
                  key={nav.id} layout whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => { scrollTo(nav.id); setActiveNav(nav.id); trackEvent("nav_click", { destination: nav.id }); }} 
                  aria-label={`Navigate to ${nav.id}`}
                  className={`cursor-pointer relative flex items-center justify-center h-12 rounded-full transition-colors z-10 overflow-hidden ${isActive ? 'text-blue-600 dark:text-blue-400 px-5 sm:px-6' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-4'}`}
                >
                  {isActive && <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full z-[-1]" transition={M3_SPRING} />}
                  <motion.div layout className="flex items-center">
                    <nav.icon size={20} className={`shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div key={lang} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={M3_SPRING} className="overflow-hidden whitespace-nowrap flex items-center">
                          <span className="pl-2 text-xs uppercase tracking-widest font-bold">
                            {nav.label[lang as keyof typeof nav.label] || nav.label.EN}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.nav>
        </div>

        <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 space-y-24 pt-32 md:pt-40 pb-40">
          
          <HeroSection 
            lang={lang} 
            darkMode={darkMode} 
            activeItem={activeItem} 
            setActiveItem={setActiveItem} 
          />

          <EventsSection 
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
          />

          <QuickActionsSection 
            lang={lang} 
          />

        </main>

        <AnimatePresence>
          {activeItem && <ExpandedModal activeItem={activeItem} setActiveItem={setActiveItem} darkMode={darkMode} lang={lang} />}
        </AnimatePresence>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
