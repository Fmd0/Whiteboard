import rough from 'roughjs';
import {circlePointerDown, circlePointerMove, paintCircle} from "./circle.ts";
import {linearPathPointerDown, linearPathPointerMove, paintLinearPath, repaintLinearPath} from "./linearPath.ts";
import {CIRCLE, ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "./data.ts";
import {linePointerDown, linePointerMove} from "./line.ts";
import {ellipsePointerDown, ellipsePointerMove} from "./ellipse.ts";
import {pointerPointerDown, pointerPointerMove} from "./pointer.ts";
import {ShapeType} from "./types.ts";
import {paintRectangle, rectanglePointerDown, rectanglePointerMove} from "./rectangle.ts";


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
const backgroundGridGap = 80;
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
    ctx.translate(0.5, 0.5);

    // draw grid
    ctx.beginPath();
    const rowLength = Math.ceil(canvas.width/scale*100);
    const rowHalfLength = Math.ceil(canvas.width/scale*50);

    const columnHalfLength = Math.ceil(canvas.height/scale*100/2);
    const rowDeviation = Math.floor(canvas.width/scale*50/gap)*gap;

    // draw colum grid
    for (let i = 0; i < rowLength; i+=gap) {
        const positive = (i+shapeTranslateX%rowLength+rowLength)%rowLength-rowHalfLength;
        ctx.moveTo(positive, -columnHalfLength);
        ctx.lineTo(positive, columnHalfLength);
    }

    // draw row grid
    // for (let i = 0; i < columnHalfLength; i+=gap) {
    //     const positiveGrid = i+shapeTranslateY>columnHalfLength?i+shapeTranslateY-2*columnHalfLength:i+shapeTranslateY;
    //     const negativeGrid = -i+shapeTranslateY<-columnHalfLength?-i+shapeTranslateY+2*columnHalfLength:-i+shapeTranslateY;
    //     ctx.moveTo(-rowHalfLength, positiveGrid);
    //     ctx.lineTo(rowHalfLength, positiveGrid);
    //     ctx.moveTo(-rowHalfLength, negativeGrid);
    //     ctx.lineTo(rowHalfLength, negativeGrid);
    // }
    ctx.strokeStyle = "#c0c0c0";
    ctx.stroke();
    ctx.closePath();

    ctx.translate(-0.5, -0.5);
    // ctx.fillStyle = "black";
    // ctx.fillRect(-20, -20, 40, 40)
}


const repaint = () => {
    // if(hasDown && drawType === LINEARPATH) {
    //     repaintLinearPath();
    //     return;
    // }

    // initial work
    ctx.clearRect(-defaultTranslateX,-defaultTranslateY, canvas.width, canvas.width);
    drawBackground(backgroundGridGap);

    shapeList.forEach(shape => {
        switch (shape.type) {
            case RECTANGLE: paintRectangle(shape); break;
            case CIRCLE: paintCircle(shape); break;
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
        // case LINEARPATH: linearPathPointerDown(event.clientX, event.clientY); break;
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
            // case LINEARPATH: linearPathPointerMove(event.clientX, event.clientY); break;
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

