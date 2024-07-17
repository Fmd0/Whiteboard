import {canvasContent, generator, scale} from "./canvas.ts";
import {RECTANGLE} from "./data.ts";


export const rectanglePointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: RECTANGLE,
        x: (clientX)*100/scale,
        y: (clientY)*100/scale,
        width: 0,
        height: 0,
        drawable: generator.rectangle(clientX, clientY, 0, 0),
    })
}


export const rectanglePointerMove = (clientX: number, clientY: number) => {
        const currentContent = canvasContent[canvasContent.length-1];
        currentContent.width = (clientX)*100/scale-currentContent.x;
        currentContent.height = (clientY)*100/scale-currentContent.y;
        currentContent.drawable = generator.rectangle(
            currentContent.x,
            currentContent.y,
            currentContent.width,
            currentContent.height,
        );
}

