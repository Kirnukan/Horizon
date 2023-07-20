import React from "react";

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
                {tabs.map((tab) => (
                    <div className={`tab-content ${activeTab === tab ? 'active' : ''}`} id={`${tab}-content`}>
                        {/* Содержимое каждой вкладки */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftPanel;
