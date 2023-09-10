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

  const [buttons, setButtons] = useState<{ thumb_path: string, file_path: string }[]>([]);

  const updateSVGColors = (svgString: string): string => {
    return svgString
        .replace(/#FF5500/g, color1)
        .replace(/#FFFFFF/g, color2)
        .replace(/white/g, color2)
        .replace(/#9A2500/g, color3);
}

useEffect(() => {
    if (isOpen) {
        const fetchImages = async () => {
            try {
                const images = await getImagesByFamilyGroupAndSubgroup(family, group, subgroup);
                const updatedImages = images.map(img => {
                    const updatedSVG = updateSVGColors(img.file_path);
                    return { thumb_path: img.thumb_path, file_path: updatedSVG };
                });
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
              {button.file_path.endsWith('.svg') && <img src={button.file_path} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeDropdown;
