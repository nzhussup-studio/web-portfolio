import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "@/api";
import { getOrderedList } from "./orderedList";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getOrderedList", () => {
  it("requests the API path and sorts records by descending display order", async () => {
    const records = [
      { name: "Second", displayOrder: 2 },
      { name: "First", displayOrder: 10 },
      { name: "Unordered" },
    ];
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(records), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await getOrderedList<(typeof records)[number]>("base/project");

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/base/project`);
    expect(result.map((record) => record.name)).toEqual(["First", "Second", "Unordered"]);
    expect(records.map((record) => record.name)).toEqual(["Second", "First", "Unordered"]);
  });

  it("throws an ApiError containing the response status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(getOrderedList("base/project")).rejects.toMatchObject({
      name: "ApiError",
      status: 503,
      message: "Request failed",
    });
  });
});
