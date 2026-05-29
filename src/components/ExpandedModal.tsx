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

function AndrewMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates for interactive parallax sway
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const chars = "0123456789ABCDEF<>/{};:[]_+$#@!&*()".split("");
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    // Store column drifts
    const drifts: number[] = Array(columns).fill(0);
    
    // Technical vocabulary keywords to inject
    const cyberWords = [
      "GEMINI", "ANTIGRAVITY", "M3_EXPRESSIVE", "AI_AGENTS", 
      "TYPESCRIPT", "REACT", "NULL_UNIVERSE", "GLITCH_CLEANSED", 
      "SYSTEM_SECURED", "CYBER_HUD", "3D_HALO", "FOB_KEY"
    ];

    let scanlineY = 0;

    const draw = () => {
      // Create trailing dissolve effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      const tick = Date.now() * 0.04;
      const chromaGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      chromaGrad.addColorStop(0, `hsl(${tick % 360}, 100%, 65%)`);
      chromaGrad.addColorStop(0.33, `hsl(${(tick + 90) % 360}, 100%, 65%)`);
      chromaGrad.addColorStop(0.66, `hsl(${(tick + 180) % 360}, 100%, 65%)`);
      chromaGrad.addColorStop(1, `hsl(${(tick + 270) % 360}, 100%, 65%)`);

      // Draw standard streams
      for (let i = 0; i < drops.length; i++) {
        const xBase = i * fontSize;
        
        // Mouse gravity: columns near cursor drift horizontally
        const dx = mouseRef.current.x - xBase;
        const dy = mouseRef.current.y - (drops[i] * fontSize);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180) {
          // Attract/repel drift smoothly
          const targetDrift = (dx / dist) * -12;
          drifts[i] += (targetDrift - drifts[i]) * 0.1;
        } else {
          // Decelerate drift back to 0
          drifts[i] += (0 - drifts[i]) * 0.05;
        }

        const x = xBase + drifts[i];
        const y = drops[i] * fontSize;

        // Highlight head particle
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = chromaGrad;
          ctx.shadowBlur = 0;
        }

        // Apply scanline flickering
        const isNearScanline = Math.abs(y - scanlineY) < 30;
        if (isNearScanline && Math.random() > 0.3) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ec4899";
          ctx.shadowBlur = 15;
          // horizontal offset jitter
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x + (Math.random() - 0.5) * 8, y);
        } else {
          // Render random word periodically
          if (Math.random() > 0.996 && drops[i] < canvas.height / fontSize - 6) {
            const word = cyberWords[Math.floor(Math.random() * cyberWords.length)];
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#ffffff";
            for (let w = 0; w < word.length; w++) {
              ctx.fillText(word[w], x, y + w * fontSize);
            }
            drops[i] += word.length;
            continue;
          }
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
        }
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Draw technical CRT scanline overlay
      scanlineY = (scanlineY + 2.5) % canvas.height;
      ctx.fillStyle = "rgba(34, 211, 238, 0.04)";
      ctx.fillRect(0, scanlineY, canvas.width, 2);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.26] mix-blend-screen"
    />
  );
}

