import type { ButtonHTMLAttributes } from "react";
import "./IconButton.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, type = "button", ...props }: IconButtonProps) {
  return <button {...props} type={type} className={["icon-button", className].filter(Boolean).join(" ")} />;
}
