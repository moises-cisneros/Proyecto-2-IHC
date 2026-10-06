import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-primary-foreground shadow-sm shadow-primary/25 hover:brightness-110 hover:shadow-md hover:shadow-primary/30 active:brightness-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border border-input bg-card text-foreground shadow-xs hover:border-primary/60 hover:bg-secondary/50",
        ghost: "text-foreground hover:bg-secondary/70",
        accent: "bg-accent text-accent-foreground shadow-sm hover:brightness-105",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-5 py-2",
        sm: "min-h-9 px-3.5 py-1.5",
        lg: "min-h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
