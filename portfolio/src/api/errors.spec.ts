import { describe, expect, it } from "vitest";
import { ApiError, isNotFoundError } from "./errors";

describe("isNotFoundError", () => {
  it("recognizes API 404 errors", () => {
    expect(isNotFoundError(new ApiError(404))).toBe(true);
  });

  it("does not classify other failures as missing content", () => {
    expect(isNotFoundError(new ApiError(500))).toBe(false);
    expect(isNotFoundError(new Error("offline"))).toBe(false);
  });
});

describe("ApiError", () => {
  it("preserves status, message, and error identity", () => {
    const error = new ApiError(503, "Temporarily unavailable");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(503);
    expect(error.message).toBe("Temporarily unavailable");
  });
});
