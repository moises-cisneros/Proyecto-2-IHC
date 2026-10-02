import { ArrowRight, CalendarCheck2, Clock, Sparkles, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Logo } from "../atoms/Logo";
import { PublicNavbar } from "../organisms/PublicNavbar";

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Users,
    title: "Pensado para el grupo",
    text: "Todos ven el mismo plan, sin cadenas de mensajes ni confusiones.",
  },
  {
    icon: CalendarCheck2,
    title: "Fechas siempre claras",
    text: "Cada plan muestra cuánto falta para su fecha límite de un vistazo.",
  },
  {
    icon: Zap,
    title: "Listo en segundos",
    text: "Describe el plan, elige la fecha y comparte la idea sin fricción.",
  },
];

function PreviewCard({
  title,
  date,
  badge,
  variant,
  className,
}: {
  title: string;
  date: string;
  badge: string;
  variant: "default" | "warning" | "success";
  className?: string;
}) {
  return (
    <Card className={cn("gap-3 p-4 shadow-lg shadow-primary/10", className)}>
      <Badge variant={variant}>
        <Clock aria-hidden="true" />
        {badge}
      </Badge>
      <p className="font-display text-lg font-bold leading-snug">{title}</p>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarCheck2 aria-hidden="true" className="size-4 text-primary" />
        {date}
      </p>
    </Card>
  );
}

export function LandingScreen() {
  return (
    <div className="min-h-screen bg-mesh">
      <PublicNavbar />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div className="grid justify-items-start gap-6">
            <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Ayudar a un grupo a <span className="text-brand-gradient">organizar un plan.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Planazo reúne las ideas de tu grupo en un solo lugar: crea planes, ponles fecha
              límite y no pierdas de vista lo que viene.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/register">
                  Crear cuenta gratis
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>

          <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-3xl" />
            <div className="relative grid gap-4">
              <PreviewCard
                title="Escapada a la playa"
                date="Sábado por la tarde"
                badge="En 2 semanas"
                variant="default"
                className="animate-float"
              />
              <PreviewCard
                title="Cena de cumpleaños"
                date="Viernes por la noche"
                badge="Mañana"
                variant="warning"
                className="translate-x-6 animate-float [animation-delay:-2s]"
              />
              <PreviewCard
                title="Torneo de fútbol"
                date="Domingo por la mañana"
                badge="En 4 semanas"
                variant="success"
                className="-translate-x-3 animate-float [animation-delay:-4s]"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="features-title" className="mb-8 text-3xl font-bold">
            Todo lo que tu grupo necesita
          </h2>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Card className="h-full gap-3 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/10">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-ink-foreground sm:px-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-10 size-72 rounded-full bg-primary/50 blur-3xl"
            />
            <div className="relative grid justify-items-center gap-5">
              <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
                Tu próximo planazo empieza hoy
              </h2>
              <p className="max-w-md text-ink-foreground/80">
                Crea tu cuenta y registra el primer plan de tu grupo en menos de un minuto.
              </p>
              <Button asChild size="lg" variant="accent">
                <Link to="/register">
                  Empezar ahora
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Logo className="[&>span:last-child]:text-base" />
          <p>© {new Date().getFullYear()} Planazo</p>
        </div>
      </footer>
    </div>
  );
}
