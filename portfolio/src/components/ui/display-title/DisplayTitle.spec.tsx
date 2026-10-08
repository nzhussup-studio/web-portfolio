import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DisplayTitle } from "./DisplayTitle";

describe("DisplayTitle", () => {
  it("renders a semantic heading with a decorative accent dot", () => {
    render(<DisplayTitle>Projects</DisplayTitle>);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading").querySelector("span")).toHaveAttribute("aria-hidden", "true");
  });
});
