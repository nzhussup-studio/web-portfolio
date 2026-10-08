import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithApp } from "@/test/render";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("wraps page content with shared navigation and footer landmarks", () => {
    renderWithApp(
      <AppShell
        language="en"
        onLanguageChange={() => undefined}
        theme="light"
        onThemeToggle={() => undefined}
      >
        <h1>Page content</h1>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { name: "Page content" }));
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
