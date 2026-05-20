import { createContext, useContext, type ReactNode } from "react";
import { useChecklistDetail as useChecklistDetail } from "@/features/checklists/api/checklists";
import { useRouter } from "@tanstack/react-router";
import type { Checklist } from "../../types/types";

interface ChecklistContextType {
  checklist: Checklist;
  loading: boolean;
  error: string | null;
  refreshChecklist: () => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(
  undefined,
);

interface ChecklistProviderProps {
  children: ReactNode;
  checklistId: string;
}

export function ChecklistProvider({
  children,
  checklistId,
}: ChecklistProviderProps) {
  const route = useRouter();
  const { data, isLoading, refetch, error } = useChecklistDetail(checklistId);

  const refreshChecklist = async () => {
    await refetch();
  };

  const checklist = data || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando checklist...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && error) {
    route.navigate({ to: "/checklists" });
    return null;
  }

  const value: ChecklistContextType = {
    checklist: checklist as Checklist,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refreshChecklist,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error("useChecklist must be used within a ChecklistProvider");
  }
  return context;
}
