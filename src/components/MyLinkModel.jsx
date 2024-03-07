import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class MyLinkModel extends DefaultLinkModel {
    constructor(options = {}) {
        super({
            ...options,
            type: 'my-link',
            color: '#00FF00', // Define el color verde aquí
            lineColor: "#00FF00",
        });
    }

    getPath() {
        const points = this.getPoints();
        // Suponiendo que points es un array de { x: number, y: number }
        if (points.length < 2) {
            // No hay suficientes puntos para formar un path
            return '';
        }

        // Construir el path como una cadena "M x1 y1 L x2 y2 L x3 y3 ... "
        // Donde M mueve a un punto sin dibujar, y L dibuja una línea hasta un punto
        const path = points.reduce((acc, point, index) => {
            const prefix = index === 0 ? 'M' : 'L';
            return `${acc} ${prefix} ${point.getX()} ${point.getY()}`;
        }, '');

        return path;
    }
}
