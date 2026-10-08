import { ExternalLink } from "lucide-react";
import { profile } from "@/app/profile";
import { BrandMark } from "@/components/ui/brand-mark";
import { ExternalLink as ExternalAnchor } from "@/components/ui/external-link";
import "./Footer.css";

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
          <BrandMark className="footer-logo" />
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
