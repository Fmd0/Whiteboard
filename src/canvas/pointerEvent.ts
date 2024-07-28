import {ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "../utils/data.ts";
import {pointerPointerDown, pointerPointerMove} from "./shape/pointer.ts";
import {rectanglePointerDown, rectanglePointerMove} from "./shape/rectangle.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./shape/ellipse.ts";
import {linePointerDown, linePointerMove} from "./shape/line.ts";
import {linearPathPointerDown, linearPathPointerMove} from "./shape/linearPath.ts";
import {shapeList, drawType, center} from "./index.ts";
import {repaint} from "./paint.ts";
import { PointerInfoShapeType, PointerInfoType, ShapeType} from "../utils/types.ts";
import {handleMultiPointerEvent} from "./multiPointerEvent.ts";
import {handleSelect} from "./select.ts";


export const multiPointerMap = new Map<number, PointerInfoType>();

export const handlePointerDown = (event: PointerEvent) => {
    // event.preventDefault();

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
    }
}


export const handlePointerMove = (() => {
    return (event: PointerEvent) => {
        // event.preventDefault();

        const pointerInfo = multiPointerMap.get(event.pointerId);
        if (!pointerInfo || pointerInfo.isThrottle) {
            return;
        }

        pointerInfo.isThrottle = true;

        // judge whether is multiple pointer case
        if(multiPointerMap.size === 2 ) {
            let noMove = true;
            multiPointerMap.forEach(pointer => {
                noMove = noMove && (pointer.drawType===POINTER || !hasMoved(pointerInfo.shape!));
            })
            if(noMove) {
                setTimeout(() => {
                    pointerInfo.isThrottle = false;
                }, 14);
                handleMultiPointerEvent(event);
                repaint();
                return;
            }
        }

        if(pointerInfo.drawType!==POINTER && pointerInfo.usedForMultiPointer) {
            return;
        }


        if(pointerInfo.drawType === POINTER) {
            setTimeout(() => {
                pointerInfo.isThrottle = false;
            }, 14);
        }
        else {
            setTimeout(() => {
                pointerInfo.isThrottle = false;
            }, 30);
        }

        switch (drawType) {
            case POINTER: pointerPointerMove(event); break;
            case RECTANGLE: rectanglePointerMove(event); break;
            case ELLIPSE: ellipsePointerMove(event); break;
            case LINE: linePointerMove(event); break;
            case LINEARPATH: linearPathPointerMove(event); break;
        }
        repaint();
    }

})()


export const handlePointerUp = (event: PointerEvent) => {
    // event.preventDefault();

    if(!multiPointerMap.has(event.pointerId)) {
        return;
    }

    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    if(pointerInfo.drawType===POINTER && !hasMoved(pointerInfo.shape!) && !pointerInfo.usedForMultiPointer) {
        handleSelect(event);
    }

    if(pointerInfo.drawType!==POINTER && pointerInfo.shape && hasMoved(pointerInfo.shape)) {
        addShapeToShapeList(pointerInfo.shape);
        // if(pointerInfo.drawType === LINEARPATH) {
        //     repaint();
        // }
    }

    multiPointerMap.delete(event.pointerId);
    center.hasInitialized = false;
}

const addShapeToShapeList = (shape: ShapeType) => {
    // if(shape.type === LINEARPATH) {
    //     const newLinearPathList: LinearPathType[] = [];
    //     const currentLinearPathList = shape.linearPathList!;
    //     const currentLinearPathLength = currentLinearPathList.length;
    //     const gap = 2;
    //     let currentX = currentLinearPathList[0].x;
    //     let currentY = currentLinearPathList[0].y;
    //
    //     for(let i = 0; i < currentLinearPathLength; i+=gap) {
    //         let newIndex = i+gap;
    //         if(i+gap >= currentLinearPathLength) {
    //             newIndex = currentLinearPathLength-1;
    //         }
    //
    //         newLinearPathList.push({
    //             x: currentX,
    //             y: currentY,
    //             width: currentLinearPathList[newIndex].width,
    //             height: currentLinearPathList[newIndex].height,
    //         })
    //         currentX = currentLinearPathList[newIndex].width;
    //         currentY = currentLinearPathList[newIndex].height;
    //     }
    //
    //     shape.linearPathList = newLinearPathList;
    //     shapeList.push(shape);
    //     return;
    // }
    shapeList.push(shape);
}

export const hasMoved = (pointerInfo: PointerInfoShapeType) => {

    if(pointerInfo.type === LINEARPATH) {
        return pointerInfo.linearPathList!.length > 0;
    }

    const deviation = (
        (pointerInfo.x-pointerInfo.width) ** 2 +
        (pointerInfo.y-pointerInfo.height) ** 2
    ) ** 0.5;

    return deviation > 5;
}

