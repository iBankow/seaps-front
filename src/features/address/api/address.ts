import api from "@/lib/http";
import type { City, State } from "../types";

export const addressApi = {
  getAddress: async (cep: string) => {
    // CEP não encontrado é fluxo normal — quem chama exibe a mensagem.
    const address = await api.get(`/address/zipcode/${cep}`, {
      skipErrorToast: true,
    });

    return address.data;
  },
  getStates: async () => {
    const states = await api.get<Array<State>>("/address/states");
    return states.data;
  },
  getCities: async (state: string) => {
    const cities = await api.get<Array<City>>(`/address/cities/${state}`);
    return cities.data.map((city) => ({
      id: String(city.id),
      name: city.name,
    }));
  },
};
