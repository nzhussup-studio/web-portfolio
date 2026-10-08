import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithApp } from "@/test/render";
import { shouldTransitionPage } from "./routeTransition";
import { AppRouter } from "./router";

describe("AppRouter", () => {
  it("renders a friendly fallback for an unknown route", () => {
    renderWithApp(<AppRouter language="en" />, { route: "/does-not-exist" });

    expect(screen.getByRole("heading", { name: "exceptions.not_found.title" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /exceptions.not_found.back/i })).toHaveAttribute("href", "/");
  });

  it("does not treat section hash navigation as a page transition", () => {
    expect(shouldTransitionPage("/curriculum-vitae", "/curriculum-vitae")).toBe(false);
  });

  it("transitions when the pathname changes", () => {
    expect(shouldTransitionPage("/", "/curriculum-vitae")).toBe(true);
  });
});
