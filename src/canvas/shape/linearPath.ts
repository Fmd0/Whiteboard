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
    ctx.save();
    ctx.beginPath();
    shape.linearPathList!.forEach(linearPath => {
        ctx.moveTo(linearPath.x+shapeTranslateX, linearPath.y+shapeTranslateY);
        ctx.lineTo(linearPath.width!+shapeTranslateX, linearPath.height!+shapeTranslateY);
    })


    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
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
        clientX: event.clientX,
        clientY: event.clientY,
        linearPathList: [],
    }
}

export const linearPathPointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    pointerInfo.shape!.linearPathList?.push({
        x: pointerInfo.shape!.x,
        y: pointerInfo.shape!.y,
        width,
        height,
    })
    pointerInfo.shape!.x = width;
    pointerInfo.shape!.y = height;
}