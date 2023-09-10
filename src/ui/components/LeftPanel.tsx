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
    const [isSquareFrameSelected, setIsSquareFrameSelected] = useState(false);
    const [isHorizontalFrameSelected, setIsHorizontalFrameSelected] = useState(false);
    const [isVerticalFrameSelected, setIsVerticalFrameSelected] = useState(false);

    type SelectionChangeMessage = {
      pluginMessage: {
          type: 'SELECTION_CHANGE';
          data: {
              hasSquareFrames: boolean;
              hasHorizontalFrames: boolean;
              hasVerticalFrames: boolean;
          };
      };
  };

    // Подписываемся на изменения выделения при монтировании компонента
    useEffect(() => {
        const handleSelectionChange = (event: MessageEvent<SelectionChangeMessage>) => {
            const message = event.data.pluginMessage;

            if (message && message.type === 'SELECTION_CHANGE') {
                setIsSquareFrameSelected(message.data.hasSquareFrames);
                setIsHorizontalFrameSelected(message.data.hasHorizontalFrames);
                setIsVerticalFrameSelected(message.data.hasVerticalFrames);
            }
        };

        window.addEventListener("message", handleSelectionChange);

        return () => {
            window.removeEventListener("message", handleSelectionChange);
        };
    }, []);
  
  


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
  
    const convertToWidePath = (filePath: string): string => {
      // Извлекаем часть пути после /static/images/
      const subPath = filePath.split("/static/images/")[1];
      // Извлекаем subgroup из subPath
      const parts = subPath.split("/");
      const subgroup = parts[2];
      // Заменяем subgroup на subgroupWide
      const newSubgroup = `${subgroup}Wide`;
      
      // Формируем новое имя файла
      const fileName = parts[3];
      const newFileName = fileName.replace(subgroup, newSubgroup);
      
      // Формируем новый путь к файлу
      parts[2] = newSubgroup;
      parts[3] = newFileName;
  
      return `/static/images/${parts.join("/")}`;
  };
  
  
  

  const handleButtonClick = async (filePath: string) => {
    console.log("Button clicked:", filePath);
    try {
        const standardSVGString = await handleImageClick(filePath);
        const wideSVGPath = convertToWidePath(filePath);
        const wideSVGString = await handleImageClick(wideSVGPath); 

        // Отправка SVG в Figma. Мы передаем оба SVG: стандартный и широкий.
        NetworkMessages.ADD_BLACK_LAYER.send({ svgStandard: standardSVGString, svgWide: wideSVGString });
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
    
  //   const handleHorizontalMirror = () => {
  //     const nodes = figma.currentPage.selection;
  
  //     nodes.forEach(node => {
  //         if (node.type === "FRAME" && node.width > node.height) { // Горизонтальный фрейм
  //             const lastChild = node.children[node.children.length - 1];
  //             if (lastChild && "rotation" in lastChild) {
  //                 lastChild.rotation = (lastChild.rotation + 180) % 360;
  //             }
  //         }
  //     });
  // }
  
  // const handleVerticalMirror = () => {
  //     const nodes = figma.currentPage.selection;
  
  //     nodes.forEach(node => {
  //         if (node.type === "FRAME" && node.height > node.width) { // Вертикальный фрейм
  //             const lastChild = node.children[node.children.length - 1];
  //             if (lastChild && "rotation" in lastChild) {
  //                 lastChild.rotation = (lastChild.rotation + 180) % 360;
  //             }
  //         }
  //     });
  // }
  
  // const handleRotate = () => {
  //     const nodes = figma.currentPage.selection;
  
  //     nodes.forEach(node => {
  //         if (node.type === "FRAME" && node.width === node.height) { // Квадратный фрейм
  //             const lastChild = node.children[node.children.length - 1];
  //             if (lastChild && "rotation" in lastChild) {
  //                 lastChild.rotation = (lastChild.rotation + 90) % 360;
  //             }
  //         }
  //     });
  // }
  

    const handleHorizontalMirrorClick = () => {
        NetworkMessages.HORIZONTAL_MIRROR.send({});
        console.log('test handleHorizontalMirrorClick')
    };

    const handleVerticalMirrorClick = () => {
        NetworkMessages.VERTICAL_MIRROR.send({});
        console.log('test handleVerticalMirrorClick')
    };


    const handleRotateFrame = () => {
        NetworkMessages.ROTATE_FRAME.send({});
        console.log('test handleRotateFrame')
    }
    
    
    const renderTabContent = (tabId: string) => {
      const tabData = tabsData.find(tab => tab.name.toLowerCase() === tabId);
      if (!tabData) return null;
      return (
        <div className="tab-content">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {tabId === 'frames' && (
            <div className="pallette-figma-buttons-container">
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

                  <div className="icon-buttons-container">
                    <button 
                        id="horizontalMirrorBtn" 
                        className={`icon-button ${!isHorizontalFrameSelected ? 'disabled' : ''}`} 
                        onClick={isHorizontalFrameSelected ? handleHorizontalMirrorClick : undefined}
                    >
                        <svg width="20" height="21" fill="#F2F2F2">
                            <path d="M5.93664 8.61269V6L0 10.4999L5.93664 15V12.4588H17.0634V14.9999L23 10.4999L17.0634 6V8.61269H5.93664Z"/>
                        </svg>
                    </button>
                    <button 
                        id="verticalMirrorBtn" 
                        className={`icon-button ${!isVerticalFrameSelected ? 'disabled' : ''}`} 
                        onClick={isVerticalFrameSelected ? handleVerticalMirrorClick : undefined}
                    >
                        <svg width="20" height="21" fill="#F2F2F2">
                            <path d="M8.61269 17.0634L6 17.0634L10.4999 23L15 17.0634L12.4588 17.0634L12.4588 5.93665L14.9999 5.93665L10.4999 -1.96699e-07L6 5.93665L8.61269 5.93665L8.61269 17.0634Z"/>
                        </svg>
                    </button>
                    <button 
                        id="rotateFrameBtn" 
                        className={`icon-button ${!isSquareFrameSelected ? 'disabled' : ''}`} 
                        onClick={isSquareFrameSelected ? handleRotateFrame : undefined}
                    >
                        <svg width="20" height="21" fill="#F2F2F2">
                            <path d="M10.5 21C15.7383 21 20 16.8025 20 11.6432C20 6.70994 16.1037 2.65673 11.1829 2.31071V0L5.21144 3.97984L11.1829 7.95976V5.71232C14.2046 6.04773 16.5611 8.57888 16.5611 11.6432C16.5611 14.9349 13.8421 17.6129 10.5001 17.6129C7.15808 17.6129 4.43904 14.9348 4.43904 11.6432C4.43904 10.3579 4.84703 9.13385 5.6188 8.10351L2.85148 6.09257C1.64027 7.70957 1 9.62889 1 11.6432C1 16.8025 5.26169 21 10.5 21Z"/>
                        </svg>
                    </button>
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