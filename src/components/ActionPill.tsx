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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      animate={{ borderRadius: active ? 16 : 32 }}
      transition={M3_SPRING}
      className={`relative h-14 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 mt-4 border border-transparent ${active ? "w-full bg-blue-600" : "min-w-[170px] w-max px-6 bg-blue-50 dark:bg-slate-800"}`}
    >
      <motion.span layout="position" className={`font-bold whitespace-nowrap z-10 flex items-center gap-2 ${active ? "text-white" : "text-blue-700 dark:text-blue-400"}`}>
        <LangText content={active ? { EN: "Confirmed", ZH: "已確認" } : { EN: "Submit Proposal", ZH: "提交提案" }} lang={lang} inline />
      </motion.span>
    </motion.div>
  );
}
