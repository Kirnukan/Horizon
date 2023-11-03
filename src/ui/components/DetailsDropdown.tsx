import React, { useState, useEffect } from 'react';
import { getImagesByFamilyGroupAndSubgroup } from "@common/network/api";
interface ButtonData {
  thumb_path: string;
  file_path: string;
}
interface DetailsDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  family: string;
  group: string;
  subgroup: string;
  isOpen: boolean;
  onOpen: () => void;
  onImageClick: (filePath: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAddToRightPanel?: (button: ButtonData) => void;
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
  onContextMenu,
  onAddToRightPanel,
}) => {
  const [buttons, setButtons] = useState<ButtonData[]>([]);



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
                  onImageClick(button.file_path, event);
              }}
              onContextMenu={(event) => {
                // console.log("Context menu event:", event);
                event.preventDefault(); // Это предотвратит появление стандартного контекстного меню
                onAddToRightPanel?.(button); // Вызов функции addToRightPanel с текущими данными кнопки
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
