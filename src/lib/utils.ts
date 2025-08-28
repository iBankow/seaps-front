import { clsx, type ClassValue } from "clsx";
import type { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFirstAndLastName = (name?: string) => {
  if (!name) {
    return "--";
  }
  const names = name.trim().split(/\s+/); // Remove espaços extras e divide por espaços
  if (names.length === 1) return names[0];

  const firstName = names[0];
  const lastName = names[names.length - 1];

  return `${firstName} ${lastName}`;
};

export const toUpperCase = (e: ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.toUpperCase();

  return e;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const states = [
  {
    acronym: "AC",
    name: "Acre",
  },
  {
    acronym: "AL",
    name: "Alagoas",
  },
  {
    acronym: "AP",
    name: "Amapá",
  },
  {
    acronym: "AM",
    name: "Amazonas",
  },
  {
    acronym: "BA",
    name: "Bahia",
  },
  {
    acronym: "CE",
    name: "Ceará",
  },
  {
    acronym: "DF",
    name: "Distrito Federal",
  },
  {
    acronym: "ES",
    name: "Espírito Santo",
  },
  {
    acronym: "GO",
    name: "Goiás",
  },
  {
    acronym: "MA",
    name: "Maranhão",
  },
  {
    acronym: "MT",
    name: "Mato Grosso",
  },
  {
    acronym: "MS",
    name: "Mato Grosso do Sul",
  },
  {
    acronym: "MG",
    name: "Minas Gerais",
  },
  {
    acronym: "PR",
    name: "Paraná",
  },
  {
    acronym: "PB",
    name: "Paraíba",
  },
  {
    acronym: "PA",
    name: "Pará",
  },
  {
    acronym: "PE",
    name: "Pernambuco",
  },
  {
    acronym: "PI",
    name: "Piauí",
  },
  {
    acronym: "RJ",
    name: "Rio de Janeiro",
  },
  {
    acronym: "RN",
    name: "Rio Grande do Norte",
  },
  {
    acronym: "RS",
    name: "Rio Grande do Sul",
  },
  {
    acronym: "RO",
    name: "Rondônia",
  },
  {
    acronym: "RR",
    name: "Roraima",
  },
  {
    acronym: "SC",
    name: "Santa Catarina",
  },
  {
    acronym: "SE",
    name: "Sergipe",
  },
  {
    acronym: "SP",
    name: "São Paulo",
  },
  {
    acronym: "TO",
    name: "Tocantins",
  },
];
