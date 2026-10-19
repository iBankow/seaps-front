import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

import { PageHeader } from "../page-header";
import {
  PageHeaderProvider,
  usePageHeaderContext,
} from "../page-header-context";

/**
 * Stand-in for <SiteHeader>, without the router/query dependencies: renders the
 * heading it receives and exposes the slot pages portal their actions into.
 */
function HeaderSpy() {
  const { heading, setActionsSlot } = usePageHeaderContext();
  return (
    <header>
      <span data-testid="eyebrow">{heading?.eyebrow ?? ""}</span>
      <h1 data-testid="title">{heading?.title ?? ""}</h1>
      <div data-testid="actions" ref={setActionsSlot} />
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PageHeaderProvider>
      <HeaderSpy />
      <main>{children}</main>
    </PageHeaderProvider>
  );
}

describe("PageHeader", () => {
  it("feeds title and eyebrow to the site header", () => {
    render(
      <Shell>
        <PageHeader eyebrow="Operação" title="Checklists" />
      </Shell>,
    );

    expect(screen.getByTestId("eyebrow")).toHaveTextContent("Operação");
    expect(screen.getByTestId("title")).toHaveTextContent("Checklists");
  });

  it("renders nothing where it is placed", () => {
    render(
      <Shell>
        <PageHeader eyebrow="Operação" title="Checklists">
          <button>Criar Checklist</button>
        </PageHeader>
      </Shell>,
    );

    // A ação existe uma única vez, e dentro do header — não no corpo da página.
    const action = screen.getByRole("button", { name: "Criar Checklist" });
    expect(screen.getByTestId("actions")).toContainElement(action);
    expect(screen.getByRole("main")).toBeEmptyDOMElement();
  });

  it("keeps portalled actions interactive", async () => {
    const user = userEvent.setup();

    function Page() {
      const [count, setCount] = useState(0);
      return (
        <PageHeader title="Checklists">
          <button onClick={() => setCount((c) => c + 1)}>
            cliques: {count}
          </button>
        </PageHeader>
      );
    }

    render(
      <Shell>
        <Page />
      </Shell>,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("cliques: 1");
  });

  it("hands the header over when one page replaces another", () => {
    const { rerender } = render(
      <Shell>
        <PageHeader eyebrow="Operação" title="Checklists" />
      </Shell>,
    );

    // Troca de rota: a página antiga desmonta e a nova monta no mesmo commit.
    rerender(
      <Shell>
        <PageHeader eyebrow="Cadastros" title="Imóveis" />
      </Shell>,
    );

    expect(screen.getByTestId("eyebrow")).toHaveTextContent("Cadastros");
    expect(screen.getByTestId("title")).toHaveTextContent("Imóveis");
  });

  it("clears the heading when the page unmounts", () => {
    const { rerender } = render(
      <Shell>
        <PageHeader eyebrow="Operação" title="Checklists" />
      </Shell>,
    );

    // Rota de detalhe, que não declara <PageHeader> e cai no fallback.
    rerender(<Shell>{null}</Shell>);

    expect(screen.getByTestId("title")).toBeEmptyDOMElement();
  });
});
