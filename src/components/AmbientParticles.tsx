import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface AmbientParticlesProps {
  darkMode: boolean;
  partyMode: boolean;
}

export function AmbientParticles({ darkMode, partyMode }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (prefersReduced) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2 - 0.12; // Slowly drift upwards
        this.opacity = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset when moving offscreen
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Standard or party color configurations
        const color = partyMode
          ? `hsla(${(Date.now() / 15 + this.x) % 360}, 100%, 75%, ${this.opacity})`
          : darkMode
          ? `rgba(173, 198, 255, ${this.opacity * 0.45})`
          : `rgba(0, 92, 187, ${this.opacity * 0.28})`;

        ctx.fillStyle = color;
        ctx.shadowBlur = partyMode ? 8 : 0;
        ctx.shadowColor = partyMode ? "white" : "transparent";
        ctx.fill();
      }
    }

    const maxParticles = partyMode ? 90 : 32;
    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let isPaused = false;
    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Render loop
    const render = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();

        // Push particles away from cursor smoothly
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= (dx / dist) * force * 0.45;
          p.y -= (dy / dist) * force * 0.45;
        }

        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, partyMode, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-20"
      style={{ opacity: partyMode ? 0.8 : 0.6 }}
    />
  );
}
