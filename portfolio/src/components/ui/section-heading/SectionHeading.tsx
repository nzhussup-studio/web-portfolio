import { CodeLabel } from "@/components/ui/code-label";
import "./SectionHeading.css";

export function SectionHeading({ label, title }: { label: string; title: string }) {
  return <header className="section-heading"><CodeLabel tone="accent">{label}</CodeLabel><h2>{title}</h2></header>;
}
