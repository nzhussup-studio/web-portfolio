import { Link } from "react-router-dom";
import type { Theme } from "@/app/preferences";
import "./BrandMark.css";

type BrandMarkProps = { theme?: Theme; className?: string; label?: string };

export function BrandMark({ theme, className, label = "Nurzhanat Zhussup home" }: BrandMarkProps) {
  return (
    <Link className={["brand-mark", className].filter(Boolean).join(" ")} to="/" aria-label={label}>
      {theme ? <img src={`/brand/nz-${theme}.svg`} alt="" aria-hidden="true" /> : (
        <>
          <img className="brand-mark-light" src="/brand/nz-light.svg" alt="" aria-hidden="true" />
          <img className="brand-mark-dark" src="/brand/nz-dark.svg" alt="" aria-hidden="true" />
        </>
      )}
    </Link>
  );
}
