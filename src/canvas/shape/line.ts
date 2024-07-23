import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX, shapeTranslateY
} from "../index.ts";
import {LINE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";


export const paintLine = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.moveTo(shape.x+shapeTranslateX, shape.y+shapeTranslateY);
    ctx.lineTo(shape.width!+shapeTranslateX, shape.height!+shapeTranslateY);

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const linePointerDown = (event: PointerEvent) => {
    shapeList.push({
        type: LINE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    })
}

export const linePointerMove = (event: PointerEvent) => {
    const currentShape = shapeList[shapeList.length-1];
    currentShape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    currentShape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}