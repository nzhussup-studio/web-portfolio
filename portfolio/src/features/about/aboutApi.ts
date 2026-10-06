export type SummaryResponse = {
  message?: string;
};

export async function fetchSummary(language: "en" | "kz", signal?: AbortSignal) {
  const response = await fetch(
    `https://api.nzhussup.dev/v1/llm/summarize?lang=${language}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Summary request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as SummaryResponse;
  if (!payload.message) throw new Error("Summary response did not include a message");
  return payload.message;
}
