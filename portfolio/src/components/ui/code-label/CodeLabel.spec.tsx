import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeLabel } from "./CodeLabel";

describe("CodeLabel", () => {
  it("supports explicit visual tones", () => {
    render(<CodeLabel tone="accent">projects / 03</CodeLabel>);
    expect(screen.getByText("projects / 03")).toHaveClass("code-label-accent");
  });
});
