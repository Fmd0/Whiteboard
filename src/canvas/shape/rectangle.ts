import {ctx, scale, shapeList, shapeTranslateX, shapeTranslateY, defaultTranslateX, defaultTranslateY} from "../index.ts";
import {RECTANGLE} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


export const paintRectangle = (shape: ShapeType) => {
    ctx.strokeStyle = "black";
    ctx.strokeRect(
        shape.x+shapeTranslateX,
        shape.y+shapeTranslateY,
        shape.width!,
        shape.height!,
    );
}

export const rectanglePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: RECTANGLE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: 0,
        height: 0,
    };
    // shapeList.push({
    //     type: RECTANGLE,
    //     x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
    //     y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
    //     width: 0,
    //     height: 0,
    // })
}

export const rectanglePointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape!.width = (event.clientX-defaultTranslateX)/scale*100-pointerInfo.shape!.x-shapeTranslateX;
    pointerInfo.shape!.height = (event.clientY-defaultTranslateY)/scale*100-pointerInfo.shape!.y-shapeTranslateY;

    // const currentShape = shapeList[shapeList.length-1];
    // currentShape.width = (event.clientX-defaultTranslateX)/scale*100-currentShape.x-shapeTranslateX;
    // currentShape.height = (event.clientY-defaultTranslateY)/scale*100-currentShape.y-shapeTranslateY;
}
