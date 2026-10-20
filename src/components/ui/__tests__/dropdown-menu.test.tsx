import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu (Base UI)", () => {
  it("renders a label inside a group", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Ações</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>ID: 42</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem>Visualizar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText("ID: 42")).toBeInTheDocument();
    expect(screen.getByText("Visualizar")).toBeInTheDocument();
  });
});
