import { DefaultLinkModel } from '@projectstorm/react-diagrams';

export class MyLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: 'my-link',
      width: 4,
      color: 'gray',
    });
    // Puedes habilitar el smart routing en tu link si deseas
    // this.setSmartRouting(true);
  }
}
