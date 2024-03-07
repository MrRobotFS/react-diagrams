import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { MyLinkModel } from './MyLinkModel';
import { MyLinkWidget } from './link-widget/MyLinkWidget';

export class LinkFactory extends AbstractReactFactory {
    constructor() {
        super('my-link');
        // console.log('LinkFactory inicializada');
    }

    generateModel(event) {
        // console.log('Generando modelo MyLinkModel', event);
        return new MyLinkModel();
    }

    generateReactWidget(event) {
        //console.log('Generando MyLinkWidget para el modelo', event.model);
        //console.log('Puntos del enlace:', event.model.getPoints()); // <-- Muestra los puntos
        return <MyLinkWidget link={event.model} diagramEngine={this.engine} factory={this} />;
    }

    generateLinkSegment(model, selected, path) {
        return (
            <g>
                <path className={selected ? 'my-selected-path' : 'my-path'} d={path} />
            </g>
        );
    }
}
