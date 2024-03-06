import React from 'react';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams';
import { DefaultLinkModel } from '@projectstorm/react-diagrams';

export class MyLinkWidget extends DefaultLinkWidget {
    
  generateLinkPath(firstPoint, lastPoint, path) {
    return path;
  }

  generateArrow(firstPoint, lastPoint) {
    const dx = lastPoint.x - firstPoint.x;
    const dy = lastPoint.y - firstPoint.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return (
      <g className="arrow" transform={`translate(${lastPoint.x}, ${lastPoint.y}) rotate(${angle})`}>
        <polygon points="-10,-5 0,0 -10,5" fill={this.props.link.getColor()} />
      </g>
    );
  }

  render() {
    const renderedPath = super.render();

    const { points } = this.props.link.getPoints();
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const path = this.generateLinkPath(firstPoint, lastPoint, renderedPath.props.d);

    const arrow = this.generateArrow(firstPoint, lastPoint);

    return (
      <g>
        {React.cloneElement(renderedPath, { d: path })}
        {arrow}
      </g>
    );
  }
}
