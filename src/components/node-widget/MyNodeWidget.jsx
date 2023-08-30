import React, { useState } from "react";
import { PortWidget } from "@projectstorm/react-diagrams-core";
import { FaTimes } from "react-icons/fa";
import { ControlsBar } from "../ControlsBar"; // Ajusta la ruta según tu estructura de archivos

const nodeIcons = {
  LEX: "https://stelligent.com/wp-content/uploads/2017/11/AI_AmazonLex_LARGE-1.png",
  HASH_AUDIT: "https://static-00.iconduck.com/assets.00/aws-icon-2048x2048-ptyrjxdo.png",
  LAMBDA: "https://seeklogo.com/images/A/aws-lambda-logo-AE95CFC218-seeklogo.com.png",
  // Add more node types here as needed...
};

export const MyNodeWidget = props => {
  const [isSelected, setIsSelected] = useState(false);

  const handleNodeClick = () => {
    setIsSelected(!isSelected);
  };

  const handleDeleteClick = e => {
    e.stopPropagation(); // Evitar que el clic se propague al nodo y lo seleccione nuevamente
    props.node.remove();
  };

  return (
    <div className={`my-node ${isSelected ? "selected" : ""}`} onClick={handleNodeClick}>
      <div
        className="my-node-header-container"
        style={{ backgroundColor: props.node.color }}
      >
        {isSelected && (
          <button className="delete-button" onClick={handleDeleteClick}>
            🗑️
          </button>
        )}
        <div className="my-icon" />
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
        <div className="my-port" />
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
