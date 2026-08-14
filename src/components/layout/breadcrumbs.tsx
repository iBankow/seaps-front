import { isMatch, Link, useMatches } from "@tanstack/react-router";

interface Crumb {
  href: string;
  label: string;
}

/** Route trail declared by each route's `loader` via `crumb`. */
export function useCrumbs(): Crumb[] {
  const matches = useMatches();
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb"),
  );

  return matchesWithCrumbs.map(({ pathname, loaderData }) => ({
    href: pathname,
    label: loaderData?.crumb as string,
  }));
}

/**
 * Navigational trail rendered as the eyebrow line of the site header, for
 * pages that don't declare an explicit `eyebrow` through <PageHeader>.
 *
 * `omitLast` drops the deepest crumb, which the header already shows as the
 * page title — without it the same label would appear twice.
 */
export const Breadcrumbs = ({ omitLast = false }: { omitLast?: boolean }) => {
  const crumbs = useCrumbs();
  const items = omitLast ? crumbs.slice(0, -1) : crumbs;

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
