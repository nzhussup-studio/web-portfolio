import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getAlbumPreviews } from "../../api/queries/albums";
import { renderWithApp } from "../../test/render";
import { AlbumsPage } from "./AlbumsPage";

vi.mock("../../api/queries/albums", () => ({ getAlbumPreviews: vi.fn() }));

describe("AlbumsPage", () => {
  it("renders album previews from the API with stable navigation", async () => {
    vi.mocked(getAlbumPreviews).mockResolvedValue([
      { id: "alps", title: "Alps", type: "public", date: "2026-01", image_count: 4 },
      { id: "vienna", title: "Vienna", type: "public", date: "2025-01", image_count: 2 },
      { id: "almaty", title: "Almaty", type: "public", date: "2024-01", image_count: 5 },
    ]);
    const { container } = renderWithApp(<AlbumsPage />);

    expect(await screen.findByRole("link", { name: /Alps/i })).toHaveAttribute("href", "/albums/alps");
    expect(container.querySelector(".album-grid-3")).toBeInTheDocument();
    expect(screen.getByText("01 / 03")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
