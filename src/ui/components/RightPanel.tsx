import React from "react";

const RightPanel: React.FC = () => (
    <div className="right-panel">
        <div className="elements">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="element" />
            ))}
            <div className="button" />
            <div className="button" />
            <div className="button big-button" />
        </div>
    </div>
);

export default RightPanel;
