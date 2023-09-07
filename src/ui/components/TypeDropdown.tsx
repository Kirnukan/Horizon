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
}) => {

  const [buttons, setButtons] = useState<{ thumb_path: string, file_path: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        try {
          const images = await getImagesByFamilyGroupAndSubgroup(family, group, subgroup);
          setButtons(images.map(img => ({ thumb_path: img.thumb_path, file_path: img.file_path })));
        } catch (error) {
          console.error('Failed to load images:', error);
        }
      };

      fetchImages();
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
              style={{ backgroundImage: `url(${button.thumb_path})` }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* Если SVG, отображаем как изображение; иначе просто пустая кнопка с фоном */}
              {button.file_path.endsWith('.svg') && <img src={button.file_path} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeDropdown;