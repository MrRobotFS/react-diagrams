import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { MyLinkModel } from './MyLinkModel';
import { MyLinkWidget } from './link-widget/MyLinkWidget';

export class LinkFactory extends AbstractReactFactory {
  constructor() {
    super('my-link');
  }

  generateModel() {
    return new MyLinkModel();
  }

  generateReactWidget(event) {
    return <MyLinkWidget link={event.model} diagramEngine={this.engine} />;
  }
}
