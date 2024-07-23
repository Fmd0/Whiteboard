import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX, shapeTranslateY
} from "../index.ts";
import {ELLIPSE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";


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
    shapeList.push({
        type: ELLIPSE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    })
}

export const ellipsePointerMove = (event: PointerEvent) => {
    const currentShape = shapeList[shapeList.length-1];
    currentShape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    currentShape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}