import { Sparkles, Pause, Play } from "lucide-react";
import "./AIGenButton.css";

const AIGenButton = ({
  texts: { title, pause, resume },
  isDarkMode,
  isGenerating,
  isPaused,
  onStartGenerating,
  onPauseResume,
}) => {
  const buttonStyle = isDarkMode ? "btn-dark" : "btn-light";

  const renderContent = () => {
    if (isGenerating) {
      return (
        <>
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
          {isPaused ? resume : pause}
        </>
      );
    } else {
      return (
        <>
          <Sparkles
            size={16}
            style={{
              stroke: "url(#sparkle-gradient)",
            }}
          />
          {title || "AI Summary"}
        </>
      );
    }
  };

  const handleClick = () => {
    if (isGenerating && onPauseResume) {
      onPauseResume();
    } else if (!isGenerating && onStartGenerating) {
      onStartGenerating();
    }
  };

  return (
    <div className='ai-gen-button-wrapper'>
      {/* Gradient for SVG icon */}
      <svg width='0' height='0'>
        <defs>
          <linearGradient
            id='sparkle-gradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop stopColor='#cb54ff' offset='0%' />
            <stop stopColor='#ff54c1' offset='100%' />
          </linearGradient>
        </defs>
      </svg>

      <button
        onClick={handleClick}
        className={`ai-gen-button ${buttonStyle}`}
        aria-live='polite'
      >
        {renderContent()}
      </button>
    </div>
  );
};

export default AIGenButton;
