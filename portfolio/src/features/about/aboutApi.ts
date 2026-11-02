import { apiClient } from "@/api";

export async function fetchSummary(language: "en" | "kk", signal?: AbortSignal) {
  const { data, error } = await apiClient.POST("/v1/llm/summaries", {
    params: { query: { lang: language } },
    signal,
  });
  if (error || !data?.message) throw new Error("Summary response did not include a message");
  return data.message;
}
