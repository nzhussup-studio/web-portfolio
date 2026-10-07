import { ExternalLink } from "lucide-react";
import { profile } from "../../app/profile";

const links = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.githubUrl },
  { label: "Studio", href: profile.githubOrganizationUrl },
  { label: "LinkedIn", href: profile.linkedinUrl },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-signature">
          <strong>NZ.</strong>
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
        <nav className="footer-links" aria-label="External links">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <ExternalLink aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
