import rough from 'roughjs';
import {CanvasContentType} from "./types.ts";
import {circlePointerDown, circlePointerMove} from "./circle.ts";
import {linearPathPointerDown, linearPathPointerMove, paintLinearPath, repaintLinearPath} from "./linearPath.ts";
import {CIRCLE, ELLIPSE, LINE, LINEARPATH, RECTANGLE} from "./data.ts";
import {rectanglePointerDown, rectanglePointerMove} from "./rectangle.ts";
import {linePointerDown, linePointerMove} from "./line.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./ellipse.ts";


export const canvasContent: CanvasContentType[] = [];
let drawType = RECTANGLE;
let hasDown = false;
let hasMove = false;


// initialize
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.document.body.appendChild(canvas);

export const ctx = canvas.getContext("2d");
export const rc = rough.canvas(canvas);
export const generator = rc.generator;

export const setDrawType = (type: string) => {
    drawType = type;
}

const repaint = () => {

    if(drawType === LINEARPATH) {
        repaintLinearPath();
        return;
    }

    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    canvasContent.forEach(c => {
        if(c.type === LINEARPATH) {
            paintLinearPath(c);
            return;
        }
        rc.draw(c.drawable!)
    })
}

const handlePointerDown = (event: PointerEvent) => {
    hasDown = true;
    switch (drawType) {
        case RECTANGLE: rectanglePointerDown(event.clientX, event.clientY); break;
        case CIRCLE: circlePointerDown(event.clientX, event.clientY); break;
        case ELLIPSE: ellipsePointerDown(event.clientX, event.clientY); break;
        case LINE: linePointerDown(event.clientX, event.clientY); break;
        case LINEARPATH: linearPathPointerDown(event.clientX, event.clientY); break;
    }
}


const handlePointerMove = (() => {
    let isThrottle = false;
    return (event: PointerEvent) => {
        if (!hasDown || isThrottle) {
            return;
        }
        isThrottle = true;
        setTimeout(() => {
            isThrottle = false;
        }, 35)
        hasMove = true;


        switch (drawType) {
            case RECTANGLE: rectanglePointerMove(event.clientX, event.clientY); break;
            case CIRCLE: circlePointerMove(event.clientX, event.clientY); break;
            case ELLIPSE: ellipsePointerMove(event.clientX, event.clientY); break;
            case LINE: linePointerMove(event.clientX, event.clientY); break;
            case LINEARPATH: linearPathPointerMove(event.clientX, event.clientY); break;
        }

        repaint();
    }

})()


const handlePointerUp = () => {
    if(!hasDown) {
        return;
    }
    if(!hasMove) {
        canvasContent.pop();
    }
    hasDown = false;
    hasMove = false;
}


window.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);
