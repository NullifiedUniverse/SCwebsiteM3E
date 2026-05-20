import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LangText } from "./LangText";
import { DEPTS } from "../data/cms";
import { getPath, M3E_SPATIAL, M3E_EFFECTS, M3E_FAST } from "../utils/physics";
import { X, Info, Users, Calendar, Bug } from "lucide-react";

// Z-index layer: modal uses layer 50 (content), 49 (scrim)
const Z_SCRIM  = 49;
const Z_MODAL  = 50;
const Z_FAB    = 51;

export function ExpandedModal({ activeItem: propActiveItem, setActiveItem, darkMode, lang }: any) {
  const [activeItem, setActiveItemState] = useState(propActiveItem);

  useEffect(() => {
    if (propActiveItem) {
      setActiveItemState(propActiveItem);
    }
  }, [propActiveItem]);

  const [imgFailed, setImgFailed] = useState(false);
  const [andrewScore, setAndrewScore] = useState(0);
  const [andrewParticles, setAndrewParticles] = useState<{id: number, text: string, x: number, y: number, color?: string}[]>([]);
  const [andrewBugs, setAndrewBugs] = useState<{id: number, pathX: number[], pathY: number[], duration: number}[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const leftPct = useTransform(scrollY, [0, 120], [50, 0], { clamp: true });
  const leftStyle = useTransform(leftPct, (v) => `${v}%`);

  const xPct = useTransform(scrollY, [0, 120], [-50, 0], { clamp: true });
  const xOffset = useTransform(scrollY, [0, 120], [0, isMobile ? 20 : 24], { clamp: true });

  const topVal = useTransform(scrollY, [0, 120], [isMobile ? 64 : 80, isMobile ? 16 : 24], { clamp: true });
  const topStyle = useTransform(topVal, (v) => `${v}px`);

  const scaleVal = useTransform(scrollY, [0, 120], [1, isMobile ? 0.32 : 0.28], { clamp: true });

  const transformXScale = useTransform(
    [xPct, xOffset, scaleVal],
    ([pct, offset, scale]) => `translate(calc(${pct}% + ${offset}px), 0) scale(${scale})`
  );

  useEffect(() => { setImgFailed(false); }, [activeItem]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveItem(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
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

  const modalStaticPath = useMemo(() => isMember ? getPath(theme!.shape, 100, 100, 0) : "", [isMember, theme]);

  const bgColor = isAndrew
    ? (darkMode ? "#082f49" : "#0284c7")
    : (theme ? (darkMode ? theme.dark : theme.light) : (darkMode ? activeItem.colorDark : activeItem.colorLight));
  const textColor = isAndrew
    ? (darkMode ? "#e0f2fe" : "#ffffff")
    : (theme ? (darkMode ? theme.textDark : theme.textLight) : (darkMode ? activeItem.textDark : activeItem.textLight));

  const orbColors = useMemo(() => {
    let color1: string;
    let color2: string;
    if (isAndrew) {
      color1 = darkMode ? "rgba(6,182,212,0.45)" : "rgba(14,165,233,0.55)";
      color2 = darkMode ? "rgba(15,23,42,0.9)" : "rgba(3,105,161,0.4)";
    } else if (theme) {
      const altColor1 = theme.light;
      const altColor2 = theme.dark;
      color1 = `color-mix(in srgb, ${altColor1} 55%, transparent)`;
      color2 = `color-mix(in srgb, ${altColor2} 55%, transparent)`;
    } else {
      const altColor1 = activeItem.colorLight;
      const altColor2 = activeItem.colorDark;
      color1 = `color-mix(in srgb, ${altColor1} 55%, transparent)`;
      color2 = `color-mix(in srgb, ${altColor2} 55%, transparent)`;
    }
    return { color1, color2 };
  }, [theme, isAndrew, darkMode, activeItem]);

  return (
    <>
      {/* ── Scrim — M3E glassmorphic backdrop ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0"
        style={{
          zIndex: Z_SCRIM,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: 'color-mix(in srgb, var(--md-scrim) 35%, transparent)',
        }}
        onClick={(e) => handleClose(e as any)}
        aria-hidden="true"
      />

      {/* ── Modal Container ── */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        style={{ zIndex: Z_MODAL }}
      >
        <motion.div
          layoutId={`card-${activeItem.id}`}
          className="w-[94vw] md:w-[90vw] lg:w-[88vw] xl:w-[85vw] max-w-[1440px] h-[90vh] max-h-[880px] relative pointer-events-auto flex flex-col overflow-hidden"
          // M3E shape.extra-large = 28dp for dialogs/sheets
          style={{
            backgroundColor: bgColor,
            borderRadius: 28,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 40px rgba(0, 0, 0, 0.15)`,
          }}
          transition={{ layout: { type: "spring", stiffness: 220, damping: 32, mass: 0.95 } }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Dynamic Liquid Mesh Backdrop */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-72 h-72 rounded-full blur-[80px] opacity-60"
              style={{ backgroundColor: orbColors.color1, left: "-10%", top: "-10%" }}
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full blur-[90px] opacity-50"
              style={{ backgroundColor: orbColors.color2, right: "-10%", bottom: "-10%" }}
              animate={{
                x: [0, -50, 30, 0],
                y: [0, 40, -30, 0],
                scale: [1, 1.15, 0.85, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          {/* Andrew matrix background */}
          {isAndrew && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay overflow-hidden">
              <motion.div
                className="absolute inset-0 origin-bottom"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  transform: 'perspective(500px) rotateX(60deg)'
                }}
                animate={{ backgroundPosition: ['0px 0px', '0px 40px'] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* Scrollable content */}
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15, transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] } }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 28,
              mass: 0.9,
              delay: 0.06
            }}
            className="absolute inset-0 flex flex-col overflow-y-auto hide-scrollbar z-10"
          >
            {/* Event image — full-bleed top */}
            {activeItem.image && !isMember && (
              <div className="w-full h-64 sm:h-80 shrink-0 relative overflow-hidden" style={{ borderRadius: `var(--md-shape-extra-large) var(--md-shape-extra-large) 0 0` }}>
                <motion.div
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 mix-blend-overlay"
                  style={{ backgroundImage: `url(${encodeURI(activeItem.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, transparent 20%, ${bgColor} 100%)` }} />
              </div>
            )}

            <div className={`flex-1 px-8 sm:px-12 pb-24 cursor-default ${(!isMember && activeItem.image) ? '-mt-16 relative z-10' : 'pt-16 sm:pt-20'}`}>

              {/* Member portrait spacer */}
              {isMember && activeItem.image && !imgFailed && (
                <div className="w-full flex justify-center shrink-0" aria-hidden="true">
                  <div className="w-[180px] h-[180px] sm:w-60 sm:h-60 lg:w-68 lg:h-68 mb-12" />
                </div>
              )}

              {/* Andrew particles */}
              {isAndrew && andrewParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.5 }}
                  animate={{ opacity: 0, y: p.y - 150, x: p.x + (Math.random() - 0.5) * 100, scale: 1.5, rotate: (Math.random() - 0.5) * 45 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  onAnimationComplete={() => setAndrewParticles(arr => arr.filter(item => item.id !== p.id))}
                  className={`fixed font-mono font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] pointer-events-none whitespace-nowrap ${p.color || 'text-cyan-300'}`}
                  style={{ zIndex: Z_FAB + 10 }}
                >
                  {p.text}
                </motion.div>
              ))}

              {/* Member/Event identity block */}
              <div className={isMember ? "flex flex-col items-center text-center" : "flex flex-col"}>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05, ...M3E_EFFECTS }}
                >
                  <LangText
                    content={isMember
                      ? { EN: `${activeItem.gen} • ${theme!.name.EN}`, ZH: `${activeItem.gen}屆 • ${theme!.name.ZH}` }
                      : (activeItem.label || activeItem.date)
                    }
                    lang={lang}
                    className="text-xs sm:text-sm uppercase tracking-widest mb-4 block font-extrabold opacity-85"
                    style={{ color: textColor, ...(isAndrew ? { fontVariationSettings: `'wght' ${Math.min(900, 400 + andrewScore * 50)}` } : {}) }}
                  />
                </motion.div>

                <h2 id="modal-title" className="m-0 p-0 w-full relative">
                  <motion.div
                    initial={{ filter: "blur(4px)", y: 14, opacity: 0 }}
                    animate={{ filter: "blur(0px)", y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.05, 0.7, 0.1, 1.0] }}
                  >
                    <LangText
                      content={activeItem.title || activeItem.name}
                      lang={lang}
                      className={`font-black mb-4 tracking-tighter leading-tight block w-full ${isAndrew ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : ''}`}
                      style={{
                        color: textColor,
                        fontSize: 'clamp(42px, 6vw, 76px)',
                        lineHeight: 1.1,
                        fontVariationSettings: isAndrew
                          ? `'opsz' ${8 + (andrewScore * 5) % 136}, 'wght' ${Math.min(900, 100 + andrewScore * 20)}`
                          : '"wght" 900, "opsz" 48, "GRAD" 50',
                      }}
                    />
                  </motion.div>
                </h2>

                {isMember && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18, ...M3E_EFFECTS }}
                  >
                    <LangText
                      content={activeItem.role}
                      lang={lang}
                      className="text-lg md:text-xl xl:text-2xl font-bold opacity-95 mb-8 block"
                      style={{ color: textColor }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Event description */}
              {!isMember && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, ...M3E_SPATIAL }}
                  whileHover={{ scale: 1.025, y: -4, transition: M3E_FAST }}
                  className="p-10 sm:p-12 backdrop-blur-sm shadow-sm mt-10 max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full mx-auto cursor-default glass-glow premium-grid-texture"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)'}`,
                    borderRadius: 'var(--md-shape-large)',
                  }}
                >
                  <h3 className="text-lg sm:text-xl uppercase tracking-wider font-black mb-4 flex items-center gap-3 relative z-10" style={{ color: textColor }}>
                    <Info size={22} />
                    <LangText content={{ EN: "Event Details", ZH: "活動詳情" }} lang={lang} inline />
                  </h3>
                  <LangText
                    content={activeItem.desc}
                    lang={lang}
                    className="text-base md:text-lg xl:text-[1.12rem] leading-relaxed font-normal block text-left relative z-10"
                    style={{ color: textColor, opacity: 1 }}
                  />
                </motion.div>
              )}

              {/* Member detail sections */}
              {isMember && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mt-12 max-w-7xl xl:max-w-[1500px] w-full mx-auto">
                  {[
                    { icon: Info, labelEN: "About Me", labelZH: "關於我", content: activeItem.about, delay: 0.2 },
                    { icon: Users, labelEN: "Expectation", labelZH: "我的期望", content: activeItem.expectation, delay: 0.28 },
                    { icon: Calendar, labelEN: "Responsibility", labelZH: "我的職責", content: activeItem.responsibility, delay: 0.36 },
                  ].map(({ icon: Icon, labelEN, labelZH, content, delay }) => (
                    <motion.div
                      key={labelEN}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay, ...M3E_SPATIAL }}
                      whileHover={{ scale: 1.025, y: -4, transition: M3E_FAST }}
                      className="p-10 sm:p-12 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md cursor-default glass-glow premium-grid-texture"
                      style={{
                        backgroundColor: darkMode ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.45)',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)'}`,
                        borderRadius: 'var(--md-shape-large)',
                      }}
                    >
                      <h3 className="text-lg sm:text-xl uppercase tracking-wider font-black mb-4 flex items-center gap-3 relative z-10" style={{ color: textColor }}>
                        <Icon size={22} />
                        <LangText content={{ EN: labelEN, ZH: labelZH }} lang={lang} inline />
                      </h3>
                      <LangText
                        content={content}
                        lang={lang}
                        className="text-base md:text-lg xl:text-[1.12rem] leading-relaxed font-normal whitespace-pre-wrap block text-left relative z-10"
                        style={{ color: textColor, opacity: 1 }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Absolute Member Portrait for Scroll-linking */}
          {isMember && activeItem.image && !imgFailed && (
            <motion.div
              style={{
                position: "absolute",
                left: leftStyle,
                top: topStyle,
                transform: transformXScale,
                transformOrigin: "top left",
                zIndex: 20,
                pointerEvents: "auto",
              }}
            >
              <motion.div
                onClick={handleAndrewClick}
                whileTap={isAndrew ? { scale: 0.9 } : undefined}
                initial={{ scale: 0.82, opacity: 0, y: 18 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.82, opacity: 0, y: 10, transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] } }}
                transition={{ ...M3E_SPATIAL, delay: 0.05 }}
                className={`w-[180px] h-[180px] sm:w-60 sm:h-60 lg:w-68 lg:h-68 relative ${isAndrew ? 'cursor-pointer' : ''}`}
                style={{ filter: isAndrew ? undefined : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <clipPath id={`modal-clip-img-${activeItem.id}`}>
                      <motion.path
                        d={modalStaticPath}
                        style={{ transformOrigin: "50px 50px" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 16 + (activeItem.seed % 5), repeat: Infinity, ease: "linear" }}
                      />
                    </clipPath>
                  </defs>
                  <motion.path
                    fill={bgColor}
                    d={modalStaticPath}
                    style={{ transformOrigin: "50px 50px" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16 + (activeItem.seed % 5), repeat: Infinity, ease: "linear" }}
                  />
                  <g transform="translate(3, 3) scale(0.94)" clipPath={`url(#modal-clip-img-${activeItem.id})`}>
                    <image
                      href={encodeURI(activeItem.image)}
                      x="0" y="0" width="100" height="100"
                      preserveAspectRatio="xMidYMid slice"
                      onError={() => setImgFailed(true)}
                    />
                  </g>
                </svg>
              </motion.div>
            </motion.div>
          )}

          {/* ── Close FAB — M3E Large FAB ─────────────────────────
              Shape: shape.large (16dp)
              Rotation: only on hover (not perpetual)
          ──────────────────────────────────────────────────────── */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8" style={{ zIndex: Z_FAB }}>
            <motion.button
              variants={{
                hidden: { scale: 0, opacity: 0, y: 32 },
                visible: { scale: 1, opacity: 1, y: 0, transition: { ...M3E_SPATIAL, delay: 0.15 } },
                hover: { scale: 1.06, y: -3, transition: M3E_FAST },
                tap: { scale: 0.94, y: 1, transition: M3E_FAST },
                exit: { scale: 0, opacity: 0, y: 16, transition: { duration: 0.15, ease: [0.3, 0, 0.8, 0.15] } }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              onClick={(e) => handleClose(e as any)}
              className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center cursor-pointer outline-none"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
              aria-label="Close"
            >
              {/* FAB background shape */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                <motion.path
                  fill={textColor}
                  d={getPath("cookie", 100, 100, 0)}
                  style={{ transformOrigin: "50px 50px" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              {/* X icon — rotates on hover state only */}
              <motion.div
                className="relative z-10"
                style={{ color: bgColor }}
                variants={{
                  hidden: { rotate: -90, scale: 0 },
                  visible: { rotate: 0, scale: 1, transition: { ...M3E_SPATIAL, delay: 0.28 } },
                  hover: { rotate: 90, scale: 1.1, transition: M3E_FAST },
                  tap: { rotate: -35, scale: 0.9, transition: M3E_FAST }
                }}
              >
                <X size={32} strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Andrew bugs */}
      {isAndrew && andrewBugs.map(bug => (
        <motion.div
          key={bug.id}
          initial={{ x: bug.pathX[0], y: bug.pathY[0], opacity: 0, scale: 0.5 }}
          animate={{ x: bug.pathX, y: bug.pathY, opacity: 1, scale: 1, rotate: [0, 90, 180, 270, 360] }}
          transition={{
            duration: bug.duration,
            ease: "linear",
            repeat: Infinity,
            rotate: { duration: 2, ease: "linear", repeat: Infinity }
          }}
          className="fixed text-cyan-400 cursor-crosshair"
          style={{ zIndex: Z_FAB + 5, filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.8))' }}
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
