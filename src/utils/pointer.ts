import {setCanvasTranslate} from "./canvas.ts";

const lastMove = {
    x: 0,
    y: 0,
}

export const pointerPointerDown = (clientX: number, clientY: number) => {
    lastMove.x = clientX;
    lastMove.y = clientY;
}


export const pointerPointerMove = (clientX: number, clientY: number) => {
    setCanvasTranslate(clientX-lastMove.x, clientY-lastMove.y);
    lastMove.x = clientX;
    lastMove.y = clientY;
}

