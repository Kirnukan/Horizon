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
                // console.log('image.file_path',increasedCountDetail)
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
    
    
    
    
    
    

    // ... остальной код ...

    return (
        <div className="homepage">

            {/* ... остальной код ... */}

            <div className="card">
                {/* ... остальной код ... */}

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

                {/* ... остальной код ... */}

            </div>

            {/* ... остальной код ... */}

        </div>
    );
}

export default App;

// function App() {
//   const [count, setCount] = useState(0);
//
//   return (
//     <div className="homepage">
//
//       <div>
//         <a href="https://www.figma.com" target="_blank">
//           <img src={figmaLogo} className="logo figma" alt="Figma logo" />
//         </a>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo vite" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <ReactLogo className="logo react" title="React logo" />
//         </a>
//       </div>
//
//       <h1>Figma + Vite + React</h1>
//
//       <div className="card">
//         <Button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </Button>
//         <Button
//           onClick={async () => {
//             const response = await NetworkMessages.PING.request({});
//             console.log("Response:", response);
//           }}
//           style={{ marginInlineStart: 10 }}
//         >
//           ping the other side
//         </Button>
//         <Button
//           onClick={() =>
//             NetworkMessages.CREATE_RECT.send({
//               width: 100,
//               height: 100,
//             })
//           }
//           style={{ marginInlineStart: 10 }}
//         >
//           create square
//         </Button>
//           <Button
//             onClick={() =>
//                 NetworkMessages.ADD_BLACK_LAYER.send({ color: { r: 0, b: 0, g: 0 }, svg: rawSvg })
//           }
//             style={{marginInlineStart:  10}}
//           >
//               Add black layer
//           </Button>
//         <p>
//           Edit <code>src/app.tsx</code> and save to test HMR
//         </p>
//       </div>
//
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more <br />
//         <span>(Current logical side = {Networker.Side.current.getName()})</span>
//       </p>
//     </div>
//   );
// }
//
// export default App;
