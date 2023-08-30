import React from "react";

export const ControlsBar = ({ onDelete }) => {
  return (
    <div className="controls-bar">
      <button className="trash-button" onClick={onDelete}>
        🗑
      </button>
    </div>
  );
};
