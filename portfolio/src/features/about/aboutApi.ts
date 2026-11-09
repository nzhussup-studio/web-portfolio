import { apiClient } from "@/api";

export async function fetchSummary(language: "en" | "kk", signal?: AbortSignal) {
	const response = await apiClient.POST("/v1/llm/summaries/generations", {
		body: { language },
    signal,
  });
	if (response.error) throw new Error("Summary generation could not be started");
	let state = response.data;

	for (let poll = 0; state?.status === "generating" && poll < 60; poll += 1) {
		await delay(state.poll_after_ms ?? 1500, signal);
		const pollResponse = await apiClient.GET("/v1/llm/summaries/{language}", {
			params: { path: { language } },
			signal,
		});
		if (pollResponse.error) throw new Error("Summary generation status could not be loaded");
		state = pollResponse.data;
	}

	if (state?.status !== "completed" || !state.summary) {
		throw new Error("Summary generation did not complete");
	}
	return state.summary;
}

function delay(milliseconds: number, signal?: AbortSignal) {
	return new Promise<void>((resolve, reject) => {
		const timer = window.setTimeout(resolve, milliseconds);
		signal?.addEventListener("abort", () => {
			window.clearTimeout(timer);
			reject(signal.reason);
		}, { once: true });
	});
}
