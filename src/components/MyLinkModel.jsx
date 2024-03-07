import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class MyLinkModel extends DefaultLinkModel {
    constructor(options = {}) {
        super({
            ...options,
            type: 'my-link',
        });
        console.log('MyLinkModel creado', this);
    }
}