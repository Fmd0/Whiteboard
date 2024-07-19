import rough from 'roughjs';
import {CanvasContentType} from "./types.ts";
import {circlePointerDown, circlePointerMove} from "./circle.ts";
import {linearPathPointerDown, linearPathPointerMove, paintLinearPath, repaintLinearPath} from "./linearPath.ts";
import {CIRCLE, ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "./data.ts";
import {rectanglePointerDown, rectanglePointerMove} from "./rectangle.ts";
import {linePointerDown, linePointerMove} from "./line.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./ellipse.ts";
import {pointerPointerDown, pointerPointerMove} from "./pointer.ts";


export const canvasContent: CanvasContentType[] = [];
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

const ctx = canvas.getContext("2d");
export const rc = rough.canvas(canvas);
export const generator = rc.generator;
const backgroundGridGap = 75;
export let scale = 100;
export let translateX = Math.floor(canvas.width/2);
export let translateY = Math.floor(canvas.height/2);
export let originalTranslateX = Math.floor(canvas.width/2);
export let originalTranslateY = Math.floor(canvas.height/2);



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

export const setCanvasTranslate = (newTranslateX: number, newTranslateY: number) => {
    ctx.translate(newTranslateX, newTranslateY);
    translateX += newTranslateX*scale/100;
    translateY += newTranslateY*scale/100;
    repaint();
}

const drawBackground = (gap: number) => {

    // console.log(translateX-originalTranslateX);
    // console.log(translateY-originalTranslateY);
    // draw background color
    ctx.fillStyle = "#F2F2F2";
    ctx.fillRect(
        -translateX/scale*100,
        -translateY/scale*100,
        canvas.width/scale*100,
        canvas.height/scale*100
    );

    // draw background grid
    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = "#d0d0d0";

    for (let i = 0; i <= Math.floor(canvas.width/scale*50); i+=gap) {
        ctx.beginPath();
        ctx.moveTo(i, -translateY/scale*100);
        ctx.lineTo(i, canvas.height/scale*100-translateY/scale*100);
        ctx.moveTo(-i, -translateY/scale*100);
        ctx.lineTo(-i, canvas.height/scale*100-translateY/scale*100);
        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 0; i <= Math.floor(canvas.height/scale*50); i+=gap) {
        ctx.beginPath();
        ctx.moveTo(-translateX/scale*100, i);
        ctx.lineTo(canvas.width/scale*100-translateX/scale*100, i);
        ctx.moveTo(-translateX/scale*100, -i);
        ctx.lineTo(canvas.width/scale*100-translateX/scale*100, -i);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.translate(-0.5, -0.5);
    ctx.fillStyle = "black";
    ctx.fillRect(-20, -20, 40, 40)
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
    event.preventDefault();
    hasDown = true;
    switch (drawType) {
        case RECTANGLE: rectanglePointerDown(event.clientX, event.clientY); break;
        case CIRCLE: circlePointerDown(event.clientX, event.clientY); break;
        case ELLIPSE: ellipsePointerDown(event.clientX, event.clientY); break;
        case LINE: linePointerDown(event.clientX, event.clientY); break;
        case LINEARPATH: linearPathPointerDown(event.clientX, event.clientY); break;
        case POINTER: pointerPointerDown(event.clientX, event.clientY); break;
    }
}


const handlePointerMove = (() => {
    let isThrottle = false;
    return (event: PointerEvent) => {
        event.preventDefault();
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
            case RECTANGLE: rectanglePointerMove(event.clientX, event.clientY); break;
            case CIRCLE: circlePointerMove(event.clientX, event.clientY); break;
            case ELLIPSE: ellipsePointerMove(event.clientX, event.clientY); break;
            case LINE: linePointerMove(event.clientX, event.clientY); break;
            case LINEARPATH: linearPathPointerMove(event.clientX, event.clientY); break;
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
        canvasContent.pop();
    }
    hasDown = false;
    hasMove = false;
}

const handleWheel = (() => {
    let isThrottle = false;
    return (e: WheelEvent) => {
        e.preventDefault();
        if(isThrottle) {
            return;
        }
        isThrottle = true;
        setTimeout(() => {
            isThrottle = false;
        }, 15)

        if(!e.ctrlKey) {
            setCanvasTranslate(
                -e.deltaX/scale*100,
                -e.deltaY/scale*100,
            );
        }
        else {
            setCanvasScale(scale*(1-e.deltaY*0.01));
        }
    }
})()



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

