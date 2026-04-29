import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "../utils/i18n";

export interface LangTextProps {
  content: any;
  lang: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
}

export const LangText = ({ content, lang, className = "", style = {}, inline = false }: LangTextProps) => {
  const text = t(content, lang);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={lang}
        initial={{ opacity: 0, y: 4, filter: "blur(4px)", scale: 0.98 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, y: -4, filter: "blur(4px)", scale: 0.98, transition: { duration: 0.1 } }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={className}
        style={{ display: inline ? "inline-block" : "block", ...style }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
};
