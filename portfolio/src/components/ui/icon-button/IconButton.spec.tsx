import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("preserves accessible button behavior", () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Toggle" onClick={onClick}>×</IconButton>);
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
