import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("opens external destinations safely", () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>);
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute("rel", "noreferrer");
  });
});
