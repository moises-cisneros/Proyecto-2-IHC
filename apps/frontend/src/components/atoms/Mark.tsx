import { Link } from "react-router-dom";

interface MarkProps {
  /** Removes the bottom margin so the mark can sit inside a row (e.g. the navbar). */
  inline?: boolean;
}

export function Mark({ inline = false }: MarkProps) {
  return (
    <Link
      to="/"
      className={`${inline ? "flex min-h-11 items-center" : "mb-l block"} w-fit rounded-pill bg-second-surface px-s py-xs text-label uppercase tracking-wide text-on-second-surface`}
    >
      Planazo
    </Link>
  );
}
