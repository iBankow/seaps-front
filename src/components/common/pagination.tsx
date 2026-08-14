"use client";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Link, useRouter } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IPaginationComponent {
  className?: HTMLAttributes<"nav">["className"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}

/*
 * Estilos da paginação do design "Painel SIMP": pílulas com borda de 1.5px que
 * acende na cor da marca no hover. `hover:bg-card` neutraliza o `hover:bg-muted`
 * da variante ghost — aqui quem responde ao hover é a borda, não o fundo.
 *
 * O raio vem de `rounded-lg` (= `--radius`) em vez dos 7px cravados no design,
 * para acompanhar o token global.
 */
const NAV_BUTTON =
  "h-8 rounded-lg border-[1.5px] border-input bg-card px-3.5 font-heading text-[10px] font-bold tracking-[0.1em] text-primary uppercase hover:border-primary hover:bg-card hover:text-primary [&_svg]:size-3";

const PAGE_BUTTON =
  "h-8 min-w-[34px] rounded-lg border-[1.5px] px-0 font-mono text-[11px] font-semibold";

const PAGE_INACTIVE =
  "border-input bg-card text-muted-foreground hover:border-primary hover:bg-card hover:text-primary";

const PAGE_ACTIVE =
  "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";

const ELLIPSIS_BUTTON = "h-8 min-w-[34px] px-0 text-muted-foreground";

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
          <Button
            variant="ghost"
            disabled={meta?.prev_page === null}
            className={NAV_BUTTON}
            asChild
          >
            <Link
              replace={true}
              to="."
              search={getParams(
                meta?.current_page ? meta?.current_page - 1 : 0
              )}
            >
              <ChevronLeft data-icon="inline-start" />
              Anterior
            </Link>
          </Button>
        </PaginationItem>
        {generatePages().map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={index}>
                <Button
                  variant="ghost"
                  disabled
                  asChild
                  size="icon"
                  className={ELLIPSIS_BUTTON}
                >
                  <Link
                    replace={true}
                    to="."
                    search={getParams(meta?.current_page + Number(item))}
                  >
                    <PaginationEllipsis />
                  </Link>
                </Button>
              </PaginationItem>
            );
          }

          const isActive = meta?.current_page === item;

          return (
            <PaginationItem key={index}>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  PAGE_BUTTON,
                  isActive ? PAGE_ACTIVE : PAGE_INACTIVE,
                )}
              >
                <Link
                  replace={true}
                  to="."
                  search={getParams(item)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </Link>
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem className="hidden sm:block">
          <Button
            variant="ghost"
            disabled={meta?.next_page === null}
            className={NAV_BUTTON}
            asChild
          >
            <Link
              replace={true}
              to="."
              search={getParams(
                meta?.current_page ? meta?.current_page + 1 : 0
              )}
            >
              Proximo
              <ChevronRight data-icon="inline-end" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
