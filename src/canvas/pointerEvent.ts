import {CIRCLE, ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "../utils/data.ts";
import {pointerPointerDown, pointerPointerMove} from "./shape/pointer.ts";
import {rectanglePointerDown, rectanglePointerMove} from "./shape/rectangle.ts";
import {circlePointerDown, circlePointerMove} from "./shape/circle.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./shape/ellipse.ts";
import {linePointerDown, linePointerMove} from "./shape/line.ts";
import {linearPathPointerDown, linearPathPointerMove, repaintLinearPath} from "./shape/linearPath.ts";
import {shapeList, drawType} from "./index.ts";
import {repaint} from "./paint.ts";
import {PointerInfoType} from "../utils/types.ts";


export const multiPointerMap = new Map<number, PointerInfoType>();


export const handlePointerDown = (event: PointerEvent) => {
    event.preventDefault();

    if(drawType===POINTER && multiPointerMap.size>=1 || multiPointerMap.size >= 2) {
        return;
    }

    multiPointerMap.set(event.pointerId, {
        hasDown: true,
        hasMove: false,
        isThrottle: false,
        drawType,
    });

    switch (drawType) {
        case POINTER: pointerPointerDown(event); break;
        case RECTANGLE: rectanglePointerDown(event); break;
        case CIRCLE: circlePointerDown(event); break;
        case ELLIPSE: ellipsePointerDown(event); break;
        case LINE: linePointerDown(event); break;
        case LINEARPATH: linearPathPointerDown(event); break;
    }
}


export const handlePointerMove = (() => {
    return (event: PointerEvent) => {
        event.preventDefault();

        const pointerInfo = multiPointerMap.get(event.pointerId);
        if (!pointerInfo || !pointerInfo.hasDown || pointerInfo.isThrottle) {
            return;
        }

        pointerInfo.isThrottle = true;

        if(drawType === POINTER) {
            setTimeout(() => {
                pointerInfo.isThrottle = false;
            }, 30)
        }
        else {
            setTimeout(() => {
                pointerInfo.isThrottle = false;
            }, 35)
        }

        pointerInfo.hasMove = true;

        switch (drawType) {
            case POINTER: pointerPointerMove(event); break;
            case RECTANGLE: rectanglePointerMove(event); break;
            case CIRCLE: circlePointerMove(event); break;
            case ELLIPSE: ellipsePointerMove(event); break;
            case LINE: linePointerMove(event); break;
            case LINEARPATH: linearPathPointerMove(event); break;
        }

        if(pointerInfo.drawType === LINEARPATH) {
            repaintLinearPath();
            return;
        }

        repaint();
    }

})()


export const handlePointerUp = (event: PointerEvent) => {
    event.preventDefault();
    if(!multiPointerMap.has(event.pointerId)) {
        return;
    }

    const pointerInfo = multiPointerMap.get(event.pointerId)!;

    if(!pointerInfo.hasMove && pointerInfo.drawType !== POINTER) {
        return;
    }

    if(pointerInfo.drawType !== LINEARPATH && pointerInfo.shape) {
        shapeList.push(pointerInfo.shape)
    }

    multiPointerMap.delete(event.pointerId);
}