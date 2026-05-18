import { clsx, type ClassValue } from "clsx";
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

export const formatPhone = (value: string) => {
  const str = value.replace(/\D/g, ""); // remove caracteres não numéricos

  return str.length <= 10
    ? str.replace(/(\d{2})(\d)/, "\($1\) $2").replace(/(\d{4})(\d)/, "$1-$2")
    : str
        .replace(/(\d{2})(\d)/, "\($1\) $2")
        .replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3")
        .slice(0, 16);
};
