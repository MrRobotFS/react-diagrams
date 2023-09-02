import React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { MyNodeModel } from "./MyNodeModel";
import { MyNodeWidget } from "./node-widget/MyNodeWidget";

console.log("Calling MyNodeFactory component");
export class NodesFactory extends AbstractReactFactory {
  constructor() {
    super("my-node");
    console.log("MyNodeFactory created");
  }

  generateModel(initialConfig) {
    console.log("Generating MyNodeModel");
    return new MyNodeModel();
  }

  generateReactWidget(event) {
    console.log("Generating MyNodeWidget");
    return <MyNodeWidget engine={this.engine} node={event.model} />;
  }
}
