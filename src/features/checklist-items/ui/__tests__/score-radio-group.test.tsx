import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScoreRadioGroup, SCORE_VALUES } from "../score-radio-group";

describe("ScoreRadioGroup", () => {
  it("shows no selection for an unanswered item, even after a previous score", () => {
    const { rerender } = render(
      <ScoreRadioGroup value={SCORE_VALUES.BOM} onValueChange={() => {}} />,
    );
    expect(screen.getByRole("radio", { name: /bom/i })).toBeChecked();

    rerender(<ScoreRadioGroup value={null} onValueChange={() => {}} />);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toBeChecked();
    }
  });

  it("reports the picked score as a string", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ScoreRadioGroup value={null} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: /ruim/i }));

    expect(onValueChange).toHaveBeenCalledWith(String(SCORE_VALUES.RUIM));
  });
});
