import React from 'react';
import { DefaultLinkWidget, PointModel, DefaultLinkModel } from '@projectstorm/react-diagrams';

class DraggableLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: 'draggable',
    });
    this.dragging = false;
    this.initialPoint = null;
    this.ref = React.createRef();
  }

  setInitialPoint(x, y) {
    if (!this.initialPoint) {
      this.initialPoint = new PointModel({ link: this, position: { x, y } });
    } else {
      this.initialPoint.setPosition(x, y);
    }
  }

  clearInitialPoint() {
    this.initialPoint = null;
  }
}

export class MyLinkWidget extends DefaultLinkWidget {

  constructor(props) {
    super(props);
    this.state = {
      isHoveringArrowhead: false,
      isHoveringLink: false,
      isDraggingArrowhead: false,
    };
    this.ref = React.createRef(); // Asegúrate de tener esta línea
  }


  onLinkStartDrag = (event) => {
    const model = this.props.link;

  // Comprobar si el modelo tiene el método setInitialPoint
  if (typeof model.setInitialPoint === "function") {
    this.setState({
      initialX: event.clientX,
      initialY: event.clientY,
    });
    model.setInitialPoint(event.clientX, event.clientY);
    model.dragging = true;
    document.addEventListener('mousemove', this.onLinkDrag);
    document.addEventListener('mouseup', this.onLinkStopDrag);
  } else {
    console.error("El modelo no soporta setInitialPoint");
  }
  }


  onLinkDrag = (event) => {
    if (!this.props.link.dragging) return;

    const model = this.props.link;
    const dx = event.clientX - this.state.initialX;
    const dy = event.clientY - this.state.initialY;

    model.getPoints().forEach((point) => {
      const { x, y } = point.getPosition();
      point.setPosition(x + dx, y + dy);
    });

    this.setState({
      initialX: event.clientX,
      initialY: event.clientY,
    });

    this.forceUpdate();
  }

  onLinkStopDrag = (event) => {
    const model = this.props.link;
    model.dragging = false;
    model.clearInitialPoint();
    document.removeEventListener('mousemove', this.onLinkDrag);
    document.removeEventListener('mouseup', this.onLinkStopDrag);
  }

  componentDidMount() {
    if (this.ref.current) {
      this.ref.current.addEventListener('mousedown', this.onLinkStartDrag);
    }
  }

  componentWillUnmount() {
    if (this.ref.current) {
      this.ref.current.removeEventListener('mousedown', this.onLinkStartDrag);
    }
  }


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
                          Z`;


    const clickableAreaSize = 20;
    const centerX = endPoint.getX();
    const centerY = endPoint.getY();

    const clickableArea = (
      <circle
        cx={centerX}
        cy={centerY}
        r={clickableAreaSize}
        fill="rgba(255, 0, 0, 0.0)"
      />
    );

    return (
      <>
        <path
          className={selected ? "link-path-selected" : "link-path"}
          d={linkPath}
          stroke="gray"
          strokeWidth={3}
          fill="none"
        />
        <path
          className={selected ? "link-path-selected" : "link-path"}
          d={arrowheadPath}
          stroke={this.state.isHoveringArrowhead ? "blue" : "green"}
          strokeWidth={2}
          fill="green"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={clickableAreaSize}
          fill="rgba(255, 0, 0, 0.0)"
          style={{ pointerEvents: 'all' }}
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
        <g className="link-layer" ref={this.ref}>
          {this.generateLinkSegment(this.props.link, this.props.link.isSelected(), path)}
        </g>
      </>
    );
  }
}