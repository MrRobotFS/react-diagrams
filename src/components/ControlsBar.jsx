import React from "react";
import "./controls-bar.css"
import { FaTimes } from "react-icons/fa";


const ControlsBar = ({ onDelete }) => {
  return (
    <div className="controls-bar">
      <button className="trash-button" onClick={onDelete}>
        <FaTimes />
      </button>

    </div>
  );
};


export default ControlsBar;