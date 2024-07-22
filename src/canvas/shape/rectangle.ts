import {ctx, scale, shapeList, shapeTranslateX, shapeTranslateY, defaultTranslateX, defaultTranslateY} from "../index.ts";
import {RECTANGLE} from "../data.ts";
import {ShapeType} from "../types.ts";


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
    shapeList.push({
        type: RECTANGLE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: 0,
        height: 0,
    })
}

export const rectanglePointerMove = (event: PointerEvent) => {
    const currentShape = shapeList[shapeList.length-1];
    currentShape.width = (event.clientX-defaultTranslateX)/scale*100-currentShape.x-shapeTranslateX;
    currentShape.height = (event.clientY-defaultTranslateY)/scale*100-currentShape.y-shapeTranslateY;
}
