// MyDiagram.js
import React from "react";
import createEngine, { DiagramModel } from "@projectstorm/react-diagrams";
import { NodesFactory } from "./components/NodesFactory";
import { MyCreatorWidget } from "./components/my-creator-widget/MyCreatorWidget";
import { MyLinkFactory } from "./components/MyLinkFactory";

function MyDiagram() {
  const engine = createEngine();
  engine.setModel(new DiagramModel());

  engine.getNodeFactories().registerFactory(new NodesFactory());
  engine.getLinkFactories().registerFactory(new MyLinkFactory());

  return <MyCreatorWidget engine={engine} />;
}

export default MyDiagram;
