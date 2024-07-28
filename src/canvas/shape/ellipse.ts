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
import {
    paintRectangleSelector,
    pointerDownWhenRectangleSelected,
    pointerMoveWhenRectangleSelected
} from "./rectangle.ts";


const paintEllipse = (shape: ShapeType) => {
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

const ellipsePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: ELLIPSE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        clientX: event.clientX,
        clientY: event.clientY,
    };
}

const ellipsePointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    shape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    shape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}

const selectEllipse = (event: PointerEvent, shape: ShapeType) => {
    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);
    const deviation = 10/scale*100;

    if((pointerX-shapeCenterX)**2/((shapeWidth/2+deviation)**2) +
        (pointerY-shapeCenterY)**2/((shapeHeight/2+deviation)**2) <= 1)  {
        throw shape;
    }
}

const pointerDownWhenEllipseSelected = pointerDownWhenRectangleSelected;

const pointerMoveWhenEllipseSelected = pointerMoveWhenRectangleSelected

const paintEllipseSelector = paintRectangleSelector;


export {
    paintEllipse,
    ellipsePointerDown,
    ellipsePointerMove,
    selectEllipse,
    pointerDownWhenEllipseSelected,
    pointerMoveWhenEllipseSelected,
    paintEllipseSelector
}