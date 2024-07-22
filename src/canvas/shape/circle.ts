import {
    ctx,
    scale,
    shapeList,
    defaultTranslateX,
    defaultTranslateY,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {CIRCLE} from "../data.ts";
import {ShapeType} from "../types.ts";



export const paintCircle = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.arc(
        (shape.x+shape.width)/2+shapeTranslateX,
        (shape.y+shape.height)/2+shapeTranslateY,
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
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        radius: 0,
    });
}

export const circlePointerMove = (event: PointerEvent) => {
    const currentShape = shapeList[shapeList.length-1];
    currentShape.radius = Math.sqrt(
        Math.pow((event.clientX-defaultTranslateX)/scale*100-currentShape.x-shapeTranslateX, 2) +
        Math.pow((event.clientY-defaultTranslateY)/scale*100-currentShape.y-shapeTranslateY, 2)
    )/2;
    currentShape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    currentShape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}