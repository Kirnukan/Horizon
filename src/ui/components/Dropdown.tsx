import React, { ReactNode, useState, useEffect } from 'react';
// import './SimpleDropdown.scss'; // Стили для SimpleDropdown

interface SimpleDropdownProps {
  title: string;
  children: ReactNode | ReactNode[];
}

function SimpleDropdown({ title, children }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  const handleDropdownOpen = (id: number) => {
    setOpenDropdowns(prev => ({...prev, [id]: !prev[id]}));
  };

  const toggleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // останавливаем всплытие события
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Если меню закрывается, закрываем все внутренние списки.
    if (!newState) {
      setOpenDropdowns({});
    }
  };

  const dropdowns = React.Children.map(children, (child, index) => {
    // Обязательно передайте `key`, `isOpen` и `onOpen` каждому `TypeDropdown`.
    return React.cloneElement(child as React.ReactElement, {
      key: index,
      isOpen: openDropdowns[index] || false,
      onOpen: () => handleDropdownOpen(index),
    });
  });

  return (
    <div onClick={toggleOpen} className={`simple-dropdown ${isOpen ? 'open' : 'closed'}`}>
      <div className="dropdown-header">{title}
      <svg className={`dropdown-header-icon ${isOpen ? 'open' : 'closed'}`} xmlns="http://www.w3.org/2000/svg" width="7" height="9" viewBox="0 0 7 9" fill="none">
        <path d="M0 0L7 4.5L0 9L0 0Z" fill={isOpen ? "#FFFFFF" : "#CCCCCC"}/>
      </svg>
      </div>
      {isOpen && <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>{dropdowns}</div>}
    </div>
  );
}

export default SimpleDropdown;
