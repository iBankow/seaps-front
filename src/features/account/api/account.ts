import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

export interface GeneratePasswordResponse {
  password: string;
}

export const useGeneratePassword = () => {
  return useMutation({
    mutationFn: () => accountApi.generatePassword(),
  });
};

export const accountApi = {
  generatePassword: async () => {
    const { data } = await api.put<GeneratePasswordResponse>(
      "/auth/generate-password",
    );

    return data;
  },
};
