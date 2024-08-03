import {
    ctx,
    defaultTranslateX,
    defaultTranslateY, globalStyleConfig,
    scale, selectedShape,
    shapeTranslateX,
    shapeTranslateY
} from "../index.ts";
import {
    ERASE_COLOR,
    LINEARPATH,
    SELECT_BOTTOM_LEFT,
    SELECT_BOTTOM_RIGHT,
    SELECT_SHAPE,
    SELECT_TOP_LEFT,
    SELECT_TOP_RIGHT
} from "../../utils/data.ts";
import {ShapeType} from "../../utils/types.ts";
import {multiPointerMap} from "../pointerEvent.ts";
import {paintRectangleSelector, selectRectangle} from "./rectangle.ts";


const paintLinearPath = (shape: ShapeType) => {
    ctx.save();
    ctx.beginPath();

    const linearPathList = shape.linearPathList!;
    const linearPathListLength = linearPathList.length;

    if(shape.hasLinearPathNormalized === true) {
        const XMin = shape.x;
        const YMin = shape.y;
        const width = shape.width! - XMin;
        const height = shape.height! - YMin;
        ctx.moveTo(linearPathList[0].x*width+XMin+shapeTranslateX, linearPathList[0].y*height+YMin+shapeTranslateY);
        for (let i = 1; i < linearPathListLength; i++) {
            ctx.lineTo(linearPathList[i].x*width+XMin+shapeTranslateX, linearPathList[i].y*height+YMin+shapeTranslateY);
        }
    }
    else {
        ctx.moveTo(linearPathList[0].x+shapeTranslateX, linearPathList[0].y+shapeTranslateY);
        for (let i = 1; i < linearPathListLength; i++) {
            ctx.lineTo(linearPathList[i].x+shapeTranslateX, linearPathList[i].y+shapeTranslateY);
        }
    }

    if(shape.hasDeleted === true) {
        ctx.strokeStyle = ERASE_COLOR;
    }
    else {
        ctx.strokeStyle = shape.styleConfig.strokeStyle;
    }
    ctx.lineWidth = shape.styleConfig.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}

const linearPathPointerDown = (event: PointerEvent) => {
    const pointerInfo = multiPointerMap.get(event.pointerId)!;
    const shapeX = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const shapeY = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    pointerInfo.shape = {
        type: LINEARPATH,
        x: shapeX,
        y: shapeY,
        width: shapeX,
        height: shapeY,
        clientX: event.clientX,
        clientY: event.clientY,
        linearPathList: [{
            x: shapeX,
            y: shapeY,
        }],
        styleConfig: {
            ...globalStyleConfig,
        }
    }
}

const linearPathPointerMove = (event: PointerEvent) => {
    const shape = multiPointerMap.get(event.pointerId)!.shape!;
    const shapeX = (event.clientX-defaultTranslateX)/scale*100-shapeTranslateX;
    const shapeY = (event.clientY-defaultTranslateY)/scale*100-shapeTranslateY;

    shape.linearPathList!.push({
        x: shapeX,
        y: shapeY,
    })

    shape.width = shape.width>shapeX?shape.width:shapeX;
    shape.x = shape.x<shapeX?shape.x:shapeX;
    shape.height = shape.height>shapeY?shape.height:shapeY;
    shape.y = shape.y<shapeY?shape.y:shapeY;
}

const selectLinearPath = selectRectangle;

const pointerDownWhenLinearPathSelected = (event: PointerEvent) => {

    normalizeLinearPath(selectedShape!);
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

        throw SELECT_SHAPE;
    }
}


const normalizeLinearPath = (shape: ShapeType) => {
    if(shape.hasLinearPathNormalized === true) {
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
        return;
    }

    const XMin = shape.x;
    const YMin = shape.y;
    const width = shape.width! - XMin;
    const height = shape.height! - YMin;

    shape.linearPathList = shape.linearPathList!.map(linearPath => {
        return {
            x: (linearPath.x-XMin)/width,
            y: (linearPath.y-YMin)/height,
        }
    })

    shape.hasLinearPathNormalized = true;
}

const pointerMoveWhenLinearPathSelected = (event: PointerEvent) => {
    normalizeLinearPath(selectedShape!)

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
            if(selectedShape!.x>selectedShape!.width &&
            selectedShape!.y>selectedShape!.height) {
                pointerInfo.selectedArea = SELECT_BOTTOM_RIGHT;
            }
            else if(selectedShape!.x>selectedShape!.width) {
                pointerInfo.selectedArea = SELECT_TOP_RIGHT
            }
            else if(selectedShape!.y>selectedShape!.height) {
                pointerInfo.selectedArea = SELECT_BOTTOM_LEFT;
            }

            break;
        }
        case SELECT_TOP_RIGHT: {
            selectedShape!.y += translateY / scale * 100;
            selectedShape!.width += translateX / scale * 100;
            if(selectedShape!.width<selectedShape!.x &&
                selectedShape!.y>selectedShape!.height) {
                pointerInfo.selectedArea = SELECT_BOTTOM_LEFT;
            }
            else if(selectedShape!.width<selectedShape!.x) {
                pointerInfo.selectedArea = SELECT_TOP_LEFT
            }
            else if(selectedShape!.y>selectedShape!.height) {
                pointerInfo.selectedArea = SELECT_BOTTOM_RIGHT;
            }
            break;
        }
        case SELECT_BOTTOM_RIGHT: {
            selectedShape!.width += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            if(selectedShape!.width<selectedShape!.x &&
                selectedShape!.height<selectedShape!.y) {
                pointerInfo.selectedArea = SELECT_TOP_LEFT;
            }
            else if(selectedShape!.width<selectedShape!.x) {
                pointerInfo.selectedArea = SELECT_BOTTOM_LEFT
            }
            else if(selectedShape!.height<selectedShape!.y) {
                pointerInfo.selectedArea = SELECT_TOP_RIGHT;
            }
            break;
        }
        case SELECT_BOTTOM_LEFT: {
            selectedShape!.x += translateX / scale * 100;
            selectedShape!.height += translateY / scale * 100;
            if(selectedShape!.x>selectedShape!.width &&
                selectedShape!.height<selectedShape!.y) {
                pointerInfo.selectedArea = SELECT_TOP_RIGHT;
            }
            else if(selectedShape!.x>selectedShape!.width) {
                pointerInfo.selectedArea = SELECT_BOTTOM_RIGHT
            }
            else if(selectedShape!.height<selectedShape!.y) {
                pointerInfo.selectedArea = SELECT_TOP_LEFT;
            }
            break;
        }
    }
}


const paintLinearPathSelector = paintRectangleSelector;


export {
    paintLinearPath,
    linearPathPointerDown,
    linearPathPointerMove,
    selectLinearPath,
    pointerDownWhenLinearPathSelected,
    pointerMoveWhenLinearPathSelected,
    paintLinearPathSelector
}