import React, { useState, useRef, useEffect } from "react";
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
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import FAQs from "../Faqs";
import { MyLinkModel } from "../MyLinkModel";
import { LinkFactory } from "../LinkFactory";



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
         if (node instanceof MyNodeModel) {
            node.setLocked(!locked);
         }
      })
   }

   /*Intro .js*/
   const zoomControlsRef = useRef(null);
   const listServices = useRef(null);

   useEffect(() => {
      introJs().setOptions({
         steps: [
            {
               intro: "Welcome to the Vernil Market Architecture View."
            },
            {
               element: document.querySelector('.zoom-controls'),
               intro: "These are zoom controls."
            },
            {
               element: document.querySelector('.nodes-types-container'),
               intro: "This is the Nodes Types Container."
            },
         ],
         showProgress: true,
         exitOnOverlayClick: false,
         showBullets: true
      }).start();
   }, []);

   /*FAQS*/
   const faqs = [
      { question: "How do I add a new node to the canvas?", answer: "Drag and drop a node type from the Node Types Container onto the canvas." },
      { question: "How can I zoom in and out on the canvas?", answer: "Use the zoom controls (+/- buttons) to zoom in or out. You can also see the current zoom percentage displayed there." },
      { question: "Is it possible to lock the canvas to prevent changes?", answer: "Yes, you can toggle the canvas lock by clicking the 'Lock Canvas'/'Unlock Canvas' button." },
      { question: "How do I download my diagram in JSON format?", answer: "Click the 'Download JSON' button to save your diagram's current state as a JSON file." },
      { question: "Can I also download my diagram in YAML format?", answer: "Yes, click on the 'Download YAML' button to export the diagram in YAML format." },
      { question: "Is there a way to copy the diagram's JSON to the clipboard?", answer: "Yes, click the 'Copy JSON to Clipboard' button, and the JSON representation of your diagram will be copied." },
      { question: "How do I toggle between different view modes?", answer: "Use the 'Canvas' and 'Template' buttons to toggle between different view modes." },
      { question: "How can I focus on the entire diagram at once?", answer: "Click the 'Focus' button to adjust the view to fit the entire diagram on the screen." },
      { question: "What is the purpose of the coordinates display?", answer: "The coordinates display shows the current mouse position relative to the canvas, useful for precision placement of nodes." },
      { question: "How do I edit or delete a node?", answer: "Click on a node to select it. You can edit it by clicking the pencil icon or delete it using the trash icon." }
  ];
 
  const createTestLink = () => {
   console.log('Creando enlace de prueba entre', nodeOne, 'y', nodeTwo);
   // Asegúrate de tener al menos dos nodos para conectar
   const nodes = diagramEngine.getModel().getNodes();
   const nodeKeys = Object.keys(nodes);
 
   if (nodeKeys.length < 2) {
     console.log("Necesitas al menos dos nodos para crear un enlace de prueba");
     return;
   }
 
   const nodeOne = nodes[nodeKeys[0]];
   const nodeTwo = nodes[nodeKeys[1]];
 
   // Crea una nueva instancia de MyLinkModel
   const link = new MyLinkModel();
 
   // Conecta el enlace a los puertos de los nodos (asumiendo que ambos nodos tienen al menos un puerto de salida y entrada)
   link.setSourcePort(nodeOne.getPort('out'));
   link.setTargetPort(nodeTwo.getPort('in'));
 
   // Agrega el enlace al modelo del diagrama
   diagramEngine.getModel().addLink(link);
 
   // Fuerza la actualización del estado para reflejar el cambio en la UI
   forceUpdate();
 };
 

   return (
      <div className="creator-body">
         <header className="creator-header">
            <div className="creator-title">
               Vernil Marketplace Architecture View
            </div>
         </header>

         <div className="zoom-controls" ref={zoomControlsRef}>
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
               {locked ? "Unlock Canvas" : "Lock Canvas"}
            </button>

         </div>

         <div className="creator-content" onMouseMove={handleMouseMove} ref={creatorContentRef}>
            {viewMode === "canvas" ? (
               <>
                  <div className="nodes-types-container" ref={listServices}>
                  <NodesTypesContainer>
                     <NodeTypeLabel model={{ ports: "in" }} name="LEX" />
                     <NodeTypeLabel model={{ ports: "in" }} name="HASH_AUDIT" />
                     <NodeTypeLabel model={{ ports: "in" }} name="LAMBDA" />
                     <NodeTypeLabel model={{ ports: "in" }} name="text_input" />
                     <NodeTypeLabel model={{ ports: "in" }} name="groups" />
                  </NodesTypesContainer>
                  </div>
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
                     <button onClick={createTestLink}>Crear Enlace de Prueba</button>
                  </div>
               </div>

            )}
         </div>
         <FAQs faqs={faqs} />
      </div>
   );
};