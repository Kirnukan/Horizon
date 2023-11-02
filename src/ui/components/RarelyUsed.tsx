import React, { useState, useEffect } from 'react';

// Импортируем функцию API для получения наименее используемых изображений
import { getLeastUsedImagesByFamily } from '../../common/network/api';

interface ButtonData {
  thumb_path: string;
  file_path: string;
}

interface RarelyUsedProps {
  tabId: string;
}

const RarelyUsed: React.FC<RarelyUsedProps> = ({ tabId }) => {
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

  return (
    <div className="rarely-used-container">
      <div className="rarely-used-header">Rarely used</div>
      <div className="buttons">
        {rarelyUsedImages.map((button, index) => (
          <button
            key={index}
            className="dropdown-button"
            style={{ backgroundImage: `url(${button.thumb_path})` }}
            onClick={(event) => {
              event.stopPropagation();
              // Обработка нажатия на изображение
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
