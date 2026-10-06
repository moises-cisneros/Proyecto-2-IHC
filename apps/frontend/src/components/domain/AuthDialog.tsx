import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LandingScreen } from "./LandingScreen";

interface AuthDialogProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function AuthDialog({ title, description, icon: Icon, children }: AuthDialogProps) {
  const navigate = useNavigate();

  return (
    <>
      <LandingScreen />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) navigate("/");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <span className="mb-1 inline-flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-md shadow-primary/30">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AuthFooter({ children }: { children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-4 text-sm text-muted-foreground">
      {children}
    </p>
  );
}
