import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as queries from "@/api/queries";
import { BackgroundDataPreloader } from "./BackgroundDataPreloader";

vi.mock("@/api/queries", () => ({
  getAlbumPreviews: vi.fn().mockResolvedValue([]),
  getCertificates: vi.fn().mockResolvedValue([]),
  getEducation: vi.fn().mockResolvedValue([]),
  getProjects: vi.fn().mockResolvedValue([]),
  getSkills: vi.fn().mockResolvedValue([]),
  getWorkExperience: vi.fn().mockResolvedValue([]),
}));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("BackgroundDataPreloader", () => {
  it("preloads public route data after the browser becomes idle", async () => {
    vi.useFakeTimers();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BackgroundDataPreloader />
      </QueryClientProvider>,
    );

    await act(async () => vi.runAllTimersAsync());

    expect(queries.getWorkExperience).toHaveBeenCalledOnce();
    expect(queries.getEducation).toHaveBeenCalledOnce();
    expect(queries.getSkills).toHaveBeenCalledOnce();
    expect(queries.getCertificates).toHaveBeenCalledOnce();
    expect(queries.getProjects).toHaveBeenCalledOnce();
    expect(queries.getAlbumPreviews).toHaveBeenCalledOnce();
  });
});
