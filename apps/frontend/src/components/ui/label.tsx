import type { ComponentProps } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("flex items-center gap-2 text-sm font-semibold leading-none", className)}
      {...props}
    />
  );
}

export { Label };
