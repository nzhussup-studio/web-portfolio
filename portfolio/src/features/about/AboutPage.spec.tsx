import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "../../test/render";
import { AboutPage } from "./AboutPage";
import { fetchSummary } from "./aboutApi";

vi.mock("./aboutApi", () => ({ fetchSummary: vi.fn() }));

describe("AboutPage", () => {
  it("renders the introduction and requests the selected-language summary", async () => {
    vi.mocked(fetchSummary).mockResolvedValue("A concise summary.");
    renderWithApp(<AboutPage language="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "redesign.about.title" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "redesign.about.generate" }));
    await waitFor(() => expect(fetchSummary).toHaveBeenCalledWith("en", expect.any(AbortSignal)));
    expect(screen.getByText("ai.summary / live")).toBeInTheDocument();
  });
});
