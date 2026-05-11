import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cn("text-[color:var(--text-primary)]", className)}
      aria-hidden="true"
    >
      {/* Geometric "VK" — two angled strokes forming a V, with a vertical bar like a K */}
      <path d="M 8 8 L 26 56 L 44 8" />
      <path d="M 50 8 L 50 56" />
      <path d="M 50 32 L 60 8" />
      <path d="M 50 32 L 60 56" />
    </svg>
  );
}

export function LogoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-7 w-7 place-items-center rounded-[6px] bg-[color:var(--text-primary)] text-[color:var(--text-inverse)]",
        className
      )}
    >
      <LogoMark size={16} className="text-[color:var(--text-inverse)]" />
    </span>
  );
}
