import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders a structural label and section heading", () => {
    render(<SectionHeading label="// experience" title="Experience" />);
    expect(screen.getByText("// experience")).toHaveClass("code-label-accent");
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
  });
});
