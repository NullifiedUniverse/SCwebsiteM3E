import React from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { BOUNCE_SPRING } from "../../utils/physics";
import { LangText } from "../LangText";
import { ActionPill } from "../ActionPill";
import { HoverReveal } from "../HoverReveal";

interface QuickActionsSectionProps {
  lang: string;
}

export function QuickActionsSection({ lang }: QuickActionsSectionProps) {
  return (
    <section className="w-full">
      <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-600 uppercase tracking-widest text-xs mb-5 flex items-center gap-2 cursor-default">
        <Info size={14} /> <LangText content={{ EN: "Quick Actions", ZH: "快速操作" }} lang={lang} inline={true} />
      </motion.h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={BOUNCE_SPRING}
          whileHover={{ scale: 1.01 }}
          className="relative p-8 rounded-[32px] shadow-none dark:shadow-sm border flex flex-col justify-center min-h-[200px] overflow-hidden w-full bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
        >
          <h3 className="font-bold mb-2 text-xl relative z-10 w-full text-slate-800 dark:text-slate-100">
            <LangText content={{ EN: "New Proposal", ZH: "新提案" }} lang={lang} inline />
          </h3>
          <p className="text-sm relative z-10 w-full text-slate-600 dark:text-slate-400">
            <LangText content={{ EN: "Submit your ideas for the upcoming winter gala directly to the council.", ZH: "將您對近期與未來活動的想法提意給我們吧。" }} lang={lang} />
          </p>
          <ActionPill lang={lang} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...BOUNCE_SPRING, delay: 0.1 }} className="h-full w-full">
          <HoverReveal lang={lang} />
        </motion.div>
      </div>
    </section>
  );
}
