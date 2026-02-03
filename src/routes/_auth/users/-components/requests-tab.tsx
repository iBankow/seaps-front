import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { api } from "@/lib/api";
import { createRequestsColumns, type RequestColumn } from "./requests-columns";
import { RequestsFilterForm } from "./requests-filter-form";
import { CardContent, CardFooter } from "@/components/ui/card";
import { RequestDetailsModal } from "./request-details-modal";
import { toast } from "sonner";

interface RequestsTabProps {
  search: {
    page?: number;
    per_page?: number;
    organization?: string;
    status?: string;
    user_name?: string;
  };
}

export function RequestsTab({ search }: RequestsTabProps) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestColumn | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = () => {
    setLoading(true);
    api
      .get("/api/v1/user-requests", {
        params: { ...search },
      })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  };

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
      setSubmitting(true);
      await api.patch(`/api/v1/user-requests/${requestId}/status`, {
        status: "APPROVED",
        permissions,
      });

      toast.success("Solicitação aprovada com sucesso!");
      setModalOpen(false);
      loadRequests(); // Recarrega a lista
    } catch (error: any) {
      console.error("Erro ao aprovar solicitação:", error);
      toast.error(
        error.response?.data?.message || "Erro ao aprovar solicitação",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      setSubmitting(true);
      await api.patch(`/api/v1/user-requests/${requestId}/status`, {
        status: "REJECTED",
        rejection_reason: reason,
      });

      toast.success("Solicitação rejeitada com sucesso!");
      setModalOpen(false);
      loadRequests(); // Recarrega a lista
    } catch (error: any) {
      console.error("Erro ao rejeitar solicitação:", error);
      toast.error(
        error.response?.data?.message || "Erro ao rejeitar solicitação",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = createRequestsColumns({
    onView: handleViewRequest,
  });

  useEffect(() => {
    loadRequests();
  }, [search]);

  return (
    <>
      <CardContent className="space-y-6 pt-6">
        <RequestsFilterForm />
        <div className="rounded-lg border">
          {loading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t mt-6 pt-6">
        {/* <div className="text-sm text-muted-foreground">
          {data?.meta && (
            <span>
              Mostrando{" "}
              <span className="font-medium">{data?.data?.length || 0}</span> de{" "}
              <span className="font-medium">{data?.meta?.total || 0}</span>{" "}
              solicitação(ões)
            </span>
          )}
        </div> */}
        {data?.meta?.total > 10 && <Pagination meta={data?.meta} />}
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
