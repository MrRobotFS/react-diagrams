import React, { useState, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { NodesTypesContainer } from "../nodes-types-container/NodesTypesContainer";
import { NodeTypeLabel } from "../node-type-label/NodeTypeLabel";
import { DiagramCanvas } from "../DiagramCanvas";
import { MyNodeModel } from "../MyNodeModel";
import "./my-creator-widget.css";
import useUndoRedo from "../../hooks/useUndoRedo";
import * as yaml from 'js-yaml'; // Importa solo una vez
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";



export const MyCreatorWidget = props => {
   const [locked, setLocked] = useState(false);
   const [zoomPercentage, setZoomPercentage] = useState(100);
   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
   const diagramEngine = props.engine;
   const creatorContentRef = useRef(null);
   const [viewMode, setViewMode] = useState("canvas");
   const [copySuccess, setCopySuccess] = useState(false);

   const yamlEditorRef = useRef(null);

   const initialDiagramState = {
      nodes: [],
      links: [],
   };

   const [diagramState, setDiagramState, undo, redo, history, currentIndex] = useUndoRedo(initialDiagramState);


   const forceUpdate = React.useReducer(bool => !bool)[1];

   const canvasRef = useRef(null);

   const onNodeDrop = event => {
      if (locked) return;
      const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
      const point = diagramEngine.getRelativeMousePoint(event);

      let newNode;
      if (data.name === "text_input") {
         newNode = new MyNodeModel({
            color: "#e86c24",
            name: "input_text",
            type: "text_input",
         });
      } else {
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

   const handleCopyClick = () => {
      navigator.clipboard.writeText(JSON.stringify(diagramEngine.getModel().serialize(), null, 2))
         .then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
         })
         .catch(err => {
            console.error('Failed to copy text: ', err);
            setCopySuccess(false);
         });
   };

   const handleDownloadJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diagramEngine.getModel().serialize(), null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "canvas.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
   };

   const handleDownloadYaml = () => {
      const yamlStr = yaml.dump(diagramEngine.getModel().serialize());
      const dataStr = "data:text/yaml;charset=utf-8," + encodeURIComponent(yamlStr);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "diagram.yaml");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
   };

   const toggleYamlFullScreen = () => {
      const yamlElement = yamlEditorRef.current;
      if (!document.fullscreenElement) {
         if (yamlElement.requestFullscreen) {
            yamlElement.requestFullscreen();
         }
      } else {
         if (document.exitFullscreen) {
            document.exitFullscreen();
         }
      }
   };

   const toggleLock = () => {
      setLocked(!locked);
      const nodes = diagramEngine.getModel().getNodes();
      Object.values(nodes).forEach(node => {
         if(node instanceof MyNodeModel){
            node.setLocked(!locked);
         }
      })
   }

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
            <button onClick={handleDownloadJson}>Download JSON</button>
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
            <button onClick={toggleLock}>
               {locked ? "Unlock Canvas": "Lock Canvas"}
            </button>

         </div>

         <div className="creator-content" onMouseMove={handleMouseMove} ref={creatorContentRef}>
            {viewMode === "canvas" ? (
               <>
                  <NodesTypesContainer>
                     <NodeTypeLabel model={{ ports: "in" }} name="LEX" />
                     <NodeTypeLabel model={{ ports: "in" }} name="HASH_AUDIT" />
                     <NodeTypeLabel model={{ ports: "in" }} name="LAMBDA" />
                     <NodeTypeLabel model={{ ports: "in" }} name="text_input" />
                     <NodeTypeLabel model={{ ports: "in" }} name="groups" />
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

               <div>
                  <div ref={yamlEditorRef}>
                     <AceEditor
                        mode="yaml"
                        theme="monokai"
                        name="yaml_editor"
                        value={yaml.dump(diagramEngine.getModel().serialize())}
                        readOnly={true}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        setOptions={{
                           enableBasicAutocompletion: false,
                           enableLiveAutocompletion: false,
                           enableSnippets: false,
                           showLineNumbers: true,
                           tabSize: 2,
                        }}
                     />
                     <button onClick={handleDownloadYaml}>Download YAML</button>
                     <button onClick={handleCopyClick}>
                        {copySuccess ? 'Copied!' : 'Copy JSON to Clipboard'}
                     </button>
                     <button onClick={toggleYamlFullScreen}>Fullscreen YAML</button>
                  </div>
               </div>

            )}
         </div>

      </div>
   );
};