import { desc } from "framer-motion/client";
import React from "react";

const Card = ({
  title,
  description,
  location,
  duration,
  isDarkMode,
  link,
  linkText,
  children,
}) => (
  <div className='card mb-3 shadow-sm rounded-lg'>
    <div className='card-body'>
      <h5 className='card-title text-body-emphasis mb-2'>{title}</h5>
      {description && (
        <p className='card-text text-muted'>
          <span style={{ whiteSpace: "pre-line" }}>{description}</span>
        </p>
      )}
      {location && (
        <p className='text-muted'>
          <strong>Location:</strong> {location}
        </p>
      )}
      {duration && (
        <p className='text-muted'>
          <strong>Duration:</strong> {duration}
        </p>
      )}
      {link && (
        <a
          href={link}
          className={`btn ${
            isDarkMode ? "btn-secondary" : "btn-light"
          } rounded-pill`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {linkText}
        </a>
      )}
      {children}
    </div>
  </div>
);

export default Card;
