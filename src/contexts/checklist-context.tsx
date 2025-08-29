import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { Checklist } from "types/types";

interface ChecklistContextType {
  checklist: Checklist | null;
  loading: boolean;
  error: string | null;
  refreshChecklist: () => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(
  undefined
);

interface ChecklistProviderProps {
  children: ReactNode;
  checklistId: string;
  checklist: Checklist;
}

export function ChecklistProvider({
  children,
  checklistId,
  checklist: Checklist,
}: ChecklistProviderProps) {
  const [checklist, setChecklist] = useState<Checklist | null>(Checklist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklist = async () => {
    try {
      setError(null);
      const response = await api.get(`/api/v1/checklists/${checklistId}`);
      setChecklist(response.data);
    } catch (err) {
      setError("Erro ao carregar checklist");
      console.error("Error fetching checklist:", err);
    }
  };

  const refreshChecklist = async () => {
    await fetchChecklist();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchChecklist();
      setLoading(false);
    };

    if (checklistId && !checklist) {
      loadData();
    }
  }, [checklistId]);

  const value: ChecklistContextType = {
    checklist,
    loading,
    error,
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
