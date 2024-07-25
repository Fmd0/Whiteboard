import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeTranslateX, shapeTranslateY
} from "../index.ts";
import {LINE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


export const paintLine = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.moveTo(shape.x+shapeTranslateX, shape.y+shapeTranslateY);
    ctx.lineTo(shape.width!+shapeTranslateX, shape.height!+shapeTranslateY);

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const linePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: LINE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        clientX: event.clientX,
        clientY: event.clientY,
    };
}

export const linePointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    shape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    shape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}