import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { NodesTypesContainer } from "../nodes-types-container/NodesTypesContainer";
import { NodeTypeLabel } from "../node-type-label/NodeTypeLabel";
import { DiagramCanvas } from "../DiagramCanvas";
import { MyNodeModel } from "../MyNodeModel";
import "./my-creator-widget.css";
import useUndoRedo from "../../hooks/useUndoRedo";

export const MyCreatorWidget = props => {
   const [locked, setLocked] = useState(false);
   const [zoomPercentage, setZoomPercentage] = useState(100);
   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
   const diagramEngine = props.engine;
   const creatorContentRef = useRef(null);
   const [viewMode, setViewMode] = useState("canvas");
   const [copySuccess, setCopySuccess] = useState(false);


   const initialDiagramState = {
      nodes: [],
      links: [],
      // other properties that your diagram might have
   };


   // Custom hook
   const [diagramState, setDiagramState, undo, redo, history, currentIndex] = useUndoRedo(initialDiagramState);


   const forceUpdate = React.useReducer(bool => !bool)[1];

   const canvasRef = useRef(null);

   const onNodeDrop = event => {
      if (locked) return;
      const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
      const point = diagramEngine.getRelativeMousePoint(event);

      let newNode;
      if (data.name === "text_input") {
         // Crear un nodo de tipo "text_input"
         newNode = new MyNodeModel({
            color: "#e86c24",
            name: "input_text",
            type: "text_input",
         });
      } else {
         // Crear nodos existentes (LEX, HASH_AUDIT, LAMBDA, etc.)
         newNode = new MyNodeModel({
            color: "#e86c24",
            name: data.name,
            type: data.type,
         });
      }

      newNode.setPosition(point);
      diagramEngine.getModel().addNode(newNode);
      forceUpdate();

      const serializedModel = diagramEngine.getModel().serialize();
      console.log(serializedModel);
      setDiagramState(serializedModel);
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

   const toggleViewMode = (mode) => {
      setViewMode(mode);
   };

   const handleTemplateClick = () => {
      const serializedModel = diagramEngine.getModel().serialize();
      console.log(serializedModel);
      alert(JSON.stringify(serializedModel, null, 2)); // Este alert muestra el JSON con un formato indentado
   };

   const handleCopyClick = () => {
      navigator.clipboard.writeText(JSON.stringify(diagramEngine.getModel().serialize(), null, 2))
         .then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
         })
         .catch(err => {
            console.error('Failed to copy text: ', err);
            setCopySuccess(false);
         });
   };
   

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
            <button
               className={viewMode === "canvas" ? "active" : ""}
               onClick={() => toggleViewMode("canvas")}
            >
               Canvas
            </button>
            <button
               className={viewMode === "template" ? "active" : ""}
               onClick={() => toggleViewMode("template")}
            >
               Template
            </button>


         </div>

         <div className="creator-content" onMouseMove={handleMouseMove} ref={creatorContentRef}>
            {viewMode === "canvas" ? (
               <>
                  <NodesTypesContainer>
                     <NodeTypeLabel model={{ ports: "in" }} name="LEX" />
                     <NodeTypeLabel model={{ ports: "in" }} name="HASH_AUDIT" />
                     <NodeTypeLabel model={{ ports: "in" }} name="LAMBDA" />
                     <NodeTypeLabel model={{ ports: "in" }} name="text_input" /> {/* Nuevo tipo de nodo */}
                     <NodeTypeLabel model={{ ports: "in" }} name="groups" /> {/* Nuevo tipo de nodo "groups" */}
                  </NodesTypesContainer>

                  <div
                     className="creator-layer"
                     onDrop={onNodeDrop}
                     onDragOver={event => {
                        event.preventDefault();
                     }}
                  >
                     <DiagramCanvas ref={canvasRef}>
                        <CanvasWidget engine={diagramEngine} />
                     </DiagramCanvas>


                     <div className="coordinates-display">
                        X: {coordinates.x}, Y: {coordinates.y}
                     </div>
                  </div>
               </>
            ) : (
               // Vista Template
               <div>
      <textarea
         readOnly
         value={JSON.stringify(diagramEngine.getModel().serialize(), null, 2)}
      />
      <button onClick={handleCopyClick}>
         {copySuccess ? 'Copied!' : 'Copy JSON to Clipboard'}
      </button>
   </div>
            )}
         </div>

      </div>
   );
};