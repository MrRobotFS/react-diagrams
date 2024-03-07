import React from 'react';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams';
//import "./my-link-widget.css"

export class MyLinkWidget extends DefaultLinkWidget {
  generateLinkSegment(model, selected, path) {
    console.log('generateLinkSegment llamado con los siguientes parámetros:', { model, selected, path });
    return (
      <path className={selected ? "link-path-selected" : "link-path"} d={path} stroke="black" strokeWidth={2} fill="none" />
    );
  }

  render() {
    console.log('Renderizando MyLinkWidget', this.props.link);
    const { link } = this.props;

    // Asumiendo que generateLinkSegment se llama correctamente y genera el path.
    // Esto es solo un ejemplo, asegúrate de ajustar según cómo estás generando el path realmente
    const path = `M ${link.getFirstPoint().getX()} ${link.getFirstPoint().getY()} L ${link.getLastPoint().getX()} ${link.getLastPoint().getY()}`;

    return (
      <g className="link-layer">
        {this.generateLinkSegment(link, link.isSelected(), path)}
      </g>
    );
  }



}

