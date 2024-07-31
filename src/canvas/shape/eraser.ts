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
import {ELLIPSE, ERASER, LINE, LINEARPATH, RECTANGLE} from "../../utils/data.ts";
import {LinearPathType, ShapeType} from "../../utils/types.ts";


const paintEraser = (shape: ShapeType) => {
    ctx.save();
    ctx.beginPath();

    shape.linearPathList!.forEach(linearPath => {
        ctx.moveTo(linearPath.x+shapeTranslateX, linearPath.y+shapeTranslateY);
        ctx.lineTo(linearPath.width!+shapeTranslateX, linearPath.height!+shapeTranslateY);
    })

    ctx.strokeStyle = "#F2F2F2";
    ctx.lineWidth = 10/scale*100;

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
        linearPathList: [],
        currentX: shapeX,
        currentY: shapeY,
    }
}

const eraserPointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    const width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    const currentShape =  {
        x: shape.currentX!,
        y: shape.currentY!,
        width,
        height,
    };

    shape.linearPathList!.push(currentShape);
    shape.currentX = width;
    shape.currentY = height;

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

    const eraserPointX = (erase.x+erase.width)/2 + shapeTranslateX;
    const eraserPointY = (erase.y+erase.height)/2 + shapeTranslateY;

    const deviation = 10/scale*100/2;

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
    const deviation = 10/scale*100;

    const eraserPointX = (erase.x+erase.width)/2 + shapeTranslateX;
    const eraserPointY = (erase.y+erase.height)/2 + shapeTranslateY;

    if(Math.abs((eraserPointX-shapeCenterX)**2/((shapeWidth/2)**2) +
        (eraserPointY-shapeCenterY)**2/((shapeHeight/2)**2) - 1) <=
        deviation/((shapeWidth/2+shapeHeight/2)/2) )  {
        shape.hasDeleted = true;
    }

}

const eraseLine = (erase: LinearPathType, shape: ShapeType) => {
    const lineStartPointX = shape.x+shapeTranslateX;
    const lineStartPointY = shape.y+shapeTranslateY;
    const lineEndPointX = shape.width+shapeTranslateX;
    const lineEndPointY = shape.height+shapeTranslateY;
    const deviation = 10/scale*100/2;

    const eraserPointX = (erase.x+erase.width)/2 + shapeTranslateX;
    const eraserPointY = (erase.y+erase.height)/2 + shapeTranslateY;


    if(Math.abs(
        (lineEndPointY-lineStartPointY)*eraserPointX -
        (lineEndPointX-lineStartPointX)*eraserPointY +
        (lineEndPointX*lineStartPointY - lineStartPointX*lineEndPointY)
    )/(((lineEndPointY-lineStartPointY)**2 + (lineEndPointX-lineStartPointX)**2) ** 0.5) <= deviation) {
        shape.hasDeleted = true;
    }
}

const eraseLinearPath = (erase: LinearPathType, shape: ShapeType) => {
    const eraserPointX = (erase.x+erase.width)/2 + shapeTranslateX;
    const eraserPointY = (erase.y+erase.height)/2 + shapeTranslateY;
    const deviation = 20/scale*100;

    if(eraserPointX<shape.x+shapeTranslateX-deviation || eraserPointX>shape.width+shapeTranslateX+deviation ||
    eraserPointY<shape.y+shapeTranslateY-deviation || eraserPointY>shape.height+shapeTranslateY+deviation) {
        return;
    }

    // let shapePointX,shapePointY;
    let lineStartPointX, lineStartPointY, lineEndPointX, lineEndPointY;

    const linearPathListLength = shape.linearPathList!.length;

    console.log("handle");
    for (let i = 0; i < linearPathListLength; i++) {
        // shapePointX = (shape.linearPathList![i].x+shape.linearPathList![i].width)/2 + shapeTranslateX;
        // shapePointY = (shape.linearPathList![i].y+shape.linearPathList![i].height)/2 + shapeTranslateY;

        lineStartPointX = shape.x+shapeTranslateX;
        lineStartPointY = shape.y+shapeTranslateY;
        lineEndPointX = shape.width+shapeTranslateX;
        lineEndPointY = shape.height+shapeTranslateY;

        if(Math.abs((lineEndPointY-lineStartPointY)*eraserPointX -
            (lineEndPointX-lineStartPointX)*eraserPointY +
            (lineEndPointX*lineStartPointY - lineStartPointX*lineEndPointY)
        )/(((lineEndPointY-lineStartPointY)**2 + (lineEndPointX-lineStartPointX)**2) ** 0.5) <= deviation) {
            shape.hasDeleted = true;
            break;
        }
    }

}



export {
    paintEraser,
    eraserPointerDown,
    eraserPointerMove
}