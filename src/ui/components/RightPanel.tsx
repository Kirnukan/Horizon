import { NetworkMessages } from "@common/network/messages";
import React, { useState } from "react";

type RightPanelProps = {
    images: Array<{ thumb_path: string, file_path: string } | null>
    handleImageClick: (index: number) => void;
    setImages: React.Dispatch<React.SetStateAction<Array<{ thumb_path: string, file_path: string } | null>>>;
};

const RightPanel: React.FC<RightPanelProps> = (props) => {


const handleCleanFramesClick = () => {
    console.log('clean')
    NetworkMessages.CLEAN_FRAMES.send({})
};

const clearElements = () => {
  props.setImages(Array(9).fill(null));
};

const addToRightPanel = (button: { thumb_path: string, file_path: string }) => {
    props.setImages(prevImages => {
      const newImages = [...prevImages];
      const index = newImages.findIndex(img => img === null);
      if (index !== -1) {
        newImages[index] = button;
      } else {
        newImages.shift();
        newImages.push(button);
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
            <div className="button big-button">
              <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0.727539" width="44" height="44" rx="4" fill="#C3CCE6"/>
              <path d="M17.6751 24.616L16.5192 26.531C15.9089 27.539 14.8558 28.1425 13.7049 28.1425H9V31.5712H13.7049C16.0067 31.5712 18.1096 30.366 19.3301 28.3482L19.6303 27.851L17.6751 24.616Z" fill="white"/>
              <path d="M36 29.8569L30.2606 24.9126C30.0135 24.6983 29.6686 24.6554 29.3784 24.7943C29.0865 24.9366 28.9007 25.2383 28.9007 25.5709V28.1425H27.5127C26.3617 28.1425 25.3103 27.539 24.7 26.531L19.3301 17.6505C18.1112 15.6327 16.0084 14.4275 13.7049 14.4275H9V17.8562H13.7049C14.8558 17.8562 15.9072 18.4597 16.5175 19.4677L21.8874 28.3482C23.108 30.366 25.2108 31.5712 27.5127 31.5712H28.9007V34.1428C28.9007 34.4754 29.0865 34.7771 29.3784 34.9194C29.4895 34.9726 29.6105 35 29.7299 35C29.9207 35 30.1097 34.9331 30.2606 34.8011L36 29.8569Z" fill="white"/>
              <path d="M36 16.1419L30.2606 11.1976C30.0135 10.985 29.6686 10.9404 29.3784 11.081C29.0865 11.2199 28.9007 11.5233 28.9007 11.8559V14.4275H27.5127C25.2092 14.4275 23.1063 15.6327 21.8874 17.6505L21.5872 18.1477L23.5425 21.3827L24.7 19.4677C25.3103 18.4597 26.3617 17.8562 27.5127 17.8562H28.9007V20.4278C28.9007 20.7604 29.0865 21.0638 29.3784 21.2044C29.4895 21.2576 29.6105 21.285 29.7299 21.285C29.9207 21.285 30.1097 21.2164 30.2606 21.0861L36 16.1419Z" fill="white"/>
              </svg>
            </div>

            <div className="button big-button"  onClick={clearElements}>
              <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0.363281" width="44" height="44" rx="4" fill="#C3CCE6"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6716 21.5002L11.5858 13.4144L14.4142 10.5859L22.5 18.6717L30.5858 10.5859L33.4142 13.4144L25.3285 21.5002L33.4142 29.5859L30.5858 32.4144L22.5 24.3286L14.4142 32.4144L11.5858 29.5859L19.6716 21.5002Z" fill="white"/>
            </svg>


            </div>
              <div className="button big-button" onClick={handleCleanFramesClick}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="4" fill="#C3CCE6"/>
              <path d="M9.26477 15.5836L15.4972 10.2146C15.7655 9.98372 16.1401 9.93532 16.4553 10.088C16.7722 10.2388 16.9739 10.5683 16.9739 10.9294V13.6608H24.5656C30.1821 13.6608 34.7352 18.2139 34.7352 23.8304C34.7352 29.4469 30.1821 34 24.5656 34H15.4972V30.1473H24.5656C28.0543 30.1473 30.8825 27.3191 30.8825 23.8304C30.8825 20.3416 28.0543 17.5134 24.5656 17.5134H16.9739V20.2377C16.9739 20.5989 16.7722 20.9284 16.4553 21.0811C16.3346 21.1388 16.2031 21.1686 16.0735 21.1686C15.8664 21.1686 15.6611 21.0941 15.4972 20.9526L9.26477 15.5836Z" fill="white"/>
            </svg>


            </div>
        </div>
    </div>
)}

export default RightPanel;
