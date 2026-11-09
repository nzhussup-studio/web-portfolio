import { apiClient } from "@/api";

const MAX_FRONTEND_WAIT_MS = 20_000;

export async function fetchSummary(language: "en" | "kk", signal?: AbortSignal) {
	const response = await apiClient.POST("/v1/llm/summaries/generations", {
		body: { language },
    signal,
  });
	if (response.error) throw new Error("Summary generation could not be started");
	let state = response.data;
	const deadline = Date.now() + MAX_FRONTEND_WAIT_MS;

	while (state?.status === "generating" && Date.now() < deadline) {
		const remaining = deadline - Date.now();
		await delay(Math.min(state.poll_after_ms ?? 1500, remaining), signal);
		const pollResponse = await apiClient.GET("/v1/llm/summaries/{language}", {
			params: { path: { language } },
			signal,
		});
		if (pollResponse.error) throw new Error("Summary generation status could not be loaded");
		state = pollResponse.data;
	}

	if (state?.status === "generating") {
		throw new Error("Summary generation is taking longer than expected. Please retry.");
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
