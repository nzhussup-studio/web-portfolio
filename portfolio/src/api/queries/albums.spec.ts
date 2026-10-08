import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/api";
import { getAlbum, getAlbumPreviews } from "./albums";

vi.mock("../client", () => ({ apiClient: { GET: vi.fn() } }));

describe("album queries", () => {
  it("returns public album previews", async () => {
    const albums = [{ id: "alps", title: "Alps", type: "public" }];
    vi.mocked(apiClient.GET).mockResolvedValue({ data: { data: albums } } as never);

    await expect(getAlbumPreviews()).resolves.toEqual(albums);
    expect(apiClient.GET).toHaveBeenCalledWith("/v1/album", {
      params: { query: { type: "public" } },
    });
  });

  it("requests an album by ID", async () => {
    const album = { title: "Alps", type: "public", images: [] };
    vi.mocked(apiClient.GET).mockResolvedValue({ data: { data: album } } as never);

    await expect(getAlbum("alps")).resolves.toEqual(album);
    expect(apiClient.GET).toHaveBeenCalledWith("/v1/album/{id}", {
      params: { path: { id: "alps" } },
    });
  });

  it("preserves a failed response status", async () => {
    vi.mocked(apiClient.GET).mockResolvedValue({ error: {}, response: { status: 404 } } as never);
    await expect(getAlbum("missing")).rejects.toMatchObject({ name: "ApiError", status: 404 });
  });
});
