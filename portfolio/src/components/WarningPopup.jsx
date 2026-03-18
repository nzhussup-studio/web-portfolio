import { useEffect, useState } from "react";

const WarningPopup = ({ showWarning, t, text }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    showWarning && (
      <div
        className='warning-popup position-fixed start-50 translate-middle-x w-auto'
        style={{
          bottom: `calc(5% + ${scrollPosition}px)`,
          opacity: 1,
          animation: "slideInFromBottom 0.5s ease-in-out forwards",
        }}
      >
        <div
          className='alert alert-warning alert-dismissible fade show rounded-3'
          role='alert'
        >
          <strong>{text.split("!")[0]}!</strong>
          {text.split("!")[1]}
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
          ></button>
        </div>
      </div>
    )
  );
};

export default WarningPopup;
