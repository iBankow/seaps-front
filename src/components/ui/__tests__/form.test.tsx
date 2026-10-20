import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function TestForm() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl className="w-full">
              <Input className="h-8" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}

describe("FormControl (Base UI useRender)", () => {
  it("merges id, aria and className into its child", () => {
    render(<TestForm />);
    const input = screen.getByLabelText("Nome");

    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input.getAttribute("aria-describedby")).toMatch(/-description$/);
    expect(input).toHaveClass("w-full", "h-8");
  });
});
