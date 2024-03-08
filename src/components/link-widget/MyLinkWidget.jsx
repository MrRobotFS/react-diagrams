import React from 'react';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams';
//import "./my-link-widget.css"

export class MyLinkWidget extends DefaultLinkWidget {
  constructor(props) {
    super(props);
    this.state = {
      isHoveringArrowhead: false,
      isHoveringLink: false,
      isDraggingArrowhead: false,
    };
  }

  handleArrowheadMouseEnter = () => {
    this.setState({ isHoveringArrowhead: true });
  };

  handleArrowheadMouseLeave = () => {
    this.setState({ isHoveringArrowhead: false });
  };

  handleArrowheadMouseDown = (event) => {
    event.stopPropagation();
    this.setState({ isDraggingArrowhead: true });
  };

  handleMouseUp = (event) => {
    if (this.state.isDraggingArrowhead) {
      this.setState({ isDraggingArrowhead: false });
    }
  };

  handleArrowheadClick = () => {
    console.log('Arrowhead was clicked!');
  };

  generateLinkSegment(model, selected, path) {
    const points = model.getPoints();
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    const dx = endPoint.getX() - startPoint.getX();
    const dy = endPoint.getY() - startPoint.getY();
    const angle = Math.atan2(dy, dx);

    const arrowLength = 10;
    const arrowWidth = 5;

    const arrowBaseStart = {
      x: endPoint.getX() - arrowLength * Math.cos(angle),
      y: endPoint.getY() - arrowLength * Math.sin(angle)
    };

    const arrowBaseLeft = {
      x: arrowBaseStart.x + arrowWidth * Math.cos(angle + Math.PI / 2),
      y: arrowBaseStart.y + arrowWidth * Math.sin(angle + Math.PI / 2),
    };
    const arrowBaseRight = {
      x: arrowBaseStart.x + arrowWidth * Math.cos(angle - Math.PI / 2),
      y: arrowBaseStart.y + arrowWidth * Math.sin(angle - Math.PI / 2),
    };
    
    const linkPath = `M ${startPoint.getX()} ${startPoint.getY()} L ${arrowBaseStart.x} ${arrowBaseStart.y}`;

    const arrowheadPath = `M ${arrowBaseLeft.x} ${arrowBaseLeft.y} 
                          L ${endPoint.getX()} ${endPoint.getY()} 
                          L ${arrowBaseRight.x} ${arrowBaseRight.y} 
                          Z`; // Usamos Z para cerrar el path y rellenarlo


    const clickableAreaSize = 20;
    const centerX = endPoint.getX();
    const centerY = endPoint.getY();

    const clickableArea = (
      <circle
        cx={centerX}
        cy={centerY}
        r={clickableAreaSize}
        fill="rgba(255, 0, 0, 0.0)"
        onClick={this.handleArrowheadClick}
        onMouseEnter={this.handleArrowheadMouseEnter}
        onMouseLeave={this.handleArrowheadMouseLeave}
      />
    );

    return (
      <>
        <path
        className={selected ? "link-path-selected" : "link-path"}
        d={linkPath}
        stroke="green"
        strokeWidth={2}
        fill="none"
      />
      <path
        onClick={this.handleArrowheadClick} // Asegúrate de que este evento se coloque correctamente
        onMouseEnter={this.handleArrowheadMouseEnter}
        onMouseLeave={this.handleArrowheadMouseLeave}
        className={selected ? "link-path-selected" : "link-path"}
        d={arrowheadPath}
        stroke={this.state.isHoveringArrowhead ? "blue" : "green"}
        strokeWidth={2}
        fill="green" // El arrowhead ya está rellenado y debería ser suficientemente visible para capturar clicks
      />
        {clickableArea}
      </>
    );
  }

  render() {
    const { link } = this.props;
    const path = `M ${link.getFirstPoint().getX()} ${link.getFirstPoint().getY()} L ${link.getLastPoint().getX()} ${link.getLastPoint().getY()}`;
    return (
      <>
        <g className="link-layer"
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}>
          {this.generateLinkSegment(link, link.isSelected(), path)}
        </g>
      </>
    );
  }
}