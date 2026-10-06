import { describe, expect, it } from "vitest";
import { formatProjectIndex, projectKey } from "./projectData";

describe("project presentation data", () => {
  it("formats visual indices without exposing API IDs", () => {
    expect(formatProjectIndex(0)).toBe("01");
    expect(formatProjectIndex(11)).toBe("12");
  });

  it("uses the API ID as a stable React key when available", () => {
    expect(projectKey({ id: 42, name: "Konform" }, 0)).toBe("42");
  });

  it("falls back to the project name and then its list position", () => {
    expect(projectKey({ name: "Konform" }, 3)).toBe("Konform");
    expect(projectKey({}, 3)).toBe("3");
  });
});
