
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { NetworkMessages } from "@common/network/messages";
import rawSvg from "@ui/assets/Biblio/Simple/type-1_1.svg?raw";
import svgs from '@ui/utils/forms.util'
import TypeDropdown from "./TypeDropdown";
import SimpleDropdown from "./Dropdown";
import groupsUtil from "@ui/utils/groups.util";

interface TabProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, isActive, onClick }) => (
  <button className={`tab ${isActive ? 'active' : ''}`} id={id} onClick={onClick}>
    {id.charAt(0).toUpperCase() + id.slice(1)}
  </button>
);

interface LeftPanelProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, onTabChange }) => {
  const tabs = ["frames", "textures", "details", "effects"];
  const [color1, setColor1] = useState("#0A64AD");
  const [color2, setColor2] = useState("#FFFFFF");
  const [color3, setColor3] = useState("#059DF5");
        // .replace(/#FF5500/g, '#177541')
        //                            .replace(/#FFFFFF/g, '#7074A0')
        //                            .replace(/#9A2500/g, '#7074FF')
const handleButtonClick = (svgString: string) => {
  let svg = svgString
    .replace(/#FF5500/g, color1)
    .replace(/#FFFFFF/g, color2).replace(/white/g, color2)
    .replace(/#9A2500/g, color3);
  NetworkMessages.ADD_BLACK_LAYER.send({ svg });
};
// const svgString = rawSvg
//   .replace(/#FF5500/g, color1)
//   .replace(/#FFFFFF/g, color2).replace(/white/g, color2)
//   .replace(/#9A2500/g, color3);
  
const changeSvgColors = (svgArr: string[], color1: string, color2: string, color3: string): string[] => {
  return svgArr.map(svgString => svgString
    .replace(/#FF5500/g, color1)
    .replace(/#FFFFFF/g, color2).replace(/white/g, color2)
    .replace(/#9A2500/g, color3));
}
  
const svgsArray = Object.values(svgs);
const newSvgs = changeSvgColors(svgsArray, color1, color2, color3);

const getTextWidth = (text: string, font: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};


const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});
const [searchTerm, setSearchTerm] = useState('');

const inputRef = useRef<HTMLInputElement | null>(null);


useEffect(() => {
  if (inputRef.current) {
      const icon = inputRef.current.nextSibling as HTMLElement;
      if (icon) {
          const inputWidth = inputRef.current.clientWidth;
          const font = getComputedStyle(inputRef.current).font;
          const textWidth = getTextWidth(searchTerm, font);
          const iconWidth = 12;
          let padding = 5; // стандартное расстояние от текста
          
          // Если поле ввода пустое и отображается только placeholder
          if (searchTerm === '') {
              padding = 25; // устанавливаем расстояние в 30px от центра поля
          }

          let rightPosition = (inputWidth - textWidth) / 2 - iconWidth - padding;

          // Проверяем, чтобы иконка не выходила за границы поля ввода
          if (rightPosition < padding) {
              icon.style.display = 'none'; // Скрываем иконку
          } else {
              icon.style.display = 'block'; // Показываем иконку
              icon.style.right = `${rightPosition}px`;
          }
      }
  }
}, [searchTerm]);








// Эта функция открывает определенный выпадающий список и закрывает все остальные.
const handleOpenDropdown = (dropdownId: string) => {
  setOpenDropdown({
    [dropdownId]: true,
  });
};
  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'frames':
        return (
          <div className="tab-content">
<div className="search-container">
    <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <svg className="search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8175 10.9301L8.85934 7.95969C9.61995 7.08675 10.0367 5.98841 10.0367 4.845C10.0367 2.17351 7.78542 0 5.01834 0C2.25127 0 0 2.17351 0 4.845C0 7.51648 2.25127 9.68999 5.01834 9.68999C6.05714 9.68999 7.04707 9.38749 7.89342 8.81326L10.8741 11.8062C10.9987 11.9311 11.1663 12 11.3458 12C11.5158 12 11.677 11.9374 11.7994 11.8237C12.0595 11.5821 12.0678 11.1814 11.8175 10.9301ZM5.01834 1.26391C7.06365 1.26391 8.72756 2.87034 8.72756 4.845C8.72756 6.81965 7.06365 8.42608 5.01834 8.42608C2.97304 8.42608 1.30913 6.81965 1.30913 4.845C1.30913 2.87034 2.97304 1.26391 5.01834 1.26391Z" fill="#C3CCE6"/>
    </svg>
</div>

            <div className="pallete">
              Colors
              <div className="pallete-colors">
                <input
                  className="pallete-button"
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                />
                <input
                  className="pallete-button"
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                />
                <input
                  className="pallete-button"
                  type="color"
                  value={color3}
                  onChange={(e) => setColor3(e.target.value)}
                />
              </div>
            </div>
            <div className="dropdown-container">
              <SimpleDropdown title="Simple">
                <div className="type-dropdown-container">
                  <TypeDropdown 
                    title="Image 1" 
                    imageActive={groupsUtil.imageActive1}
                    imagePassive={groupsUtil.imagePassive1}
                    isOpen={openDropdown['Image 1'] || false}
                    onOpen={() => handleOpenDropdown('Image 1')}
                    buttons={newSvgs.map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 2" 
                    imageActive={groupsUtil.imageActive2}
                    imagePassive={groupsUtil.imagePassive2}
                    isOpen={openDropdown['Image 2'] || false}
                    onOpen={() => handleOpenDropdown('Image 2')}
                    buttons={[...newSvgs, ...newSvgs.slice(-1)].map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 3" 
                    imageActive={groupsUtil.imageActive3}
                    imagePassive={groupsUtil.imagePassive3}
                    isOpen={openDropdown['Image 3'] || false}
                    onOpen={() => handleOpenDropdown('Image 3')}
                    buttons={newSvgs.slice(1).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 4" 
                    imageActive={groupsUtil.imageActive4}
                    imagePassive={groupsUtil.imagePassive4}
                    isOpen={openDropdown['Image 4'] || false}
                    onOpen={() => handleOpenDropdown('Image 4')}
                    buttons={newSvgs.slice(1).map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 5" 
                    imageActive={groupsUtil.imageActive5}
                    imagePassive={groupsUtil.imagePassive5}
                    isOpen={openDropdown['Image 5'] || false}
                    onOpen={() => handleOpenDropdown('Image 5')}
                    buttons={newSvgs.slice(3).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                </div>
              </SimpleDropdown>
              <SimpleDropdown title="Simple2">
                <div className="type-dropdown-container">
                  <TypeDropdown 
                    title="Image 1" 
                    imageActive={groupsUtil.imageActive1}
                    imagePassive={groupsUtil.imagePassive1}
                    isOpen={openDropdown['Image 1'] || false}
                    onOpen={() => handleOpenDropdown('Image 1')}
                    buttons={newSvgs.map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 2" 
                    imageActive={groupsUtil.imageActive2}
                    imagePassive={groupsUtil.imagePassive2}
                    isOpen={openDropdown['Image 2'] || false}
                    onOpen={() => handleOpenDropdown('Image 2')}
                    buttons={[...newSvgs, ...newSvgs.slice(-1)].map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 3" 
                    imageActive={groupsUtil.imageActive3}
                    imagePassive={groupsUtil.imagePassive3}
                    isOpen={openDropdown['Image 3'] || false}
                    onOpen={() => handleOpenDropdown('Image 3')}
                    buttons={newSvgs.slice(1).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 4" 
                    imageActive={groupsUtil.imageActive4}
                    imagePassive={groupsUtil.imagePassive4}
                    isOpen={openDropdown['Image 4'] || false}
                    onOpen={() => handleOpenDropdown('Image 4')}
                    buttons={newSvgs.slice(1).map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 5" 
                    imageActive={groupsUtil.imageActive5}
                    imagePassive={groupsUtil.imagePassive5}
                    isOpen={openDropdown['Image 5'] || false}
                    onOpen={() => handleOpenDropdown('Image 5')}
                    buttons={newSvgs.slice(3).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                </div>
              </SimpleDropdown>
              <SimpleDropdown title="Simple3">
                <div className="type-dropdown-container">
                  <TypeDropdown 
                    title="Image 1" 
                    imageActive={groupsUtil.imageActive1}
                    imagePassive={groupsUtil.imagePassive1}
                    isOpen={openDropdown['Image 1'] || false}
                    onOpen={() => handleOpenDropdown('Image 1')}
                    buttons={newSvgs.map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 2" 
                    imageActive={groupsUtil.imageActive2}
                    imagePassive={groupsUtil.imagePassive2}
                    isOpen={openDropdown['Image 2'] || false}
                    onOpen={() => handleOpenDropdown('Image 2')}
                    buttons={[...newSvgs, ...newSvgs.slice(-1)].map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 3" 
                    imageActive={groupsUtil.imageActive3}
                    imagePassive={groupsUtil.imagePassive3}
                    isOpen={openDropdown['Image 3'] || false}
                    onOpen={() => handleOpenDropdown('Image 3')}
                    buttons={newSvgs.slice(1).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 4" 
                    imageActive={groupsUtil.imageActive4}
                    imagePassive={groupsUtil.imagePassive4}
                    isOpen={openDropdown['Image 4'] || false}
                    onOpen={() => handleOpenDropdown('Image 4')}
                    buttons={newSvgs.slice(1).map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 5" 
                    imageActive={groupsUtil.imageActive5}
                    imagePassive={groupsUtil.imagePassive5}
                    isOpen={openDropdown['Image 5'] || false}
                    onOpen={() => handleOpenDropdown('Image 5')}
                    buttons={newSvgs.slice(3).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                </div>
              </SimpleDropdown>
              <SimpleDropdown title="Simple4">
                <div className="type-dropdown-container">
                  <TypeDropdown 
                    title="Image 1" 
                    imageActive={groupsUtil.imageActive1}
                    imagePassive={groupsUtil.imagePassive1}
                    isOpen={openDropdown['Image 1'] || false}
                    onOpen={() => handleOpenDropdown('Image 1')}
                    buttons={newSvgs.map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 2" 
                    imageActive={groupsUtil.imageActive2}
                    imagePassive={groupsUtil.imagePassive2}
                    isOpen={openDropdown['Image 2'] || false}
                    onOpen={() => handleOpenDropdown('Image 2')}
                    buttons={[...newSvgs, ...newSvgs.slice(-1)].map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 3" 
                    imageActive={groupsUtil.imageActive3}
                    imagePassive={groupsUtil.imagePassive3}
                    isOpen={openDropdown['Image 3'] || false}
                    onOpen={() => handleOpenDropdown('Image 3')}
                    buttons={newSvgs.slice(1).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 4" 
                    imageActive={groupsUtil.imageActive4}
                    imagePassive={groupsUtil.imagePassive4}
                    isOpen={openDropdown['Image 4'] || false}
                    onOpen={() => handleOpenDropdown('Image 4')}
                    buttons={newSvgs.slice(1).map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                  <TypeDropdown 
                    title="Image 5" 
                    imageActive={groupsUtil.imageActive5}
                    imagePassive={groupsUtil.imagePassive5}
                    isOpen={openDropdown['Image 5'] || false}
                    onOpen={() => handleOpenDropdown('Image 5')}
                    buttons={newSvgs.slice(3).reverse().map(svg => ({ svg: svg, onClick: () => handleButtonClick(svg) }))}
                  />
                </div>
              </SimpleDropdown>
              <SimpleDropdown title="Button 2">
              </SimpleDropdown>
            </div>


            {/* <Button
              onClick={handleButtonClick}
              style={{ marginInlineStart: 10 }}
            >
              Add image
            </Button> */}
          </div>
        );

      case 'textures':
        return (
          <div className="tab-content">
<div className="search-container">
    <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <svg className="search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8175 10.9301L8.85934 7.95969C9.61995 7.08675 10.0367 5.98841 10.0367 4.845C10.0367 2.17351 7.78542 0 5.01834 0C2.25127 0 0 2.17351 0 4.845C0 7.51648 2.25127 9.68999 5.01834 9.68999C6.05714 9.68999 7.04707 9.38749 7.89342 8.81326L10.8741 11.8062C10.9987 11.9311 11.1663 12 11.3458 12C11.5158 12 11.677 11.9374 11.7994 11.8237C12.0595 11.5821 12.0678 11.1814 11.8175 10.9301ZM5.01834 1.26391C7.06365 1.26391 8.72756 2.87034 8.72756 4.845C8.72756 6.81965 7.06365 8.42608 5.01834 8.42608C2.97304 8.42608 1.30913 6.81965 1.30913 4.845C1.30913 2.87034 2.97304 1.26391 5.01834 1.26391Z" fill="#C3CCE6"/>
    </svg>
</div>

            {/* Содержимое для вкладки 'textures' */}
            2
          </div>
        );

      case 'details':
        return (
          <div className="tab-content">
<div className="search-container">
    <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <svg className="search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8175 10.9301L8.85934 7.95969C9.61995 7.08675 10.0367 5.98841 10.0367 4.845C10.0367 2.17351 7.78542 0 5.01834 0C2.25127 0 0 2.17351 0 4.845C0 7.51648 2.25127 9.68999 5.01834 9.68999C6.05714 9.68999 7.04707 9.38749 7.89342 8.81326L10.8741 11.8062C10.9987 11.9311 11.1663 12 11.3458 12C11.5158 12 11.677 11.9374 11.7994 11.8237C12.0595 11.5821 12.0678 11.1814 11.8175 10.9301ZM5.01834 1.26391C7.06365 1.26391 8.72756 2.87034 8.72756 4.845C8.72756 6.81965 7.06365 8.42608 5.01834 8.42608C2.97304 8.42608 1.30913 6.81965 1.30913 4.845C1.30913 2.87034 2.97304 1.26391 5.01834 1.26391Z" fill="#C3CCE6"/>
    </svg>
</div>
            {/* Содержимое для вкладки 'details' */}
            3
          </div>
        );

      case 'effects':
        return (
          <div className="tab-content">
<div className="search-container">
    <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <svg className="search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8175 10.9301L8.85934 7.95969C9.61995 7.08675 10.0367 5.98841 10.0367 4.845C10.0367 2.17351 7.78542 0 5.01834 0C2.25127 0 0 2.17351 0 4.845C0 7.51648 2.25127 9.68999 5.01834 9.68999C6.05714 9.68999 7.04707 9.38749 7.89342 8.81326L10.8741 11.8062C10.9987 11.9311 11.1663 12 11.3458 12C11.5158 12 11.677 11.9374 11.7994 11.8237C12.0595 11.5821 12.0678 11.1814 11.8175 10.9301ZM5.01834 1.26391C7.06365 1.26391 8.72756 2.87034 8.72756 4.845C8.72756 6.81965 7.06365 8.42608 5.01834 8.42608C2.97304 8.42608 1.30913 6.81965 1.30913 4.845C1.30913 2.87034 2.97304 1.26391 5.01834 1.26391Z" fill="#C3CCE6"/>
    </svg>
</div>
            {/* Содержимое для вкладки 'effects' */}
            4
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="left-panel">
      <div className="tabs">
        {tabs.map((tab) => (
          <Tab
            key={tab}
            id={tab}
            isActive={activeTab === tab}
            onClick={() => onTabChange(tab)}
          />
        ))}
      </div>

      <div className="tabs-content">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
};

export default LeftPanel;
