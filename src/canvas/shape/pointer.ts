import {setCanvasTranslate} from "../index.ts";
import {multiPointerMap} from "../pointerEvent.ts";
import {POINTER} from "../../utils/data.ts";


export const pointerPointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: POINTER,
        x: event.clientX,
        y: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
    }
}


export const pointerPointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    setCanvasTranslate(event.clientX-pointerInfo.shape!.x, event.clientY-pointerInfo.shape!.y);
    pointerInfo.shape!.x = event.clientX;
    pointerInfo.shape!.y = event.clientY;
    pointerInfo.shape!.clientX = event.clientX;
    pointerInfo.shape!.clientY = event.clientY;
}

