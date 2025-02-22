import {ELLIPSE, ERASER, LINE, LINEARPATH, POINTER, RECTANGLE} from "../utils/data.ts";
import {pointerPointerDown} from "./shape/pointer.ts";
import {rectanglePointerDown} from "./shape/rectangle.ts";
import {ellipsePointerDown} from "./shape/ellipse.ts";
import {linePointerDown} from "./shape/line.ts";
import {linearPathPointerDown} from "./shape/linearPath.ts";
import {drawType} from "./index.ts";
import {PointerInfoShapeType, PointerInfoType} from "../utils/types.ts";
import {eraserPointerDown} from "./shape/eraser.ts";


export const multiPointerMap = new Map<number, PointerInfoType>();

export const handlePointerDown = (event: PointerEvent) => {

    if(multiPointerMap.size >= 2) {
        return;
    }

    multiPointerMap.set(event.pointerId, {
        isThrottle: false,
        drawType,
        usedForMultiPointer: false,
    });

    switch (drawType) {
        case POINTER: pointerPointerDown(event); break;
        case RECTANGLE: rectanglePointerDown(event); break;
        case ELLIPSE: ellipsePointerDown(event); break;
        case LINE: linePointerDown(event); break;
        case LINEARPATH: linearPathPointerDown(event); break;
        case ERASER: eraserPointerDown(event); break;
    }
}
//
//
// export const handlePointerMove = (() => {
//     return (event: PointerEvent) => {
//         const pointerInfo = multiPointerMap.get(event.pointerId);
//         if (!pointerInfo || pointerInfo.isThrottle) {
//             return;
//         }
//
//         pointerInfo.isThrottle = true;
//
//         // judge whether is multiple pointer case
//         if(multiPointerMap.size === 2 ) {
//             let noMove = true;
//             multiPointerMap.forEach(pointer => {
//                 noMove = noMove && (pointer.drawType===POINTER || !hasMoved(pointerInfo.shape!));
//             })
//             if(noMove) {
//                 setTimeout(() => {
//                     pointerInfo.isThrottle = false;
//                 }, 14);
//                 handleMultiPointerEvent(event);
//                 repaint();
//                 return;
//             }
//         }
//
//         if(pointerInfo.drawType!==POINTER && pointerInfo.usedForMultiPointer) {
//             return;
//         }
//
//
//         if(pointerInfo.drawType === POINTER) {
//             setTimeout(() => {
//                 pointerInfo.isThrottle = false;
//             }, 14);
//         }
//         else {
//             setTimeout(() => {
//                 pointerInfo.isThrottle = false;
//             }, 30);
//         }
//
//         switch (drawType) {
//             case POINTER: pointerPointerMove(event); break;
//             case RECTANGLE: rectanglePointerMove(event); break;
//             case ELLIPSE: ellipsePointerMove(event); break;
//             case LINE: linePointerMove(event); break;
//             case LINEARPATH: linearPathPointerMove(event); break;
//             case ERASER: eraserPointerMove(event); break;
//         }
//         repaint();
//     }
//
// })()
//
//
// export const handlePointerUp = (event: PointerEvent) => {
//     if(!multiPointerMap.has(event.pointerId)) {
//         return;
//     }
//
//     const pointerInfo = multiPointerMap.get(event.pointerId)!;
//     if(pointerInfo.drawType===POINTER && pointerInfo.shape && !hasMoved(pointerInfo.shape) && !pointerInfo.usedForMultiPointer) {
//         handleSelect(event);
//     }
//
//     if(pointerInfo.drawType!==POINTER && pointerInfo.drawType !== ERASER && pointerInfo.shape && hasMoved(pointerInfo.shape)) {
//         shapeList.push(pointerInfo.shape);
//     }
//
//     if(pointerInfo.drawType === ERASER) {
//         setShapeList(shapeList.filter(shape => {
//             return shape.hasDeleted !== true;
//         }));
//         multiPointerMap.delete(event.pointerId);
//         repaint();
//     }
//
//     multiPointerMap.delete(event.pointerId);
//     center.hasInitialized = false;
// }
//
export const hasMoved = (pointerInfo: PointerInfoShapeType) => {

    if(pointerInfo.type === LINEARPATH || pointerInfo.type === ERASER) {
        return pointerInfo.linearPathList!.length > 1;
    }

    const deviation = (
        (pointerInfo.x-pointerInfo.width!) ** 2 +
        (pointerInfo.y-pointerInfo.height!) ** 2
    ) ** 0.5;

    return deviation > 5;
}

