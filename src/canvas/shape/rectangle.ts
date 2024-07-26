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


export const paintRectangle = (shape: ShapeType) => {
    ctx.strokeStyle = "black";
    ctx.strokeRect(
        shape.x+shapeTranslateX,
        shape.y+shapeTranslateY,
        shape.width!-shape.x,
        shape.height!-shape.y,
    );
}

export const rectanglePointerDown = (event: PointerEvent) => {
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

export const rectanglePointerMove = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    pointerInfo.shape!.width = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    pointerInfo.shape!.height = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;
}


export const selectRectangle = (event: PointerEvent, shape: ShapeType) => {
    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);
    const deviation = 10/scale*100;

    if(pointerX>=shapeCenterX-shapeWidth/2-deviation && pointerX<=shapeCenterX+shapeWidth/2+deviation &&
        pointerY>=shapeCenterY-shapeHeight/2-deviation && pointerY<=shapeCenterY+shapeHeight/2-deviation)  {
        throw shape;
    }
}


export const pointerDownSelectRectangle = (event: PointerEvent) => {
    const pointerX = (event.clientX-defaultTranslateX)/scale*100;
    const pointerY = (event.clientY-defaultTranslateY)/scale*100;
    const shapeCenterX = (selectedShape!.x+selectedShape!.width)/2+shapeTranslateX;
    const shapeCenterY = (selectedShape!.y+selectedShape!.height)/2+shapeTranslateY;
    const shapeWidth = Math.abs(selectedShape!.width-selectedShape!.x);
    const shapeHeight = Math.abs(selectedShape!.height-selectedShape!.y);
    const deviation = 10/scale*100;
    const radiusSquare = 10/scale*100*10/scale*100;

    restructureRectangle(selectedShape!);

    if(pointerX>=shapeCenterX-shapeWidth/2-deviation && pointerX<=shapeCenterX+shapeWidth/2+deviation &&
        pointerY>=shapeCenterY-shapeHeight/2-deviation && pointerY<=shapeCenterY+shapeHeight/2+deviation)  {

        if(Math.pow(pointerX - (shapeCenterX-shapeWidth/2), 2)+
        Math.pow(pointerY - (shapeCenterY-shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_TOP_LEFT;
        }

        if(Math.pow(pointerX - shapeCenterX, 2)+
            Math.pow(pointerY - (shapeCenterY-shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_TOP_CENTER;
        }

        if(Math.pow(pointerX - (shapeCenterX+shapeWidth/2), 2)+
            Math.pow(pointerY - (shapeCenterY-shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_TOP_RIGHT;
        }

        if(Math.pow(pointerX - (shapeCenterX+shapeWidth/2), 2)+
            Math.pow(pointerY - shapeCenterY, 2) <= radiusSquare) {
            throw SELECT_MIDDLE_RIGHT;
        }

        if(Math.pow(pointerX - (shapeCenterX+shapeWidth/2), 2)+
            Math.pow(pointerY - (shapeCenterY+shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_BOTTOM_RIGHT;
        }

        if(Math.pow(pointerX - shapeCenterX, 2)+
            Math.pow(pointerY - (shapeCenterY+shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_BOTTOM_CENTER;
        }

        if(Math.pow(pointerX - (shapeCenterX-shapeWidth/2), 2)+
            Math.pow(pointerY - (shapeCenterY+shapeHeight/2), 2) <= radiusSquare) {
            throw SELECT_BOTTOM_LEFT;
        }

        if(Math.pow(pointerX - (shapeCenterX-shapeWidth/2), 2)+
            Math.pow(pointerY - shapeCenterY, 2) <= radiusSquare) {
            throw SELECT_MIDDLE_LEFT;
        }

        throw SELECT_SHAPE;
    }
}

export const pointerMoveSelectRectangle = (event: PointerEvent, area: string) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const translateX = event.clientX-pointerInfo.shape!.x;
    const translateY = event.clientY-pointerInfo.shape!.y;

    switch (area) {
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

const restructureRectangle = (shape: ShapeType) => {
    const shapeCenterX = (shape.x+shape.width!)/2;
    const shapeCenterY = (shape.y+shape.height!)/2;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);

    shape.x = shapeCenterX - shapeWidth/2;
    shape.y = shapeCenterY - shapeHeight/2;
    shape.width = shapeCenterX + shapeWidth/2;
    shape.height = shapeCenterY + shapeHeight/2;
}

export const paintRectangleSelector = (shape: ShapeType) => {
    ctx.save();
    const normalWidth = 1/scale*100;
    const normalRadius = 5/scale*100;
    const shapeCenterX = (shape.x+shape.width!)/2+shapeTranslateX;
    const shapeCenterY = (shape.y+shape.height!)/2+shapeTranslateY;
    const shapeWidth = Math.abs(shape.width!-shape.x);
    const shapeHeight = Math.abs(shape.height!-shape.y);

    ctx.strokeStyle = "blue";
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
    ctx.moveTo(shapeCenterX-normalWidth/2+normalRadius,
        shapeCenterY-shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX-normalWidth/2,
        shapeCenterY-shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // top right
    ctx.moveTo(shapeCenterX+shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY-shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX+shapeWidth/2-normalWidth/2,
        shapeCenterY-shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // middle right
    ctx.moveTo(shapeCenterX+shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY-normalWidth/2)
    ctx.arc(
        shapeCenterX+shapeWidth/2-normalWidth/2,
        shapeCenterY-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // bottom right
    ctx.moveTo(shapeCenterX+shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY+shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX+shapeWidth/2-normalWidth/2,
        shapeCenterY+shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // bottom center
    ctx.moveTo(shapeCenterX-normalWidth/2+normalRadius,
        shapeCenterY+shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX-normalWidth/2,
        shapeCenterY+shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // bottom left
    ctx.moveTo(shapeCenterX-shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY+shapeHeight/2-normalWidth/2)
    ctx.arc(
        shapeCenterX-shapeWidth/2-normalWidth/2,
        shapeCenterY+shapeHeight/2-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    // middle center
    ctx.moveTo(shapeCenterX-shapeWidth/2-normalWidth/2+normalRadius,
        shapeCenterY-normalWidth/2)
    ctx.arc(
        shapeCenterX-shapeWidth/2-normalWidth/2,
        shapeCenterY-normalWidth/2,
        normalRadius,
        0,
        2*Math.PI,
    )

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = normalRadius/3;
    ctx.strokeStyle = "#808080"
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}