import { useState } from "react";
import * as Networker from "monorepo-networker";
import { NetworkMessages } from "@common/network/messages";

import ReactLogo from "@ui/assets/react.svg?component";
import viteLogo from "@ui/assets/vite.svg?inline";
import figmaLogo from "@ui/assets/figma.png";
import rawSvg from "@ui/assets/vite.svg?raw";

import { Button } from "@ui/components/Button";
import "@ui/styles/main.scss";
import LeftPanel from "@ui/components/LeftPanel";
import RightPanel from "@ui/components/RightPanel";
import CheckPage from "@ui/components/CheckPage";
import { increaseImageUsage, replaceInPath } from "@common/network/api";

function App() {
    const [activeTab, setActiveTab] = useState("frames");
    const [images, setImages] = useState<Array<{ thumb_path: string, file_path: string } | null>>(Array(9).fill(null));
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

    const handleImageClick = async (index: number) => {
        console.log("Function handleImageClick called with index:", index);
        const image = images[index];
        if (!image) {
            console.log("No image found at index", index);
            return;
        }
        console.log("Image at index", index, ":", image);
        if (image) {
            try {
                const arrayBuffer = await handleImageClickForJPG(image.file_path);
                const increasedCountDetail = replaceInPath(image.file_path, ".", "_thumb.")
                await increaseImageUsage(increasedCountDetail)
                NetworkMessages.ADD_IMAGE_TO_FIGMA.send({ image: arrayBuffer });
            } catch (error) {
                console.error('Ошибка при добавлении изображения в Figma:', error);
            }
        }
      };

    const addToRightPanel = (button: { thumb_path: string, file_path: string }) => {
        setImages(prevImages => {
            const newImages = [...prevImages];
            const index = newImages.findIndex(img => img === null);
            if (index !== -1) {
                newImages[index] = button;
            } else {
                newImages.shift();
                newImages.push(button);
            }
            return newImages;
        });
    };
    
    const [showCheckPage, setShowCheckPage] = useState(true);
    

    const handleCloseCheckPage = () => {
    // При закрытии компонента, скрываем его
    setShowCheckPage(false);
    };
        
    


    return (
        <div className="homepage">
            {showCheckPage && <CheckPage onClose={handleCloseCheckPage} />}
            {}

            <div className="card">
                {}
                
                <div className="panels-container">
                    <LeftPanel 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    addToRightPanel={addToRightPanel} 
                    images={images} 
                    handleImageClick={handleImageClick}

                    />
                    <RightPanel images={images} setImages={setImages} handleImageClick={handleImageClick}/>
                </div>

                {}

            </div>

            {}

        </div>
    );
}

export default App;

