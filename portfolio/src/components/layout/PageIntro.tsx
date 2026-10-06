import type { ReactNode } from "react";

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
        <p className="code-label">{eyebrow}</p>
        <h1>{title}<span aria-hidden="true">.</span></h1>
        {description && <p>{description}</p>}
      </div>
      {aside}
    </header>
  );
}
