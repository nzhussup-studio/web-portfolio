import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageIntro } from "./PageIntro";

describe("PageIntro", () => {
  it("renders its hierarchy, description, and optional aside", () => {
    render(
      <PageIntro
        eyebrow="projects / 03"
        title="Projects"
        description="Things I have built."
        aside={<span>Newest first</span>}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("projects / 03")).toBeInTheDocument();
    expect(screen.getByText("Things I have built.")).toBeInTheDocument();
    expect(screen.getByText("Newest first")).toBeInTheDocument();
  });
});
