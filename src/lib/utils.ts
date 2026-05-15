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
