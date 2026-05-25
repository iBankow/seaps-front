import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/lib/axios";
import type { ChecklistListItem } from "../../types/types";
import { Loading } from "@/components/loading";
import { useInfiniteChecklistsList } from "../../api/checklists";
import { DataFilterForm } from "../list-components/filter-form";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChecklistListMobile = ({ search }: { search: any }) => {
  const {
    data,
    status,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteChecklistsList(search);

  const handleScroll = useCallback(
    (e?: React.UIEvent<HTMLDivElement>) => {
      if (!e) return;

      const bottom =
        Math.ceil(
          e?.currentTarget?.clientHeight + (e?.currentTarget?.scrollTop || 0),
        ) >= e?.currentTarget?.scrollHeight;

      if (bottom && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetching, hasNextPage],
  );

  return (
    <div className="flex-1 flex flex-col max-h-[calc(100vh-130px)] relative">
      <div className="flex items-center justify-between mb-4">
        <DataFilterForm
          data={data?.pages[0]?.data}
          totalRecords={data?.pages[0]?.meta?.total}
        />
      </div>
      <div className="overflow-scroll pr-2 -mr-2" onScroll={handleScroll}>
        {isLoading && (
          <div className="absolute inset-x-0 flex items-center justify-center py-4">
            <Loading size="lg" />
          </div>
        )}
        {isFetchingNextPage && (
          <div className="z-50 absolute inset-x-0 bottom-0 flex items-center justify-center py-4 bg-gradient-to-t from-background pointer-events-none">
            <Loading size="sm" />
          </div>
        )}
        <div className="flex flex-col gap-2 p-px">
          {status !== "pending" && !isLoading && RenderMap(data)}
        </div>
      </div>
    </div>
  );
};

const RenderMap = (
  data: InfiniteData<PaginatedResponse<ChecklistListItem>, unknown> | undefined,
) => {
  return data?.pages.map((page) =>
    page.data.map((checklist) => (
      <Link
        to={`/checklists/$checklistId`}
        params={{ checklistId: checklist.id }}
        key={checklist.id}
      >
        <Card
          className={cn(
            checklist.status === "CLOSED" && "ring-red-500/20",
            checklist.status === "OPEN" && "ring-green-500/20",
            checklist.status === "APPROVED" && "ring-purple-500/20",
            "drop-shadow",
          )}
        >
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xs font-thin font-mono">
              {checklist.sid}
              <span className="font-sans font-normal">
                {" - "}
                {checklist.organization.acronym}
              </span>
            </CardTitle>
            <CardDescription>
              <StatusBadge status={checklist.status} />
            </CardDescription>
          </CardHeader>
          <CardContent className="inline-flex items-center">
            <p className="line-clamp-2 font-bold">{checklist.property?.name}</p>
            <Button size="icon-sm" className="ml-auto">
              <ChevronRight />
            </Button>
          </CardContent>
        </Card>
      </Link>
    )),
  );
};
