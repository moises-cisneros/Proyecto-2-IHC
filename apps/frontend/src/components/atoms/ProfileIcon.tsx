interface ProfileIconProps {
  /** Accessible name, e.g. "Perfil de Ana". */
  label: string;
}

export function ProfileIcon({ label }: ProfileIconProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-primary"
    >
      <circle cx="12" cy="12" r="10.25" />
      <circle cx="12" cy="9.5" r="3.25" />
      <path d="M5.5 19c1.4-3 3.6-4.25 6.5-4.25s5.1 1.25 6.5 4.25" />
    </svg>
  );
}
