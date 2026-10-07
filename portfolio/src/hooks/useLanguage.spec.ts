import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLanguage } from "./useLanguage";

afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  document.documentElement.lang = "en";
});

describe("useLanguage", () => {
  it("reads Kazakh from the URL and synchronizes browser state", async () => {
    window.history.replaceState(null, "", "/projects?lang=kk");
    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe("kk");
    await waitFor(() => expect(document.documentElement.lang).toBe("kk"));
    expect(window.location.search).toBe("?lang=kk");
  });

  it("removes the default language from the URL", async () => {
    window.history.replaceState(null, "", "/?lang=kk");
    const { result } = renderHook(() => useLanguage());
    act(() => result.current.setLanguage("en"));

    await waitFor(() => expect(result.current.language).toBe("en"));
    expect(window.location.search).toBe("");
    expect(document.documentElement.lang).toBe("en");
  });
});
