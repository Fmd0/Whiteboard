import {
    ctx,
    scale,
    shapeTranslateX,
    shapeTranslateY,
    defaultTranslateX,
    defaultTranslateY,
    selectedShape
} from "../index.ts";
import {
    RECTANGLE, SELECT_BOTTOM_CENTER, SELECT_BOTTOM_LEFT, SELECT_BOTTOM_RIGHT, SELECT_MIDDLE_LEFT,
    SELECT_MIDDLE_RIGHT,
    SELECT_SHAPE,
    SELECT_TOP_CENTER,
    SELECT_TOP_LEFT,
    SELECT_TOP_RIGHT
} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";


const paintRectangle = (shape: ShapeType) => {
    ctx.strokeStyle = "black";
    ctx.strokeRect(
        shape.x+shapeTranslateX,
        shape.y+shapeTranslateY,
        shape.width!-shape.x,
        shape.height!-shape.y,
    );
}

const rectanglePointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape = {
        type: RECTANGLE,
        x: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        y: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        width: (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX,
        height: (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY,
        clientX: event.clientX,
        clientY: event.clientY,
    };
}

const rectanglePointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape!.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    pointerInfo.shape!.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}


const selectRectangle = (event: PointerEvent, shape: ShapeType) => {
    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);
    const deviation = 10/scale*100;

    if(pointerX>=shapeCenterX-shapeWidth/2-deviation && pointerX<=shapeCenterX+shapeWidth/2+deviation &&
        pointerY>=shapeCenterY-shapeHeight/2-deviation && pointerY<=shapeCenterY+shapeHeight/2+deviation)  {
        throw shape;
    }
}


const pointerDownWhenRectangleSelected = (event: PointerEvent) => {

    normalizeRectangle(selectedShape!);

    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const shapeCenterX = (selectedShape!.x+selectedShape!.width)/2+shapeTranslateX;
    const shapeCenterY = (selectedShape!.y+selectedShape!.height)/2+shapeTranslateY;
    const shapeWidth = Math.abs(selectedShape!.width-selectedShape!.x);
    const shapeHeight = Math.abs(selectedShape!.height-selectedShape!.y);
    const deviation = 10/scale*100;
    const radiusSquare = 10/scale*100*10/scale*100;

    const normalWidth = 1/scale*100;


    if(pointerX>=shapeCenterX-shapeWidth/2-deviation && pointerX<=shapeCenterX+shapeWidth/2+deviation &&
        pointerY>=shapeCenterY-shapeHeight/2-deviation && pointerY<=shapeCenterY+shapeHeight/2+deviation)  {

        if((pointerX - (shapeCenterX-shapeWidth/2 - normalWidth/2)) ** 2+
            (pointerY - (shapeCenterY-shapeHeight/2 - normalWidth/2)) ** 2 <= radiusSquare) {
            throw SELECT_TOP_LEFT;
        }

        if((pointerX - (shapeCenterX+shapeWidth/2+normalWidth/2)) ** 2+
            (pointerY - (shapeCenterY-shapeHeight/2-normalWidth/2)) ** 2 <= radiusSquare) {
            throw SELECT_TOP_RIGHT;
        }

        if((pointerX - (shapeCenterX+shapeWidth/2+normalWidth/2)) ** 2+
            (pointerY - (shapeCenterY+shapeHeight/2+normalWidth/2)) ** 2 <= radiusSquare) {
            throw SELECT_BOTTOM_RIGHT;
        }

        if((pointerX - (shapeCenterX-shapeWidth/2-normalWidth/2)) ** 2 +
            (pointerY - (shapeCenterY+shapeHeight/2+normalWidth/2)) ** 2 <= radiusSquare) {
            throw SELECT_BOTTOM_LEFT;
        }

        if(Math.abs(pointerY - (shapeCenterY-shapeHeight/2-normalWidth/2)) <= deviation) {
            throw SELECT_TOP_CENTER;
        }

        if(Math.abs(pointerX - (shapeCenterX+shapeWidth/2+normalWidth/2)) <= deviation) {
            throw SELECT_MIDDLE_RIGHT;
        }

        if(Math.abs(pointerY - (shapeCenterY+shapeHeight/2+normalWidth/2)) <= deviation) {
            throw SELECT_BOTTOM_CENTER;
        }

        if(Math.abs(pointerX - (shapeCenterX-shapeWidth/2-normalWidth/2)) <= deviation) {
            throw SELECT_MIDDLE_LEFT;
        }

        throw SELECT_SHAPE;
    }
}

