import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { NetworkMessages } from "@common/network/messages";
import svgs from '@ui/utils/forms.util';
import TypeDropdown from "./TypeDropdown";
import SimpleDropdown from "./Dropdown";
import groupsUtil from "@ui/utils/groups.util";
import { getImageByFilePath, getLeastUsedImagesByFamily, increaseImageUsage, removeUntilStatic, replaceInPath, searchImagesByKeywordAndFamily } from "@common/network/api";
import { tabsData, Tab, Group, Subgroup } from "@ui/utils/dataStructure"; 
import DetailsDropdown from "./DetailsDropdown";
import TexturesDropdown from "./TexturesDropdown";
import EffectsDropdown from "./EffectsDropdown";
import RarelyUsed from "./RarelyUsed";



  interface TabProps {
    id: string;
    isActive: boolean;
    onClick: () => void;
    retrieveImageByPath: (filePath: string) => Promise<string>;
  }

  const Tab: React.FC<TabProps> = ({ id, isActive, onClick }) => (
    <button className={`tab ${isActive ? 'active' : ''}`} id={id} onClick={onClick}>
      {id.charAt(0).toUpperCase() + id.slice(1)}
    </button>
  );



  interface LeftPanelProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    addToRightPanel: (button: { thumb_path: string; file_path: string; }) => void;
    images: Array<{ thumb_path: string, file_path: string } | null>;
    handleImageClick: (index: number) => void;
  }

  interface OpenDropdowns {
    [key: string]: boolean; // This is an index signature
  }
  



  const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, onTabChange, addToRightPanel, images, handleImageClick}) => {
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
    // const [colors, setColors] = useState(["#0A64AD", "#FFFFFF", "#059DF5"]);
    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [color1, setColor1] = useState("#000000");
    const [color2, setColor2] = useState("#FFFFFF");
    const [color3, setColor3] = useState("#D4440B");
    const [currentSVG, setCurrentSVG] = useState<string | null>(null);
    const [lastAddedImage, setLastAddedImage] = useState<{ thumb_path: string, file_path: string } | null>(null);
    const [opacity, setOpacity] = useState(50);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<ButtonData[]>([]);
    const [tabId, setTabId] = useState<string>('frames');
    const [notification, setNotification] = useState('');
    const [rarelyUsedImages, setRarelyUsedImages] = useState<ButtonData[]>([]);
    const [lastSearchTabId, setLastSearchTabId] = useState('');


    // useEffect(() => {
    //   const fetchRarelyUsedImages = async (idTab:string) => {
    //     try {
    //       const images = await getLeastUsedImagesByFamily(idTab); // предполагая, что tabId - это текущее семейство
    //         setRarelyUsedImages(images);
    //     } catch (error) {
    //       console.error('Failed to fetch rarely used images:', error);
    //     }
    //   };
      
    //   fetchRarelyUsedImages(tabId);
    // }, [tabId]); 
    interface ButtonData {
      thumb_path: string;
      file_path: string;
    }
  
    const handleSearch = async (keyword: string, idTab: string) => {
      try {
          // Проверка на пустую строку или строку, состоящую только из пробелов
          if (!keyword || !keyword.trim()) {
              setSearchResults([])
              setNotification('Введите название');
              return;  // Выйти из функции, если ключевое слово невалидно
          }

          const results = await searchImagesByKeywordAndFamily(keyword, idTab);
          console.log('results', results);
          if (results && results.length > 0) {
              setSearchResults(results);
              setLastSearchTabId(idTab);
              setNotification('');  // Очистить уведомление, если были найдены результаты
          } else {
              
              setNotification('Ничего не найдено');
          }
      } catch (error) {
          setSearchResults([])
          console.error('Error searching for images:', error);
      }
  };

  const SearchBar: React.FC<{ searchTerm: string, setSearchTerm: (term: string) => void, tabId: string}> = ({ searchTerm, setSearchTerm, tabId }) => {
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
          inputRef.current.focus();
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('handlesearch ',searchTerm, tabId);
                handleSearch(searchTerm, tabId)
            }
          }}


          
        />

        <svg className="search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.8175 10.9301L8.85934 7.95969C9.61995 7.08675 10.0367 5.98841 10.0367 4.845C10.0367 2.17351 7.78542 0 5.01834 0C2.25127 0 0 2.17351 0 4.845C0 7.51648 2.25127 9.68999 5.01834 9.68999C6.05714 9.68999 7.04707 9.38749 7.89342 8.81326L10.8741 11.8062C10.9987 11.9311 11.1663 12 11.3458 12C11.5158 12 11.677 11.9374 11.7994 11.8237C12.0595 11.5821 12.0678 11.1814 11.8175 10.9301ZM5.01834 1.26391C7.06365 1.26391 8.72756 2.87034 8.72756 4.845C8.72756 6.81965 7.06365 8.42608 5.01834 8.42608C2.97304 8.42608 1.30913 6.81965 1.30913 4.845C1.30913 2.87034 2.97304 1.26391 5.01834 1.26391Z" fill="#C3CCE6"/>
        </svg>
      </div>
    );
  }


    const adjustColorValue = (colorValue: number): number => {
      if (colorValue < 128) {
        return colorValue + 4;
      } else {
        return colorValue - 4;
      }
    };
    
    const adjustColor = (color: string): string => {
      // Преобразование hex в rgb
      const bigint = parseInt(color.slice(1), 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
    
      // Небольшое изменение цвета
      r = adjustColorValue(r);
      g = adjustColorValue(g);
      b = adjustColorValue(b);
    
      // Преобразование обратно в hex и возврат
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const onColorChange = (
      setColorFunc: React.Dispatch<React.SetStateAction<string>>, 
      newColor: string, 
      ...otherColors: string[]
  ): void => {
      let adjustedColor = newColor;
      
      // Проверка, совпадает ли новый цвет с другими цветами
      while (otherColors.includes(adjustedColor)) {
          // Если совпадает, немного измените его
          adjustedColor = adjustColor(adjustedColor);
      }
  
      // Устанавливаем новый цвет
      setColorFunc(adjustedColor);
  };
  
  
  
    

    const [selectedTextures, setSelectedTextures] = useState<Record<string, string | null>>(
      [color1, color2, color3].reduce((acc, color) => ({ ...acc, [color]: null }), {})
    );
    


    const retrieveImageByPath = async (filePath: string): Promise<string> => {
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
  
    const handleImageClickForJPG = async (filePath: string): Promise<ArrayBuffer> => {
      try {
          const response = await fetch(filePath);
          console.log('Response - ',response)
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const arrayBuffer = await response.arrayBuffer();
          console.log(arrayBuffer)
          return arrayBuffer;
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
  
  
  

//   const handleButtonClick = async (filePath: string) => {
//     console.log("Button clicked:", filePath);
//     try {
//         let standardSVGString = await handleImageClick(filePath);
//         standardSVGString = updateSVGColors(standardSVGString);  // Обновляем цвета в стандартном SVG
        
//         const wideSVGPath = convertToWidePath(filePath);
//         let wideSVGString = await handleImageClick(wideSVGPath);
//         wideSVGString = updateSVGColors(wideSVGString);  // Обновляем цвета в широком SVG

//         // Отправка SVG в Figma. Мы передаем оба SVG: стандартный и широкий.
//         NetworkMessages.ADD_BLACK_LAYER.send({ svgStandard: standardSVGString, svgWide: wideSVGString });
//     } catch (error) {
//         console.error('Ошибка при отправке SVG в Figma:', error);
//     }
// };


const handleFrameButtonClick = async (filePath: string) => {
  console.log("Button clicked:", filePath);
  try {
      let standardSVGString = await retrieveImageByPath(filePath);
      standardSVGString = updateSVGColors(standardSVGString);  // Обновляем цвета в стандартном SVG
      
      const wideSVGPath = convertToWidePath(filePath);
      let wideSVGString = await retrieveImageByPath(wideSVGPath);
      wideSVGString = updateSVGColors(wideSVGString);  // Обновляем цвета в широком SVG

      // Отправка SVG в Figma. Мы передаем оба SVG: стандартный и широкий.
      await increaseImageUsage(filePath)
      NetworkMessages.ADD_BLACK_LAYER.send({ svgStandard: standardSVGString, svgWide: wideSVGString });
  } catch (error) {
      console.error('Ошибка при отправке SVG в Figma:', error);
  }
};


const handleDetailButtonClick = async (filePath: string, event: React.MouseEvent<HTMLButtonElement>) => {
  if (event.type === 'click') { // Левый клик
    console.log("Left click:", filePath);
    try {
      const arrayBuffer = await handleImageClickForJPG(filePath);
      const increasedCountDetail = replaceInPath(filePath, ".", "_thumb.");
      await increaseImageUsage(increasedCountDetail);
      NetworkMessages.ADD_IMAGE_TO_FIGMA.send({ image: arrayBuffer });
    } catch (error) {
      console.error("An error occurred while handling the image click for JPG:", error);
    }
  } else if (event.type === 'contextmenu') { // Правый клик
    event.preventDefault(); // Отменяем стандартное контекстное меню
    console.log("Right click:", filePath);
    // Здесь разместите логику для обработки правого клика
    const newImage = { thumb_path: filePath, file_path: filePath };
    addToRightPanel(newImage);
  }
};


const handleEffectsButtonClick = async (filePath: string) => {
  console.log("Button clicked:", filePath);
  try {
    const arrayBuffer = await handleImageClickForJPG(filePath);
    const increasedCountEffect = replaceInPath(filePath, ".", "_thumb.")

    increaseImageUsage(increasedCountEffect)
    NetworkMessages.ADD_EFFECT_TO_FIGMA.send({ image: arrayBuffer });
  } catch (error) {
    console.error('Ошибка при добавлении текстуры в Figma:', error);
  }
};

useEffect(() => {
  const sendImageToFigma = async (image: { thumb_path: string, file_path: string }) => {
    try {
      // const arrayBuffer = await handleImageClickForJPG(image.file_path);
      // NetworkMessages.ADD_IMAGE_TO_FIGMA.send({ image: arrayBuffer });
    } catch (error) {
      console.error('Ошибка при добавлении изображения в Figma:', error);
    }
  };

  // Проверяем, есть ли новое изображение, которое еще не было отправлено в Figma
  if (lastAddedImage) {
    sendImageToFigma(lastAddedImage);
  }
}, [images, lastAddedImage]);






  

const updateSVGColors = (svgString: string): string => {
  return svgString
      .replace(/#FF5500/g, color1)
      .replace(/#FFFFFF/g, color2)
      .replace(/white/g, color2)
      .replace(/#9A2500/g, color3);
};




  useEffect(() => {
      if (currentSVG) {
          updateSVGColors(currentSVG);
      }
  }, [color1, color2, color3]);
const handleOpenDropdown = (dropdownId: string) => {
  setOpenDropdown(prevState => {
    // Now TypeScript knows that prevState has a string index signature
    const newState: OpenDropdowns = {}; // Initialize with the correct type

    // Set all dropdowns to false
    Object.keys(prevState).forEach(key => {
      newState[key] = false;
    });

    // Toggle the clicked dropdown
    newState[dropdownId] = !prevState[dropdownId];

    return newState;
  });
};


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


    const handleButtonClick = (index: number) => {
      setActiveButton(index);
    }
    
    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOpacity = Number(e.target.value);
      setOpacity(newOpacity);
      parent.postMessage({pluginMessage: {type: 'change-opacity', opacity: newOpacity}}, '*');
    };
    
    const renderTabContent = (tabId: string) => {
      const tabData = tabsData.find(tab => tab.name.toLowerCase() === tabId);
      if (!tabData) return null;
    const renderFramesContent = () => (
              <div className="pallette-figma-buttons-container">
                  <div className="pallete">
                    Colors
                    <div className="pallete-colors">
                      <input
                          className="pallete-button"
                          type="color"
                          value={color1}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => onColorChange(setColor1, e.target.value, color2, color3)} 
                      />
                      <input
                          className="pallete-button"
                          type="color"
                          value={color2}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => onColorChange(setColor2, e.target.value, color1, color3)} 
                      />
                      <input
                          className="pallete-button"
                          type="color"
                          value={color3}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => onColorChange(setColor3, e.target.value, color1, color2)} 
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
    );

    const renderDetailsContent = () => (
        <div>
            {/* TODO: Добавьте ваш контент для вкладки "Details" */}
        </div>
    );

const renderTexturesContent = () => (
    <div>
        {/* Ячейки цветов */}
        <div className="color-container">
          <div 
            className={`color-button ${activeButton === 0 ? 'active' : ''}`} 
            style={{ backgroundColor: color1 }}
            onClick={() => handleButtonClick(0)}
          ></div>

          <div 
            className={`color-button ${activeButton === 1 ? 'active' : ''}`} 
            style={{ backgroundColor: color2 }}
            onClick={() => handleButtonClick(1)}
          ></div>

          <div 
            className={`color-button ${activeButton === 2 ? 'active' : ''}`} 
            style={{ backgroundColor: color3 }}
            onClick={() => handleButtonClick(2)}
          ></div>
        </div>


        {/* Ползунок прозрачности */}
        <div className="opacity-slider-container">
            <input
                className="opacity-slider"
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={handleOpacityChange}
                style={{ "--slider-value": `${opacity}%` } as React.CSSProperties}
            />
            <span className="opacity-label">Opacity</span>
            <span className="opacity-value">{opacity}%</span>
        </div>

        {/* Ваш код для остального содержимого */}
    </div>
);

const determineSubgroupForColor = (color: string): string => {
  switch (color.toLowerCase()) {
    case '#ffffff':
      return "White";
    case '#000000':
      return "Black";
    default:
      return "Color";
  }
};

const replaceSubgroupInPath = (path: string, color: string): string => {
  const subgroup = determineSubgroupForColor(color);
  return path.replace("/Color/", `/${subgroup}/`).replace("_Color_", `_${subgroup}_`);
};



const handleTextureButtonClick = async (texturePath: string, color: string) => {
  if (activeButton === null) {
    console.log("Please select a color first!");
    return;
  }
  console.log("Texture button clicked:", texturePath, color);

  // Определение подгруппы на основе цвета
  // const subgroup = determineSubgroupForColor(color);

  // Меняем подгруппу в пути файла и в его названии
  const newTexturePath = replaceSubgroupInPath(texturePath, color);
  const increasedCountTexture = replaceInPath(newTexturePath, ".", "_thumb.")

  try {
    const arrayBuffer = await handleImageClickForJPG(newTexturePath);
    increaseImageUsage(increasedCountTexture)
    NetworkMessages.ADD_TEXTURE_TO_FIGMA.send({ image: arrayBuffer, color, opacity });

    // Обновление состояния, если это необходимо
    setSelectedTextures(prev => {
      if (prev[color] === newTexturePath) {
        return { ...prev, [color]: null };
      } else {
        return { ...prev, [color]: newTexturePath };
      }
    });
  } catch (error) {
    console.error('Ошибка при добавлении текстуры в Figma:', error);
  }
};



const getClickHandler = (button: ButtonData, tabId: string) => {
  switch (tabId) {
    case 'frames':
      return () => handleFrameButtonClick(button.file_path);
    case 'details':
      return (event: React.MouseEvent<HTMLButtonElement>) => handleDetailButtonClick(button.file_path, event);
    case 'textures':
      return () => handleTextureButtonClick(button.file_path, activeButton === 0 ? color1 :
        activeButton === 1 ? color2 :
        color3);
    case 'effects':
      return () => handleEffectsButtonClick(button.file_path);
    default:
      return () => undefined;
  }
};



    const renderEffectsContent = () => (
        <div>
            {/* TODO: Добавьте ваш контент для вкладки "Effects" */}
        </div>
    );
    return (
      <div className="tab-content">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} tabId={tabId} />

        

        {searchResults.length > 0 ? (
          <>
            <div className="buttons buttons-search">
                {searchResults.map((button, index) => (
                  <button
                  key={index}
                  className={`dropdown-button dropdown-button-search`}
                  // style={{ backgroundImage: `url(${button.thumb_path})` }}
                  onClick={(event) => {
                    event.stopPropagation();
                    const clickHandler = getClickHandler(button, lastSearchTabId);
                    clickHandler(event); // Вызываем обработчик клика для данной кнопки
                  }}
                >
                  <img className={`dropdown-button-search-image`} src={button.thumb_path} alt="Image Preview" />
                </button>
                ))}
            </div>
                {tabId === 'frames' && renderFramesContent()}
                {tabId === 'details' && renderDetailsContent()}
                {tabId === 'textures' && renderTexturesContent()}
                {tabId === 'effects' && renderEffectsContent()}
            </>
        ) : (
            <>
                {tabId === 'frames' && renderFramesContent()}
                {tabId === 'details' && renderDetailsContent()}
                {tabId === 'textures' && renderTexturesContent()}
                {tabId === 'effects' && renderEffectsContent()}
            </>
        )}
        <RarelyUsed
  tabId={tabId}
  selectedColor={
    activeButton === 0 ? color1 :
    activeButton === 1 ? color2 :
    color3
  }
  onFrameClick={handleFrameButtonClick}
  onDetailClick={(filePath, event) => handleDetailButtonClick(filePath, event)}
  onEffectClick={handleEffectsButtonClick}
  onTextureClick={handleTextureButtonClick}
  color1={color1}
  color2={color2}
  color3={color3}
/>


  <div className="dropdowns-list">
        {tabData.groups.map((group: Group) => (
          
          <SimpleDropdown key={group.title} title={group.title}>
            <div className="type-dropdown-container">
              {group.subgroups.map((subgroup: Subgroup) => (
                tabId === 'frames' ? (
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
                    onImageClick={handleFrameButtonClick}
                    color1={color1}
                    color2={color2}
                    color3={color3}
                  />
              ) : tabId === 'details' ? (
                  <DetailsDropdown 
                    key={subgroup.title}
                    title={subgroup.title}
                    imageActive={subgroup.imageActive}
                    imagePassive={subgroup.imagePassive}
                    isOpen={openDropdown[subgroup.title] || false}
                    onOpen={() => handleOpenDropdown(subgroup.title)}
                    family={tabId}
                    group={group.title}
                    subgroup={subgroup.title}
                    onImageClick={(filePath, event) => handleDetailButtonClick(filePath, event)}
                    onAddToRightPanel={(button) => {
                      addToRightPanel(button);
                    }}

                    />
                  
              ) : tabId === 'effects' ? ( 
                  <EffectsDropdown 
                    key={subgroup.title}
                    title={subgroup.title}
                    imageActive={subgroup.imageActive}
                    imagePassive={subgroup.imagePassive}
                    isOpen={openDropdown[subgroup.title] || false}
                    onOpen={() => handleOpenDropdown(subgroup.title)}
                    family={tabId}
                    group={group.title}
                    subgroup={subgroup.title}
                    onImageEffectClick={handleEffectsButtonClick}
                  />
              ) : tabId === 'textures' ? (
                  <TexturesDropdown 
                      key={subgroup.title}
                      title={subgroup.title}
                      imageActive={subgroup.imageActive}
                      imagePassive={subgroup.imagePassive}
                      isOpen={openDropdown[subgroup.title] || false}
                      onOpen={() => handleOpenDropdown(subgroup.title)}
                      family={tabId}
                      group={group.title}
                      subgroup={subgroup.title}
                      selectedColor={
                        activeButton === 0 ? color1 :
                        activeButton === 1 ? color2 :
                        color3
                      }
                      selectedTexture={selectedTextures[activeButton === 0 ? color1 : activeButton === 1 ? color2 : color3]}
                      onTextureClick={handleTextureButtonClick}
                  />
              ) : null
              ))}
            </div>
          </SimpleDropdown>
          
        ))}
        </div>
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
              retrieveImageByPath={retrieveImageByPath}
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