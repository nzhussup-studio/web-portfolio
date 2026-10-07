import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useTheme } from "./useTheme";

afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
});

describe("useTheme", () => {
  it("uses the URL preference and synchronizes the document", () => {
    window.history.replaceState(null, "", "/?theme=dark");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.location.search).toBe("?theme=dark");
  });

  it("uses light when the URL has no theme", () => {
    window.history.replaceState(null, "", "/projects");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  it("toggles and persists the theme", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
    expect(window.location.search).toBe("?theme=dark");
  });
});
