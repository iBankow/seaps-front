import { Skeleton } from "seaps-front";

export function CardLoading() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
