import React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { MyNodeModel } from "./MyNodeModel";
import { MyNodeWidget } from "./node-widget/MyNodeWidget";

console.log("Nodes Factory")
export class NodesFactory extends AbstractReactFactory {
  constructor() {
    console.log("Constructor Nodes Factory")
    super("my-node");
  }

  generateModel(initialConfig) {
    console.log("Model Nodes Factory")
    return new MyNodeModel();
  }

  generateReactWidget(event) {
    console.log("Widget Nodes Factory")
    return <MyNodeWidget engine={this.engine} node={event.model} />;
  }
}
