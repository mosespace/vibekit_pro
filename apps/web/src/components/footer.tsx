import Link from "next/link";
import { SITE } from "@/lib/utils";

const cols = [
  {
    label: "Framework",
    links: [
      { name: "Tutorial — TaskFlow course", href: "/tutorial" },
      { name: "Quickstart", href: "/docs/quickstart" },
      { name: "GitHub (fork)", href: SITE.github },
      { name: "CLAUDE_PROMPT.md", href: `${SITE.github}/blob/main/CLAUDE_PROMPT.md` },
      { name: "Pre-deploy review", href: `${SITE.github}/blob/main/pre-deploy-review.md` },
    ],
  },
  {
    label: "Reference",
    links: [
      { name: "Database guide", href: `${SITE.upstreamGithub}/blob/main/database-guide.md` },
      { name: "Deployment", href: `${SITE.upstreamGithub}/blob/main/deployment.md` },
      { name: "Environment vars", href: `${SITE.upstreamGithub}/blob/main/environment-variables.md` },
      { name: "Monetization", href: `${SITE.upstreamGithub}/blob/main/monetization-guide.md` },
      { name: "Troubleshooting", href: `${SITE.upstreamGithub}/blob/main/troubleshooting.md` },
    ],
  },
  {
    label: "Community",
    links: [
      { name: "Join WhatsApp community", href: SITE.community },
      { name: "GitHub Discussions", href: `${SITE.github}/discussions` },
      { name: "Contribute a component", href: "/contribute" },
      { name: "JB Component Registry", href: "https://jb.desishub.com/blog/jb-component-registry-complete-reference" },
    ],
  },
  {
    label: "Authors",
    links: [
      { name: "Moses Kisakye (fork)", href: SITE.authorUrl },
      { name: "JB · Desishub (original)", href: SITE.originalAuthorUrl },
      { name: "Desishub Technologies", href: "https://desishub.com" },
      { name: "JB on YouTube", href: "https://www.youtube.com/@JBWEBDEVELOPER" },
      { name: "Upstream repo", href: SITE.upstreamGithub },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.label}>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                {col.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.name}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[color:var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] font-mono text-[11px] font-bold">
              VK
            </span>
            <span className="font-display text-[16px] tracking-tight text-[color:var(--text-primary)]">
              VibeKit
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:items-end">
            <p className="text-[13px] text-[color:var(--text-tertiary)]">
              MIT licensed · Fork maintained by{" "}
              <a
                href={SITE.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
              >
                Moses Kisakye
              </a>
            </p>
            <p className="text-[12px] text-[color:var(--text-tertiary)]">
              Original framework by{" "}
              <a
                href={SITE.originalAuthorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--text-secondary)] transition-colors"
              >
                JB (Muke Johnbaptist)
              </a>
              {" "}· Desishub Technologies
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
