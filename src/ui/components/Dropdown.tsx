// Dropdown.tsx
import React, { ReactNode, useState } from 'react';
// import './SimpleDropdown.scss'; // Стили для SimpleDropdown

interface SimpleDropdownProps {
  title: string;
  children: ReactNode;
}

function SimpleDropdown({ title, children }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // останавливаем всплытие события
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleOpen} className={`simple-dropdown ${isOpen ? 'open' : 'closed'}`}>
      <div className="dropdown-header">{title}
      <svg className={`dropdown-header-icon ${isOpen ? 'open' : 'closed'}`} xmlns="http://www.w3.org/2000/svg" width="7" height="9" viewBox="0 0 7 9" fill="none">
        <path d="M0 0L7 4.5L0 9L0 0Z" fill={isOpen ? "#FFFFFF" : "#CCCCCC"}/>
      </svg>
      </div>
      {isOpen && <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>{children}</div>}
    </div>
  );
}

export default SimpleDropdown;