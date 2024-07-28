import {selectedShape, setCanvasTranslate} from "../index.ts";
import {multiPointerMap} from "../pointerEvent.ts";
import {ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "../../utils/data.ts";
import {pointerDownWhenRectangleSelected, pointerMoveWhenRectangleSelected} from "./rectangle.ts";
import {pointerDownWhenEllipseSelected, pointerMoveWhenEllipseSelected} from "./ellipse.ts";
import {pointerDownWhenLineSelected, pointerMoveWhenLineSelected} from "./line.ts";
import {pointerDownWhenLinearPathSelected, pointerMoveWhenLinearPathSelected} from "./linearPath.ts";


export const pointerPointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: POINTER,
        x: event.clientX,
        y: event.clientY,
        width: event.clientX,
        height: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
    }

    if(selectedShape) {
        try {
            switch (selectedShape.type) {
                case RECTANGLE: pointerDownWhenRectangleSelected(event); break;
                case ELLIPSE: pointerDownWhenEllipseSelected(event); break;
                case LINE: pointerDownWhenLineSelected(event); break;
                case LINEARPATH: pointerDownWhenLinearPathSelected(event); break;
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

    if (pointerInfo.selectedArea !== undefined) {
        switch (selectedShape!.type) {
            case RECTANGLE: pointerMoveWhenRectangleSelected(event); break;
            case ELLIPSE: pointerMoveWhenEllipseSelected(event); break;
            case LINE: pointerMoveWhenLineSelected(event); break;
            case LINEARPATH: pointerMoveWhenLinearPathSelected(event); break;
        }
    }
    else {
        setCanvasTranslate(
            event.clientX-pointerInfo.shape!.width,
            event.clientY-pointerInfo.shape!.height
        );
    }

    pointerInfo.shape!.width = event.clientX;
    pointerInfo.shape!.height = event.clientY;
    pointerInfo.shape!.clientX = event.clientX;
    pointerInfo.shape!.clientY = event.clientY;
}

