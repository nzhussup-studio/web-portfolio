import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "./MarkdownContent";

describe("MarkdownContent", () => {
  it("renders nested lists, emphasis, and safe external links", () => {
    render(
      <MarkdownContent>{`- Built **reliable systems**
  - Automated releases

[Read more](https://example.com)`}</MarkdownContent>,
    );

    expect(screen.getByText("reliable systems")).toHaveProperty("tagName", "STRONG");
    expect(screen.getByText("Automated releases").closest("ul")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute("rel", "noreferrer");
  });
});
