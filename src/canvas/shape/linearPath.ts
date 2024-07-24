import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {LINEARPATH} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


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
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: LINEARPATH,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    }
}

export const linearPathPointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
    shapeList.push({
        type: LINEARPATH,
        x: pointerInfo.shape!.x,
        y: pointerInfo.shape!.y,
        width,
        height,
    })
    pointerInfo.shape!.x = width;
    pointerInfo.shape!.y = height;
}