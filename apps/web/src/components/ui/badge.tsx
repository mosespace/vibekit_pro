import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[color:var(--text-primary)] text-[color:var(--text-inverse)]",
        secondary:
          "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-secondary)]",
        accent:
          "border-transparent bg-[color:var(--accent)] text-[color:var(--accent-fg)]",
        outline:
          "border-[color:var(--border-strong)] bg-transparent text-[color:var(--text-primary)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
