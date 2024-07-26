import {selectedShape, setCanvasTranslate} from "../index.ts";
import {multiPointerMap} from "../pointerEvent.ts";
import {POINTER, RECTANGLE} from "../../utils/data.ts";
import {pointerDownSelectRectangle, pointerMoveSelectRectangle} from "./rectangle.ts";


export const pointerPointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: POINTER,
        x: event.clientX,
        y: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
    }

    if(selectedShape) {
        try {
            switch (selectedShape.type) {
                case RECTANGLE: pointerDownSelectRectangle(event); break;
            }
        }
        catch (area) {
            // console.log(area);
            pointerInfo.selectedArea = area;
        }
    }
}


export const pointerPointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const translateX = event.clientX-pointerInfo.shape!.x;
    const translateY = event.clientY-pointerInfo.shape!.y;

    if (pointerInfo.selectedArea !== undefined) {
        switch (selectedShape!.type) {
            case RECTANGLE: pointerMoveSelectRectangle(event, pointerInfo.selectedArea); break;
        }
    }
    else {
        setCanvasTranslate(translateX, translateY);
    }

    pointerInfo.shape!.x = event.clientX;
    pointerInfo.shape!.y = event.clientY;
    pointerInfo.shape!.clientX = event.clientX;
    pointerInfo.shape!.clientY = event.clientY;
}

