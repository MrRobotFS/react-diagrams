import React, { useState } from "react";
import { PortWidget } from "@projectstorm/react-diagrams-core";
import { FaTimes } from "react-icons/fa";

import "./my-node-widget.css";

const nodeIcons = {
  LEX: "https://stelligent.com/wp-content/uploads/2017/11/AI_AmazonLex_LARGE-1.png",
  HASH_AUDIT: "https://static-00.iconduck.com/assets.00/aws-icon-2048x2048-ptyrjxdo.png",
  LAMBDA: "https://seeklogo.com/images/A/aws-lambda-logo-AE95CFC218-seeklogo.com.png",
};

export const MyNodeWidget = props => {
  const [isSelected, setIsSelected] = useState(false);

  const handleNodeClick = () => {
    setIsSelected(!isSelected);
  };

  const handleDeleteClick = e => {
    e.stopPropagation();
    props.node.remove();
  };

  return (
    <div className={`my-node ${isSelected ? "selected" : ""}`} onClick={handleNodeClick} style={isSelected ? { backgroundColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 5px #00f', position: 'relative' } : { position: 'relative' }}>
      {isSelected && (
        <button className="delete-button" onClick={handleDeleteClick} style={{ color: 'white', borderRadius: '50%', backgroundColor: 'red', border: '2px solid red', position: 'absolute', top: '-10px', right: '-10px', width: '18px', height: '18px', zIndex: 1000, padding: '0', fontSize: '12px' }}>
          <FaTimes />
        </button>
      )}
      <div
        className="my-node-header-container"
        style={{ backgroundColor: props.node.color, display: 'flex', justifyContent: 'center' }}
      >
        <div className="my-node-header-text">{props.node.name}</div>
      </div>

      <img
        src={nodeIcons[props.node.nodeType] || "fallback-image-url"}
        alt={props.node.name}
        width="60"
        height="60"
        draggable="false"
      />

      <PortWidget
        className="port-container left-port"
        engine={props.engine}
        port={props.node.getPort("in")}
      >
        <div className="my-port">
          <svg className="arrowhead" viewBox="0 0 20 20">
            <path d="M0 0 L20 10 L0 20 L5 10 Z"></path>
          </svg>
        </div>

      </PortWidget>



      <PortWidget
        className="port-container right-port"
        engine={props.engine}
        port={props.node.getPort("out")}
      >
        <div className="my-port" />
      </PortWidget>
    </div>
  );
};
