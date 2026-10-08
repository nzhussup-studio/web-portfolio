import { ArrowLeft } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { CodeLabel } from "@/components/ui/code-label";
import "./PageState.css";

type PageStateProps = {
  eyebrow: string;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  link?: { label: string; to: string };
};

export function PageState({ eyebrow, title, message, action, link }: PageStateProps) {
  return (
    <section className="page-state site-container">
      <CodeLabel>{eyebrow}</CodeLabel>
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      {(action || link) && (
        <div className="page-state-actions">
          {link && <ButtonLink to={link.to}><ArrowLeft aria-hidden="true" />{link.label}</ButtonLink>}
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
        </div>
      )}
    </section>
  );
}
