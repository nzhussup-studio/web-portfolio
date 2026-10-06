import { ExternalLink } from "lucide-react";

const links = [
  { label: "Email", href: "mailto:zhussup.nb@gmail.com" },
  { label: "GitHub", href: "https://github.com/nzhussup" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nurzhanat-zhussup/" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-signature">
          <strong>NZ.</strong>
          <span>© {new Date().getFullYear()} Nurzhanat Zhussup</span>
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
