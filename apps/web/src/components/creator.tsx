"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Youtube,
  GitFork,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "./ui/button";
import { SITE } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.21 8.21 0 0 0 4.78 1.53V6.73a4.85 4.85 0 0 1-1.85-.04Z" />
    </svg>
  );
}

const mosesLinks = [
  { label: "GitHub", href: "https://github.com/mosespace", Icon: Github },
  { label: "Fork Repo", href: SITE.github, Icon: GitFork },
];

const mosesStats = [
  { value: "Full-Stack", label: "Speciality" },
  { value: "React / TS", label: "Stack" },
  { value: "Uganda", label: "Based in" },
  { value: "Open OSS", label: "Passion" },
];

const jbLinks = [
  { label: "Website", href: "https://jb.desishub.com", Icon: ExternalLink },
  { label: "GitHub", href: "https://github.com/MUKE-coder", Icon: Github },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@JBWEBDEVELOPER",
    Icon: Youtube,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muke-johnbaptist/",
    Icon: Linkedin,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@jbdesishub",
    Icon: TikTokIcon,
  },
];

function OrbitalPhoto({
  src,
  alt,
  size = "lg",
}: {
  src: string;
  alt: string;
  size?: "sm" | "lg";
}) {
  const dim =
    size === "lg" ? "h-64 w-64 sm:h-72 sm:w-72" : "h-40 w-40 sm:h-48 sm:w-48";
  return (
    <div className={`relative ${dim}`}>
      <svg
        className="absolute inset-0 h-full w-full animate-spin-slow"
        viewBox="0 0 100 100"
        aria-hidden
        style={{ animationDuration: "28s" }}
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.4"
          strokeDasharray="2 4"
          opacity="0.5"
        />
        <circle cx="50" cy="2" r="1.5" fill="var(--accent)" />
        <circle cx="98" cy="50" r="1" fill="var(--accent)" opacity="0.6" />
      </svg>
      <svg
        className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] animate-spin-slow"
        viewBox="0 0 100 100"
        aria-hidden
        style={{ animationDuration: "18s", animationDirection: "reverse" }}
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="0.4"
        />
      </svg>
      <div
        className="absolute inset-6 rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />
      <div className="absolute inset-6 overflow-hidden rounded-full border border-[color:var(--border-strong)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-xl)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="288px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function Creator() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });
      tl.from(".creator-section-label", { y: 10, opacity: 0, duration: 0.4 })
        .from(
          ".creator-fork-card",
          { y: 24, opacity: 0, duration: 0.7 },
          "-=0.2",
        )
        .from(
          ".creator-origin-card",
          { y: 18, opacity: 0, duration: 0.6 },
          "-=0.4",
        )
        .from(
          ".creator-stat",
          { y: 10, opacity: 0, stagger: 0.07, duration: 0.35 },
          "-=0.3",
        )
        .from(
          ".creator-link",
          { y: 8, opacity: 0, stagger: 0.05, duration: 0.3 },
          "-=0.2",
        );
      // ensure ScrollTrigger calculations are up-to-date on first load
      try {
        ScrollTrigger.refresh();
      } catch (e) {
        /* noop */
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="creator"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background ambient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 60%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section label */}
        <div className="creator-section-label mb-12 flex items-center gap-3">
          <div className="h-px flex-1 bg-[color:var(--border)]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            The people behind VibeKit
          </span>
          <div className="h-px flex-1 bg-[color:var(--border)]" />
        </div>

        {/* ── Fork maintainer ── Moses Kisakye */}
        <div className="creator-fork-card group relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8 sm:p-12 transition-all hover:border-[color:var(--border-strong)]">
          {/* Accent glow on hover */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 50%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 70%)",
            }}
          />

          {/* Fork badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
            <GitFork className="h-3 w-3" />
            Fork Maintainer
          </div>

          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start md:gap-16">
            {/* Photo */}
            <div className="mx-auto md:mx-0">
              <div className="relative">
                <OrbitalPhoto
                  src={SITE.authorAvatar}
                  alt="Moses Kisakye"
                  size="lg"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-secondary)] shadow-[var(--shadow-md)] whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Building
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                Maintained by
              </div>
              <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
                Hi, I'm <em className="not-italic gradient-text">Moses</em>.
                <br />
                <span className="text-[color:var(--text-secondary)]">
                  I maintain this fork.
                </span>
              </h2>

              <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
                <p>
                  I'm{" "}
                  <strong className="font-medium text-[color:var(--text-primary)]">
                    Moses Kisakye
                  </strong>
                  , a full-stack engineer based in Uganda. I picked up VibeKit,
                  fell in love with the workflow, and decided to actively
                  maintain and extend it adding{" "}
                  <strong className="font-medium text-[color:var(--text-primary)]">
                    create-vibekit-app
                  </strong>
                  , multi-provider support (Claude Code, Codex, Gemini,
                  OpenCode), and a tighter monorepo setup.
                </p>
                <p>
                  This fork tracks upstream (
                  <a
                    href={SITE.upstreamGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--accent)] underline underline-offset-4"
                  >
                    MUKE-coder/vibekit
                  </a>
                  ) while adding my own improvements. All credit for the
                  original framework goes to JB see below.
                </p>
              </div>

              {/* Stats */}
              <dl className="creator-stat mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {mosesStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-mono text-[15px] font-semibold text-[color:var(--text-primary)]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                {mosesLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-link inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-secondary)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  href="https://github.com/mosespace"
                  variant="accent"
                  size="md"
                >
                  View github.com/mosespace
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Original creator ── JB */}
        <div className="creator-origin-card mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            {/* Small photo */}
            <div className="mx-auto shrink-0 sm:mx-0">
              <OrbitalPhoto
                src={SITE.originalAuthorAvatar}
                alt="JB (Muke Johnbaptist)"
                size="sm"
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                Original Creator · VibeKit
              </div>

              <h3 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight tracking-tight text-[color:var(--text-primary)]">
                Built by <em className="not-italic gradient-text">JB</em> Muke
                Johnbaptist
              </h3>

              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                VibeKit was created by{" "}
                <strong className="font-medium text-[color:var(--text-primary)]">
                  Muke Johnbaptist
                </strong>
                , founder of{" "}
                <a
                  href="https://desishub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] underline underline-offset-4"
                >
                  Desishub Technologies
                </a>{" "}
                in Kampala, Uganda. He built VibeKit because he was tired of
                burning tokens and watching agents ship code with
                unauthenticated routes. All the battle-tested patterns in this
                framework came from his real client projects. He also created
                the{" "}
                <a
                  href="https://gritframework.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] underline underline-offset-4"
                >
                  Grit Framework
                </a>{" "}
                and the JB Component Registry.
              </p>

              {/* Links */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {jbLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-link inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </a>
                ))}
              </div>

              <div className="mt-5">
                <a
                  href={SITE.upstreamGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)] transition-colors hover:text-[color:var(--text-primary)]"
                >
                  <Github className="h-3.5 w-3.5" />
                  Upstream repo: github.com/MUKE-coder/vibekit
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
