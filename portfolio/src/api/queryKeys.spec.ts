import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("isolates summaries by language", () => {
    expect(queryKeys.about.summary("en")).toEqual(["about", "summary", "en"]);
    expect(queryKeys.about.summary("kk")).toEqual(["about", "summary", "kk"]);
  });

  it("isolates album detail requests by ID", () => {
    expect(queryKeys.albums.detail("winter")).toEqual(["albums", "detail", "winter"]);
    expect(queryKeys.albums.detail("summer")).not.toEqual(queryKeys.albums.detail("winter"));
  });

  it("keeps list keys stable", () => {
    expect(queryKeys.albums.list).toEqual(["albums", "public"]);
    expect(queryKeys.projects.list).toEqual(["projects"]);
  });
});
