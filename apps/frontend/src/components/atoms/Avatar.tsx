import { cn } from "@/lib/utils";

interface AvatarProps {
  label: string;
  name: string;
  className?: string;
}

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

export function Avatar({ label, name, className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex size-9 shrink-0 select-none items-center justify-center rounded-full border bg-secondary text-xs font-bold text-secondary-foreground",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
