// MyDiagram.js
import React from "react";
import createEngine, { DiagramModel } from "@projectstorm/react-diagrams";
import { NodesFactory } from "./components/NodesFactory";
import { LinkFactory } from "./components/LinkFactory";
import { MyCreatorWidget } from "./components/my-creator-widget/MyCreatorWidget";


function MyDiagram() {
  // const engine = createEngine();
  const engine = createEngine({
    // Habilita el smart routing en la configuración del engine
    registerDefaultZoomCanvasAction: false,
    registerDefaultDeleteItemsAction: false,
    smartRouting: true,
  });
  engine.setModel(new DiagramModel());
  engine.getNodeFactories().registerFactory(new NodesFactory());
  engine.getLinkFactories().registerFactory(new LinkFactory());

  return <MyCreatorWidget engine={engine} />;
}

export default MyDiagram;
