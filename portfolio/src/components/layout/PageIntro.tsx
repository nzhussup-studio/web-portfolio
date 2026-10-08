import type { ReactNode } from "react";
import { CodeLabel } from "../ui/CodeLabel";

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
        <CodeLabel>{eyebrow}</CodeLabel>
        <h1>{title}<span aria-hidden="true">.</span></h1>
        {description && <p>{description}</p>}
      </div>
      {aside}
    </header>
  );
}
