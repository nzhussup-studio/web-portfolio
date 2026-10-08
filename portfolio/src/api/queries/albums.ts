import { apiClient, ApiError } from "@/api";

export async function getAlbumPreviews() {
  const { data, error, response } = await apiClient.GET("/v1/album", {
    params: { query: { type: "public" } },
  });
  if (error) throw new ApiError(response.status);
  return data?.data ?? [];
}

export async function getAlbum(id: string) {
  const { data, error, response } = await apiClient.GET("/v1/album/{id}", {
    params: { path: { id } },
  });
  if (error || !data?.data) throw new ApiError(response.status);
  return data.data;
}
