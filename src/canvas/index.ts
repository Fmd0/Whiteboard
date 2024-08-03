import {ShapeStyleType, ShapeType} from "../utils/types.ts";
import {repaint} from "./paint.ts";
import {POINTER} from "../utils/data.ts";


// initialize global variables
export let shapeList: ShapeType[] = [];
export let drawType = POINTER;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const canvas = document.createElement('canvas');
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;
export const devicePixelRatio = window.devicePixelRatio;
canvas.width = Math.floor(canvasWidth * devicePixelRatio);
canvas.height = Math.floor(canvasHeight * devicePixelRatio);
window.document.body.appendChild(canvas);

export const ctx = canvas.getContext("2d")!;
ctx.scale(devicePixelRatio, devicePixelRatio);


export let scale = 100;
export let scaleCopy = 100;
export const defaultTranslateX = Math.floor(canvasWidth/2);
export const defaultTranslateY = Math.floor(canvasHeight/2);
export let shapeTranslateX = 0;
export let shapeTranslateY = 0;
export const center = {
    x: 0,
    y: 0,
    hasInitialized: false,
}
export let selectedShape: ShapeType|null = null;
export let globalStyleConfig: ShapeStyleType = {
    strokeStyle: "#000000",
    lineWidth: 2,
}

ctx.translate(defaultTranslateX, defaultTranslateY);
repaint();


export const setDrawType = (type: string) => {
    drawType = type;
}

export const setGlobalStyleConfig = (newStyleConfig: ShapeStyleType) => {
    globalStyleConfig = newStyleConfig;
}

export const setSelectedShape = (shape: ShapeType|null) => {
    selectedShape = shape;
}

export const setShapeList = (newShapeList: ShapeType[]) => {
    shapeList = newShapeList;
}

export const setCanvasScale = (newScale: number) => {
    ctx.scale(newScale/scale, newScale/scale);
    scale = newScale;
}

export const setCanvasScaleCopy = (newScale: number) => {
    scaleCopy = newScale;
}

export const setCanvasTranslate = (newTranslateX: number, newTranslateY: number) => {
    shapeTranslateX += newTranslateX/scale*100;
    shapeTranslateY += newTranslateY/scale*100;
}


// window.addEventListener('pointerdown', handlePointerDown);
// window.addEventListener('pointermove', handlePointerMove);
// window.addEventListener('pointerup', handlePointerUp);

window.addEventListener('scroll', (event) => {
    event.preventDefault();
}, {
    passive: false,
});

