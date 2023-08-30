import React from "react";
import "./node-type-label.css";

export const NodeTypeLabel = props => {
  return (
    <div
      className="node-type-label"
      color={props.color}
      draggable
      onDragStart={event => {
        event.dataTransfer.setData(
          "storm-diagram-node",
          JSON.stringify({ ...props.model, name: props.name, type: props.name })
        );
      }}
    >
      {props.name}
    </div>
  );
};
