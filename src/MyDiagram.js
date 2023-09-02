// MyDiagram.js
import React from "react";
import createEngine, { DiagramModel } from "@projectstorm/react-diagrams";
import { MyLinkFactory } from "./components/MyLinkFactory";
import { NodesFactory } from "./components/NodesFactory";
import { MyCreatorWidget } from "./components/my-creator-widget/MyCreatorWidget";


function MyDiagram() {
  const engine = createEngine();
  engine.setModel(new DiagramModel());

  engine.getLinkFactories().registerFactory(new MyLinkFactory());
  engine.getNodeFactories().registerFactory(new NodesFactory());
  
  return <MyCreatorWidget engine={engine} />;
}

export default MyDiagram;
