import React, { useState } from "react";
import config from "../config/AppConfig";
import "./AlbumCard.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const AlbumCard = ({ images, isDarkMode }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  return (
    <div className={`album-wrapper ${isDarkMode ? "dark" : ""}`}>
      <div className='album-container'>
        {images.map((image, index) => (
          <div
            key={index}
            className='collage-item'
            onClick={() => openLightbox(index)}
          >
            <img
              src={config.api.personal.api_url + image.url}
              alt={`Album Image ${index + 1}`}
              className='collage-image'
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={closeLightbox}
        slides={images.map((img) => ({
          src: config.api.personal.api_url + img.url,
        }))}
        styles={{
          container: {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          },
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </div>
  );
};

export default AlbumCard;
