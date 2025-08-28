import { isMatch, Link, useMatches } from "@tanstack/react-router";
import { BreadcrumbItem, BreadcrumbSeparator } from "./ui/breadcrumb";
import React from "react";
import { cn } from "@/lib/utils";

export const Breadcrumbs = () => {
  const matches = useMatches();
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb")
  );

  const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
    return {
      href: pathname,
      label: loaderData?.crumb,
    };
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              <Link
                to={item.href}
                className={cn(
                  "breadcrumb-link",
                  index === items.length - 1 && "font-bold"
                )}
              >
                {item.label}
              </Link>
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator
                key={"separator-" + index}
                className="self-center"
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
