import api, {
  getApiErrorAction,
  getApiErrorMessage,
  initialData,
  isApiError,
  type PaginatedResponse,
} from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Person, PersonCreatePayload, PersonsListParams } from "../types";
import { personsKeys } from "./query-keys";
import { toast } from "sonner";

export const usePersonsList = (filters?: PersonsListParams) => {
  return useQuery({
    queryKey: personsKeys.list(filters),
    queryFn: () => personsApi.list(filters),
    initialData,
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PersonCreatePayload) => personsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personsKeys.all });

      toast.success("Responsável criado com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) {
        toast.error(getApiErrorMessage(err), {
          description: getApiErrorAction(err),
        });
      }

      if (err instanceof Error) {
        toast.error(err.message);
      }

      toast.error("Erro ao criar responsável. Tente novamente.");
    },
  });
};

export const personsApi = {
  list: async (params?: PersonsListParams) => {
    const { data } = await api.get<PaginatedResponse<Person>>("/persons", {
      params,
    });
    return data;
  },

  create: async (payload: PersonCreatePayload) => {
    const { data } = await api.post<Person>("/persons", payload);

    return data;
  },
};
