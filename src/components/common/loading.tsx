export function Loading({ size = "default" }: { size?: string }) {
  const sizeClass =
    size === "default"
      ? "size-32"
      : size === "sm"
        ? "size-18"
        : size === "lg"
          ? "size-24"
          : size;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative animate-pulse">
        <div
          className={`absolute border-primary ${sizeClass} animate-spin rounded-full border-b-2`}
        ></div>
        <div className={`rounded overflow-hidden p-4 ${sizeClass}`}>
          <img src="/icon192.png" alt="Logo Governo" className="rounded-full" />
        </div>
      </div>
    </div>
  );
}
