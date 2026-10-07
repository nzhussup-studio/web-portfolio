import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "../../test/render";
import { AboutPage } from "./AboutPage";
import { fetchSummary } from "./aboutApi";

vi.mock("./aboutApi", () => ({ fetchSummary: vi.fn() }));

describe("AboutPage", () => {
  it("renders the introduction and requests the selected-language summary", async () => {
    vi.mocked(fetchSummary).mockResolvedValue("A concise summary.");
    renderWithApp(<AboutPage language="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "portfolio.about.title" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "portfolio.about.generate" }));
    await waitFor(() => expect(fetchSummary).toHaveBeenCalledWith("en", expect.any(AbortSignal)));
    expect(screen.getByText("ai.summary / live")).toBeInTheDocument();
  });

  it("keeps a stable generating state until the summary arrives", async () => {
    let resolveSummary: (value: string) => void = () => undefined;
    vi.mocked(fetchSummary).mockImplementation(() => new Promise((resolve) => {
      resolveSummary = resolve;
    }));
    renderWithApp(<AboutPage language="en" />);

    fireEvent.click(screen.getByRole("button", { name: "portfolio.about.generate" }));

    const generatingButton = await screen.findByRole("button", { name: "portfolio.about.generating" });
    expect(generatingButton).toBeDisabled();
    expect(screen.queryByRole("button", { name: "portfolio.about.regenerate" })).not.toBeInTheDocument();

    resolveSummary("A summary that takes a moment to reveal.");
    await screen.findByRole("button", { name: "portfolio.about.pause" });
  });

  it("cancels generation and returns to idle when the language changes", async () => {
    let aborted = false;
    vi.mocked(fetchSummary).mockImplementation((_language, signal) => new Promise((_resolve, reject) => {
      signal?.addEventListener("abort", () => {
        aborted = true;
        reject(new DOMException("Aborted", "AbortError"));
      });
    }));

    function LanguageHarness() {
      const [language, setLanguage] = useState<"en" | "kk">("en");
      return (
        <>
          <button type="button" onClick={() => setLanguage("kk")}>Switch language</button>
          <AboutPage language={language} />
        </>
      );
    }

    renderWithApp(<LanguageHarness />);
    fireEvent.click(screen.getByRole("button", { name: "portfolio.about.generate" }));
    await screen.findByRole("button", { name: "portfolio.about.generating" });

    fireEvent.click(screen.getByRole("button", { name: "Switch language" }));

    await waitFor(() => expect(aborted).toBe(true));
    expect(screen.getByRole("button", { name: "portfolio.about.generate" })).toBeEnabled();
    expect(screen.queryByText("ai.summary / live")).not.toBeInTheDocument();
  });
});
