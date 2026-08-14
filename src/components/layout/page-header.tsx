import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePageHeaderContext } from "./page-header-context";

interface PageHeaderProps {
  /** Small mono uppercase label above the title, e.g. "Operação". */
  eyebrow?: string;
  title: string;
  /** Right-aligned controls — search input, "+ Novo" button, etc. */
  children?: ReactNode;
}

/**
 * Declares the title and actions of the page. Renders nothing where it is
 * placed: the title goes into the single site header via context, and the
 * actions are portalled into that header's action slot. Pages that omit it
 * fall back to the route breadcrumbs for the title.
 */
export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  const { setHeading, actionsSlot } = usePageHeaderContext();

  useEffect(() => {
    setHeading({ eyebrow, title });
    return () => setHeading(null);
  }, [eyebrow, title, setHeading]);

  if (!children || !actionsSlot) return null;

  return createPortal(children, actionsSlot);
}
