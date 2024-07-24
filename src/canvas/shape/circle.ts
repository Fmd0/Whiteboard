import {
    ctx,
    scale,
    defaultTranslateX,
    defaultTranslateY,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {CIRCLE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";



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
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: CIRCLE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        radius: 0,
    };
}


export const circlePointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    shape.radius = Math.sqrt(
        Math.pow((event.clientX-defaultTranslateX)/scale*100-shape.x-shapeTranslateX, 2) +
        Math.pow((event.clientY-defaultTranslateY)/scale*100-shape.y-shapeTranslateY, 2)
    )/2;
    shape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    shape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}