import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Colour of the header's 3px bottom rule. The design paints it with the status
 * of the record being viewed, so a checklist ABERTO gets a green rule.
 */
export type HeaderTone =
  | "brand"
  | "success"
  | "destructive"
  | "validated"
  | "muted";

export interface PageHeading {
  /** Small mono uppercase label above the title, e.g. "Operação". */
  eyebrow?: string;
  title: string;
  tone?: HeaderTone;
}

interface PageHeaderContextValue {
  heading: PageHeading | null;
  setHeading: (heading: PageHeading | null) => void;
  /** Element inside the site header that pages portal their actions into. */
  actionsSlot: HTMLElement | null;
  setActionsSlot: (element: HTMLElement | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

/**
 * Lets a page own the title and actions of the single site header, instead of
 * rendering a second header of its own. `SiteHeader` consumes it; `PageHeader`
 * feeds it.
 */
export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [heading, setHeading] = useState<PageHeading | null>(null);
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);

  const value = useMemo(
    () => ({ heading, setHeading, actionsSlot, setActionsSlot }),
    [heading, actionsSlot],
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error(
      "usePageHeaderContext deve ser usado dentro de <PageHeaderProvider>",
    );
  }
  return context;
}
