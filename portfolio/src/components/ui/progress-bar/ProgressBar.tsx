import type { Ref } from "react";
import "./ProgressBar.css";

type ProgressBarProps = {
  label: string;
  value?: number;
  rootRef?: Ref<HTMLSpanElement>;
  fillRef?: Ref<HTMLElement>;
  className?: string;
};

export function ProgressBar({ label, value = 0, rootRef, fillRef, className }: ProgressBarProps) {
  return (
    <span ref={rootRef} className={["progress-bar", className].filter(Boolean).join(" ")} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
      <i ref={fillRef} style={{ transform: `scaleX(${value / 100})` }} />
    </span>
  );
}
