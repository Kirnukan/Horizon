import React, { useState, useEffect } from 'react';
import { getImagesByFamilyGroupAndSubgroup } from "@common/network/api";

interface TexturesDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  family: string;
  group: string;
  subgroup: string;
  selectedColor: string;
  isOpen: boolean;
  selectedTexture: string | null;
  onOpen: () => void;
  onTextureClick: (filePath: string, color: string) => void;
}

const TexturesDropdown: React.FC<TexturesDropdownProps> = ({
  title,
  imageActive,
  imagePassive,
  family,
  group,
  subgroup,
  selectedColor,
  isOpen,
  onOpen,
  onTextureClick,
  selectedTexture
}) => {
  console.log("Rendering TexturesDropdown with color:", selectedColor);
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
              className={`dropdown-button ${selectedTexture === button.file_path ? 'active' : ''}`}
              style={{ backgroundImage: `url(${button.thumb_path})` }}
              onClick={(event) => {
                event.stopPropagation();
                console.log("Button clicked with:", button.file_path, selectedColor);  // <-- добавьте эту строку
                onTextureClick(button.file_path, selectedColor);
            }}
          >
              <img src={button.thumb_path} alt="Texture Preview" />
          </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TexturesDropdown;
