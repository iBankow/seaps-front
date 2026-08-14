import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * A config roda com `globals: false`, então o auto-cleanup do Testing Library
 * (que depende de um `afterEach` global) nunca se registra e o DOM de um teste
 * vaza para o seguinte. Registramos na mão.
 */
afterEach(cleanup);
