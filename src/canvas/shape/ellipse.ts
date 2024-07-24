import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeTranslateX, shapeTranslateY
} from "../index.ts";
import {ELLIPSE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


export const paintEllipse = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.ellipse(
        (shape.x+shape.width)/2+shapeTranslateX,
        (shape.y+shape.height)/2+shapeTranslateY,
        Math.abs(shape.x-shape.width)/2,
        Math.abs(shape.y-shape.height)/2,
        0,
        0,
        2*Math.PI,
    )

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const ellipsePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: ELLIPSE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    };
}

export const ellipsePointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    shape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    shape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}