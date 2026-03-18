import React, { useState, useEffect } from "react";

const UpButton = ({ isDarkMode }) => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true); // Show button when scroll position is greater than 100px
    } else {
      setShowButton(false); // Hide button when at the top
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // Add event listener for scrolling

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`btn rounded-circle position-fixed bottom-0 end-0 m-3 d-flex justify-content-center align-items-center transition-opacity ${
        showButton ? "opacity-100" : "opacity-0"
      }`}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "transparent", // Make background transparent
        border: `2px solid ${isDarkMode ? "white" : "black"}`, // Optional: Add a border to make it visible
        zIndex: 1050, // Ensure it's on top of other elements
        padding: 0, // Ensure no padding around the icon
        transition: "opacity 1.5s ease", // Smooth fade-in/fade-out effect
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='42'
        height='42'
        fill='currentColor'
        className='bi bi-arrow-up-short'
        viewBox='0 0 16 16'
      >
        <path
          fillRule='evenodd'
          d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5'
        />
      </svg>
    </button>
  );
};

export default UpButton;
