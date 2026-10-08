import type { HTMLAttributes } from "react";
import "./CodeLabel.css";

export function CodeLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={["code-label", className].filter(Boolean).join(" ")} />;
}
