import {CIRCLE, ELLIPSE, LINE, LINEARPATH, RECTANGLE} from "../utils/data.ts";
import {paintLinearPath} from "./shape/linearPath.ts";
import {paintRectangle} from "./shape/rectangle.ts";
import {paintCircle} from "./shape/circle.ts";
import {paintEllipse} from "./shape/ellipse.ts";
import {paintLine} from "./shape/line.ts";
import {
    backgroundGridGap,
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "./index.ts";
import {multiPointerMap} from "./pointerEvent.ts";


const drawBackground = (gap: number) => {

    // draw background color
    ctx.fillStyle = "#F2F2F2";
    ctx.fillRect(
        -defaultTranslateX/scale*100,
        -defaultTranslateY/scale*100,
        window.innerWidth/scale*100,
        window.innerHeight/scale*100
    );

    // draw background grid

    // draw row grid
    ctx.beginPath();
    const rowHalfLength = Math.ceil(window.innerWidth/scale*50);
    const columnHalfLength = Math.ceil(window.innerHeight/scale*100/2);

    const rowDeviation = Math.floor(window.innerWidth/scale*50/gap)*gap;
    const columnDeviation = Math.floor(window.innerHeight/scale*50/gap)*gap;

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


export const repaint = () => {


    // initial work
    ctx.clearRect(
        -defaultTranslateX/scale*100,
        -defaultTranslateY/scale*100,
        window.innerWidth/scale*100,
        window.innerHeight/scale*100
    );
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

    multiPointerMap.forEach(pointer => {
        const shape = pointer.shape;
        if(shape) {
            switch (shape.type) {
                case RECTANGLE: paintRectangle(shape); break;
                case CIRCLE: paintCircle(shape); break;
                case ELLIPSE: paintEllipse(shape); break;
                case LINE: paintLine(shape); break;
                case LINEARPATH: paintLinearPath(shape); break;
            }
        }
    })
}
