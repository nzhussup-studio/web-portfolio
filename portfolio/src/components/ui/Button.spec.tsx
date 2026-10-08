import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithApp } from "../../test/render";
import { Button, ButtonLink } from "./Button";

describe("Button", () => {
  it("shares button and link semantics without losing native behavior", () => {
    const onClick = vi.fn();
    renderWithApp(<><Button size="large" onClick={onClick}>Generate</Button><ButtonLink to="/">Home</ButtonLink></>);

    fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Generate" })).toHaveClass("ui-button-large");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });
});
