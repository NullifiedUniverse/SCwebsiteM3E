import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { DEPTS } from "../data/cms";
import { getPath, M3_SPRING, M3_EXPRESSIVE_SPRING } from "../utils/physics";
import { X, Info, Users, Calendar, Bug } from "lucide-react";

// getOrganicPath removed in favor of system-wide getPath

export function ExpandedModal({ activeItem, setActiveItem, darkMode, lang }: any) {
  const [imgFailed, setImgFailed] = useState(false);
  const [andrewScore, setAndrewScore] = useState(0);
  const [andrewParticles, setAndrewParticles] = useState<{id: number, text: string, x: number, y: number, color?: string}[]>([]);
  const [andrewBugs, setAndrewBugs] = useState<{id: number, pathX: number[], pathY: number[], duration: number}[]>([]);
  const [fabHovered, setFabHovered] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [activeItem]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveItem(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      if (e.key === "Escape") {
        handleClose(); 
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isMember = activeItem?.type === "member";
  const theme = isMember ? DEPTS[activeItem.dept] : null;
  const isAndrew = isMember && activeItem.name.includes("Andrew");
  
  const handleAndrewClick = (e: React.MouseEvent) => {
    if (!isAndrew) return;
    setAndrewScore(s => s + 1);
    const texts = ["<div />", "wahoo", "sudo rm -rf /", "console.log()", "undefined", "NaN", "Easter Egg #42", "Fixing bugs...", "TypeScript > JS"];
    const text = texts[Math.floor(Math.random() * texts.length)];
    
    setAndrewParticles(p => [...p, { id: Date.now() + Math.random(), text, x: e.clientX, y: e.clientY }]);

    if (andrewScore > 0 && andrewScore % 4 === 0) {
      setAndrewBugs(b => [...b, { 
        id: Date.now(), 
        pathX: Array.from({length: 6}, () => (Math.random() - 0.5) * window.innerWidth),
        pathY: Array.from({length: 6}, () => (Math.random() - 0.5) * window.innerHeight),
        duration: 8 + Math.random() * 5
      }]);
    }
  };

  const squashBug = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAndrewBugs(b => b.filter(bug => bug.id !== id));
    setAndrewScore(s => s + 5);
    setAndrewParticles(p => [...p, { id: Date.now() + Math.random(), text: "SQUASHED!", x: e.clientX, y: e.clientY, color: "text-red-400" }]);
  };
  
  const modalPaths = useMemo(() => isMember ? [
    getPath(theme!.shape, 100, 100, activeItem.seed),
    getPath(theme!.shape, 100, 100, activeItem.seed + 1.5),
    getPath(theme!.shape, 100, 100, activeItem.seed + 3),
    getPath(theme!.shape, 100, 100, activeItem.seed)
  ] : [], [isMember, theme, activeItem]);

  const bgColor = isAndrew ? (darkMode ? "#082f49" : "#0284c7") : (theme ? (darkMode ? theme.dark : theme.light) : (darkMode ? activeItem.colorDark : activeItem.colorLight));
  const textColor = isAndrew ? (darkMode ? "#e0f2fe" : "#ffffff") : (theme ? (darkMode ? theme.textDark : theme.textLight) : (darkMode ? activeItem.textDark : activeItem.textLight));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9990] bg-slate-900/80 dark:bg-slate-950/90"
        onClick={(e) => handleClose(e as any)}
      />

      <motion.div 
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <motion.div
          layoutId={`card-${activeItem.id}`} 
          className={`w-full max-w-2xl h-[85vh] sm:h-[700px] shadow-2xl border border-black/5 dark:border-none dark:shadow-2xl relative pointer-events-auto flex flex-col bg-opacity-100 rounded-[48px] overflow-hidden`}
          style={{ backgroundColor: bgColor, borderRadius: 48 }} 
          transition={M3_EXPRESSIVE_SPRING}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {isAndrew && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-overlay overflow-hidden">
              <motion.div 
                className="absolute inset-0 origin-bottom"
                style={{ backgroundImage: `linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)' }}
                animate={{ backgroundPosition: ['0px 0px', '0px 40px'] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0.08 } }} 
            transition={{ duration: 0.25, delay: 0.05 }}
            className="absolute inset-0 flex flex-col overflow-y-auto hide-scrollbar z-10"
          >
            {activeItem.image && !isMember && (
              <div className="w-full h-64 sm:h-80 shrink-0 relative overflow-hidden rounded-t-[48px] -mt-2">
                <motion.div 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 mix-blend-overlay" 
                  style={{ backgroundImage: `url(${encodeURI(activeItem.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
                />
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, transparent 20%, ${bgColor} 100%)` }} />
              </div>
            )}

            <div className={`flex-1 px-8 sm:px-12 pb-24 cursor-default transition-all duration-700 ${(!isMember && activeItem.image) ? '-mt-16 relative z-10' : 'pt-16 sm:pt-20'}`}>
              
               {isMember && activeItem.image && !imgFailed && (
                 <div className="w-full flex justify-center">
                   <motion.div 
                     onClick={handleAndrewClick}
                     whileTap={isAndrew ? { scale: 0.9 } : undefined}
                     initial={{ scale: 0.8, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     transition={{ ...M3_SPRING, delay: 0.05 }}
                     className={`w-[180px] h-[180px] sm:w-56 sm:h-56 mb-8 relative dark:drop-shadow-xl ${isAndrew ? 'cursor-pointer hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]' : ''}`}
                   >
                     <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                       <defs>
                         <clipPath id={`modal-clip-img-${activeItem.id}`}>
                           <motion.path animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                         </clipPath>
                       </defs>
                       <motion.path fill={bgColor} animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                       <g transform="translate(3, 3) scale(0.94)" clipPath={`url(#modal-clip-img-${activeItem.id})`}>
                         <image href={encodeURI(activeItem.image)} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                       </g>
                     </svg>
                   </motion.div>
                 </div>
              )}

              {/* Andrew Particles */}
              {isAndrew && andrewParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.5 }}
                  animate={{ opacity: 0, y: p.y - 150, x: p.x + (Math.random() - 0.5) * 100, scale: 1.5, rotate: (Math.random() - 0.5) * 45 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  onAnimationComplete={() => setAndrewParticles(arr => arr.filter(item => item.id !== p.id))}
                  className={`fixed font-mono font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] pointer-events-none z-[110] whitespace-nowrap ${p.color || 'text-cyan-300'}`}
                >
                  {p.text}
                </motion.div>
              ))}

              <div className={isMember ? "flex flex-col items-center text-center" : "flex flex-col"}>
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.05, duration: 0.35, ease: [0, 0, 0, 1] }}>
                  <LangText content={isMember ? { EN: `${activeItem.gen} • ${theme!.name.EN}`, ZH: `${activeItem.gen}屆 • ${theme!.name.ZH}` } : (activeItem.label || activeItem.date)} lang={lang} className="font-mono font-bold text-sm tracking-widest uppercase mb-4 block opacity-80 transition-all duration-300" style={{ color: textColor, ...(isAndrew ? { fontVariationSettings: `'wght' ${Math.min(900, 400 + andrewScore * 50)}` } : {}) }} />
                </motion.div>
                <h2 id="modal-title" className="m-0 p-0 w-full relative">
                  <motion.div initial={{ filter: "blur(4px)", y: 15, opacity: 0 }} animate={{ filter: "blur(0px)", y: 0, opacity: 1 }} exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0 } }} transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0, 1] }}>
                    <LangText content={activeItem.title || activeItem.name} lang={lang} className={`font-sans text-5xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tighter leading-tight ${isAndrew ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : ''} transition-all duration-300 block w-full`} style={{ color: textColor, ...(isAndrew ? { fontVariationSettings: `'opsz' ${8 + (andrewScore * 5) % 136}, 'wght' ${Math.min(900, 100 + andrewScore * 20)}` } : {}) }} />
                  </motion.div>
                </h2>
                {isMember && <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.18, duration: 0.35, ease: [0, 0, 0, 1] }}><LangText content={activeItem.role} lang={lang} className="text-xl font-bold opacity-90 mb-8 block" style={{ color: textColor }} /></motion.div>}
              </div>
              
              {!isMember && <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.22, duration: 0.35, ease: [0, 0, 0, 1] }}><LangText content={activeItem.desc} lang={lang} className="text-xl leading-relaxed font-medium opacity-90 mt-6 block max-w-prose" style={{ color: textColor }} /></motion.div>}

              {isMember && (
                <div className="space-y-10 mt-8 max-w-prose mx-auto">
                  <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.25, duration: 0.35, ease: [0, 0, 0, 1] }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-3 flex items-center justify-center gap-2" style={{ color: textColor }}><Info size={16} /> <LangText content={{ EN: "About Me", ZH: "關於我" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.about} lang={lang} className="text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block text-center" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.32, duration: 0.5 }} className="h-px w-2/3 mx-auto opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.35, duration: 0.35, ease: [0, 0, 0, 1] }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-3 flex items-center justify-center gap-2" style={{ color: textColor }}><Users size={16} /> <LangText content={{ EN: "Expectation", ZH: "我的期望" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.expectation} lang={lang} className="text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block text-center" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.42, duration: 0.5 }} className="h-px w-2/3 mx-auto opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ delay: 0.45, duration: 0.35, ease: [0, 0, 0, 1] }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-3 flex items-center justify-center gap-2" style={{ color: textColor }}><Calendar size={16} /> <LangText content={{ EN: "Responsibility", ZH: "我的職責" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.responsibility} lang={lang} className="text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block text-center" style={{ color: textColor }} />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>

          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto">
            <motion.button 
              variants={{
                hidden: { scale: 0, opacity: 0, y: 40 },
                visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22, delay: 0.15 } },
                hover: { scale: 1.05, y: -3, transition: { type: "spring", stiffness: 500, damping: 25 } },
                tap: { scale: 0.95, y: 1, transition: { type: "spring", stiffness: 500, damping: 20 } },
                exit: { scale: 0, opacity: 0, y: 20, transition: { duration: 0.15, ease: [0.3, 0, 1, 1] } }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              onClick={(e) => handleClose(e as any)} 
              className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center cursor-pointer drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)] transition-shadow outline-none group" 
              aria-label="Close Modal"
            >
              <motion.svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full overflow-visible mix-blend-normal"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <motion.path
                  fill={textColor}
                  animate={{ d: [
                    getPath("cookie", 100, 100, 0),
                    getPath("cookie", 100, 100, 1.5),
                    getPath("cookie", 100, 100, 3),
                    getPath("cookie", 100, 100, 0),
                  ] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.svg>
              <motion.div 
                className="relative z-10" 
                style={{ color: bgColor }}
                variants={{
                  hidden: { rotate: -90, scale: 0 },
                  visible: { rotate: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.3 } },
                  hover: { rotate: 90, scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 25 } },
                  tap: { rotate: -45, scale: 0.9, transition: { type: "spring", stiffness: 500, damping: 20 } }
                }}
              >
                <X size={36} className="stroke-current" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Render Bugs Floating Around in Fixed Positioning */}
      {isAndrew && andrewBugs.map(bug => (
        <motion.div
          key={bug.id}
          initial={{ x: bug.pathX[0], y: bug.pathY[0], opacity: 0, scale: 0.5 }}
          animate={{ 
            x: bug.pathX, 
            y: bug.pathY, 
            opacity: 1, 
            scale: 1,
            rotate: [0, 90, 180, 270, 360] 
          }}
          transition={{ 
            duration: bug.duration, 
            ease: "linear", 
            repeat: Infinity,
            rotate: { duration: 2, ease: "linear", repeat: Infinity }
          }}
          className="fixed z-[105] text-cyan-400 cursor-crosshair drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] filter hover:brightness-150"
          onClick={(e) => squashBug(e, bug.id)}
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 0.8 }}
        >
          <Bug size={32} />
        </motion.div>
      ))}
    </>
  );
}
