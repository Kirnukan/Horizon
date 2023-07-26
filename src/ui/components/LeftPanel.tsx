// import React from "react";
// import { Button } from "./Button";
// import { NetworkMessages } from "@common/network/messages";
// import rawSvg from "@ui/assets/vite.svg?raw";
// interface TabProps {
//     id: string;
//     isActive: boolean;
//     onClick: () => void;
// }

// const Tab: React.FC<TabProps> = ({ id, isActive, onClick }) => (
//     <button className={`tab ${isActive ? 'active' : ''}`} id={id} onClick={onClick}>
//         {id.charAt(0).toUpperCase() + id.slice(1)}
//     </button>
// );

// interface LeftPanelProps {
//     activeTab: string;
//     onTabChange: (tabId: string) => void;
// }

// const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, onTabChange }) => {
//     const tabs = ["frames", "textures", "details", "effects"];

//     return (
//         <div className="left-panel">
//             <div className="tabs">
//                 {tabs.map((tab) => (
//                     <Tab
//                         key={tab}
//                         id={tab}
//                         isActive={activeTab === tab}
//                         onClick={() => onTabChange(tab)}
//                     />
//                 ))}
//             </div>

//             <div className="tabs-content">
//                 {tabs.map((tab) => (
//                     <div className={`tab-content ${activeTab === tab ? 'active' : ''}`} id={`${tab}-content`}>
//                         {/* Содержимое каждой вкладки */}
                        
//                         <Button
//                             onClick={() =>
//                                 NetworkMessages.ADD_BLACK_LAYER.send({ color: { r: 0, b: 0, g: 0 }, svg: rawSvg })
//                         }
//                             style={{marginInlineStart:  10}}
//                         >
//                             Add black layer
//                         </Button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default LeftPanel;
// import React, { useState } from "react";
// import { Button } from "./Button";
// import { NetworkMessages } from "@common/network/messages";
// import rawSvg from "@ui/assets/vite.svg?raw";

// interface TabProps {
//   id: string;
//   isActive: boolean;
//   onClick: () => void;
// }

// const Tab: React.FC<TabProps> = ({ id, isActive, onClick }) => (
//   <button className={`tab ${isActive ? 'active' : ''}`} id={id} onClick={onClick}>
//     {id.charAt(0).toUpperCase() + id.slice(1)}
//   </button>
// );

// interface LeftPanelProps {
//   activeTab: string;
//   onTabChange: (tabId: string) => void;
// }

// const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, onTabChange }) => {
//   const tabs = ["frames", "textures", "details", "effects"];
//   const [color1, setColor1] = useState("#000000");
//   const [color2, setColor2] = useState("#000000");
//   const [color3, setColor3] = useState("#000000");
//   const renderTabContent = (tabId: string) => {
//     switch (tabId) {
//       case 'frames':
//         return (
//           <div className="tab-content">
//             {/* Содержимое для вкладки 'frames' */}
//             <Button
//               onClick={() =>
//                 NetworkMessages.ADD_BLACK_LAYER.send({ /*color: { r: 0, b: 0, g: 0 },*/ svg: rawSvg })
//               }
//               style={{ marginInlineStart: 10 }}
//             >
//               Add image
//             </Button>
//           </div>
//         );

//       case 'textures':
//         return (
//           <div className="tab-content">
//             {/* Содержимое для вкладки 'textures' */}
//             2
//           </div>
//         );

//       case 'details':
//         return (
//           <div className="tab-content">
//             {/* Содержимое для вкладки 'details' */}
//             3
//           </div>
//         );

//       case 'effects':
//         return (
//           <div className="tab-content">
//             {/* Содержимое для вкладки 'effects' */}
//             4
//           </div>
//         );

//       default:
//         return null;
//     }
//   }

//   return (
//     <div className="left-panel">
//       <div className="tabs">
//         {tabs.map((tab) => (
//           <Tab
//             key={tab}
//             id={tab}
//             isActive={activeTab === tab}
//             onClick={() => onTabChange(tab)}
//           />
//         ))}
//       </div>

//       <div className="tabs-content">
//         {renderTabContent(activeTab)}
//       </div>
//     </div>
//   );
// };

// export default LeftPanel;
import React, { useState } from "react";
import { Button } from "./Button";
import { NetworkMessages } from "@common/network/messages";
import rawSvg from "@ui/assets/Biblio/Simple/type-1_1.svg?raw";
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
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#000000");
  const [color3, setColor3] = useState("#000000");
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
const svgString = rawSvg
  .replace(/#FF5500/g, color1)
  .replace(/#FFFFFF/g, color2).replace(/white/g, color2)
  .replace(/#9A2500/g, color3);
  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'frames':
        return (
          <div className="tab-content">
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
                    buttons={[{ svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) },
                              { svg: svgString, onClick: () => handleButtonClick(svgString) }]}
                  />
                  <TypeDropdown 
                    title="Image 2" 
                    imageActive={groupsUtil.imageActive2}
                    imagePassive={groupsUtil.imagePassive2}
                    buttons={[{ svg: svgString, onClick: () => handleButtonClick(svgString) }]}
                  />
                  <TypeDropdown 
                    title="Image 3" 
                    imageActive={groupsUtil.imageActive3}
                    imagePassive={groupsUtil.imagePassive3}
                    buttons={[{ svg: svgString, onClick: () => handleButtonClick(svgString) }]}
                  />
                  <TypeDropdown 
                    title="Image 4" 
                    imageActive={groupsUtil.imageActive4}
                    imagePassive={groupsUtil.imagePassive4}
                    buttons={[{ svg: svgString, onClick: () => handleButtonClick(svgString) }]}
                  />
                  <TypeDropdown 
                    title="Image 5" 
                    imageActive={groupsUtil.imageActive5}
                    imagePassive={groupsUtil.imagePassive5}
                    buttons={[{ svg: svgString, onClick: () => handleButtonClick(svgString) }]}
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
            {/* Содержимое для вкладки 'textures' */}
            2
          </div>
        );

      case 'details':
        return (
          <div className="tab-content">
            {/* Содержимое для вкладки 'details' */}
            3
          </div>
        );

      case 'effects':
        return (
          <div className="tab-content">
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