const pointerMoveWhenRectangleSelected = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const translateX = event.clientX-pointerInfo.shape!.width;
    const translateY = event.clientY-pointerInfo.shape!.height;

    switch (pointerInfo.selectedArea) {
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
        case SELECT_TOP_CENTER: {
            selectedShape!.y += translateY / scale * 100;
            break;
        }
        case SELECT_TOP_RIGHT: {
            selectedShape!.y += translateY / scale * 100;
            selectedShape!.width += translateX / scale * 100;
            break;
        }
        case SELECT_MIDDLE_RIGHT: {
            selectedShape!.width += translateX / scale * 100;
            break;
        }
        case SELECT_BOTTOM_RIGHT: {
            selectedShape!.width += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            break;
        }
        case SELECT_BOTTOM_CENTER: {
            selectedShape!.height += translateY / scale * 100;
            break;
        }
        case SELECT_BOTTOM_LEFT: {
            selectedShape!.x += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            break;
        }
        case SELECT_MIDDLE_LEFT: {
            selectedShape!.x += translateX / scale * 100;
            break;
        }
    }
}

const normalizeRectangle = (shape: ShapeType) => {
    if(shape.x > shape!.width) {
        shape.x = shape.x ^ shape.width;
        shape.width = shape.x ^ shape.width;
        shape.x = shape.x ^ shape.width;
    }

    if(shape.y > shape!.height) {
        shape.y = shape.y ^ shape.height;
        shape.height = shape.y ^ shape.height;
        shape.y = shape.y ^ shape.height;
    }
}


const paintRectangleSelector = (shape: ShapeType) => {
    ctx.save();
    const normalWidth = 1/scale*100;
    const normalRadius = 5/scale*100;
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);

    ctx.strokeStyle = "#2A79FF";
    ctx.lineWidth = normalWidth;
    ctx.strokeRect(
        shapeCenterX-shapeWidth/2-normalWidth/2,
        shapeCenterY-shapeHeight/2-normalWidth/2,
        shapeWidth+normalWidth,
        shapeHeight+normalWidth,
    );


    ctx.beginPath()

    // top left
    ctx.arc(
        shapeCenterX-shapeWidth/2-normalWidth/2,
        shapeCenterY-shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // top center
    // ctx.moveTo(shapeCenterX+normalRadius,
    //     shapeCenterY-shapeHeight/2-normalWidth/2)
    // ctx.arc(
    //     shapeCenterX,
    //     shapeCenterY-shapeHeight/2-normalWidth/2,
    //     normalRadius,
    //     0,
    //     2*Math.PI,
    // )

    // top right
    ctx.moveTo(shapeCenterX+shapeWidth/2+normalWidth/2+normalRadius,
        shapeCenterY-shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX+shapeWidth/2+normalWidth/2,
        shapeCenterY-shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // middle right
    // ctx.moveTo(shapeCenterX+shapeWidth/2+normalWidth/2+normalRadius,
    //     shapeCenterY)
    // ctx.arc(
    //     shapeCenterX+shapeWidth/2+normalWidth/2,
    //     shapeCenterY,
    //     normalRadius,
    //     0,
    //     2*Math.PI,
    // )

    // bottom right
    ctx.moveTo(shapeCenterX+shapeWidth/2+normalWidth/2+normalRadius,
        shapeCenterY+shapeHeight/2+normalWidth/2)
    ctx.arc(
        shapeCenterX+shapeWidth/2+normalWidth/2,
        shapeCenterY+shapeHeight/2+normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // bottom center
    // ctx.moveTo(shapeCenterX+normalRadius,
    //     shapeCenterY+shapeHeight/2+normalWidth/2)
    // ctx.arc(
    //     shapeCenterX,
    //     shapeCenterY+shapeHeight/2+normalWidth/2,
    //     normalRadius,
    //     0,
    //     2*Math.PI,
    // )

    // bottom left
    ctx.moveTo(shapeCenterX-shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY+shapeHeight/2+normalWidth/2)
    ctx.arc(
        shapeCenterX-shapeWidth/2-normalWidth/2,
        shapeCenterY+shapeHeight/2+normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // middle left
    // ctx.moveTo(shapeCenterX-shapeWidth/2-normalWidth/2+normalRadius,
    //     shapeCenterY)
    // ctx.arc(
    //     shapeCenterX-shapeWidth/2-normalWidth/2,
    //     shapeCenterY,
    //     normalRadius,
    //     0,
    //     2*Math.PI,
    // )

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = normalRadius/3;
    ctx.strokeStyle = "#0000005a"
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}


export {
    paintRectangle,
    rectanglePointerDown,
    rectanglePointerMove,
    selectRectangle,
    pointerDownWhenRectangleSelected,
    pointerMoveWhenRectangleSelected,
    paintRectangleSelector
}