import {ShapeType} from "../utils/types.ts";
import {handleWheel} from "./wheelEvent.ts";
import {handlePointerDown, handlePointerMove, handlePointerUp} from "./pointerEvent.ts";
import {repaint} from "./paint.ts";
import {POINTER} from "../utils/data.ts";


// initialize some global variables
export const shapeList: ShapeType[] = [];
export let drawType = POINTER;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
window.document.body.appendChild(canvas);

export const ctx = canvas.getContext("2d")!;
export const backgroundGridGap = 75;
export let scale = 100;
export const defaultTranslateX = Math.floor(canvas.width/2);
export const defaultTranslateY = Math.floor(canvas.height/2);
export let shapeTranslateX = 0;
export let shapeTranslateY = 0;
export const center = {
    x: 0,
    y: 0,
    hasInitialized: false,
}
export let selectedShape: ShapeType|null = null;

export const setDrawType = (type: string) => {
    drawType = type;
    // if(type !== POINTER) {
    //     canvas.style.cursor = "crossHair";
    // }
    // else {
    //     canvas.style.cursor = "default";
    // }
}

export const setSelectedShape = (shape: ShapeType|null) => {
    selectedShape = shape;
}

export const setCanvasScale = (newScale: number) => {
    ctx.scale(newScale/scale, newScale/scale);
    scale = newScale;
}

export const setCanvasTranslate = (newTranslateX: number, newTranslateY: number) => {
    shapeTranslateX += newTranslateX/scale*100;
    shapeTranslateY += newTranslateY/scale*100;
}


ctx.translate(defaultTranslateX/scale*100, defaultTranslateY/scale*100);
repaint();

window.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);



window.addEventListener('wheel', handleWheel, {
    passive: false,
});


window.addEventListener('scroll', (event) => {
    event.preventDefault();
}, {
    passive: false,
});

