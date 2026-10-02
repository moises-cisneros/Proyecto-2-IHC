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
