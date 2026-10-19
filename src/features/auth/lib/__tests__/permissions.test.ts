import { describe, expect, it } from "vitest";
import { can } from "../permissions";

describe("can", () => {
  it("libera quando o usuário tem a permissão exata", () => {
    expect(can(["properties:edit"], ["properties:edit"])).toBe(true);
  });

  it("nega quando falta a permissão", () => {
    expect(can(["properties:edit"], ["properties:create"])).toBe(false);
    expect(can(["properties:edit"], [])).toBe(false);
  });

  it("nega quando não há permissões (usuário não carregado)", () => {
    expect(can(["properties:edit"], undefined)).toBe(false);
  });

  it("exige TODOS os guards, não apenas um", () => {
    const permissions = ["properties:edit"];

    expect(can(["properties:edit", "properties:delete"], permissions)).toBe(
      false,
    );
    expect(
      can(["properties:edit", "properties:delete"], [
        ...permissions,
        "properties:delete",
      ]),
    ).toBe(true);
  });

  it.each(["system:admin", "*", "*:*"])("o curinga %s libera tudo", (w) => {
    expect(can(["qualquer:coisa"], [w])).toBe(true);
    expect(can(["a:b", "c:d"], [w])).toBe(true);
  });

  it("NÃO expande curinga por recurso", () => {
    // properties:* não cobre properties:edit — comportamento intencional.
    expect(can(["properties:edit"], ["properties:*"])).toBe(false);
  });

  it("libera quando a lista de guards é vazia", () => {
    expect(can([], ["qualquer:coisa"])).toBe(true);
  });
});
