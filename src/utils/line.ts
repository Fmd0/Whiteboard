import {canvasContent, generator} from "./canvas.ts";
import {LINE} from "./data.ts";


export const linePointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: LINE,
        x: clientX,
        y: clientY,
        width: clientX,
        height: clientY,
        drawable: generator.line(clientX, clientY, clientX, clientY),
    })
}


export const linePointerMove = (clientX: number, clientY: number) => {
        const currentContent = canvasContent[canvasContent.length-1];
        currentContent.width = clientX;
        currentContent.height = clientY;
        currentContent.drawable = generator.line(currentContent.x, currentContent.y, clientX, clientY);
}

