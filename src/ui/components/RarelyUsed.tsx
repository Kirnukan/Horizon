import React, { useState, useEffect } from 'react';

// Импортируем функцию API для получения наименее используемых изображений
import { getLeastUsedImagesByFamily } from '../../common/network/api';

interface ButtonData {
  thumb_path: string;
  file_path: string;
}

interface RarelyUsedProps {
  tabId: string;
  selectedColor: string;
  onFrameClick?: (filePath: string, color1: string, color2: string, color3: string) => void;
  onDetailClick?: (filePath: string) => void;
  onEffectClick?: (filePath: string) => void;
  onTextureClick?: (filePath: string, selectedColor: string) => void;
  color1?: string;
  color2?: string;
  color3?: string;
}

const RarelyUsed: React.FC<RarelyUsedProps> = ({
  tabId,
  selectedColor,
  onFrameClick,
  onDetailClick,
  onEffectClick,
  onTextureClick,
  color1,
  color2,
  color3
}) => {
  const [rarelyUsedImages, setRarelyUsedImages] = useState<ButtonData[]>([]);

  useEffect(() => {
    const fetchRarelyUsedImages = async () => {
      try {
        const images = await getLeastUsedImagesByFamily(tabId);
        setRarelyUsedImages(images);
      } catch (error) {
        console.error('Failed to fetch rarely used images:', error);
      }
    };

    fetchRarelyUsedImages();
  }, [tabId]); // Зависимость от tabId обеспечивает обновление при смене вкладки
  
  // Функция для выбора обработчика нажатия кнопки на основе tabId
  const getClickHandler = (file_path: string) => {
    switch (tabId) {
      case 'frames':
        return () => {
          if (onFrameClick) {
            return onFrameClick(file_path, color1!, color2!, color3!); // '!' используется для утверждения, что значения определены
          }
        }
      case 'details':
        return () => {
          if (onDetailClick) {
            return onDetailClick(file_path);
          }
        }
      case 'effects':
        return () => {
          if (onEffectClick) {
            return onEffectClick(file_path);
          }
        }
      case 'textures':
        // Здесь вы должны определить, какие данные передать
        // Например: selectedColor и selectedTexture
        return () => {
          if(onTextureClick){
            onTextureClick(file_path, selectedColor);
          }
        }
      default:
        return undefined;
    }
  };

  return (
    <div className="rarely-used-container">
      <div className="rarely-used-header">Rarely used</div>
        <div className="buttons">
        {rarelyUsedImages.map((button, index) => (
          <button
            key={index}
            className="dropdown-button"
            style={{
              backgroundImage: `url(${button.thumb_path})`,
              // Добавить изменение цвета для вкладки 'frames'
              // backgroundColor: tabId === 'frames' ? someColorFunction(index) : 'initial'
            }}
            onClick={(event) => {
              event.stopPropagation();
              const clickHandler = getClickHandler(button.file_path);
              if (clickHandler) {
                clickHandler();
              }
            }}
          >
            <img src={button.thumb_path} alt="Image preview" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RarelyUsed;
