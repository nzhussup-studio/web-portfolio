import { ExternalLink } from "lucide-react";
import { profile } from "../../app/profile";
import { ExternalLink as ExternalAnchor } from "../ui/ExternalLink";

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
          <a className="footer-logo" href="/" aria-label="Nurzhanat Zhussup home">
            <img className="footer-logo-light" src="/brand/nz-light.svg" alt="" aria-hidden="true" />
            <img className="footer-logo-dark" src="/brand/nz-dark.svg" alt="" aria-hidden="true" />
          </a>
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
        <nav className="footer-links" aria-label="External links">
          {links.map((link) => (
            <ExternalAnchor key={link.label} href={link.href}>
              {link.label}
              <ExternalLink aria-hidden="true" />
            </ExternalAnchor>
          ))}
        </nav>
      </div>
    </footer>
  );
}
