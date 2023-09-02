// MyLinkModel.jsx
import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class MyLinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      ...options,
      type: "my-link",
    });
    this.getOptions().color = 'black';  // Define el color aquí
  }
}
