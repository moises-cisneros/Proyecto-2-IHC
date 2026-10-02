import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        error: "border-destructive/40 bg-destructive/8 text-destructive",
        success: "border-success/40 bg-success/10 text-foreground [&>svg]:text-success",
      },
    },
    defaultVariants: { variant: "error" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}

export { Alert };
