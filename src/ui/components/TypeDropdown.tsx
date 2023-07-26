// TypeDropdown.tsx
import React, { ReactNode, useState } from 'react';
// import './TypeDropdown.scss'; // Стили для TypeDropdown

interface TypeDropdownProps {
  title: string;
  imageActive: string;
  imagePassive: string;
  buttons: {
    svg: string;
    onClick: () => void;
  }[];
}

const TypeDropdown: React.FC<TypeDropdownProps> = ({
  title,
  imageActive,
  imagePassive,
  buttons,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (onClick: () => void) => {
    onClick();
    // Не нужно менять состояние isOpen при нажатии на кнопку
    // setIsOpen(false);
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
              onClick={(event) => {
                event.stopPropagation(); // Остановите всплытие события
                handleButtonClick(button.onClick);
              }}
            >
              <img src={`data:image/svg+xml,${encodeURIComponent(button.svg)}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeDropdown;