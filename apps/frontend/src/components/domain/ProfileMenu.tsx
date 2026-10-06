import { Avatar } from "./Avatar";

export function ProfileMenu({ name }: { name: string }) {
  return (
    <div className="flex min-h-11 items-center gap-2.5">
      <Avatar label={`Perfil de ${name}`} name={name} />
      <span className="hidden max-w-40 truncate text-sm font-semibold md:inline" aria-hidden="true">
        {name}
      </span>
    </div>
  );
}
