import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getProjects } from "../../api/queries/projects";
import { renderWithApp } from "../../test/render";
import { ProjectsPage } from "./ProjectsPage";

vi.mock("../../api/queries/projects", () => ({ getProjects: vi.fn() }));

describe("ProjectsPage", () => {
  it("renders API projects and their source links", async () => {
    vi.mocked(getProjects).mockResolvedValue([
      { id: 1, name: "Konform", techStack: "Go, React", url: "https://github.com/nzhussup/konform" },
    ]);
    renderWithApp(<ProjectsPage />);

    expect(await screen.findByRole("heading", { name: "Konform" })).toBeInTheDocument();
    expect(screen.getByText("Go, React")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portfolio.projects.source/i })).toHaveAttribute(
      "href",
      "https://github.com/nzhussup/konform",
    );
  });

  it("shows a friendly empty state", async () => {
    vi.mocked(getProjects).mockResolvedValue([]);
    renderWithApp(<ProjectsPage />);
    expect(await screen.findByText("portfolio.common.empty")).toBeInTheDocument();
  });
});
