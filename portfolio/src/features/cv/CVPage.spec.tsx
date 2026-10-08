import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getCertificates, getEducation, getSkills, getWorkExperience } from "@/api/queries";
import { renderWithApp } from "@/test/render";
import { CVPage } from "./CVPage";
import { downloadCvPdf } from "./cvPdf";

vi.mock("../../api/queries/cv", () => ({
  getCertificates: vi.fn(),
  getEducation: vi.fn(),
  getSkills: vi.fn(),
  getWorkExperience: vi.fn(),
}));
vi.mock("./cvPdf", () => ({ downloadCvPdf: vi.fn() }));

describe("CVPage", () => {
  it("renders all API-backed CV sections", async () => {
    vi.mocked(getWorkExperience).mockResolvedValue([
      {
        id: 1,
        position: "Software Engineer",
        company: "Example",
        startDate: "2024-01-01",
        description: "- Built **reliable systems**\n  - Automated releases",
      },
    ]);
    vi.mocked(getEducation).mockResolvedValue([
      { id: 2, degree: "Economics", institution: "WU Vienna", startDate: "2020-01-01" },
    ]);
    vi.mocked(getSkills).mockResolvedValue([{ id: 3, category: "Infrastructure", skillNames: "Kubernetes, AWS" }]);
    vi.mocked(getCertificates).mockResolvedValue([{ id: 4, name: "Cloud", issuer: "Example" }]);
    renderWithApp(<CVPage />);

    expect(await screen.findByRole("heading", { name: "Software Engineer" })).toBeInTheDocument();
    expect(screen.getByText("reliable systems")).toHaveProperty("tagName", "STRONG");
    expect(screen.getByText("Automated releases")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Economics" })).toBeInTheDocument();
    expect(screen.getByText("Kubernetes, AWS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cloud" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "portfolio.cv.downloadPdf" }));
    await waitFor(() => expect(downloadCvPdf).toHaveBeenCalledWith(expect.objectContaining({
      work: expect.arrayContaining([expect.objectContaining({ company: "Example" })]),
      education: expect.arrayContaining([expect.objectContaining({ institution: "WU Vienna" })]),
      skills: expect.arrayContaining([expect.objectContaining({ category: "Infrastructure" })]),
      certificates: expect.arrayContaining([expect.objectContaining({ name: "Cloud" })]),
    })));
  });
});
