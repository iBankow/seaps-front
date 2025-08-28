"use client";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Link, useRouter } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IPaginationComponent {
  className?: HTMLAttributes<"nav">["className"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}

export function Pagination({ className, meta }: IPaginationComponent) {
  const LE = "-3";
  const RE = "+3";

  const router = useRouter();

  const generatePages = () => {
    const current = Math.min(meta?.current_page || 1, meta?.current_page || 1);
    const total = Math.max(1, meta?.last_page || 1);

    if (total <= 7) {
      return Array.from({ length: total }).map((_, i) => i + 1);
    }

    if (current < 3) {
      return [1, 2, 3, RE, total - 1, total];
    }

    if (current === 3) {
      return [1, 2, 3, 4, RE, total - 1, total];
    }

    if (current > total - 2) {
      return [1, 2, LE, total - 2, total - 1, total];
    }

    if (current === total - 2) {
      return [1, 2, LE, total - 3, total - 2, total - 1, total];
    }

    return [1, LE, current - 1, current, current + 1, RE, total];
  };

  function getParams(page: number) {
    const params = { ...router.latestLocation.search };

    params.per_page = meta?.per_page || 10;
    params.page = page;

    delete params.refresh;

    return params;
  }

  return (
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem className="hidden sm:block">
          <Button variant="ghost" disabled={meta?.prev_page === null} asChild>
            <Link
              to="."
              search={getParams(
                meta?.current_page ? meta?.current_page - 1 : 0
              )}
            >
              <ChevronLeft />
              Anterior
            </Link>
          </Button>
        </PaginationItem>
        {generatePages().map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={index}>
                <Button variant="ghost" disabled asChild size="icon">
                  <Link
                    to="."
                    search={getParams(meta?.current_page + Number(item))}
                  >
                    <PaginationEllipsis />
                  </Link>
                </Button>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={index}>
              <Button
                asChild
                variant={meta.current_page === item ? "secondary" : "ghost"}
                size="icon"
              >
                <Link to="." search={getParams(item)}>
                  {item}
                </Link>
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem className="hidden sm:block">
          <Button variant="ghost" disabled={meta?.next_page === null} asChild>
            <Link
              to="."
              search={getParams(
                meta?.current_page ? meta?.current_page + 1 : 0
              )}
            >
              Proximo
              <ChevronRight />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
