import { describe, expect, it } from "vitest";
import { API_PREFIX, apiBaseUrl, bucketUrl, env } from "@/config/env";
import { http } from "../http";

/**
 * Guardas do contrato de URL do cliente HTTP.
 *
 * O prefixo de versão mora no baseURL, e os call sites escrevem só
 * "/checklists". Se o API_PREFIX for esvaziado por engano (aconteceu num
 * codemod), toda requisição da aplicação passa a bater no path errado sem que
 * o tsc perceba.
 */
describe("baseURL do cliente HTTP", () => {
  it("carrega o prefixo de versão da API", () => {
    expect(API_PREFIX).toBe("/api/v1");
  });

  it("compõe o baseURL como <VITE_API_URL>/api/v1", () => {
    expect(apiBaseUrl).toBe(`${env.apiUrl}/api/v1`);
    expect(apiBaseUrl).toMatch(/\/api\/v1$/);
    expect(apiBaseUrl).not.toMatch(/\/api\/v1\/api\/v1/);
  });

  it("é o baseURL da instância axios, com cookies habilitados", () => {
    expect(http.defaults.baseURL).toBe(apiBaseUrl);
    expect(http.defaults.withCredentials).toBe(true);
  });

  it("não fixa Content-Type, para não quebrar upload de FormData", () => {
    expect(http.defaults.headers["Content-Type"]).toBeUndefined();
  });
});

describe("bucketUrl", () => {
  it("concatena o path ao bucket", () => {
    expect(bucketUrl("/foo.png")).toBe(`${env.bucketUrl}/foo.png`);
  });

  it("devolve string vazia para path ausente", () => {
    expect(bucketUrl(null)).toBe("");
    expect(bucketUrl(undefined)).toBe("");
    expect(bucketUrl("")).toBe("");
  });
});
