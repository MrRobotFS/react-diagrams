import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { NodesTypesContainer } from "../nodes-types-container/NodesTypesContainer";
import { NodeTypeLabel } from "../node-type-label/NodeTypeLabel";
import { DiagramCanvas } from "../DiagramCanvas";
import { MyNodeModel } from "../MyNodeModel";
import "./my-creator-widget.css";

export const MyCreatorWidget = props => {
   const [locked, setLocked] = useState(false);
   const [zoomPercentage, setZoomPercentage] = useState(100);
   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
   const diagramEngine = props.engine;
   const creatorContentRef = useRef(null);

   const forceUpdate = React.useReducer(bool => !bool)[1];

   const canvasRef = useRef(null);

   const onNodeDrop = event => {
      if (locked) return;
      const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
      const node = new MyNodeModel({
         color: "#e86c24",
         name: data.name,
         type: data.type
      });
      const point = diagramEngine.getRelativeMousePoint(event);
      node.setPosition(point);
      diagramEngine.getModel().addNode(node);
      forceUpdate();
   };

   const handleZoomIn = () => {
      const model = diagramEngine.getModel();
      const newZoom = model.getZoomLevel() * 1.1;
      model.setZoomLevel(newZoom);
      setZoomPercentage(Math.round(newZoom * 100));
      forceUpdate();
   };

   const handleZoomOut = () => {
      const model = diagramEngine.getModel();
      const newZoom = model.getZoomLevel() / 1.1;
      model.setZoomLevel(newZoom);
      setZoomPercentage(Math.round(newZoom * 100));
      forceUpdate();
   };

   const handleFocusDiagram = () => {
      diagramEngine.zoomToFit();
   };

   const toggleFullScreen = () => {
      if (document.fullscreenElement) {
         document.exitFullscreen().then(() => {
            diagramEngine.repaintCanvas();
         });
      } else {
         canvasRef.current.requestFullscreen().then(() => {
            diagramEngine.repaintCanvas();
         });
      }
   };

   const handleMouseMove = (e) => {
      setCoordinates({ x: e.clientX, y: e.clientY });
   };

   const addArrowsToConnectedNodes = () => {
      let inPorts = document.querySelectorAll('.left-port .my-port');
      let paths = document.querySelectorAll('svg .css-ve2mk5');

      inPorts.forEach(port => {
         const existingArrow = port.querySelector("svg");
         if (existingArrow) {
            port.removeChild(existingArrow);
         }

         let portRect = port.getBoundingClientRect();

         for (let path of paths) {
            let pathRect = path.getBoundingClientRect();

            if (portRect.right > pathRect.left && portRect.left < pathRect.right &&
               portRect.bottom > pathRect.top && portRect.top < pathRect.bottom) {

               let svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
               svgElem.setAttribute("width", "25");
               svgElem.setAttribute("height", "25");
               svgElem.setAttribute("viewBox", "0 0 10 10");

               let pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
               pathElem.setAttribute("d", "M0 0 L10 5 L0 10 L2 5 Z");
               pathElem.setAttribute("fill", "gray");

               svgElem.appendChild(pathElem);
               port.appendChild(svgElem);

               break;
            }
         }
      });

      let style = document.createElement('style');
      style.innerHTML = `
      .left-port .my-port {
         position: relative;
      }
      .left-port .my-port svg {
         position: absolute;
         left: -20px;
         top: -5px;
         z-index: 3;
      }
      svg .css-ve2mk5 {
         z-index: 1;
      }
   `;
      document.head.appendChild(style);

   };

   useEffect(() => {
      const handleKeyDown = (event) => {
         if (event.key === "Delete") { // La tecla "supr" se identifica como "Delete" en el objeto event.
            addArrowsToConnectedNodes();
         }
      };

      const handleDeleteButtonClick = () => {
         addArrowsToConnectedNodes();
      };

      // Agregar el listener al objeto window.
      window.addEventListener("keydown", handleKeyDown);

      // Agregar el listener al botón "delete-button".
      const deleteButton = document.querySelector(".delete-button");
      if (deleteButton) {
         deleteButton.addEventListener("click", handleDeleteButtonClick);
      }

      return () => {
         // Limpiar listeners cuando el componente se desmonta.
         window.removeEventListener("keydown", handleKeyDown);
         if (deleteButton) {
            deleteButton.removeEventListener("click", handleDeleteButtonClick);
         }
      };
   }, []);


   return (
      <div className="creator-body">
         <header className="creator-header">
            <div className="creator-title">
               Vernil Marketplace Architecture View
            </div>
         </header>

         <div className="zoom-controls">
            <button onClick={handleZoomOut}><FaMinus /></button>
            <span>{zoomPercentage}%</span>
            <button onClick={handleZoomIn}><FaPlus /></button>
            <button onClick={handleFocusDiagram}>Focus</button>
            <button onClick={toggleFullScreen}>Fullscreen</button>
         </div>

         <div className="creator-content" onMouseMove={handleMouseMove} ref={creatorContentRef}>
            <NodesTypesContainer>
               <NodeTypeLabel model={{ ports: "in" }} name="LEX" />
               <NodeTypeLabel model={{ ports: "in" }} name="HASH_AUDIT" />
               <NodeTypeLabel model={{ ports: "in" }} name="LAMBDA" />
            </NodesTypesContainer>

            <div
               className="creator-layer"
               onDrop={onNodeDrop}
               onDragOver={event => {
                  event.preventDefault();
               }}
               onMouseUp={addArrowsToConnectedNodes}
            >
               <DiagramCanvas ref={canvasRef}>
                  <CanvasWidget engine={diagramEngine} />
               </DiagramCanvas>


               <div className="coordinates-display">
                  X: {coordinates.x}, Y: {coordinates.y}
               </div>
            </div>
         </div>
      </div>
   );
};