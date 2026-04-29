import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { DEPTS } from "../data/cms";
import { getPath, BOUNCE_SPRING } from "../utils/physics";
import { X, Info, Users, Calendar, Bug } from "lucide-react";

export function ExpandedModal({ activeItem, setActiveItem, darkMode, lang }: any) {
  const [imgFailed, setImgFailed] = useState(false);
  const [andrewScore, setAndrewScore] = useState(0);
  const [andrewParticles, setAndrewParticles] = useState<{id: number, text: string, x: number, y: number, color?: string}[]>([]);
  const [andrewBugs, setAndrewBugs] = useState<{id: number, pathX: number[], pathY: number[], duration: number}[]>([]);

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
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(12px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.15 } }} transition={{ duration: 0.4 }}
        className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80"
        onClick={(e) => handleClose(e as any)}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-${activeItem.id}`} 
          className={`w-full max-w-2xl h-[85vh] sm:h-[700px] shadow-2xl border border-black/5 dark:border-none dark:shadow-2xl relative pointer-events-auto flex flex-col overflow-hidden backdrop-blur-3xl`}
          style={{ backgroundColor: bgColor, borderRadius: 32 }} 
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
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

          {activeItem.image && !isMember && (
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 right-0 w-full h-64 pointer-events-none mix-blend-overlay" 
              style={{ backgroundImage: `url(${activeItem.image})`, backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to bottom, black, transparent)' }} 
            />
          )}

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0 } }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="absolute top-5 sm:top-6 right-5 sm:right-6 z-20">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }} 
                onClick={handleClose as any} 
                className="p-3 rounded-full bg-black/10 dark:bg-white/20 hover:bg-black/20 dark:hover:bg-white/30 transition-all backdrop-blur-md" 
                style={{ color: textColor }}
              >
                <X size={20} className="stroke-current" strokeWidth={3} />
              </motion.button>
            </div>

            <div className={`overflow-y-auto hide-scrollbar z-10 flex-1 px-8 sm:px-10 pt-16 sm:pt-14 pb-8 cursor-default transition-all duration-700`}>
              
               {isMember && activeItem.image && !imgFailed && (
                 <motion.div 
                   onClick={handleAndrewClick}
                   whileTap={isAndrew ? { scale: 0.9 } : undefined}
                   initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ ...BOUNCE_SPRING, delay: 0.15 }}
                   className={`w-[160px] h-[160px] sm:w-48 sm:h-48 mb-6 relative dark:drop-shadow-md ${isAndrew ? 'cursor-pointer hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]' : ''}`}
                 >
                   <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                     <defs>
                       <clipPath id={`modal-clip-img-${activeItem.id}`}>
                         <motion.path animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                       </clipPath>
                     </defs>
                     <motion.path fill={bgColor} animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                     <g transform="translate(3, 3) scale(0.94)">
                       <image href={encodeURI(activeItem.image)} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#modal-clip-img-${activeItem.id})`} />
                     </g>
                   </svg>
                 </motion.div>
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

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <LangText content={isMember ? { EN: `${activeItem.gen} • ${theme!.name.EN}`, ZH: `${activeItem.gen}屆 • ${theme!.name.ZH}` } : (activeItem.label || activeItem.date)} lang={lang} className="font-mono font-bold text-xs tracking-widest uppercase mb-3 block opacity-80 transition-all duration-300" style={{ color: textColor, ...(isAndrew ? { fontVariationSettings: `'wght' ${Math.min(900, 400 + andrewScore * 50)}` } : {}) }} />
                <h2 id="modal-title" className="m-0 p-0">
                  <LangText content={activeItem.title || activeItem.name} lang={lang} className={`font-serif text-4xl sm:text-5xl font-black mb-2 tracking-tighter leading-tight ${isAndrew ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : ''} transition-all duration-300`} style={{ color: textColor, ...(isAndrew ? { fontVariationSettings: `'opsz' ${8 + (andrewScore * 5) % 136}, 'wght' ${Math.min(900, 100 + andrewScore * 20)}` } : {}) }} />
                </h2>
              </motion.div>
              
              {isMember && <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}><LangText content={activeItem.role} lang={lang} className="text-lg font-bold opacity-90 mb-8 block" style={{ color: textColor }} /></motion.div>}
              {!isMember && <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}><LangText content={activeItem.desc} lang={lang} className="text-lg leading-relaxed font-medium opacity-90 mt-6 block" style={{ color: textColor }} /></motion.div>}

              {isMember && (
                <div className="space-y-8 mt-6">
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Info size={16} /> <LangText content={{ EN: "About Me", ZH: "關於我" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.about} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.5 }} className="h-px w-full opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Users size={16} /> <LangText content={{ EN: "Expectation", ZH: "我的期望" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.expectation} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.5 }} className="h-px w-full opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Calendar size={16} /> <LangText content={{ EN: "Responsibility", ZH: "我的職責" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.responsibility} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                </div>
              )}
              
              <motion.button 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={handleClose as any} className="w-full mt-10 py-4 rounded-full font-bold shadow-none border border-black/10 dark:border-none dark:shadow-lg relative z-50 cursor-pointer" style={{ backgroundColor: textColor, color: bgColor }}>
                <LangText content={{ EN: "Close Details", ZH: "關閉詳細資訊" }} lang={lang} inline />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

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
