import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { DEPTS } from "../data/cms";
import { Code, Star } from "lucide-react";
import { getPath, QUICK_SPRING } from "../utils/physics";

export const MemberBlob = React.memo(({ member, activeItem, onClick, darkMode, lang, index, rootRef }: any) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [prankLag, setPrankLag] = useState(false);
  const [hovered, setHovered] = useState(false);
  const theme = DEPTS[member.dept];
  const isAndrew = member.name.includes("Andrew");
  const isLeader = member.role.EN.includes("Dir") || member.role.EN.includes("President") || member.role.EN.includes("Pres");
  const isTarget = member.id === "mem-p3";

  useEffect(() => {
    if (isTarget) setPrankLag(true);
  }, [isTarget]);

  const handleInteraction = () => {
    if (isTarget && prankLag) {
      if (Math.random() > 0.4) return; 
      setTimeout(() => onClick(member), Math.random() * 1500 + 800); 
    } else {
      onClick(member);
    }
  };
  
  const bgColor = isAndrew ? (darkMode ? "#082f49" : "#0284c7") : (darkMode ? theme.dark : theme.light);
  const textColor = isAndrew ? (darkMode ? "#e0f2fe" : "#ffffff") : (darkMode ? theme.textDark : theme.textLight);
  const isExpanded = activeItem?.id === member.id;
  const imageUrl = member.image;

  const paths = useMemo(() => [
    getPath(theme.shape, 100, 100, member.seed),
    getPath(theme.shape, 100, 100, member.seed + 1.5),
    getPath(theme.shape, 100, 100, member.seed + 3),
    getPath(theme.shape, 100, 100, member.seed)
  ], [theme.shape, member.seed]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 30, filter: "blur(4px)", scale: 0.8 }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ root: rootRef, margin: "0px -48px", once: true }}
      className={`flex flex-col items-center gap-4 shrink-0 group relative w-64 ${isTarget ? 'cursor-wait' : 'cursor-pointer'}`}
      style={{ zIndex: isExpanded ? 100 : (isAndrew ? 20 : 1) }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ 
        y: (isTarget && prankLag) ? -1 : -12, 
        scale: (isTarget && prankLag) ? 1.02 : 1.05 
      }}
      whileTap={{ scale: (isTarget && prankLag) ? 0.99 : 0.94, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleInteraction}
    >
      <motion.div layoutId={`card-${member.id}`} className="relative flex items-center justify-center w-[220px] h-[220px]" style={{ borderRadius: 72, backgroundColor: "transparent" }}>
        {isAndrew && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 rounded-[80px] border-[3px] border-cyan-400 border-dashed opacity-60 z-0 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        )}
        <motion.div animate={{ opacity: isExpanded ? 0 : 1 }} transition={{ duration: isExpanded ? 0 : 0.2 }} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-lg overflow-visible" aria-hidden="true" focusable="false">
            <motion.path fill={bgColor} animate={{ d: paths }} transition={{ duration: hovered ? 1.5 : 8 + (member.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
            
            {/* Glass reflection offset */}
            {hovered && (
              <motion.path 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                fill="url(#glass-gradient)" 
                d={paths[0]} 
                className="mix-blend-overlay"
              />
            )}
            <defs>
              <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
              <clipPath id={`clip-img-${member.id}`}>
                <motion.path animate={{ d: paths }} transition={{ duration: hovered ? 1.5 : 8 + (member.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
              </clipPath>
            </defs>

            {imageUrl && !imgFailed && (
              <g transform="translate(4, 4) scale(0.92)">
                <motion.image animate={{ scale: hovered ? 1.05 : 1, x: hovered ? -2.5 : 0, y: hovered ? -2.5 : 0 }} transition={{ duration: 0.3 }} href={encodeURI(imageUrl)} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-img-${member.id})`} />
                
                {/* Image glass reflection overlay */}
                {hovered && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x="0" y="0" width="100" height="100"
                    fill="url(#glass-gradient)"
                    clipPath={`url(#clip-img-${member.id})`}
                    className="mix-blend-overlay"
                  />
                )}
              </g>
            )}
          </svg>

          <span className="absolute font-black text-3xl z-10" style={{ color: textColor, display: (imageUrl && !imgFailed) ? 'none' : 'block' }}>{member.name.charAt(0)}</span>
        </motion.div>
      </motion.div>
      
      <div className="text-center px-1 flex flex-col items-center w-full relative z-10 mt-1">
        <span className={`font-serif font-black text-xl w-full text-center leading-tight line-clamp-2 cursor-default transition-all duration-300 ${isAndrew && hovered ? "text-cyan-500 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] scale-110" : "text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}>
          {member.name.split(" ")[0]}
        </span>
        <motion.div animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-90 mt-1.5 px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm dark:shadow-md backdrop-blur-md transition-colors border border-black/5 dark:border-white/10" style={{ backgroundColor: bgColor, color: textColor }}>
          {isAndrew ? <Code size={14} className="shrink-0" /> : (isLeader && <Star size={12} fill="currentColor" className="shrink-0" />)}
          <LangText content={member.role} lang={lang} className="truncate cursor-default whitespace-nowrap" inline={true} />
        </motion.div>
      </div>
    </motion.div>
  );
});
