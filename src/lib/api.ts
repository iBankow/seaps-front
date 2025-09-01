import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.config.url === "/api/v1/auth/me" &&
      error.response?.status === 401 &&
      window.location.pathname === "/login"
    ) {
      return Promise.reject(error);
    }

    if (error.response?.data?.messages?.length > 0) {
      error.response.data.messages.map((msg: string) => toast.error(msg));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message, {
        description: error.response.data.action,
      });
    } else {
      toast.error("Erro ao tentar processar a requisição. Tente novamente.");
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log(error);

    return Promise.reject(error);
  }
);
