import {ELLIPSE, ERASER, LINE, LINEARPATH, RECTANGLE} from "../utils/data.ts";
import {paintLinearPath, paintLinearPathSelector} from "./shape/linearPath.ts";
import {paintRectangle, paintRectangleSelector} from "./shape/rectangle.ts";
import {paintEllipse, paintEllipseSelector} from "./shape/ellipse.ts";
import {paintLine, paintLineSelector} from "./shape/line.ts";
import {
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


const multipleValue = 2000;
const backgroundGridGapStarter = 20;
const threshold = 0.4;
const width = 0.25;
const backgroundGridGapWidthMap = {
    20: width,
    80: width*4,
    320: width*16,
    1280: width*64,
    5120: width*256,
    20480: width*1024,
    81920: width*4096
}


const drawBackground = () => {
    let currentBackgroundGridGap = backgroundGridGapStarter;
    while (currentBackgroundGridGap*scale <= multipleValue) {
        currentBackgroundGridGap*=4;
    }

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

    const rowDeviation = Math.floor(window.innerWidth/scale*50/currentBackgroundGridGap)*currentBackgroundGridGap;
    const columnDeviation = Math.floor(window.innerHeight/scale*50/currentBackgroundGridGap)*currentBackgroundGridGap;

    // draw colum grid
    for (let i = shapeTranslateX%currentBackgroundGridGap-rowDeviation-currentBackgroundGridGap ; i < rowHalfLength; i+=currentBackgroundGridGap) {
        ctx.moveTo(i, -columnHalfLength);
        ctx.lineTo(i, columnHalfLength);
    }

    // draw row grid
    for (let i = shapeTranslateY%currentBackgroundGridGap-columnDeviation-currentBackgroundGridGap; i < columnHalfLength; i+=currentBackgroundGridGap) {
        ctx.moveTo(-rowHalfLength, i);
        ctx.lineTo(rowHalfLength, i);
    }

    ctx.lineWidth = backgroundGridGapWidthMap[currentBackgroundGridGap];
    ctx.strokeStyle = "#E2E2E2";
    ctx.stroke();
    ctx.closePath();

    if(multipleValue/scale/currentBackgroundGridGap >= threshold) {
        const nextRowDeviation = Math.floor(window.innerWidth/scale*50/(currentBackgroundGridGap*4))*currentBackgroundGridGap*4;
        const nextRolumnDeviation = Math.floor(window.innerHeight/scale*50/(currentBackgroundGridGap*4))*currentBackgroundGridGap*4;

        ctx.beginPath();

        for (let i = shapeTranslateX%(currentBackgroundGridGap*4)-nextRowDeviation-(currentBackgroundGridGap*4) ; i < rowHalfLength; i+=(currentBackgroundGridGap*4)) {
            ctx.moveTo(i, -columnHalfLength);
            ctx.lineTo(i, columnHalfLength);
        }

        // draw row grid
        for (let i = shapeTranslateY%(currentBackgroundGridGap*4)-nextRolumnDeviation-(currentBackgroundGridGap*4); i < columnHalfLength; i+=(currentBackgroundGridGap*4)) {
            ctx.moveTo(-rowHalfLength, i);
            ctx.lineTo(rowHalfLength, i);
        }

        ctx.lineWidth = backgroundGridGapWidthMap[currentBackgroundGridGap*4];
        ctx.strokeStyle = "#E2E2E2";
        ctx.stroke();
        ctx.closePath();

    }
}


export const repaint = () => {

    // initial work
    ctx.clearRect(
        -defaultTranslateX/scale*100,
        -defaultTranslateY/scale*100,
        window.innerWidth/scale*100,
        window.innerHeight/scale*100
    );
    drawBackground();

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
