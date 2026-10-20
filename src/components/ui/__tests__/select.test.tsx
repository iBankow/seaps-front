import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const items = [{ value: "1", label: "Cuiabá" }];

function TestSelect({ value }: { value: string | null }) {
  return (
    <Select value={value} items={items}>
      <SelectTrigger data-testid="trigger">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

describe("Select (Base UI)", () => {
  it("shows the item label, not the raw value", () => {
    render(<TestSelect value="1" />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("Cuiabá");
  });

  it("stays controlled when starting empty with null", () => {
    const { rerender } = render(<TestSelect value={null} />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("Selecione");

    rerender(<TestSelect value="1" />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("Cuiabá");

    rerender(<TestSelect value={null} />);
    expect(screen.getByTestId("trigger")).toHaveTextContent("Selecione");
  });
});

describe("Select inside Dialog", () => {
  it("picking an option does not dismiss the dialog", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Filtro</DialogTitle>
          <Select items={items} onValueChange={onValueChange}>
            <SelectTrigger data-testid="trigger">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByTestId("trigger"));
    await user.click(await screen.findByRole("option", { name: "Cuiabá" }));

    expect(onValueChange).toHaveBeenCalledWith("1", expect.anything());
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
  });
});
