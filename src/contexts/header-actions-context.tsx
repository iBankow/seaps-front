import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const HeaderActionsSlotContext = createContext<HTMLDivElement | null>(
  null,
);

/**
 * Renders `children` into the top header's action slot (next to the
 * notification bell), so each page can put its primary action (e.g. "+ Novo
 * Checklist") in the persistent header instead of the page body.
 */
export function HeaderActions({ children }: { children: ReactNode }) {
  const slot = useContext(HeaderActionsSlotContext);

  if (!slot) return null;

  return createPortal(children, slot);
}
