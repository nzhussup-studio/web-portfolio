import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
      <p className="code-label">{eyebrow}</p>
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      {(action || link) && (
        <div className="page-state-actions">
          {link && <Link to={link.to}><ArrowLeft aria-hidden="true" />{link.label}</Link>}
          {action && <button type="button" onClick={action.onClick}>{action.label}</button>}
        </div>
      )}
    </section>
  );
}
