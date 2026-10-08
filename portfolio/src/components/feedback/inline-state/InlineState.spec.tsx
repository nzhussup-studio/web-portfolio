import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineState } from "./InlineState";

describe("InlineState", () => {
  it("renders an optional recovery action", () => {
    const retry = vi.fn();
    render(<InlineState tone="error" action={{ label: "Retry", onClick: retry }}>Unavailable</InlineState>);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
