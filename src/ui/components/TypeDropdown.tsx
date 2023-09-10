import React, { useState, useEffect } from 'react';
import { getImagesByFamilyGroupAndSubgroup } from "@common/network/api";

interface TypeDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  family: string;
  group: string;
  subgroup: string;
  isOpen: boolean;
  onOpen: () => void;
  onImageClick: (filePath: string) => void;
  color1: string;
  color2: string;
  color3: string;
}

const TypeDropdown: React.FC<TypeDropdownProps> = ({
  title,
  imageActive,
  imagePassive,
  family,
  group,
  subgroup,
  isOpen,
  onOpen,
  onImageClick,
  color1,
  color2,
  color3,
}) => {
  const [buttons, setButtons] = useState<ButtonData[]>([]);


  interface ButtonData {
    thumb_path: string;
    file_path: string;
    svgContent: string;
  } 

  const updateSVGColors = (svgString: string) => {
    return svgString
        .replace(/#FF5500/g, color1)
        .replace(/#FFFFFF/g, color2)
        .replace(/white/g, color2)
        .replace(/#9A2500/g, color3);
  }

  useEffect(() => {
    if (isOpen) {
    const fetchSVGContent = async (url: string): Promise<string> => {
        const response = await fetch(url);
        return response.text();
    };

    const fetchImages = async () => {
        try {
            const images = await getImagesByFamilyGroupAndSubgroup(family, group, subgroup);
            console.log("Original SVGs:", images);

            const updatedImagesPromises = images.map(async img => {
                const svgContent = await fetchSVGContent(img.file_path);
                const updatedSVG = updateSVGColors(svgContent);
                return { thumb_path: img.thumb_path, file_path: img.file_path, svgContent: updatedSVG };

            });

            const updatedImages = await Promise.all(updatedImagesPromises);
            setButtons(updatedImages);
        } catch (error) {
            console.error('Failed to load images:', error);
        }
    };

        fetchImages();
    }
  }, [isOpen, family, group, subgroup, color1, color2, color3]);

  const handleDropdownClick = () => {
    onOpen();
  };

  return (
    <div className="type-dropdown-wrapper">
      <div
        className={`type-dropdown ${isOpen ? "open" : ""}`}
        onClick={handleDropdownClick}
      >
        <div className="type-dropdown-header">
          <img
            className={`type-dropdown-header-icon ${isOpen ? "open" : "closed"}`}
            src={isOpen ? imageActive : imagePassive}
          />
        </div>
      </div>

      {isOpen && (
        <div className="buttons">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="dropdown-button"
              style={{ backgroundImage: `url(${button.thumb_path})` }}
              onClick={(event) => {
                  event.stopPropagation();
                  onImageClick(button.file_path);
              }}
          >
              <div className="dropdown-button" dangerouslySetInnerHTML={{ __html: button.svgContent }} />
          </button>

          ))}
        </div>
      )}
    </div>
  );
};

export default TypeDropdown;
