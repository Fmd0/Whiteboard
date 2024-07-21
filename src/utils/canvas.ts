import rough from 'roughjs';
import {circlePointerDown, circlePointerMove, paintCircle} from "./circle.ts";
import {
    linearPathPointerDown,
    linearPathPointerMove,
    paintLinearPath,
    paintLinePath,
    repaintLinearPath
} from "./linearPath.ts";
import {CIRCLE, ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "./data.ts";
import {linePointerDown, linePointerMove} from "./line.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./ellipse.ts";
import {pointerPointerDown, pointerPointerMove} from "./pointer.ts";
import {ShapeType} from "./types.ts";
import {paintRectangle, rectanglePointerDown, rectanglePointerMove} from "./rectangle.ts";
import {handleWheel} from "./pointerEvent.ts";


export const shapeList: ShapeType[] = [];
let drawType = POINTER;
let hasDown = false;
let hasMove = false;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;


// initialize
const canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
window.document.body.appendChild(canvas);

export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const rc = rough.canvas(canvas);
export const generator = rc.generator;
const backgroundGridGap = 75;
export let scale = 100;
export const defaultTranslateX = Math.floor(canvas.width/2);
export const defaultTranslateY = Math.floor(canvas.height/2);
export let shapeTranslateX = 0;
export let shapeTranslateY = 0;



ctx.translate(defaultTranslateX/scale*100, defaultTranslateY/scale*100);


export const setDrawType = (type: string) => {
    drawType = type;
}

export const setCanvasScale = (newScale: number) => {
    ctx.scale(newScale/scale, newScale/scale);
    scale = newScale;
    repaint();
}



export const setCanvasTranslate = (newTranslateX: number, newTranslateY: number) => {
    shapeTranslateX += newTranslateX/scale*100;
    shapeTranslateY += newTranslateY/scale*100;
    repaint();
}

const drawBackground = (gap: number) => {

    // draw background color
    ctx.fillStyle = "#F2F2F2";
    ctx.fillRect(
        -defaultTranslateX/scale*100,
        -defaultTranslateY/scale*100,
        canvas.width/scale*100,
        canvas.height/scale*100
    );

    // draw background grid
    // ctx.translate(0.5, 0.5);

    // draw grid
    ctx.beginPath();
    const rowHalfLength = Math.ceil(canvas.width/scale*50);
    const columnHalfLength = Math.ceil(canvas.height/scale*100/2);

    const rowDeviation = Math.floor(canvas.width/scale*50/gap)*gap;
    const columnDeviation = Math.floor(canvas.height/scale*50/gap)*gap;

    // draw colum grid
    for (let i = shapeTranslateX%gap-rowDeviation-gap ; i < rowHalfLength; i+=gap) {
        ctx.moveTo(i, -columnHalfLength);
        ctx.lineTo(i, columnHalfLength);
    }

    // draw row grid
    for (let i = shapeTranslateY%gap-columnDeviation-gap; i < columnHalfLength; i+=gap) {
        ctx.moveTo(-rowHalfLength, i);
        ctx.lineTo(rowHalfLength, i);
    }
    ctx.strokeStyle = "#c0c0c0";
    ctx.stroke();
    ctx.closePath();
    // ctx.translate(-0.5, -0.5);
}


const repaint = () => {
    if(hasDown && drawType === LINEARPATH) {
        repaintLinearPath();
        return;
    }

    // initial work
    ctx.clearRect(-defaultTranslateX,-defaultTranslateY, canvas.width, canvas.width);
    drawBackground(backgroundGridGap);

    shapeList.forEach(shape => {
        switch (shape.type) {
            case RECTANGLE: paintRectangle(shape); break;
            case CIRCLE: paintCircle(shape); break;
            case LINEARPATH: paintLinePath(shape); break;
        }
    })
}

const handlePointerDown = (event: PointerEvent) => {
    event.preventDefault();
    hasDown = true;
    switch (drawType) {
        case POINTER: pointerPointerDown(event.clientX, event.clientY); break;
        case RECTANGLE: rectanglePointerDown(event); break;
        case CIRCLE: circlePointerDown(event); break;
        // case CIRCLE: circleRoughPointerDown(event.clientX, event.clientY); break;
        // case ELLIPSE: ellipsePointerDown(event.clientX, event.clientY); break;
        // case LINE: linePointerDown(event.clientX, event.clientY); break;
        case LINEARPATH: linearPathPointerDown(event); break;
    }
}


const handlePointerMove = (() => {
    let isThrottle = false;
    return (event: PointerEvent) => {
        event.preventDefault();
        // console.log(event.pointerId);
        if (!hasDown || isThrottle) {
            return;
        }
        isThrottle = true;

        if(drawType === POINTER) {
            setTimeout(() => {
                isThrottle = false;
            }, 30)
        }
        else {
            setTimeout(() => {
                isThrottle = false;
            }, 35)
        }
        hasMove = true;
        switch (drawType) {
            case POINTER: pointerPointerMove(event.clientX, event.clientY); break;
            case RECTANGLE: rectanglePointerMove(event); break;
            case CIRCLE: circlePointerMove(event); break;
            // case CIRCLE: circleRoughPointerMove(event.clientX, event.clientY); break;
            // case ELLIPSE: ellipsePointerMove(event.clientX, event.clientY); break;
            // case LINE: linePointerMove(event.clientX, event.clientY); break;
            case LINEARPATH: linearPathPointerMove(event); break;
        }

        if(drawType !== POINTER) {
            repaint();
        }
    }

})()


const handlePointerUp = (event: PointerEvent) => {
    event.preventDefault();
    if(!hasDown) {
        return;
    }
    if(!hasMove && drawType !== POINTER) {
        shapeList.pop();
    }
    hasDown = false;
    hasMove = false;
}


drawBackground(backgroundGridGap);


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

