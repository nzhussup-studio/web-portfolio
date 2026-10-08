import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithApp } from "@/test/render";
import { BackLink } from "./BackLink";

describe("BackLink", () => {
  it("renders internal back navigation", () => {
    renderWithApp(<BackLink to="/albums">Albums</BackLink>);
    expect(screen.getByRole("link", { name: "Albums" })).toHaveAttribute("href", "/albums");
  });
});
