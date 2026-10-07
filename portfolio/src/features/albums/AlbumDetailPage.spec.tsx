import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import { ApiError } from "../../api/errors";
import { getAlbum } from "../../api/queries/albums";
import { renderWithApp } from "../../test/render";
import { AlbumDetailPage } from "./AlbumDetailPage";

vi.mock("../../api/queries/albums", () => ({ getAlbum: vi.fn() }));

describe("AlbumDetailPage", () => {
  const page = (
    <Routes>
      <Route path="/albums/:albumID" element={<AlbumDetailPage />} />
    </Routes>
  );

  it("renders a friendly not-found state for a missing album", async () => {
    vi.mocked(getAlbum).mockRejectedValue(new ApiError(404));
    renderWithApp(page, { route: "/albums/missing" });

    expect(await screen.findByRole("heading", { name: "portfolio.albums.notFoundTitle" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portfolio.albums.back/i })).toHaveAttribute("href", "/albums");
  });

  it("renders album metadata and images", async () => {
    vi.mocked(getAlbum).mockResolvedValue({
      title: "Winter",
      type: "public",
      date: "2026-01",
      images: [{ id: "one.jpg" }],
    });
    renderWithApp(page, { route: "/albums/winter" });

    expect(await screen.findByRole("heading", { name: "Winter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "portfolio.albums.openPhoto" })).toBeInTheDocument();
  });
});
