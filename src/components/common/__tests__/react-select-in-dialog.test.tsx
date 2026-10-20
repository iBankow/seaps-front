import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RSSelect } from "@/components/common/react-select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const options = [
  { id: "1", name: "Cuiabá" },
  { id: "2", name: "Várzea Grande" },
];

describe("RSSelect inside Dialog", () => {
  it("keeps the dialog open when picking an option from the portaled menu", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Filtro</DialogTitle>
          <RSSelect options={options} placeholder="Cidade" />
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Cidade"));
    await user.click(await screen.findByText("Várzea Grande"));

    await waitFor(() => {
      expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByText("Várzea Grande")).toBeInTheDocument();
    });
  });
});
