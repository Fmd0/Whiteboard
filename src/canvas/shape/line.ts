import {
    ctx,
    defaultTranslateX,
    defaultTranslateY, globalStyleConfig,
    scale, selectedShape,
    shapeTranslateX, shapeTranslateY
} from "../index.ts";
import {ERASE_COLOR, LINE, SELECT_BOTTOM_RIGHT, SELECT_SHAPE, SELECT_TOP_LEFT} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


const paintLine = (shape: ShapeType) => {
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(shape.x+shapeTranslateX, shape.y+shapeTranslateY);
    ctx.lineTo(shape.width!+shapeTranslateX, shape.height!+shapeTranslateY);

    if(shape.hasDeleted === true) {
        ctx.strokeStyle = ERASE_COLOR;
    }
    else {
        ctx.strokeStyle = shape.styleConfig.strokeStyle;
    }
    ctx.lineWidth = shape.styleConfig.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}

const linePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: LINE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        clientX: event.clientX,
        clientY: event.clientY,
        styleConfig: {
            ...globalStyleConfig,
        }
    };
}

const linePointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    shape.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    shape.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}


const selectLine = (event: PointerEvent, shape: ShapeType) => {
    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const lineStartPointX = shape.x+shapeTranslateX;
    const lineStartPointY = shape.y+shapeTranslateY;
    const lineEndPointX = shape!.width+shapeTranslateX;
    const lineEndPointY = shape!.height+shapeTranslateY;
    const deviation = 10/scale*100;

    if(Math.abs(pointerX-(lineStartPointX+lineEndPointX)/2) <= Math.abs(lineStartPointX-lineEndPointX)/2+deviation &&
        Math.abs(pointerY-(lineStartPointY+lineEndPointY)/2) <= Math.abs(lineStartPointY-lineEndPointY)/2+deviation ){
        if(Math.abs(
            (lineEndPointY-lineStartPointY)*pointerX -
            (lineEndPointX-lineStartPointX)*pointerY +
            (lineEndPointX*lineStartPointY - lineStartPointX*lineEndPointY)
        )/(((lineEndPointY-lineStartPointY)**2 + (lineEndPointX-lineStartPointX)**2) ** 0.5) <= deviation) {
            throw shape;
        }
    }
}

const pointerDownWhenLineSelected = (event: PointerEvent) => {

    normalizeLine(selectedShape!);

    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const lineStartPointX = selectedShape!.x+shapeTranslateX;
    const lineStartPointY = selectedShape!.y+shapeTranslateY;
    const lineEndPointX = selectedShape!.width+shapeTranslateX;
    const lineEndPointY = selectedShape!.height+shapeTranslateY;
    const deviation = 10/scale*100;
    const radiusSquare = 10/scale*100*10/scale*100;


    if(Math.abs(pointerX-(lineStartPointX+lineEndPointX)/2) <= Math.abs(lineStartPointX-lineEndPointX)/2+deviation &&
        Math.abs(pointerY-(lineStartPointY+lineEndPointY)/2) <= Math.abs(lineStartPointY-lineEndPointY)/2+deviation ) {
        if(Math.abs(
            (lineEndPointY-lineStartPointY)*pointerX -
            (lineEndPointX-lineStartPointX)*pointerY +
            (lineEndPointX*lineStartPointY - lineStartPointX*lineEndPointY)
        ) /(((lineEndPointY-lineStartPointY)**2 + (lineEndPointX-lineStartPointX)**2) ** 0.5) <= deviation) {

            if((pointerX-lineStartPointX)**2 +
                (pointerY-lineStartPointY)**2 <= radiusSquare) {
                throw SELECT_TOP_LEFT;
            }

            if((pointerX-lineEndPointX)**2 +
                (pointerY-lineEndPointY)**2 <= radiusSquare) {
                throw SELECT_BOTTOM_RIGHT;
            }

            throw SELECT_SHAPE;
        }
    }

}

const pointerMoveWhenLineSelected = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const translateX = event.clientX-pointerInfo.shape!.width;
    const translateY = event.clientY-pointerInfo.shape!.height;

    switch(pointerInfo.selectedArea) {
        case SELECT_SHAPE: {
            selectedShape!.x += translateX / scale * 100;
            selectedShape!.y += translateY / scale * 100;
            selectedShape!.width += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            break;
        }
        case SELECT_TOP_LEFT: {
            selectedShape!.x += translateX / scale * 100;
            selectedShape!.y += translateY / scale * 100;
            break;
        }
        case SELECT_BOTTOM_RIGHT: {
            selectedShape!.width += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            break
        }
    }
}


const normalizeLine = (shape: ShapeType) => {
    if(shape.x > shape!.width) {
        shape.x = shape.x ^ shape.width;
        shape.width = shape.x ^ shape.width;
        shape.x = shape.x ^ shape.width;

        shape.y = shape.y ^ shape.height;
        shape.height = shape.y ^ shape.height;
        shape.y = shape.y ^ shape.height;

    }
}


const paintLineSelector = (shape: ShapeType) => {
    ctx.save();
    const normalRadius = 5.5/scale*100;
    const lineStartPointX = shape.x+shapeTranslateX;
    const lineStartPointY = shape.y+shapeTranslateY;
    const lineEndPointX = shape.width+shapeTranslateX;
    const lineEndPointY = shape.height+shapeTranslateY;

    ctx.beginPath()

    ctx.arc(
        lineStartPointX,
        lineStartPointY,
        normalRadius,
        0,
        2*Math.PI,
    )

    ctx.moveTo(
        lineEndPointX+normalRadius,
        lineEndPointY,
    )
    ctx.arc(
        lineEndPointX,
        lineEndPointY,
        normalRadius,
        0,
        2*Math.PI,
    )

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = normalRadius/2;
    ctx.strokeStyle = "#2A79FF";
    ctx.stroke();

    ctx.restore();
}

export {
    paintLine,
    linePointerDown,
    linePointerMove,
    selectLine,
    pointerDownWhenLineSelected,
    pointerMoveWhenLineSelected,
    paintLineSelector,
}