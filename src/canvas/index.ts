import {circlePointerDown, circlePointerMove, paintCircle} from "./shape/circle.ts";
import {
    linearPathPointerDown,
    linearPathPointerMove,
    paintLinearPath,
    repaintLinearPath
} from "./shape/linearPath.ts";
import {CIRCLE, ELLIPSE, LINE, LINEARPATH, POINTER, RECTANGLE} from "./data.ts";
import {linePointerDown, linePointerMove, paintLine} from "./shape/line.ts";
import {ellipsePointerDown, ellipsePointerMove, paintEllipse} from "./shape/ellipse.ts";
import {pointerPointerDown, pointerPointerMove} from "./shape/pointer.ts";
import {ShapeType} from "./types.ts";
import {paintRectangle, rectanglePointerDown, rectanglePointerMove} from "./shape/rectangle.ts";
import {handleWheel} from "./pointerEvent.ts";


export const shapeList: ShapeType[] = [];
let drawType = POINTER;
let hasDown = false;
let hasMove = false;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;


// initialize
const index = document.createElement('canvas');
index.width = canvasWidth;
index.height = canvasHeight;
window.document.body.appendChild(index);

export const ctx = index.getContext("2d")!;
// export const rc = rough.canvas(index);
// export const generator = rc.generator;
const backgroundGridGap = 75;
export let scale = 100;
export const defaultTranslateX = Math.floor(index.width/2);
export const defaultTranslateY = Math.floor(index.height/2);
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
        index.width/scale*100,
        index.height/scale*100
    );

    // draw background grid

    // draw row grid
    ctx.beginPath();
    const rowHalfLength = Math.ceil(index.width/scale*50);
    const columnHalfLength = Math.ceil(index.height/scale*100/2);

    const rowDeviation = Math.floor(index.width/scale*50/gap)*gap;
    const columnDeviation = Math.floor(index.height/scale*50/gap)*gap;

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
}


const repaint = () => {
    if(hasDown && drawType === LINEARPATH) {
        repaintLinearPath();
        return;
    }

    // initial work
    ctx.clearRect(-defaultTranslateX,-defaultTranslateY, index.width, index.width);
    drawBackground(backgroundGridGap);

    shapeList.forEach(shape => {
        switch (shape.type) {
            case RECTANGLE: paintRectangle(shape); break;
            case CIRCLE: paintCircle(shape); break;
            case ELLIPSE: paintEllipse(shape); break;
            case LINE: paintLine(shape); break;
            case LINEARPATH: paintLinearPath(shape); break;
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
        case ELLIPSE: ellipsePointerDown(event); break;
        case LINE: linePointerDown(event); break;
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
            case ELLIPSE: ellipsePointerMove(event); break;
            case LINE: linePointerMove(event); break;
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

