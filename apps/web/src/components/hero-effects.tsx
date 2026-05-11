"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
 * Hero effects layer
 * - Animated circuit lines drawing in (SVG)
 * - Floating particles with cursor parallax (canvas)
 * - All theme-aware via CSS variables
 * ──────────────────────────────────────────────────────────── */

export function HeroEffects() {
  return (
    <>
      <CircuitLines />
      <ParticleField />
    </>
  );
}

/** Animated SVG circuits drawing in around the hero */
function CircuitLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="circuit-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="circuit-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="node-glow">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Left circuit */}
      <g stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.55">
        <path
          d="M -20 200 L 200 200 L 230 230 L 230 320 L 280 360 L 380 360"
          className="circuit-draw"
        />
        <circle cx="200" cy="200" r="3" fill="var(--accent)" className="circuit-node" />
        <circle cx="230" cy="320" r="3" fill="var(--accent)" className="circuit-node" />
        <circle cx="380" cy="360" r="4" fill="var(--accent)" className="circuit-node-pulse" />
        <circle cx="380" cy="360" r="14" fill="url(#node-glow)" className="circuit-node-pulse" />
      </g>

      {/* Right circuit */}
      <g stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.55">
        <path
          d="M 1220 250 L 1000 250 L 970 280 L 970 380 L 920 420 L 820 420"
          className="circuit-draw"
          style={{ animationDelay: "0.4s" }}
        />
        <circle cx="1000" cy="250" r="3" fill="var(--accent)" className="circuit-node" />
        <circle cx="970" cy="380" r="3" fill="var(--accent)" className="circuit-node" />
        <circle cx="820" cy="420" r="4" fill="var(--accent)" className="circuit-node-pulse" />
        <circle cx="820" cy="420" r="14" fill="url(#node-glow)" className="circuit-node-pulse" />
      </g>

      {/* Bottom-left circuit */}
      <g stroke="var(--accent)" strokeWidth="0.6" fill="none" opacity="0.4">
        <path
          d="M -20 700 L 150 700 L 180 670 L 280 670 L 320 630 L 480 630"
          className="circuit-draw"
          style={{ animationDelay: "0.8s" }}
        />
        <circle cx="150" cy="700" r="2.5" fill="var(--accent)" className="circuit-node" />
        <circle cx="280" cy="670" r="2.5" fill="var(--accent)" className="circuit-node" />
        <circle cx="480" cy="630" r="3" fill="var(--accent)" className="circuit-node-pulse" />
      </g>

      {/* Bottom-right circuit */}
      <g stroke="var(--accent)" strokeWidth="0.6" fill="none" opacity="0.4">
        <path
          d="M 1220 720 L 1050 720 L 1020 690 L 920 690 L 880 650 L 720 650"
          className="circuit-draw"
          style={{ animationDelay: "1.1s" }}
        />
        <circle cx="1050" cy="720" r="2.5" fill="var(--accent)" className="circuit-node" />
        <circle cx="920" cy="690" r="2.5" fill="var(--accent)" className="circuit-node" />
        <circle cx="720" cy="650" r="3" fill="var(--accent)" className="circuit-node-pulse" />
      </g>

      {/* Traveling pulses */}
      <g>
        <circle r="2.5" fill="var(--accent)" className="circuit-pulse-l" />
        <circle r="2.5" fill="var(--accent)" className="circuit-pulse-r" />
      </g>

      <style>{`
        .circuit-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 2.4s ease-out forwards;
        }
        .circuit-node {
          opacity: 0;
          animation: pop-in 0.4s ease-out forwards;
          animation-delay: 1.4s;
        }
        .circuit-node-pulse {
          opacity: 0;
          animation: pop-in 0.4s ease-out forwards, glow-pulse 2.6s ease-in-out infinite;
          animation-delay: 1.8s, 2.2s;
        }
        .circuit-pulse-l {
          offset-path: path("M -20 200 L 200 200 L 230 230 L 230 320 L 280 360 L 380 360");
          animation: pulse-along 4s ease-in-out infinite;
          animation-delay: 2.4s;
          opacity: 0;
        }
        .circuit-pulse-r {
          offset-path: path("M 1220 250 L 1000 250 L 970 280 L 970 380 L 920 420 L 820 420");
          animation: pulse-along 4s ease-in-out infinite;
          animation-delay: 3s;
          opacity: 0;
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-along {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .circuit-draw, .circuit-node, .circuit-node-pulse, .circuit-pulse-l, .circuit-pulse-r {
            animation: none;
          }
          .circuit-draw { stroke-dashoffset: 0; }
          .circuit-node, .circuit-node-pulse { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

/** Floating particle field with cursor parallax (canvas) */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollOffset = 0;

    const accentColor = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#818CF8";

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      depth: number; // 0..1, controls parallax + size
      hue: number;
    }> = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-init particles based on size
      const count = Math.floor((width * height) / 14000);
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.6 + Math.random() * 1.4,
          depth: Math.random(),
          hue: Math.random() > 0.7 ? 1 : 0, // 30% are accent-colored
        });
      }
    };

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - width / 2;
      mouseY = e.clientY - rect.top - height / 2;
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const accent = accentColor();

      for (const p of particles) {
        // Physics: gentle drift + cursor parallax based on depth
        p.x += p.vx + (mouseX * p.depth) * 0.0008;
        p.y += p.vy + (mouseY * p.depth) * 0.0008 - scrollOffset * 0.0001 * p.depth;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const radius = p.r * (0.5 + p.depth * 0.7);
        const alpha = 0.25 + p.depth * 0.55;

        if (p.hue) {
          ctx.fillStyle = `${accent}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        } else {
          ctx.fillStyle = `rgba(180, 180, 180, ${alpha * 0.5})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect close particles with thin lines (constellation)
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.globalAlpha = 1 - dist / 90;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
