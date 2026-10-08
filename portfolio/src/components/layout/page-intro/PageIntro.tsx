import type { ReactNode } from "react";
import { CodeLabel } from "@/components/ui/code-label";
import { DisplayTitle } from "@/components/ui/display-title";
import "./PageIntro.css";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div>
        <CodeLabel tone="accent">{eyebrow}</CodeLabel>
        <DisplayTitle>{title}</DisplayTitle>
        {description && <p>{description}</p>}
      </div>
      {aside}
    </header>
  );
}
