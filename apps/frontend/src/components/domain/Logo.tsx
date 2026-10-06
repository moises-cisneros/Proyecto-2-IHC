import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** Planazo symbol: a calendar with a check, plus an amber spark. Decorative by default. */
export function LogoMark({ className }: LogoMarkProps) {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${gradientId})`} />
      <rect x="14" y="19" width="36" height="31" rx="8" fill="#fff" />
      <rect x="14" y="19" width="36" height="10" rx="5" fill="#ccfbf1" />
      <rect x="22" y="13" width="4.5" height="12" rx="2.25" fill="#fff" />
      <rect x="37.5" y="13" width="4.5" height="12" rx="2.25" fill="#fff" />
      <path
        d="M23 40.5l6 6 12-13"
        fill="none"
        stroke="#0f766e"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="51" cy="14" r="7" fill="#fbbf24" />
      <path d="M51 9.5v9M46.5 14h9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  tone?: "default" | "light";
}

export function Logo({ className, tone = "default" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          tone === "light" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        Planazo
      </span>
    </span>
  );
}
