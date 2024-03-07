import React from 'react';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams';

export class MyLinkWidget extends DefaultLinkWidget {
    
    // Método para generar un segmento de enlace
    generateLinkSegment(model, selected, path) {
        // Aquí puedes personalizar el segmento del enlace como prefieras
        // El siguiente es un ejemplo básico que dibuja una línea recta
        return (
            <g>
                <path
                    className={selected ? "link-path-selected" : "link-path"}
                    strokeWidth={model.width}
                    stroke={model.color}
                    d={path}
                />
            </g>
        );
    }

    render() {
        // Log para confirmar la renderización del enlace
        console.log('Renderizando MyLinkWidget', this.props.link);

        // Modifica la renderización como necesites. 
        // El siguiente ejemplo simplemente extiende la funcionalidad básica del DefaultLinkWidget
        return super.render();
    }
}
