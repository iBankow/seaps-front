import { DataTable } from "@/components/common/data-table";
import { Pagination } from "@/components/common/pagination";
import { useState } from "react";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useReviewUserRequest, useUserRequestsList } from "../api/user-requests";
import type { UserRequestsListParams } from "../types";
import { createRequestsColumns, type RequestColumn } from "./requests-columns";
import { RequestsFilterForm } from "./requests-filter-form";
import { RequestDetailsModal } from "./request-details-modal";

interface RequestsTabProps {
  search: UserRequestsListParams;
}

export function RequestsTab({ search }: RequestsTabProps) {
  const { data, isLoading } = useUserRequestsList(search);
  const { mutateAsync: reviewRequest, isPending: submitting } =
    useReviewUserRequest();

  const [selectedRequest, setSelectedRequest] = useState<RequestColumn | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewRequest = (request: RequestColumn) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleApprove = async (
    requestId: string,
    _observation?: string,
    permissions?: string[],
  ) => {
    try {
      await reviewRequest({ id: requestId, status: "APPROVED", permissions });
      toast.success("Solicitação aprovada com sucesso!");
      setModalOpen(false);
    } catch (error: any) {
      console.error("Erro ao aprovar solicitação:", error);
      toast.error(
        error.response?.data?.message || "Erro ao aprovar solicitação",
      );
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await reviewRequest({
        id: requestId,
        status: "REJECTED",
        rejection_reason: reason,
      });
      toast.success("Solicitação rejeitada com sucesso!");
      setModalOpen(false);
    } catch (error: any) {
      console.error("Erro ao rejeitar solicitação:", error);
      toast.error(
        error.response?.data?.message || "Erro ao rejeitar solicitação",
      );
    }
  };

  const columns = createRequestsColumns({
    onView: handleViewRequest,
  });

  return (
    <>
      <CardContent className="space-y-6 pt-6">
        <RequestsFilterForm />
        <div className="rounded-lg border">
          {isLoading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data ?? []} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t mt-6 pt-6">
        {data?.meta && data.meta.total > 10 && <Pagination meta={data.meta} />}
      </CardFooter>

      <RequestDetailsModal
        request={selectedRequest}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        submitting={submitting}
      />
    </>
  );
}
