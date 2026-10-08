import type { AnchorHTMLAttributes } from "react";
import "./ExternalLink.css";

export function ExternalLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={["external-link", className].filter(Boolean).join(" ")} target="_blank" rel="noreferrer" />;
}
