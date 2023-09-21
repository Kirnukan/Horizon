import React, { useState, useEffect } from 'react';
import { getImagesByFamilyGroupAndSubgroup } from "@common/network/api";

interface DetailsDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  family: string;
  group: string;
  subgroup: string;
  isOpen: boolean;
  onOpen: () => void;
  onImageClick: (filePath: string) => void;
}

const DetailsDropdown: React.FC<DetailsDropdownProps> = ({
  title,
  imageActive,
  imagePassive,
  family,
  group,
  subgroup,
  isOpen,
  onOpen,
  onImageClick,
}) => {
  const [buttons, setButtons] = useState<ButtonData[]>([]);

  interface ButtonData {
    thumb_path: string;
    file_path: string;
  }

  useEffect(() => {
    const updatePreview = async () => {
      try {
        const images = await getImagesByFamilyGroupAndSubgroup(family, group, subgroup);
        setButtons(images);
      } catch (error) {
        console.error('Failed to load images:', error);
      }
    };

    if (isOpen) {
      updatePreview();
    }
  }, [isOpen, family, group, subgroup]);

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
              style={{ backgroundColor: `#FFFFFF` }}
              onClick={(event) => {
                  event.stopPropagation();
                  onImageClick(button.file_path);
              }}
          >
              <img src={button.thumb_path} alt="Details Preview" />
          </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsDropdown;
