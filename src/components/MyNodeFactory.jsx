import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { MyNodeModel } from "./MyNodeModel";
import { MyNodeWidget } from "./MyNodeWidget";

export class MyNodeFactory extends AbstractReactFactory {
  constructor(handleElementSelect) {
      super("my-node");
      this.handleElementSelect = handleElementSelect;
  }

  generateModel(event) {
      return new MyNodeModel();
  }

  generateReactWidget(event) {
      return <MyNodeWidget node={event.model} handleElementSelect={this.handleElementSelect} selectedItems={this.selectedItems} />;
  }
}

