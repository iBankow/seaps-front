import api from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "../types";
import { dashboardKeys } from "./query-keys";

export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardApi.get,
  });
};

export const dashboardApi = {
  get: async () => {
    const { data } = await api.get<DashboardData>("/dashboards");

    return data;
  },
};
