import React, { useState } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { QUICK_SPRING, BOUNCE_SPRING, getPath } from "../utils/physics";

export function HoverReveal({ lang }: { lang: string }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href="https://www.instagram.com/kcis_2steps_ahead/"
      target="_blank"
      rel="noreferrer"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileTap={{ scale: 0.98 }}
      animate={{
        borderRadius: hover ? "32px 8px 32px 32px" : "24px",
      }}
      transition={QUICK_SPRING}
      className={`relative p-6 cursor-pointer overflow-hidden shadow-none dark:shadow-sm flex items-center justify-between h-full w-full border border-slate-200 dark:border-slate-800 transition-colors duration-300 ${hover ? "bg-slate-900 dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-900"}`}
    >
      {/* M3E decorative corner shape */}
      <motion.svg viewBox="0 0 100 100" className="absolute -left-4 -bottom-4 w-24 h-24 opacity-[0.05] dark:opacity-[0.08] pointer-events-none" aria-hidden="true">
        <motion.path 
          fill="currentColor"
          animate={{ d: [getPath("8-leaf clover", 100, 100, 0), getPath("8-leaf clover", 100, 100, 2), getPath("8-leaf clover", 100, 100, 0)] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
      <motion.div 
        animate={{ opacity: hover ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" 
      />
      <span className={`font-bold z-10 text-lg flex-1 transition-colors duration-300 ${hover ? "text-slate-50" : "text-slate-900 dark:text-slate-50"}`}>
        <LangText content={{ EN: "Official Instagram", ZH: "官方 Instagram" }} lang={lang} inline />
      </span>
      <motion.div 
        animate={{ x: hover ? 0 : 20, opacity: hover ? 1 : 0, scale: hover ? 1 : 0.8, rotate: hover ? 0 : -45 }} 
        transition={BOUNCE_SPRING} 
        className="relative w-10 h-10 flex items-center justify-center shrink-0 z-10"
      >
        <motion.svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <motion.path 
            fill="#3b82f6"
            animate={{ d: [getPath("cookie", 100, 100, 0), getPath("cookie", 100, 100, 1.5), getPath("cookie", 100, 100, 0)] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
        <span className="relative z-10 text-white font-black text-sm">→</span>
      </motion.div>
    </motion.a>
  );
}
