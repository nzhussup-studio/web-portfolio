import type { ComponentPropsWithoutRef, ElementType } from "react";
import "./DisplayTitle.css";

type DisplayTitleProps<T extends ElementType> = {
  as?: T;
  size?: "hero" | "page";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function DisplayTitle<T extends ElementType = "h1">({ as, className, children, size = "page", ...props }: DisplayTitleProps<T>) {
  const Component = as ?? "h1";
  return <Component {...props} className={["display-title", `display-title-${size}`, className].filter(Boolean).join(" ")}>{children}<span aria-hidden="true">.</span></Component>;
}
