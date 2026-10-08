import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import "./InlineState.css";

type InlineStateProps = {
  children: ReactNode;
  tone?: "muted" | "error";
  action?: { label: string; onClick: () => void };
};

export function InlineState({ children, tone = "muted", action }: InlineStateProps) {
  return (
    <div className={["inline-state", `inline-state-${tone}`, action && "inline-state-action"].filter(Boolean).join(" ")}>
      <span>{children}</span>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
