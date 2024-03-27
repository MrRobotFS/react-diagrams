import { NodeModel, DefaultPortModel } from "@projectstorm/react-diagrams";
import { MyLinkModel } from "./MyLinkModel";
import { MyPortModel } from "./MyPortModel";

export class MyNodeModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: "my-node"
    });

    this.color = options.color || "black";
    this.name = options.name || "Unknown";
    this.customText = options.customText || "";

    if (options) {
      this.color = options.color || "black";
    }

    this.addPort(new MyPortModel({ in: true, name: 'in' }));
    this.addPort(new MyPortModel({ in: false, name: 'out' }));

    this.addPort(
      new DefaultPortModel({
        in: true,
        name: "top"
      })
    );
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: "bottom"
      })
    );

    /*
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: "in"
      })
    );
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: "out"
      })
    );
    
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: "top"
      })
    );
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: "bottom"
      })
    );
    */
    this.nodeType = options.type || "Unknown";
    this.size = options.size || { width: 100, height: 100 };
  }

  setSize(width, height) {
    this.size = { width, height };
  }

  locked = false;

  setLocked(locked) {
    this.locked = locked;
  }

  setPosition(x, y) {
    if (!this.locked) {
      super.setPosition(x, y);
    }
  }

  setCustomText(text) {
    this.customText = text;
  }

}
