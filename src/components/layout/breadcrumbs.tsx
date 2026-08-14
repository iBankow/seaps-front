import { isMatch, Link, useMatches } from "@tanstack/react-router";

/**
 * Slim navigational trail in the persistent top bar. Pages that render a
 * <PageHeader> own the big title themselves — this stays small/muted so the
 * two never compete for the same visual weight.
 */
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

  return (
    <div className="font-mono flex min-w-0 flex-nowrap items-center gap-1 truncate text-[10px] tracking-widest text-muted-foreground uppercase">
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-1">
          {index === items.length - 1 ? (
            <span className="text-foreground">{item.label}</span>
          ) : (
            <Link
              to={item.href}
              replace
              preload={false}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          )}
          {index < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </div>
  );
};
