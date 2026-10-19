import { describe, expect, it } from "vitest";
import {
  formatBRL,
  formatCpfCnpj,
  formatDate,
  formatDateLong,
  formatDateShort,
  formatDateTime,
  formatDateTimeLong,
  formatPhone,
} from "../format";

// Data sem fuso, interpretada como horário local — igual ao que a API devolve.
const DATE = "2026-08-05T14:30:00";

describe("formatadores de data", () => {
  it("formata nos padrões usados na aplicação", () => {
    expect(formatDate(DATE)).toBe("05/08/2026");
    expect(formatDateShort(DATE)).toBe("05/08/26");
    expect(formatDateTime(DATE)).toBe("05/08/2026 às 14:30");
    expect(formatDateLong(DATE)).toBe("05 de agosto de 2026");
    expect(formatDateTimeLong(DATE)).toBe("05 de agosto de 2026 às 14:30");
  });

  it("usa o locale pt-BR no nome do mês", () => {
    expect(formatDateLong("2026-01-15T00:00:00")).toBe("15 de janeiro de 2026");
  });

  it("aceita Date e devolve placeholder para ausente ou inválido", () => {
    expect(formatDate(new Date(2026, 7, 5))).toBe("05/08/2026");
    expect(formatDate(null)).toBe("--");
    expect(formatDate(undefined)).toBe("--");
    expect(formatDate("")).toBe("--");
    expect(formatDate("nao é data")).toBe("--");
  });
});

describe("formatBRL", () => {
  it("formata como moeda brasileira", () => {
    //   é o espaço não separável que o Intl insere depois de R$.
    expect(formatBRL(1234.56)).toBe("R$ 1.234,56");
    expect(formatBRL("10")).toBe("R$ 10,00");
    expect(formatBRL(0)).toBe("R$ 0,00");
  });

  it("devolve placeholder para valor ausente ou não numérico", () => {
    expect(formatBRL(null)).toBe("--");
    expect(formatBRL(undefined)).toBe("--");
    expect(formatBRL("abc")).toBe("--");
  });
});

describe("formatCpfCnpj", () => {
  it("mascara CPF e CNPJ pelo número de dígitos", () => {
    expect(formatCpfCnpj("12345678901")).toBe("123.456.789-01");
    expect(formatCpfCnpj("12345678000199")).toBe("12.345.678/0001-99");
  });

  it("devolve a entrada quando não tem 11 nem 14 dígitos", () => {
    expect(formatCpfCnpj("123")).toBe("123");
    expect(formatCpfCnpj(null)).toBe("");
  });
});

describe("formatPhone", () => {
  it("mascara fixo e celular", () => {
    expect(formatPhone("6533334444")).toBe("(65) 3333-4444");
    expect(formatPhone("65988887777")).toBe("(65) 9 8888-7777");
  });

  it("tolera nulo", () => {
    expect(formatPhone(null)).toBe("");
  });
});
