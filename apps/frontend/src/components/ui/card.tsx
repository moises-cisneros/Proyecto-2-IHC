import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
