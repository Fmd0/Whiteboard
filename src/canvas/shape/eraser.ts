import {multiPointerMap} from "../pointerEvent.ts";
import {
    ctx,
    defaultTranslateX,
    defaultTranslateY,
    scale,
    shapeList,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {CANVAS_BACKGROUND_COLOR, ELLIPSE, ERASER, ERASER_WIDTH, LINE, LINEARPATH, RECTANGLE} from "../../utils/data.ts";
import {LinearPathType, ShapeType} from "../../utils/types.ts";


const paintEraser = (shape: ShapeType) => {
    ctx.save();
    ctx.beginPath();

    const linearPathList = shape.linearPathList!;
    const linearPathListLength = linearPathList.length;
    ctx.moveTo(linearPathList[0].x+shapeTranslateX, linearPathList[0].y+shapeTranslateY);
    for (let i = 1; i < linearPathListLength; i++) {
        ctx.lineTo(linearPathList[i].x+shapeTranslateX, linearPathList[i].y+shapeTranslateY);
    }

    ctx.strokeStyle = shape.styleConfig.strokeStyle;
    ctx.lineWidth = shape.styleConfig.lineWidth/scale*100;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}


const eraserPointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const shapeX = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const shapeY = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    pointerInfo.shape = {
        type: ERASER,
        x: shapeX,
        y: shapeY,
        clientX: event.clientX,
        clientY: event.clientY,
        linearPathList: [{
            x: shapeX,
            y: shapeY,
        }],
        styleConfig: {
            strokeStyle: CANVAS_BACKGROUND_COLOR,
            lineWidth: ERASER_WIDTH,
        }
    }
}

const eraserPointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    const shapeX = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const shapeY = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    const currentShape =  {
        x: shapeX,
        y: shapeY,
    };

    shape.linearPathList!.push(currentShape);

    shapeList.forEach(shape => {
        if(shape.hasDeleted === true) {
            return;
        }

        switch(shape.type) {
            case RECTANGLE: eraseRectangle(currentShape, shape); break;
            case ELLIPSE: eraseEllipse(currentShape, shape); break;
            case LINE: eraseLine(currentShape, shape); break;
            case LINEARPATH: eraseLinearPath(currentShape, shape); break;
        }
    })
}


const eraseRectangle = (erase: LinearPathType, shape: ShapeType) => {
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);

    const eraserPointX = erase.x + shapeTranslateX;
    const eraserPointY = erase.y + shapeTranslateY;

    const deviation = ERASER_WIDTH/scale*100/2;

    const eraserPointXInLine = Math.abs(eraserPointX-(shapeCenterX-shapeWidth/2))<=deviation ||
        Math.abs(eraserPointX-(shapeCenterX+shapeWidth/2))<=deviation;
    const eraserPointYInLine = Math.abs(eraserPointY-(shapeCenterY-shapeHeight/2))<=deviation ||
        Math.abs(eraserPointY-(shapeCenterY+shapeHeight/2))<=deviation;

    const eraserPointXInScope = eraserPointX>=shapeCenterX-shapeWidth/2-deviation &&
        eraserPointX<=shapeCenterX+shapeWidth/2+deviation;
    const eraserPointYInScope = eraserPointY>=shapeCenterY-shapeHeight/2-deviation &&
        eraserPointY<=shapeCenterY+shapeHeight/2+deviation;

    if(eraserPointXInLine&&eraserPointYInScope || eraserPointYInLine&&eraserPointXInScope) {
        shape.hasDeleted = true;
    }
}

const eraseEllipse = (erase: LinearPathType, shape: ShapeType) => {
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);
    const deviation = ERASER_WIDTH/scale*100;

    const eraserPointX = erase.x + shapeTranslateX;
    const eraserPointY = erase.y + shapeTranslateY;

    if(Math.abs((eraserPointX-shapeCenterX)**2/((shapeWidth/2)**2) +
        (eraserPointY-shapeCenterY)**2/((shapeHeight/2)**2) - 1) <=
        deviation/((shapeWidth+shapeHeight)/2)+deviation/((shapeWidth+shapeHeight)/2))  {
        shape.hasDeleted = true;
    }

}

const eraseLine = (erase: LinearPathType, shape: ShapeType) => {
    const lineStartPointX = shape.x+shapeTranslateX;
    const lineStartPointY = shape.y+shapeTranslateY;
    const lineEndPointX = shape!.width+shapeTranslateX;
    const lineEndPointY = shape!.height+shapeTranslateY;
    const deviation = ERASER_WIDTH/scale*100/2;

    const eraserPointX = erase.x + shapeTranslateX;
    const eraserPointY = erase.y + shapeTranslateY;

    if(Math.abs(eraserPointX-(lineStartPointX+lineEndPointX)/2) <= Math.abs(lineStartPointX-lineEndPointX)/2+deviation &&
        Math.abs(eraserPointY-(lineStartPointY+lineEndPointY)/2) <= Math.abs(lineStartPointY-lineEndPointY)/2+deviation ) {
        if (Math.abs(
            (lineEndPointY - lineStartPointY) * eraserPointX -
            (lineEndPointX - lineStartPointX) * eraserPointY +
            (lineEndPointX * lineStartPointY - lineStartPointX * lineEndPointY)
        ) / (((lineEndPointY - lineStartPointY) ** 2 + (lineEndPointX - lineStartPointX) ** 2) ** 0.5) <= deviation) {
            shape.hasDeleted = true;
        }
    }
}

const eraseLinearPath = (erase: LinearPathType, shape: ShapeType) => {
    const eraserPointX = erase.x + shapeTranslateX;
    const eraserPointY = erase.y + shapeTranslateY;
    const deviation = ERASER_WIDTH/scale*100;

    if(eraserPointX<shape.x+shapeTranslateX-deviation || eraserPointX>shape!.width+shapeTranslateX+deviation ||
    eraserPointY<shape.y+shapeTranslateY-deviation || eraserPointY>shape!.height+shapeTranslateY+deviation) {
        return;
    }

    let lineStartPointX, lineStartPointY, lineEndPointX, lineEndPointY;
    const linearPathList = shape.linearPathList!;
    const linearPathListLength = linearPathList.length;

    for (let i = 0; i < linearPathListLength-1; i++) {
        lineStartPointX = linearPathList[i].x+shapeTranslateX;
        lineStartPointY = linearPathList[i].y+shapeTranslateY;
        lineEndPointX = linearPathList[i+1].x+shapeTranslateX;
        lineEndPointY = linearPathList[i+1].y+shapeTranslateY;

        if(Math.abs(eraserPointX-(lineStartPointX+lineEndPointX)/2) <= Math.abs(lineStartPointX-lineEndPointX)/2+deviation &&
            Math.abs(eraserPointY-(lineStartPointY+lineEndPointY)/2) <= Math.abs(lineStartPointY-lineEndPointY)/2+deviation ) {
            if (Math.abs((lineEndPointY - lineStartPointY) * eraserPointX -
                (lineEndPointX - lineStartPointX) * eraserPointY +
                (lineEndPointX * lineStartPointY - lineStartPointX * lineEndPointY)
            ) / (((lineEndPointY - lineStartPointY) ** 2 + (lineEndPointX - lineStartPointX) ** 2) ** 0.5) <= deviation) {
                shape.hasDeleted = true;
                break;
            }
        }
    }

}



export {
    paintEraser,
    eraserPointerDown,
    eraserPointerMove
}