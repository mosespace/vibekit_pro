import { ExternalLink } from "lucide-react";
import { Section } from "./section";
import { Button } from "./ui/button";

const components = [
  { name: "Better Auth UI", desc: "Sign-in, sign-up, OAuth, password reset, OTP — full auth stack." },
  { name: "Website UI", desc: "10 marketing pages, navbar, footer, dark mode, i18n, full SEO." },
  { name: "Stripe UI", desc: "Embedded Payment Element, checkout flow, orders, webhooks." },
  { name: "Data Table", desc: "Search, sort, pagination, column visibility, row selection." },
  { name: "File Storage UI", desc: "S3/R2 drag-drop upload, preview, progress, file management." },
  { name: "MDX Blog", desc: "File-based blog with syntax highlighting and full SEO metadata." },
  { name: "DGateway Shop", desc: "Mobile Money + Stripe checkout for African markets." },
  { name: "Zustand Cart", desc: "Client-side cart with localStorage persistence." },
  { name: "Searchable Select", desc: "Filterable dropdown with search and clear." },
  { name: "Scalar API Docs", desc: "Interactive API docs with OpenAPI 3.0 spec." },
];

export function JBRegistry() {
  return (
    <Section
      id="features"
      eyebrow="JB component registry"
      title={<>Don't write what already exists. <em className="not-italic gradient-text">Install it.</em></>}
      description="Production-ready shadcn components for every primitive — auth, tables, forms, file uploads, e-commerce. Claude Code checks the registry before writing from scratch, saving 60–80% of tokens."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((c) => (
          <div
            key={c.name}
            className="reveal group flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition-all hover:border-[color:var(--border-strong)]"
          >
            <div>
              <h3 className="font-display text-[18px] leading-tight text-[color:var(--text-primary)]">
                {c.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
                {c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal mt-10 flex justify-center">
        <Button
          href="https://jb.desishub.com/blog/jb-component-registry-complete-reference"
          variant="outline"
          size="md"
        >
          Browse the full registry
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
