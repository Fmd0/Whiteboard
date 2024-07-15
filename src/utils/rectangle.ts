import {canvasContent, generator} from "./canvas.ts";
import {RECTANGLE} from "./data.ts";


export const rectanglePointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: RECTANGLE,
        x: clientX,
        y: clientY,
        width: 0,
        height: 0,
        drawable: generator.rectangle(clientX, clientY, 0, 0),
    })
}


export const rectanglePointerMove = (clientX: number, clientY: number) => {
        const currentContent = canvasContent[canvasContent.length-1];
        currentContent.width = clientX-currentContent.x;
        currentContent.height = clientY-currentContent.y;
        currentContent.drawable = generator.rectangle(currentContent.x, currentContent.y, clientX-currentContent.x, clientY-currentContent.y);
}

