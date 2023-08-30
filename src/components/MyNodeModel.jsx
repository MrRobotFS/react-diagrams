import { NodeModel, DefaultPortModel } from "@projectstorm/react-diagrams";

export class MyNodeModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: "my-node"
    });

    this.color = options.color || "black";
    this.name = options.name || "Unknown"; // this is the new line

    if (options) {
      this.color = options.color || "black";
    }

    // setup an in and out port
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

    this.nodeType = options.type || "Unknown"; // this is the new line
  }
}
