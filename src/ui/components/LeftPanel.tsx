import React, { useEffect, useRef, useState } from "react";
import { NetworkMessages } from "@common/network/messages";
import svgs from '@ui/utils/forms.util';
import TypeDropdown from "./TypeDropdown";
import SimpleDropdown from "./Dropdown";
import groupsUtil from "@ui/utils/groups.util";
import { getImageByFilePath } from "@common/network/api";
import { tabsData, Tab, Group, Subgroup } from "@ui/utils/dataStructure"; 



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

  const SearchBar: React.FC<{ searchTerm: string, setSearchTerm: (term: string) => void }> = ({ searchTerm, setSearchTerm }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const getTextWidth = (text: string, font: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return 0;
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    };
    
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
    
    return (
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
    );
  }

  interface LeftPanelProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
  }




  const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, onTabChange }) => {
    const tabs = ["frames", "textures", "details", "effects"];
    const [colors, setColors] = useState(["#0A64AD", "#FFFFFF", "#059DF5"]);
    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [color1, setColor1] = useState("#0A64AD");
    const [color2, setColor2] = useState("#FFFFFF");
    const [color3, setColor3] = useState("#059DF5");
    const [currentSVG, setCurrentSVG] = useState<string | null>(null);

    const handleImageClick = async (filePath: string): Promise<string> => {
      try {
          const response = await getImageByFilePath(filePath);
  
          // Добавляем проверку на существование объекта и свойства file_path
          if (!response || typeof response !== 'object' || !('file_path' in response)) {
              throw new Error("Server did not return the expected data.");
          }
  
          const svgString = response.file_path;
          console.log("SVG String:", svgString);
          return svgString;
      } catch (error) {
          console.error('Ошибка при обработке изображения:', error);
          throw error; 
      }
    };
  
  
  

    const handleButtonClick = async (filePath: string) => {
      console.log("Button clicked:", filePath);
      try {
          const svgString = await handleImageClick(filePath);
          let updatedSVG = updateSVGColors(svgString);  // Получите обновленный SVG
          
          // Отправка обновленного SVG в Figma
          NetworkMessages.ADD_BLACK_LAYER.send({ svg: updatedSVG });
  
      } catch (error) {
          console.error('Ошибка при отправке SVG в Figma:', error);
      }
  };
  

  const updateSVGColors = (svgString: string): string => {
    let updatedSVG = colors.reduce((acc, color, index) => {
        const patterns = [
            /#FF5500/g,
            /#FFFFFF/g, /white/g,
            /#9A2500/g
        ];
        return acc.replace(patterns[index], color);
    }, svgString);
    return updatedSVG;  // Верните обновленный SVG
};



  useEffect(() => {
      if (currentSVG) {
          updateSVGColors(currentSVG);
      }
  }, [color1, color2, color3]);
    const handleOpenDropdown = (dropdownId: string) => {
      setOpenDropdown(prevState => ({
        ...prevState,
        [dropdownId]: true,
      }));
    };
    
    const renderTabContent = (tabId: string) => {
      const tabData = tabsData.find(tab => tab.name.toLowerCase() === tabId);
      if (!tabData) return null;
      return (
        <div className="tab-content">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {tabId === 'frames' && (
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
                )}
          {tabData.groups.map((group: Group) => (
            <SimpleDropdown key={group.title} title={group.title}>
              <div className="type-dropdown-container">
                {group.subgroups.map((subgroup: Subgroup) => (
                  <TypeDropdown 
                    key={subgroup.title}
                    title={subgroup.title}
                    imageActive={subgroup.imageActive}
                    imagePassive={subgroup.imagePassive}
                    isOpen={openDropdown[subgroup.title] || false}
                    onOpen={() => handleOpenDropdown(subgroup.title)}
                    family={tabId}
                    group={group.title}
                    subgroup={subgroup.title}
                    onImageClick={handleButtonClick}
                    color1={color1}
                    color2={color2}
                    color3={color3}
                  />
                ))}
              </div>
            </SimpleDropdown>
          ))}
        </div>
      );
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
  }
  
  export default LeftPanel;