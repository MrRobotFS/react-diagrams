import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { MyLinkModel } from './MyLinkModel';

export class MyPortModel extends DefaultPortModel {
    createLinkModel() {
        return new MyLinkModel();
    }
}
