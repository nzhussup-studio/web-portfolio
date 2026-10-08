import { API_BASE_URL, resolveApiAsset, type AlbumImage, type AlbumPreview } from "@/api";

export function sortAlbums(albums: AlbumPreview[]): AlbumPreview[] {
  return [...albums].sort((left, right) => {
    if (!left.date && !right.date) return 0;
    if (!left.date) return 1;
    if (!right.date) return -1;
    return right.date.localeCompare(left.date);
  });
}

export function albumImageSource(albumId: string, image: AlbumImage): string | undefined {
  if (image.url) return resolveApiAsset(image.url);
  if (image.id) return `${API_BASE_URL}/album/${encodeURIComponent(albumId)}/${encodeURIComponent(image.id)}`;
  return undefined;
}

export function albumKey(album: AlbumPreview, index: number): string {
  return album.id ?? `${album.title}-${index}`;
}
