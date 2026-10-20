import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * A config roda com `globals: false`, então o auto-cleanup do Testing Library
 * (que depende de um `afterEach` global) nunca se registra e o DOM de um teste
 * vaza para o seguinte. Registramos na mão.
 */
afterEach(cleanup);

/**
 * O jsdom não implementa `PointerEvent`, e componentes do Base UI (ex. Radio)
 * o instanciam ao tratar cliques. Um MouseEvent com `pointerType` basta.
 */
if (typeof window !== "undefined" && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? "mouse";
    }
  }
  window.PointerEvent = PointerEvent as unknown as typeof window.PointerEvent;
}
