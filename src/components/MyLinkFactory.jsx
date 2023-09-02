// MyLinkFactory.jsx
import * as React from 'react';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams';
import { MyLinkModel } from './MyLinkModel';
import { MyLinkWidget } from './MyLinkWidget';

export class MyLinkFactory extends DefaultLinkFactory {
    constructor() {
        super('my-link');
    }

    generateModel(initialConfig) {
        console.log("Generating MyLinkModel");
        return new MyLinkModel();
    }

    generateReactWidget(event) {
        console.log("Generating MyLinkWidget");
        return <MyLinkWidget link={event.model} />;
    }
}
