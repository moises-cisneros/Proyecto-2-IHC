import { ProfileIcon } from "../atoms/ProfileIcon";

export function ProfileMenu({ name }: { name: string }) {
  return (
    <div className="flex min-h-11 items-center gap-s">
      <ProfileIcon label={`Perfil de ${name}`} />
      <span className="hidden max-w-40 truncate text-label sm:inline" aria-hidden="true">
        {name}
      </span>
    </div>
  );
}
