import { NetworkMessages } from "@common/network/messages";
import React, { useState } from "react";

type RightPanelProps = {
    images: Array<{ thumb_path: string, file_path: string } | null>
    handleImageClick: (index: number) => void;
    setImages: React.Dispatch<React.SetStateAction<Array<{ thumb_path: string, file_path: string } | null>>>;
};

const RightPanel: React.FC<RightPanelProps> = (props) => {

    // const [images, setImages] = useState<Array<{ thumb_path: string, file_path: string } | null>>(Array(9).fill(null));

const handleCleanFramesClick = () => {
    console.log('clean')
    NetworkMessages.CLEAN_FRAMES.send({})
};

const addToRightPanel = (button: { thumb_path: string, file_path: string }) => {
    props.setImages(prevImages => {
      const newImages = [...prevImages];
      const index = newImages.findIndex(img => img === null);
      if (index !== -1) {
        newImages[index] = button;
      } else {
        newImages.shift();  // Удалить первый элемент
        newImages.push(button);  // Добавить новый элемент в конец
      }
      return newImages;
    });
  };




  



  const handleRightClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    props.setImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = null;
        return newImages;
    });
};



return (
    <div className="right-panel">
        <div className="elements">
        {props.images.map((image, index) => (
          <div key={index} className="element">
            <button className="element"
              onClick={() => props.handleImageClick(index)}
              onContextMenu={(event) => handleRightClick(event, index)}
              style={{ backgroundImage: image ? `url(${image.thumb_path})` : 'none' }}
            />
          </div>
        ))}
            <div className="button" />
            <div className="button" />
            <div className="button big-button" onClick={handleCleanFramesClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <rect width="44" height="44" rx="4" fill="#C3CCE6"/>
                    <path d="M32.8 13.6H11.2C10.8817 13.6 10.5765 13.7264 10.3515 13.9515C10.1264 14.1765 10 14.4817 10 14.8C10 15.1183 10.1264 15.4235 10.3515 15.6485C10.5765 15.8736 10.8817 16 11.2 16H13.6V30.4C13.6003 31.3547 13.9797 32.2702 14.6547 32.9453C15.3298 33.6203 16.2453 33.9997 17.2 34H26.8C27.7547 33.9997 28.6702 33.6204 29.3453 32.9453C30.0204 32.2702 30.3997 31.3547 30.4 30.4V16H32.8C33.1183 16 33.4235 15.8736 33.6485 15.6485C33.8736 15.4235 34 15.1183 34 14.8C34 14.4817 33.8736 14.1765 33.6485 13.9515C33.4235 13.7264 33.1183 13.6 32.8 13.6ZM20.8 26.8C20.8 27.1183 20.6736 27.4235 20.4485 27.6485C20.2235 27.8736 19.9183 28 19.6 28C19.2817 28 18.9765 27.8736 18.7515 27.6485C18.5264 27.4235 18.4 27.1183 18.4 26.8V20.8C18.4 20.4817 18.5264 20.1765 18.7515 19.9515C18.9765 19.7264 19.2817 19.6 19.6 19.6C19.9183 19.6 20.2235 19.7264 20.4485 19.9515C20.6736 20.1765 20.8 20.4817 20.8 20.8V26.8ZM25.6 26.8C25.6 27.1183 25.4736 27.4235 25.2485 27.6485C25.0235 27.8736 24.7183 28 24.4 28C24.0817 28 23.7765 27.8736 23.5515 27.6485C23.3264 27.4235 23.2 27.1183 23.2 26.8V20.8C23.2 20.4817 23.3264 20.1765 23.5515 19.9515C23.7765 19.7264 24.0817 19.6 24.4 19.6C24.7183 19.6 25.0235 19.7264 25.2485 19.9515C25.4736 20.1765 25.6 20.4817 25.6 20.8V26.8Z" fill="white"/>
                    <path d="M19.6 12.4H24.4C24.7183 12.4 25.0235 12.2736 25.2485 12.0485C25.4736 11.8235 25.6 11.5183 25.6 11.2C25.6 10.8817 25.4736 10.5765 25.2485 10.3515C25.0235 10.1264 24.7183 10 24.4 10H19.6C19.2817 10 18.9765 10.1264 18.7515 10.3515C18.5264 10.5765 18.4 10.8817 18.4 11.2C18.4 11.5183 18.5264 11.8235 18.7515 12.0485C18.9765 12.2736 19.2817 12.4 19.6 12.4Z" fill="white"/>
                </svg>
            </div>
        </div>
    </div>
)}

export default RightPanel;
