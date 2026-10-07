import { apiClient } from "../../api/client";

export async function fetchSummary(language: "en" | "kk", signal?: AbortSignal) {
  const { data, error } = await apiClient.GET("/v1/llm/summarize", {
    params: { query: { lang: language } },
    signal,
  });
  if (error || !data?.message) throw new Error("Summary response did not include a message");
  return data.message;
}
