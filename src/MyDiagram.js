// MyDiagram.js
import React from "react";
import createEngine, { DiagramModel } from "@projectstorm/react-diagrams";
import { NodesFactory } from "./components/NodesFactory";
import { MyCreatorWidget } from "./components/my-creator-widget/MyCreatorWidget";


function MyDiagram() {
  const engine = createEngine();
  engine.setModel(new DiagramModel());
  engine.getNodeFactories().registerFactory(new NodesFactory());

  return <MyCreatorWidget engine={engine} />;
}

export default MyDiagram;
