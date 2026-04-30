import React, { useState } from "react";
import { motion } from "motion/react";
import { LangText } from "./LangText";
import { M3_SPRING } from "../utils/physics";

export function ActionPill({ lang }: { lang: string }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      layout
      onClick={() => setActive(!active)}
      initial={false}
      whileHover="hover"
      whileTap="tap"
      animate={{ borderRadius: active ? 16 : 32 }}
      transition={M3_SPRING}
      className={`relative h-14 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 mt-4 border border-transparent ${active ? "w-full bg-blue-600" : "min-w-[170px] w-max px-6 bg-blue-50 dark:bg-slate-800"}`}
    >
      <motion.span 
        initial="rest"
        animate="rest"
        variants={{ 
          rest: { fontVariationSettings: '"wght" 700, "wdth" 100', scale: 1, fontSize: "100%" },
          hover: { fontVariationSettings: '"wght" 900, "wdth" 120', scale: 1, fontSize: "83.3%" }, 
          tap: { scale: 0.96, fontVariationSettings: '"wght" 500, "wdth" 90', fontSize: "111.1%" } 
        }} 
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        layout="position" 
        className={`font-bold whitespace-nowrap z-10 flex items-center gap-2 ${active ? "text-white" : "text-blue-700 dark:text-blue-400"}`}
      >
        <LangText content={active ? { EN: "Confirmed", ZH: "已確認" } : { EN: "Submit Proposal", ZH: "提交提案" }} lang={lang} inline />
      </motion.span>
    </motion.div>
  );
}
