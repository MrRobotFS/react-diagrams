import React from "react";
import { AbstractReactFactory } from '@projectstorm/react-diagrams';
import { MyLinkModel } from './MyLinkModel';
import {MyLinkWidget} from './MyLinkWidget';

console.log("Calling MyLinkFactory component");
export class MyLinkFactory extends AbstractReactFactory {
    constructor() {
        super('my-link');
        console.log("MyLinkFactory created");
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
