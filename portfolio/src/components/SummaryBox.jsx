import ReactMarkdown from "react-markdown";
import "./AIGenButton.css";

const SummaryBox = ({ content }) => {
  return (
    <div className='summary-box-wrapper'>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className='summary-box' {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SummaryBox;