function VanessaTurtle({ darkMode }: { darkMode: boolean }) {
  const [x, setX] = useState(-150); // Start off-screen nicely for the wide turtle
  const [state, setState] = useState<
    "crawling" | "resting" | "hiding" | "jumping" |
    "startled" | "retracting" | "hidden" | "peeking" |
    "eating-prep" | "chewing" | "windup" | "landing" |
    "tickled" | "singing" | "stretching" | "digging" |
    "theme-change" | "coding" | "breakdance"
  >("crawling");
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [food, setFood] = useState<{ x: number; y: number; active: boolean } | null>(null);
  const [walkStep, setWalkStep] = useState(0);
  const [musicNotes, setMusicNotes] = useState<{ id: number; x: number; y: number; char: string }[]>([]);
  const [dusts, setDusts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [lastDarkMode, setLastDarkMode] = useState(darkMode);

  const activeTimers = useRef<number[]>([]);
  const isMounted = useRef(true);
  const lastClickTime = useRef(0);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      activeTimers.current.forEach(id => window.clearTimeout(id));
    };
  }, []);

  const safeTimeout = (callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      if (isMounted.current) callback();
      activeTimers.current = activeTimers.current.filter(t => t !== id);
    }, delay);
    activeTimers.current.push(id);
    return id;
  };

  const safeSetState = (newState: React.SetStateAction<typeof state>) => { if (isMounted.current) setState(newState); };
  const safeSetBubbleText = (text: React.SetStateAction<string | null>) => { if (isMounted.current) setBubbleText(text); };
  const safeSetFood = (val: React.SetStateAction<typeof food>) => { if (isMounted.current) setFood(val); };
  const safeSetHearts = (val: React.SetStateAction<typeof hearts>) => { if (isMounted.current) setHearts(val); };
  const safeSetMusicNotes = (val: React.SetStateAction<typeof musicNotes>) => { if (isMounted.current) setMusicNotes(val); };
  const safeSetDusts = (val: React.SetStateAction<typeof dusts>) => { if (isMounted.current) setDusts(val); };
  const safeSetX = (val: React.SetStateAction<number>) => { if (isMounted.current) setX(val); };
  const safeSetDirection = (val: React.SetStateAction<1 | -1>) => { if (isMounted.current) setDirection(val); };

  useEffect(() => {
    if (darkMode !== lastDarkMode) {
      setLastDarkMode(darkMode);
      const currentState = stateRef.current;
      if (currentState === "crawling" || currentState === "resting") {
        safeSetState("theme-change");
        safeSetBubbleText(darkMode ? "Night Goggles ON! 🕶️" : "Bright light mode! ☀️");
        safeTimeout(() => {
          safeSetState("crawling");
          safeSetBubbleText(null);
        }, 2200);
      }
    }
  }, [darkMode]);

  const stateRef = useRef(state);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const xRef = useRef(x);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { xRef.current = x; }, [x]);

  useEffect(() => {
    const walkInterval = setInterval(() => {
      if (isMounted.current) setWalkStep(prev => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(walkInterval);
  }, []);

  const spawnMusicNote = (currentX: number) => {
    const chars = ["♪", "♫", "♬", "♩", "🎶"];
    safeSetMusicNotes(prev => [...prev, { id: Date.now() + Math.random(), x: currentX + 60, y: 0, char: chars[Math.floor(Math.random() * chars.length)] }]);
  };

  const spawnDust = (currentX: number) => {
    safeSetDusts(prev => [...prev, { id: Date.now() + Math.random(), x: currentX + 30 + Math.random() * 60, y: 10 }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = stateRef.current;
      if (currentState !== "crawling") return;

      const rand = Math.random();
      const currentX = xRef.current;

      if (rand < 0.15) {
        safeSetState("startled");
        safeSetBubbleText("Huh?! 😳");
        safeTimeout(() => {
          safeSetState("retracting");
          safeSetBubbleText("Wait... 😰");
          safeTimeout(() => {
            safeSetState("hidden");
            safeSetBubbleText("Scared! 🙈");
            safeTimeout(() => {
              safeSetState("peeking");
              safeSetBubbleText("Safe? 🫣");
              safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 600);
            }, 1800);
          }, 400);
        }, 400);
      } else if (rand < 0.26) {
        safeSetState("resting");
        safeSetBubbleText("Sleeping... 💤");
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 3000);
      } else if (rand < 0.36 && !foodRef.current) {
        const foodX = 80 + Math.random() * (Math.min(window.innerWidth, 600) - 160);
        safeSetFood({ x: foodX, y: -40, active: true });
        safeSetBubbleText("Ooh, food! 🍓");
        safeTimeout(() => safeSetBubbleText(null), 1500);
      } else if (rand < 0.46) {
        safeSetState("singing");
        safeSetBubbleText("La la la~ ♩");
        spawnMusicNote(currentX);
        safeTimeout(() => spawnMusicNote(currentX), 400);
        safeTimeout(() => spawnMusicNote(currentX), 800);
        safeTimeout(() => spawnMusicNote(currentX), 1200);
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 2200);
      } else if (rand < 0.56) {
        safeSetState("stretching");
        safeSetBubbleText("Up! Down! 💪");
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 2400);
      } else if (rand < 0.66) {
        safeSetState("digging");
        safeSetBubbleText("Digging... ⛏️");
        spawnDust(currentX);
        safeTimeout(() => spawnDust(currentX), 300);
        safeTimeout(() => spawnDust(currentX), 600);
        safeTimeout(() => spawnDust(currentX), 900);
        safeTimeout(() => spawnDust(currentX), 1200);
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 2200);
      } else if (rand < 0.74) {
        safeSetState("coding");
        const gitCommits = ["git commit -m 'fix' 💻", "npm run build... 👾", "npm run dev... 🚀", "docker compose up -d 🐳", "git push... ⚡"];
        safeSetBubbleText(gitCommits[Math.floor(Math.random() * gitCommits.length)]);
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 2500);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [lastDarkMode]);

  useEffect(() => {
    if (!food || !food.active) return;
    const fallInterval = setInterval(() => {
      safeSetFood(f => {
        if (!f) return null;
        if (f.y >= 0) { clearInterval(fallInterval); return f; }
        return { ...f, y: f.y + 3.0 };
      });
    }, 30);
    return () => clearInterval(fallInterval);
  }, [food]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const trackWidth = Math.min(window.innerWidth - 40, 880);
      const currentState = stateRef.current;
      const currentDirection = directionRef.current;
      const currentFood = foodRef.current;
      const currentX = xRef.current;

      if (currentState === "crawling") {
        if (currentFood && currentFood.active && currentFood.y >= 0) {
          const headX = currentDirection === 1 ? currentX + 130 : currentX + 10;
          const dx = currentFood.x - headX;
          if (Math.abs(dx) < 30) {
            safeSetFood(null);
            safeSetState("eating-prep");
            safeSetBubbleText("Ooh! 🍓");
            safeTimeout(() => {
              safeSetState("jumping");
              safeSetBubbleText("Nom nom nom! 🍓");
              safeSetHearts(Array.from({ length: 3 }).map((_, i) => ({ id: Date.now() + i, x: currentX + 60, y: 0 })));
              safeTimeout(() => {
                safeSetState("chewing");
                safeSetBubbleText("Yum! 🥰");
                safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 1200);
              }, 1200);
            }, 450);
          } else {
            const dir = dx > 0 ? 1 : -1;
            safeSetDirection(dir);
            safeSetX(prev => prev + dir * 3.5);
          }
        } else {
          safeSetX(prev => {
            let nextX = prev + currentDirection * 1.2;
            if (nextX > trackWidth - 170) { safeSetDirection(-1); return trackWidth - 175; }
            if (nextX < 10) { safeSetDirection(1); return 15; }
            return nextX;
          });
        }
      }
    }, 30);
    return () => clearInterval(moveInterval);
  }, []);

  const handleTurtleClick = () => {
    const currentState = stateRef.current;
    if (["hiding", "startled", "retracting", "hidden", "peeking"].includes(currentState)) {
      safeSetBubbleText("Leave me alone! 🥺");
      safeTimeout(() => safeSetBubbleText(null), 1500);
      return;
    }
    if (["jumping", "windup", "landing", "breakdance"].includes(currentState)) return;
    
    const now = Date.now();
    if (now - lastClickTime.current < 280) {
      lastClickTime.current = 0;
      safeSetState("breakdance");
      const lyrics = ["BREAKDANCE WAVE! ⚡", "DJ TURTLE SPIN! 🎛️", "WINDMILL SHELL! 🌀", "UPSIDE DOWN DRIFT! 💫"];
      safeSetBubbleText(lyrics[Math.floor(Math.random() * lyrics.length)]);
      safeTimeout(() => {
        safeSetState("landing");
        safeSetBubbleText("TA-DA! 🎉");
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 800);
      }, 2000);
      return;
    }
    lastClickTime.current = now;
    safeSetState("windup");
    safeSetBubbleText("Ready...");
    safeTimeout(() => {
      safeSetState("jumping");
      safeSetBubbleText("TORNADO FLIP! 🌀");
      safeTimeout(() => {
        safeSetState("landing");
        safeSetBubbleText("TA-DA! 🎉");
        safeTimeout(() => { safeSetState("crawling"); safeSetBubbleText(null); }, 800);
      }, 1000);
    }, 250);
  };

  const handleMouseEnter = () => {
    if (["crawling", "resting", "singing", "coding"].includes(stateRef.current)) {
      safeSetState("tickled");
      const texts = ["Hehehe! 😆", "Stop it! 😂", "Tickles! 🌸", "Aha! 🦖", "Too ticklish! 🍭"];
      safeSetBubbleText(texts[Math.floor(Math.random() * texts.length)]);
    }
  };

  const handleMouseLeave = () => {
    if (stateRef.current === "tickled") {
      safeSetState("crawling");
      safeSetBubbleText(null);
    }
  };

  const getAsciiTurtle = () => {
    const isRight = direction === 1;
    let eye = "o";
    if (state === "resting") eye = "z";
    else if (state === "jumping" || state === "landing") eye = "^";
    else if (["startled", "retracting", "windup", "eating-prep"].includes(state)) eye = "*";
    else if (state === "peeking") eye = "-";
    else if (state === "chewing") eye = walkStep % 2 === 0 ? ">" : "<";
    else if (state === "tickled") eye = walkStep % 2 === 0 ? "x" : ">";
    else if (state === "singing") eye = "♩";
    else if (state === "coding") eye = "\"";
    else if (state === "crawling" && walkStep === 0 && Math.random() < 0.2) eye = "-";

    const legs = state === "hidden" || state === "resting" || state === "digging" ? "|_|_| |_|_|" : (walkStep === 1 ? "|/|_| |_|\\|" : walkStep === 2 ? "| | | | | |" : walkStep === 3 ? "|_|\\| |/|_|" : "|_|_| |_|_|");
    const tail = (state !== "crawling" && state !== "singing") ? "~" : (walkStep % 2 === 0 ? "~" : "-");

    if (isRight) {
      if (state === "hidden") return ["  _____", " /      \\", "|        |", "|_________/", legs].join("\n");
      if (state === "retracting" || state === "peeking") return ["  _____     __", ` /      \\  | ${eye} |`, "|        |/ _\\|", "|_________/", legs].join("\n");
      if (state === "theme-change") {
        const eyeGoggle = darkMode ? "[o-o]" : "[x-x]";
        return ["  _____     ____", ` /      \\  |${eyeGoggle}|`, "|        |/ ___\\| ", ` ${tail}|_________/     `, legs].join("\n");
      }
      return ["  _____     ____", ` /      \\  |  ${eye} | `, "|        |/ ___\\| ", ` ${tail}|_________/     `, legs].join("\n");
    } else {
      if (state === "hidden") return ["           _____  ", "         /      \\ ", "         |        |", "       \\_________|", `       ${legs}`].join("\n");
      if (state === "retracting" || state === "peeking") return ["   __      _____  ", `   | ${eye} |  /      \\ `, "   |\\_ \\|        |", "       \\_________|", `       ${legs}`].join("\n");
      if (state === "theme-change") {
        const eyeGoggle = darkMode ? "[o-o]" : "[x-x]";
        return ["  ____     _____  ", ` |${eyeGoggle}|  /      \\ `, " |/ ___ \\|        |", `       \\_________|${tail}`, `       ${legs}`].join("\n");
      }
      return ["  ____     _____  ", ` |  ${eye} |  /      \\ `, " |/ ___ \\|        |", `       \\_________|${tail}`, `       ${legs}`].join("\n");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden select-none" style={{ zIndex: 60 }}>
      {food && <motion.div key="food-strawberry" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, x: food.x, y: food.y }} className="absolute font-mono text-xl z-20 pointer-events-none" style={{ bottom: 42 }}>🍓</motion.div>}
      {hearts.map(h => <motion.div key={h.id} initial={{ opacity: 1, x: h.x, y: -10, scale: 0.8 }} animate={{ opacity: 0, y: -80, x: h.x + (Math.random() - 0.5) * 50, scale: 1.5 }} transition={{ duration: 1.5, ease: "easeOut" }} onAnimationComplete={() => setHearts(prev => prev.filter(item => item.id !== h.id))} className="absolute text-rose-500 text-lg pointer-events-none" style={{ bottom: 42 }}>❤️</motion.div>)}
      {musicNotes.map(n => <motion.div key={n.id} initial={{ opacity: 1, x: n.x, y: -10, scale: 0.8 }} animate={{ opacity: 0, y: -80, x: n.x + (Math.random() - 0.5) * 60, scale: 1.6 }} transition={{ duration: 1.8, ease: "easeOut" }} onAnimationComplete={() => setMusicNotes(prev => prev.filter(item => item.id !== n.id))} className="absolute text-emerald-400 font-mono font-bold text-lg select-none pointer-events-none" style={{ bottom: 42, filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.8))' }}>{n.char}</motion.div>)}
      {dusts.map(d => <motion.div key={d.id} initial={{ opacity: 1, x: d.x, y: 15, scale: 0.6 }} animate={{ opacity: 0, y: -10, x: d.x + (Math.random() - 0.5) * 30, scale: 1.2 }} transition={{ duration: 0.8, ease: "easeOut" }} onAnimationComplete={() => setDusts(prev => prev.filter(item => item.id !== d.id))} className="absolute text-emerald-600/60 font-mono font-bold text-xs select-none pointer-events-none" style={{ bottom: 12 }}>*</motion.div>)}

      {bubbleText && (
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bg-slate-950/85 backdrop-blur-md text-emerald-400 px-3.5 py-2 rounded-xl text-[10px] sm:text-xs shadow-lg border border-emerald-500/45 flex items-center gap-1.5 select-none font-mono z-50 pointer-events-none drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]" style={{ left: x + 85, bottom: 95, transform: "translateX(-50%)" }}>
          <span className="text-emerald-500 font-black animate-pulse select-none pointer-events-none">&gt;</span>
          <span className="tracking-wider uppercase">{bubbleText}</span>
          <div className="absolute w-2.5 h-2.5 bg-slate-950 rotate-45 border-r border-b border-emerald-500/45 bottom-[-5px] left-[50%] translate-x-[-50%]" />
        </motion.div>
      )}

      <motion.div onClick={handleTurtleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="absolute cursor-pointer pointer-events-auto flex items-center justify-center select-none" style={{ left: x, bottom: 6 }} animate={{ y: state === "jumping" ? [0, -90, 0] : state === "digging" ? [0, 45, 0] : state === "breakdance" ? [0, -40, 0] : (state === "crawling" || state === "startled" || state === "windup") ? [0, -3, 0] : 0, rotate: state === "jumping" ? [0, 360, 720] : state === "breakdance" ? [0, 360, 720, 1080] : state === "tickled" ? [-4, 4, -4, 4, 0] : 0, scaleY: state === "windup" ? 0.7 : state === "landing" ? 0.8 : state === "stretching" ? [1, 0.5, 1.1, 0.5, 1.1, 1] : state === "breakdance" ? -1 : 1, scaleX: state === "windup" ? 1.15 : state === "landing" ? 1.1 : state === "stretching" ? [1, 1.1, 0.9, 1.1, 0.9, 1] : 1 }} exit={{ x: direction === 1 ? window.innerWidth : -window.innerWidth, y: -150, rotate: [0, 720], scale: 0.2, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }} transition={{ y: state === "jumping" ? { duration: 1.0, ease: "easeInOut" } : state === "digging" ? { duration: 2.0, times: [0, 0.2, 0.8, 1], ease: "easeInOut" } : state === "breakdance" ? { duration: 2.0, ease: "easeInOut" } : { duration: 0.6, repeat: Infinity, ease: "easeInOut" }, rotate: state === "tickled" ? { repeat: Infinity, duration: 0.15 } : state === "breakdance" ? { duration: 2.0, ease: "linear" } : undefined, scaleY: state === "stretching" ? { duration: 1.5, repeat: Infinity } : { duration: 0.2, ease: "easeOut" }, scaleX: state === "stretching" ? { duration: 1.5, repeat: Infinity } : { duration: 0.2, ease: "easeOut" } }}>
        <motion.pre className="text-[10px] sm:text-xs md:text-sm leading-[1.1] font-mono select-none text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.95)] hover:scale-105 transition-transform duration-200 whitespace-pre" style={{ margin: 0, padding: 0, background: "transparent", border: "none" }} animate={state === "resting" ? { scaleY: 0.85, skewX: 5 } : { scaleY: 1, skewX: 0 }}>
          {getAsciiTurtle()}
        </motion.pre>
      </motion.div>
    </div>
  );
}

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
  const [cardShake, setCardShake] = useState(false);
  const [shardExplosions, setShardExplosions] = useState<{id: number, x: number, y: number, targetX: number, targetY: number, text: string, color: string}[]>([]);

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

  const scaleVal = useTransform(scrollY, [0, 120], [1, isMobile ? 0.3 : 0.26], { clamp: true });

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
    
    // Shake the card!
    setCardShake(true);
    setTimeout(() => setCardShake(false), 350);

    const texts = ["<div />", "wahoo", "sudo rm -rf /", "console.log()", "undefined", "NaN", "Easter Egg #42", "Fixing bugs...", "TypeScript > JS"];
    const text = texts[Math.floor(Math.random() * texts.length)];
    setAndrewParticles(p => [...p, { id: Date.now() + Math.random(), text, x: e.clientX, y: e.clientY }]);
    
    if (andrewScore >= 0 && andrewScore % 2 === 0) {
      setAndrewBugs(b => [...b, {
        id: Date.now() + Math.random(),
        pathX: Array.from({length: 6}, () => (0.15 + Math.random() * 0.7) * window.innerWidth),
        pathY: Array.from({length: 6}, () => (0.15 + Math.random() * 0.7) * window.innerHeight),
        duration: 5 + Math.random() * 4
      }]);
    }
  };

  const squashBug = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAndrewBugs(b => b.filter(bug => bug.id !== id));
    setAndrewScore(s => s + 5);
    
    // Shake the card on squashing!
    setCardShake(true);
    setTimeout(() => setCardShake(false), 350);

    setAndrewParticles(p => [...p, { id: Date.now() + Math.random(), text: "GLITCH REMOVED!", x: e.clientX, y: e.clientY, color: "text-rose-400 font-bold" }]);

    // Radial code shard explosion!
    const chromaColors = ["text-cyan-400", "text-purple-400", "text-pink-400", "text-emerald-400"];
    const glyphs = ["1", "0", "0xEF", "{}", "< />", "Err!", "Bug"];
    const newShards = Array.from({ length: 8 }).map((_, idx) => {
      const angle = (idx / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const velocity = 90 + Math.random() * 120;
      return {
        id: Date.now() + idx + Math.random(),
        x: e.clientX,
        y: e.clientY,
        targetX: e.clientX + Math.cos(angle) * velocity,
        targetY: e.clientY + Math.sin(angle) * velocity,
        text: glyphs[Math.floor(Math.random() * glyphs.length)],
        color: chromaColors[Math.floor(Math.random() * chromaColors.length)]
      };
    });
    setShardExplosions(prev => [...prev, ...newShards]);
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
        initial={{ opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" } as any}
        animate={{ opacity: 1, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" } as any}
        exit={{
          opacity: 0,
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          transition: { duration: 0.18, ease: "easeOut" }
        } as any}
        transition={M3E_EFFECTS}
        className="fixed inset-0"
        style={{
          zIndex: Z_SCRIM,
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
          className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl h-[88vh] max-h-[900px] relative pointer-events-auto flex flex-col overflow-hidden"
          // M3E shape.extra-large = 28dp for dialogs/sheets
          style={{
            backgroundColor: bgColor,
            borderRadius: 28,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 40px rgba(0, 0, 0, 0.15)`,
          }}
          transition={{ layout: M3E_SPATIAL }}
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
          {isAndrew && <AndrewMatrixRain />}

          {/* Scrollable content */}
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15, transition: { duration: 0.12, ease: "easeIn" } }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 24,
              mass: 0.8,
              delay: 0.08
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
                  <div className="w-[160px] h-[160px] sm:w-52 sm:h-52 mb-8" />
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
                  style={{ left: 0, top: 0, zIndex: Z_FAB + 10 }}
                >
                  {p.text}
                </motion.div>
              ))}

              {/* Andrew Bug Shard Explosions */}
              {isAndrew && shardExplosions.map(s => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 1, x: s.x, y: s.y, scale: 1 }}
                  animate={{ opacity: 0, x: s.targetX, y: s.targetY, scale: 0.4, rotate: (Math.random() - 0.5) * 360 }}
                  transition={{ duration: 1.2, ease: [0.1, 0.8, 0.25, 1.0] }}
                  onAnimationComplete={() => setShardExplosions(arr => arr.filter(item => item.id !== s.id))}
                  className={`fixed font-mono font-bold pointer-events-none ${s.color}`}
                  style={{ left: 0, top: 0, zIndex: Z_FAB + 12, filter: 'drop-shadow(0 0 5px currentColor)' }}
                >
                  {s.text}
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
                    className="md-label-large uppercase tracking-widest mb-4 block opacity-80"
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
                        fontSize: 'clamp(36px, 5vw, 60px)',
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
                      className="md-title-medium font-bold opacity-90 mb-8 block"
                      style={{ color: textColor }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Event description */}
              {!isMember && (
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, ...M3E_SPATIAL }}
                  className="p-6 backdrop-blur-sm shadow-sm mt-8 max-w-3xl lg:max-w-4xl w-full mx-auto"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)'}`,
                    borderRadius: 'var(--md-shape-large)',
                  }}
                >
                  <h3 className="md-label-large uppercase tracking-wider font-bold mb-2.5 flex items-center gap-2" style={{ color: textColor, opacity: 0.85 }}>
                    <Info size={16} />
                    <LangText content={{ EN: "Event Details", ZH: "活動詳情" }} lang={lang} inline />
                  </h3>
                  <LangText
                    content={activeItem.desc}
                    lang={lang}
                    className="md-body-large leading-relaxed font-normal block text-left"
                    style={{ color: textColor, opacity: 0.95 }}
                  />
                </motion.div>
              )}

              {/* Member detail sections */}
              {isMember && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl lg:max-w-6xl w-full mx-auto">
                  {[
                    { icon: Info, labelEN: "About Me", labelZH: "關於我", content: activeItem.about, delay: 0.2 },
                    { icon: Users, labelEN: "Expectation", labelZH: "我的期望", content: activeItem.expectation, delay: 0.28 },
                    { icon: Calendar, labelEN: "Responsibility", labelZH: "我的職責", content: activeItem.responsibility, delay: 0.36 },
                  ].map(({ icon: Icon, labelEN, labelZH, content, delay }) => (
                    <motion.div
                      key={labelEN}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay, ...M3E_SPATIAL }}
                      className="p-6 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
                      style={{
                        backgroundColor: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)'}`,
                        borderRadius: 'var(--md-shape-large)',
                      }}
                    >
                      <h3 className="md-label-large uppercase tracking-wider font-bold mb-2.5 flex items-center gap-2" style={{ color: textColor, opacity: 0.85 }}>
                        <Icon size={16} />
                        <LangText content={{ EN: labelEN, ZH: labelZH }} lang={lang} inline />
                      </h3>
                      <LangText
                        content={content}
                        lang={lang}
                        className="md-body-large leading-relaxed font-normal whitespace-pre-wrap block text-left"
                        style={{ color: textColor, opacity: 0.95 }}
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
                whileTap={isAndrew ? { scale: 0.95 } : undefined}
                initial={{ scale: 0.82, opacity: 0, y: 18 }}
                animate={cardShake ? "shake" : "visible"}
                variants={{
                  visible: { scale: 1, opacity: 1, y: 0 },
                  shake: {
                    x: [0, -6, 6, -6, 6, -3, 3, -1, 1, 0],
                    y: [0, 4, -4, 4, -4, 2, -2, 1, -1, 0],
                    transition: { duration: 0.35, ease: "easeInOut" }
                  }
                }}
                exit={{ scale: 0.82, opacity: 0, y: 10, transition: { duration: 0.12, ease: "easeIn" } }}
                transition={{ ...M3E_SPATIAL, delay: 0.05 }}
                className={`w-[160px] h-[160px] sm:w-52 sm:h-52 relative ${isAndrew ? 'cursor-pointer group' : ''}`}
                style={{ filter: isAndrew ? undefined : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
              >
                {/* Andrew expanded holographic neon tech ring */}
                {isAndrew && (
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                    className="absolute -inset-6 pointer-events-none flex items-center justify-center"
                    style={{ zIndex: -1 }}
                  >
                    <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
                      <defs>
                        <motion.linearGradient
                          id="andrew-modal-chroma-grad"
                          animate={{
                            x1: ["0%", "100%", "100%", "0%", "0%"],
                            y1: ["0%", "0%", "100%", "100%", "0%"],
                            x2: ["100%", "0%", "0%", "100%", "100%"],
                            y2: ["100%", "100%", "0%", "0%", "100%"]
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <motion.stop
                            offset="0%"
                            animate={{ stopColor: ["#22d3ee", "#8b5cf6", "#ec4899", "#10b981", "#22d3ee"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.stop
                            offset="35%"
                            animate={{ stopColor: ["#8b5cf6", "#ec4899", "#10b981", "#22d3ee", "#8b5cf6"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.stop
                            offset="70%"
                            animate={{ stopColor: ["#ec4899", "#10b981", "#22d3ee", "#8b5cf6", "#ec4899"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.stop
                            offset="100%"
                            animate={{ stopColor: ["#10b981", "#22d3ee", "#8b5cf6", "#ec4899", "#10b981"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.linearGradient>
                      </defs>
                      <motion.circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke="url(#andrew-modal-chroma-grad)"
                        strokeWidth="1.5"
                        strokeDasharray="4 8 12 8"
                        animate={{ strokeDashoffset: [0, 32] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.85))" }}
                      />
                      <motion.circle
                        cx="60" cy="60" r="58"
                        fill="none"
                        stroke="url(#andrew-modal-chroma-grad)"
                        strokeWidth="1"
                        strokeDasharray="50 15"
                        animate={{ strokeDashoffset: [0, -60] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                        style={{ opacity: 0.7 }}
                      />
                      <motion.circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="url(#andrew-modal-chroma-grad)"
                        strokeWidth="2.5"
                        strokeDasharray="25 45 15 35"
                        animate={{ strokeDashoffset: [0, 120] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
                        style={{ filter: "drop-shadow(0 0 5px rgba(139,92,246,0.75))" }}
                      />
                    </svg>
                  </motion.div>
                )}

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
                  <g transform="translate(3, 3) scale(0.94)">
                    <image
                      clipPath={`url(#modal-clip-img-${activeItem.id})`}
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
          {/* Vanessa Liu's interactive turtle companion */}
          {activeItem?.id === "mem-i3" && <VanessaTurtle darkMode={darkMode} />}
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
          className="fixed text-rose-400 cursor-crosshair flex items-center justify-center"
          style={{ left: 0, top: 0, zIndex: Z_FAB + 5, filter: 'drop-shadow(0 0 12px rgba(244,63,94,0.9))' }}
          onClick={(e) => squashBug(e, bug.id)}
          whileHover={{ scale: 1.6 }}
          whileTap={{ scale: 0.8 }}
        >
          {/* Cyber-glitch bug effect container */}
          <div className="relative">
            <motion.div
              animate={{
                x: [-1, 2, -2, 1, -1],
                y: [1, -1, 2, -1, 1],
                skewX: [0, 15, -15, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.18, repeatType: "mirror" }}
              className="text-rose-500 font-extrabold text-[9px] select-none absolute -top-4 left-0 font-mono tracking-tighter"
            >
              GLITCH!
            </motion.div>
            <motion.div
              animate={{
                fill: ["#ef4444", "#ec4899", "#8b5cf6", "#ef4444"],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{ duration: 0.25, repeat: Infinity }}
            >
              <Bug size={38} className="stroke-[2.5]" />
            </motion.div>
            <div className="absolute inset-0 bg-cyan-400 mix-blend-overlay opacity-30 blur-[1px] animate-pulse" />
          </div>
        </motion.div>
      ))}
    </>
  );
}
