import {CanvasContentPointType, CanvasContentType, ShapeType} from "./types.ts";
import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    generator,
    rc, scale,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "./canvas.ts";
import {Drawable} from "roughjs/bin/core";
import {LINEARPATH} from "./data.ts";

let prePoint = {
    x: 0,
    y: 0,
}

// export const repaintLinearPath = () => {
//     const currentCanvasContent = canvasContent[canvasContent.length-1];
//     rc.draw(currentCanvasContent.points?.[currentCanvasContent.points?.length-1].drawable as Drawable)
// }
//
// export const paintLinearPath = (content: CanvasContentType) => {
//     content.points?.forEach((point) => {
//         rc.draw(point.drawable!);
//     })
// }
//
// export const linearPathPointerDown = (clientX: number, clientY: number) => {
//     canvasContent.push({
//         type: LINEARPATH,
//         x: clientX,
//         y: clientY,
//     })
// }
//
//
// export const linearPathPointerMove =  (clientX: number, clientY: number) => {
//         const currentContent = canvasContent[canvasContent.length-1];
//
//         if(!currentContent.points) {
//             currentContent.points = [];
//             currentContent.points.push({
//                 x: currentContent.x,
//                 y: currentContent.y,
//                 width: clientX,
//                 height: clientY,
//                 drawable: generator.linearPath([[currentContent.x, currentContent.y], [clientX, clientY]]),
//             })
//             return;
//         }
//
//         const currentPoint = currentContent.points?.[currentContent.points?.length-1] as CanvasContentPointType;
//         currentContent.points?.push({
//             x: currentPoint.width,
//             y: currentPoint.height,
//             width: clientX,
//             height: clientY,
//             drawable: generator.linearPath([[currentPoint.width, currentPoint.height], [clientX, clientY]]),
//         })
// }

export const paintLinePath = (shape: ShapeType) => {
    ctx.beginPath();
    ctx.moveTo(shape.x+shapeTranslateX, shape.y+shapeTranslateY);
    ctx.lineTo(shape.width!+shapeTranslateX, shape.height!+shapeTranslateY);

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

export const repaintLinearPath = () => {
    const currentShape = shapeList[shapeList.length - 1];
    paintLinePath(currentShape);
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