import {
    ctx,
    scale,
    shapeList,
    defaultTranslateX,
    defaultTranslateY,
    shapeTranslateX,
    shapeTranslateY
} from "./canvas.ts";
import {CIRCLE} from "./data.ts";
import {ShapeType} from "./types.ts";


// export const circleRoughPointerDown = (clientX: number, clientY: number) => {
//     canvasContent.push({
//         type: CIRCLE,
//         x: clientX,
//         y: clientY,
//         diameter: 0,
//         drawable: generator.circle(clientX, clientY, 0),
//     })
// }
//
//
// export const circleRoughPointerMove = (clientX: number, clientY: number) => {
//         const currentContent = canvasContent[canvasContent.length-1];
//         const currentDiameter = Math.sqrt(Math.pow(clientX - currentContent.x, 2) + Math.pow(clientY - currentContent.y, 2));
//         currentContent.diameter = currentDiameter;
//         currentContent.drawable = generator.circle((currentContent.x+clientX)/2, (currentContent.y+clientY)/2, currentDiameter);
// }

export const paintCircle = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.arc(
        shape.x+shapeTranslateX,
        shape.y+shapeTranslateY,
        shape.radius!,
        0,
        2*Math.PI,
    );
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const circlePointerDown = (event: PointerEvent) => {
    shapeList.push({
        type: CIRCLE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        radius: 0,
    });
}

export const circlePointerMove = (event: PointerEvent) => {
    const currentShape = shapeList[shapeList.length-1];
    currentShape.radius = Math.sqrt(
        Math.pow((event.clientX-defaultTranslateX)/scale*100-currentShape.x-shapeTranslateX, 2) +
        Math.pow((event.clientY-defaultTranslateY)/scale*100-currentShape.y-shapeTranslateY, 2)
    );
}