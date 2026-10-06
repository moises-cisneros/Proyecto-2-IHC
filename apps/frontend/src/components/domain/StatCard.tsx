import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "primary" | "accent" | "danger";
}

const chipStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/40 text-accent-foreground",
  danger: "bg-destructive/10 text-destructive",
} as const;

export function StatCard({ icon: Icon, label, value, tone = "primary" }: StatCardProps) {
  return (
    <Card className="flex-row items-center gap-4 p-4">
      <span className={cn("inline-flex size-12 shrink-0 items-center justify-center rounded-xl", chipStyles[tone])}>
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate font-display text-xl font-bold">{value}</p>
      </div>
    </Card>
  );
}
