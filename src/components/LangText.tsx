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
  const isChinese = lang === "ZH";
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={lang}
        initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -4, filter: "blur(4px)", transition: { duration: 0.15, ease: [0.3, 0, 1, 1] } }}
        transition={{ duration: 0.35, ease: [0, 0, 0, 1] }}
        className={className}
        style={{ 
          display: inline ? "inline-block" : "block", 
          fontSize: isChinese ? "0.92em" : undefined,
          letterSpacing: isChinese ? "0.02em" : undefined,
          ...style 
        }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
};
