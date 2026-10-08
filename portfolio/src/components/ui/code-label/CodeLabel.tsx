import type { HTMLAttributes } from "react";
import "./CodeLabel.css";

type CodeLabelProps = HTMLAttributes<HTMLParagraphElement> & { tone?: "muted" | "accent" };

export function CodeLabel({ className, tone = "muted", ...props }: CodeLabelProps) {
  return <p {...props} className={["code-label", `code-label-${tone}`, className].filter(Boolean).join(" ")} />;
}
