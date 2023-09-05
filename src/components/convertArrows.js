// Encuentra todos los nodos in
let inPorts = document.querySelectorAll('.left-port .my-port');

// Encuentra todos los paths que representan las conexiones en el SVG.
let paths = document.querySelectorAll('svg .css-ve2mk5');

// Para cada nodo in, revisa si está conectado y, en ese caso, añade la flecha.
inPorts.forEach(port => {
    let portRect = port.getBoundingClientRect();

    for (let path of paths) {
        let pathRect = path.getBoundingClientRect();

        // Comprueba si el nodo in y la conexión se superponen.
        // Esta es una forma simplificada y podría requerir ajustes según el diseño y estructura exactos.
        if (portRect.right > pathRect.left && portRect.left < pathRect.right &&
            portRect.bottom > pathRect.top && portRect.top < pathRect.bottom) {
            
            // Añade la flecha al nodo in conectado
            let svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElem.setAttribute("width", "25");
            svgElem.setAttribute("height", "25");
            svgElem.setAttribute("viewBox", "0 0 10 10");

            let pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathElem.setAttribute("d", "M0 0 L10 5 L0 10 L2 5 Z");
            pathElem.setAttribute("fill", "gray");

            svgElem.appendChild(pathElem);
            port.appendChild(svgElem);

            break;  // Si encontramos una conexión, no es necesario revisar las demás conexiones.
        }
    }
});

let style = document.createElement('style');
style.innerHTML = `
    .left-port .my-port {
        position: relative;
    }
    .left-port .my-port svg {
        position: absolute;
        left: -20px;
        top: -5px;
        z-index: 3;
    }
`;
document.head.appendChild(style);
