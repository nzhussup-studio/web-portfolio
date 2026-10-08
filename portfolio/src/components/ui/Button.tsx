import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

type ButtonSize = "compact" | "large";

function buttonClasses(size: ButtonSize, className?: string) {
  return ["ui-button", `ui-button-${size}`, className].filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
};

export function Button({ className, size = "compact", type = "button", ...props }: ButtonProps) {
  return <button {...props} type={type} className={buttonClasses(size, className)} />;
}

type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
};

export function ButtonLink({ to, children, className, size = "compact" }: ButtonLinkProps) {
  return <Link to={to} className={buttonClasses(size, className)}>{children}</Link>;
}
