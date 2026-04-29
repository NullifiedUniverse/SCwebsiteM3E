import React, { useState } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { QUICK_SPRING, BOUNCE_SPRING } from "../utils/physics";

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
        className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white font-black shrink-0 z-10 shadow-none dark:shadow-lg dark:shadow-blue-500/30"
      >
        →
      </motion.div>
    </motion.a>
  );
}
