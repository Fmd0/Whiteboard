import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {LINEARPATH} from "../data.ts";
import {ShapeType} from "../types.ts";

const prePoint = {
    x: 0,
    y: 0,
}

export const paintLinearPath = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.moveTo(shape.x+shapeTranslateX, shape.y+shapeTranslateY);
    ctx.lineTo(shape.width!+shapeTranslateX, shape.height!+shapeTranslateY);

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const repaintLinearPath = () => {
    const currentShape = shapeList[shapeList.length - 1];
    paintLinearPath(currentShape);
}

export const linearPathPointerDown = (event: PointerEvent) => {
    prePoint.x = event.clientX;
    prePoint.y = event.clientY;
}

export const linearPathPointerMove = (event: PointerEvent) => {
    shapeList.push({
        type: LINEARPATH,
        x: (prePoint.x-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (prePoint.y-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    })
    prePoint.x = event.clientX;
    prePoint.y = event.clientY;
}