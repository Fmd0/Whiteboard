import {canvasContent, generator} from "./canvas.ts";
import {CIRCLE} from "./data.ts";


export const circlePointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: CIRCLE,
        x: clientX,
        y: clientY,
        diameter: 0,
        drawable: generator.circle(clientX, clientY, 0),
    })
}


export const circlePointerMove = (clientX: number, clientY: number) => {
        const currentContent = canvasContent[canvasContent.length-1];
        const currentDiameter = Math.sqrt(Math.pow(clientX - currentContent.x, 2) + Math.pow(clientY - currentContent.y, 2));
        currentContent.diameter = currentDiameter;
        currentContent.drawable = generator.circle((currentContent.x+clientX)/2, (currentContent.y+clientY)/2, currentDiameter);
}

