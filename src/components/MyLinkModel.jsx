import { DefaultLinkModel, PointModel } from "@projectstorm/react-diagrams";

export class MyLinkModel extends DefaultLinkModel {
    constructor(options = {}) {
        super({
            ...options,
            type: 'my-link',
            color: '#00FF00',
            lineColor: "#00FF00",
        });
        this.dragging = false;
        this.initialPoint = null;
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

    getPath() {
        const points = this.getPoints();
        if (points.length < 2) {
            return '';
        }
        const path = points.reduce((acc, point, index) => {
            const prefix = index === 0 ? 'M' : 'L';
            return `${acc} ${prefix} ${point.getX()} ${point.getY()}`;
        }, '');

        return path;
    }
}
