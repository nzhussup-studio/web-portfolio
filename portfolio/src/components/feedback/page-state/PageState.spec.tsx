import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "@/test/render";
import { PageState } from "./PageState";

describe("PageState", () => {
  it("renders friendly content, navigation, and a retry action", () => {
    const retry = vi.fn();
    renderWithApp(
      <PageState
        eyebrow="404 / lost"
        title="Page not found :("
        message="This page moved."
        link={{ label: "Back home", to: "/" }}
        action={{ label: "Try again", onClick: retry }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Page not found :(" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute("href", "/");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
