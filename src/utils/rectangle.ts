import {ctx, scale, shapeList, shapeTranslateX, shapeTranslateY, defaultTranslateX, defaultTranslateY} from "./canvas.ts";
import {RECTANGLE} from "./data.ts";
import {ShapeType} from "./types.ts";


// export const rectangleRoughPointerDown = (clientX: number, clientY: number) => {
//     canvasContent.push({
//         type: RECTANGLE,
//         x: (clientX-translateX)*100/scale,
//         y: (clientY-translateY)*100/scale,
//         width: 0,
//         height: 0,
//         drawable: generator.rectangle(clientX, clientY, 0, 0),
//     })
// }
//
//
// export const rectangleRoughPointerMove = (clientX: number, clientY: number) => {
//         const currentContent = canvasContent[canvasContent.length-1];
//         currentContent.width = (clientX-translateX)*100/scale-currentContent.x;
//         currentContent.height = (clientY-translateY)*100/scale-currentContent.y;
//         currentContent.drawable = generator.rectangle(
//             currentContent.x,
//             currentContent.y,
//             currentContent.width,
//             currentContent.height,
//         );
// }

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
