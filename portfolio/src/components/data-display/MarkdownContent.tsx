import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export function MarkdownContent({ children, className }: MarkdownContentProps) {
  const classes = ["markdown-content", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children: linkText, href }) => (
            <a href={href} target="_blank" rel="noreferrer">{linkText}</a>
          ),
          h1: ({ children: heading }) => <h4>{heading}</h4>,
          h2: ({ children: heading }) => <h4>{heading}</h4>,
          h3: ({ children: heading }) => <h4>{heading}</h4>,
          h4: ({ children: heading }) => <h4>{heading}</h4>,
          h5: ({ children: heading }) => <h4>{heading}</h4>,
          h6: ({ children: heading }) => <h4>{heading}</h4>,
          img: ({ alt }) => alt ? <span>{alt}</span> : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
