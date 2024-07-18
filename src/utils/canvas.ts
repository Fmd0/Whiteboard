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
// const canvasWidth = 6000;
// const canvasHeight = 4000;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;


// initialize
const canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
window.document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
export const rc = rough.canvas(canvas);
export const generator = rc.generator;
const backgroundGridGap = 50;
export let scale = 100;
export const translateX = Math.floor(canvas.width/2);
export const translateY = Math.floor(canvas.height/2);



window.ctx = ctx;
// ctx.scale(2,2)
ctx.translate(translateX, translateY);


export const setDrawType = (type: string) => {
    drawType = type;
}

export const setCanvasScale = (newScale: number) => {
    ctx.scale(newScale/scale, newScale/scale);
    scale = newScale;
    repaint();
}

const drawBackground = (gap: number) => {

    // draw background color
    ctx.fillStyle = "#F2F2F2";
    ctx.fillRect(-translateX, -translateY, canvas.width, canvas.height);

    // draw background grid
    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = "#e0e0e0";
    for (let i = gap; i < canvas.width; i+=gap) {
        ctx.beginPath();
        ctx.moveTo(i-translateX, -translateY);
        ctx.lineTo(i-translateX, canvas.height-translateY);
        ctx.stroke();
        ctx.closePath();
    }

    for (let i = gap; i < canvas.height; i+=gap) {
        ctx.beginPath();
        ctx.moveTo(-translateX, i-translateY);
        ctx.lineTo(canvas.width-translateX, i-translateY);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.translate(-0.5, -0.5);
}


const repaint = () => {
    if(drawType === LINEARPATH) {
        repaintLinearPath();
        return;
    }
    ctx.clearRect(-translateX,-translateY, canvas.width, canvas.width);
    drawBackground(backgroundGridGap);
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



drawBackground(backgroundGridGap);
window.addEventListener('pointerdown', handlePointerDown);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);
// window.addEventListener('wheel', (e) => {
//     e.preventDefault();
// }, {
//     passive: false,
// });
