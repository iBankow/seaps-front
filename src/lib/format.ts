import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateInput = string | number | Date | null | undefined;

/** Placeholder para valor ausente ou data inválida. */
const EMPTY = "--";

/**
 * Usa `new Date(value)` de propósito: é o que todos os call sites migrados
 * faziam. Trocar por `parseISO` mudaria a interpretação das datas sem fuso
 * que a API devolve.
 */
function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;

  const date = value instanceof Date ? value : new Date(value);

  return isValid(date) ? date : null;
}

function formatWith(value: DateInput, pattern: string): string {
  const date = toDate(value);

  return date ? format(date, pattern, { locale: ptBR }) : EMPTY;
}

/** 05/08/2026 */
export const formatDate = (value: DateInput) => formatWith(value, "dd/MM/yyyy");

/** 05/08/26 */
export const formatDateShort = (value: DateInput) =>
  formatWith(value, "dd/MM/yy");

/** 05/08/2026 às 14:30 */
export const formatDateTime = (value: DateInput) =>
  formatWith(value, "dd/MM/yyyy 'às' HH:mm");

/** 05 de agosto de 2026 */
export const formatDateLong = (value: DateInput) =>
  formatWith(value, "dd 'de' MMMM 'de' yyyy");

/** 05 de agosto de 2026 às 14:30 */
export const formatDateTimeLong = (value: DateInput) =>
  formatWith(value, "dd 'de' MMMM 'de' yyyy 'às' HH:mm");

/** R$ 1.234,56 */
export function formatBRL(value?: number | string | null): string {
  const amount = typeof value === "string" ? Number(value) : value;

  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return EMPTY;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

/** 000.000.000-00 (CPF) ou 00.000.000/0000-00 (CNPJ). */
export function formatCpfCnpj(value?: string | null): string {
  const digits = (value ?? "").replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  return value ?? "";
}

/** (65) 3333-4444 ou (65) 9 8888-7777 */
export const formatPhone = (value?: string | null) => {
  const str = (value ?? "").replace(/\D/g, "");

  return str.length <= 10
    ? str.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    : str
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3")
        .slice(0, 16);
};
