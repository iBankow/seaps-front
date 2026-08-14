import { isMatch, Link, useMatches } from "@tanstack/react-router";

export const Breadcrumbs = () => {
  const matches = useMatches();
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb"),
  );

  const items = matchesWithCrumbs.map(({ pathname, loaderData }) => ({
    href: pathname,
    label: loaderData?.crumb as string,
  }));

  if (items.length === 0) return null;

  const parents = items.slice(0, -1);
  const current = items[items.length - 1];

  return (
    <div className="min-w-0 leading-tight">
      {parents.length > 0 && (
        <div className="font-mono flex flex-nowrap items-center gap-1 truncate text-[10px] tracking-widest text-muted-foreground uppercase">
          {parents.map((item, index) => (
            <span key={item.href} className="flex items-center gap-1">
              <Link
                to={item.href}
                replace
                preload={false}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
              {index < parents.length - 1 && <span aria-hidden>/</span>}
            </span>
          ))}
        </div>
      )}
      <div className="font-heading truncate text-sm font-bold tracking-wide text-foreground uppercase">
        {current.label}
      </div>
    </div>
  );
};
