import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/api";
import { fetchSummary } from "./aboutApi";

vi.mock("../../api/client", () => ({ apiClient: { GET: vi.fn() } }));

describe("fetchSummary", () => {
  it("requests and returns the summary for the selected language", async () => {
    vi.mocked(apiClient.GET).mockResolvedValue({ data: { message: "Summary" } } as never);
    const signal = new AbortController().signal;

    await expect(fetchSummary("kk", signal)).resolves.toBe("Summary");
    expect(apiClient.GET).toHaveBeenCalledWith("/v1/llm/summarize", {
      params: { query: { lang: "kk" } },
      signal,
    });
  });

  it("rejects incomplete responses", async () => {
    vi.mocked(apiClient.GET).mockResolvedValue({ data: {}, error: undefined } as never);
    await expect(fetchSummary("en")).rejects.toThrow("Summary response did not include a message");
  });
});
