import {canvasContent, generator} from "./canvas.ts";
import {ELLIPSE} from "./data.ts";


export const ellipsePointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: ELLIPSE,
        x: clientX,
        y: clientY,
        width: 0,
        height: 0,
        drawable: generator.ellipse(clientX, clientY, 0,0),
    })
}


export const ellipsePointerMove = (clientX: number, clientY: number) => {
    const currentContent = canvasContent[canvasContent.length-1];
    currentContent.width = clientX-currentContent.x;
    currentContent.height = clientY-currentContent.y;
    currentContent.drawable = generator.ellipse((currentContent.x+clientX)/2, (currentContent.y+clientY)/2, currentContent.width, currentContent.height);
}

