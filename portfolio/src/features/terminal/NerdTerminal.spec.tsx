import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getAlbumPreviews, getCertificates, getEducation, getProjects, getSkills, getWorkExperience } from "@/api/queries";
import { renderWithApp } from "@/test/render";
import { NerdTerminal } from "./NerdTerminal";

vi.mock("../../api/queries/albums", () => ({ getAlbumPreviews: vi.fn() }));
vi.mock("../../api/queries/cv", () => ({
  getCertificates: vi.fn(), getEducation: vi.fn(), getSkills: vi.fn(), getWorkExperience: vi.fn(),
}));
vi.mock("../../api/queries/projects", () => ({ getProjects: vi.fn() }));

describe("NerdTerminal", () => {
  it("runs commands and provides an explicit exit", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    vi.mocked(getWorkExperience).mockResolvedValue([]);
    vi.mocked(getEducation).mockResolvedValue([]);
    vi.mocked(getSkills).mockResolvedValue([]);
    vi.mocked(getCertificates).mockResolvedValue([]);
    vi.mocked(getProjects).mockResolvedValue([{ name: "Portfolio", techStack: "React" }]);
    vi.mocked(getAlbumPreviews).mockResolvedValue([]);
    const exit = vi.fn();
    renderWithApp(<NerdTerminal onExit={exit} />);

    expect(screen.getAllByText("NZHUSSUP STUDIO SYSTEM")).toHaveLength(2);
    const input = screen.getByRole("textbox", { name: "Terminal command" });
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Available commands:")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "exit" } });
    fireEvent.keyDown(input, { key: "Enter" });
    const terminal = screen.getByRole("region", { name: "Nerd Mode terminal" });
    await waitFor(() => expect(terminal).toHaveClass("is-powering-off"));
    expect(screen.getByRole("button", { name: "Exit Nerd Mode" })).toBeDisabled();
  });
});
