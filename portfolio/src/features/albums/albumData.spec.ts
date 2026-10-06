import { describe, expect, it } from "vitest";
import { albumImageSource, sortAlbums } from "./albumData";

describe("album data", () => {
  it("sorts dated albums newest-first and undated albums last", () => {
    const result = sortAlbums([
      { title: "Undated", type: "public" },
      { title: "Older", type: "public", date: "2024-03" },
      { title: "Newer", type: "public", date: "2025-01" },
    ]);
    expect(result.map((album) => album.title)).toEqual(["Newer", "Older", "Undated"]);
  });

  it("builds the documented image endpoint when no URL is provided", () => {
    expect(albumImageSource("winter trip", { id: "cover.jpg" })).toContain(
      "/album/winter%20trip/cover.jpg",
    );
  });
});
