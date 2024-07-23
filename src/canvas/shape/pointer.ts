import {setCanvasTranslate} from "../index.ts";

const lastMove = {
    x: 0,
    y: 0,
}

export const pointerPointerDown = (event: PointerEvent) => {
    lastMove.x = event.clientX;
    lastMove.y = event.clientY;
}


export const pointerPointerMove = (event: PointerEvent) => {
    setCanvasTranslate(event.clientX-lastMove.x, event.clientY-lastMove.y);
    lastMove.x = event.clientX;
    lastMove.y = event.clientY;
}

