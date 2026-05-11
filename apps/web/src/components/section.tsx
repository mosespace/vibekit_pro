"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  align?: "left" | "center";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  children,
  align = "center",
}: SectionProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".reveal", root.current);
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      id={id}
      ref={root}
      className={cn("relative py-24 sm:py-32", className)}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", containerClassName)}>
        <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
          {eyebrow ? (
            <div className="reveal inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="reveal font-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
            {title}
          </h2>
          {description ? (
            <p className="reveal mt-5 text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        <div className="reveal mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
