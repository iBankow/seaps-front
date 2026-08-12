import { isMatch, Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { cn } from "@/lib/utils";

export const Breadcrumbs = () => {
  const matches = useMatches();
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb"),
  );

  const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
    return {
      href: pathname,
      label: loaderData?.crumb,
    };
  });

  if (items.length > 3) {
    return (
      <Breadcrumb className="overflow-hidden overflow-ellipsis">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to={items[0].href}
                replace
                preload={false}
                className={cn("breadcrumb-link")}
              >
                {items[0].label}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="self-center" />
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator className="self-center" />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {items[items.length - 1].label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index === items.length - 1 ? (
              <BreadcrumbItem>
                <BreadcrumbPage key={index} className="line-clamp-1">
                  {item.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink asChild>
                  <Link
                    to={item.href}
                    replace
                    preload={false}
                    className={cn(
                      "breadcrumb-link",
                      index === items.length - 1 && "font-bold",
                    )}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator
                key={"separator-" + index}
                className="self-center"
              />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
