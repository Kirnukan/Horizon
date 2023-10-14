import React, { useState, useEffect } from 'react';
import { getImagesByFamilyGroupAndSubgroup } from "@common/network/api";

interface EffectsDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  family: string;
  group: string;
  subgroup: string;
  isOpen: boolean;
  onOpen: () => void;
  onImageEffectClick: (filePath: string) => void;
}

const EffectsDropdown: React.FC<EffectsDropdownProps> = ({
  title,
  imageActive,
  imagePassive,
  family,
  group,
  subgroup,
  isOpen,
  onOpen,
  onImageEffectClick,
}) => {
  const [buttons, setButtons] = useState<ButtonData[]>([]);

  interface ButtonData {
    thumb_path: string;
    file_path: string;
  }

  useEffect(() => {
    const updatePreview = async () => {
      try {
        const images = await getImagesByFamilyGroupAndSubgroup(family, group, subgroup); // Ensure this API call is applicable for effects as well
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
                  onImageEffectClick(button.file_path);
              }}
          >
              <img src={button.thumb_path} alt="Effects Preview" />
          </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EffectsDropdown;
