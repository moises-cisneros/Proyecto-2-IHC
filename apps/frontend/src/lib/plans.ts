import type { Plan } from "../api/client";

/** Mirrors the server order: due date ascending, then creation time ascending. */
export function comparePlans(a: Plan, b: Plan): number {
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  return Date.parse(a.createdAt) - Date.parse(b.createdAt);
}

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" });

/** Formats a YYYY-MM-DD date in Spanish without time zone shifts. */
export function formatDueDate(dueDate: string): string {
  return dateFormatter.format(new Date(`${dueDate}T00:00:00.000Z`));
}

const DAY_MS = 86_400_000;

export type DueTone = "overdue" | "today" | "soon" | "later";

export interface DueStatus {
  tone: DueTone;
  label: string;
  days: number;
}

export function daysUntil(dueDate: string, now: Date = new Date()): number {
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${dueDate}T00:00:00.000Z`) - todayUtc) / DAY_MS);
}

export function getDueStatus(dueDate: string, now: Date = new Date()): DueStatus {
  const days = daysUntil(dueDate, now);
  if (days < 0) {
    const late = Math.abs(days);
    return { tone: "overdue", days, label: late === 1 ? "Venció ayer" : `Venció hace ${late} días` };
  }
  if (days === 0) return { tone: "today", days, label: "Es hoy" };
  if (days === 1) return { tone: "soon", days, label: "Mañana" };
  return { tone: days <= 7 ? "soon" : "later", days, label: `En ${days} días` };
}
