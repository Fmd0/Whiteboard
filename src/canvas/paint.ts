import {ELLIPSE, ERASER, LINE, LINEARPATH, RECTANGLE} from "../utils/data.ts";
import {paintLinearPath, paintLinearPathSelector} from "./shape/linearPath.ts";
import {paintRectangle, paintRectangleSelector} from "./shape/rectangle.ts";
import {paintEllipse, paintEllipseSelector} from "./shape/ellipse.ts";
import {paintLine, paintLineSelector} from "./shape/line.ts";
import {
    backgroundGridGap,
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale, selectedShape,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "./index.ts";
import {hasMoved, multiPointerMap} from "./pointerEvent.ts";
import {paintEraser} from "./shape/eraser.ts";


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

    for(const shape of shapeList) {
        switch (shape.type) {
            case RECTANGLE: paintRectangle(shape); break;
            case ELLIPSE: paintEllipse(shape); break;
            case LINE: paintLine(shape); break;
            case LINEARPATH: paintLinearPath(shape); break;
        }
    }

    multiPointerMap.forEach(pointerInfo => {
        const shape = pointerInfo.shape;
        if(shape && hasMoved(shape)) {
            switch (shape.type) {
                case RECTANGLE: paintRectangle(shape); break;
                case ELLIPSE: paintEllipse(shape); break;
                case LINE: paintLine(shape); break;
                case LINEARPATH: paintLinearPath(shape); break;
                case ERASER: paintEraser(shape); break;
            }
        }
    })

    if(selectedShape) {
        switch (selectedShape.type) {
            case RECTANGLE: paintRectangleSelector(selectedShape); break;
            case ELLIPSE: paintEllipseSelector(selectedShape); break;
            case LINE: paintLineSelector(selectedShape); break;
            case LINEARPATH: paintLinearPathSelector(selectedShape); break;
        }
    }
}
