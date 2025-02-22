import {
    center,
    drawType, scale,
    selectedShape, setCanvasScale, setCanvasScaleCopy, setCanvasTranslate,
    setShapeList,
    shapeList,
} from "../../canvas";
import {ELLIPSE, ERASER, LINE, LINEARPATH, POINTER, RECTANGLE} from "../../utils/data.ts";
import {pointerPointerMove} from "../../canvas/shape/pointer.ts";
import {rectanglePointerMove} from "../../canvas/shape/rectangle.ts";
import {ellipsePointerMove} from "../../canvas/shape/ellipse.ts";
import {linePointerMove} from "../../canvas/shape/line.ts";
import {linearPathPointerMove} from "../../canvas/shape/linearPath.ts";
import {eraserPointerMove} from "../../canvas/shape/eraser.ts";
import {repaint} from "../../canvas/paint.ts";
import {hasMoved, multiPointerMap} from "../../canvas/pointerEvent.ts";
import {useCanvasInfoStore} from "../../hooks/useCanvasInfoStore.ts";
import {useEffect} from "react";
import {handleSelect} from "../../canvas/select.ts";


const PointerEvent = () => {
    const {
        setIsDisplayed,
        setTopAndLeft,
        setStrokeStyleStateAndLineWidthState,
        setScaleState
    } = useCanvasInfoStore();


    const handlePointerMove = (() => {
        return (event: PointerEvent) => {
            const pointerInfo = multiPointerMap.get(event.pointerId);
            if (!pointerInfo || pointerInfo.isThrottle) {
                return;
            }

            pointerInfo.isThrottle = true;

            // judge whether is multiple pointer case
            if(multiPointerMap.size === 2 ) {
                let noMove = true;
                multiPointerMap.forEach(pointer => {
                    noMove = noMove && (pointer.drawType===POINTER || !hasMoved(pointerInfo.shape!));
                })
                if(noMove) {
                    setTimeout(() => {
                        pointerInfo.isThrottle = false;
                    }, 14);
                    handleMultiPointerEvent(event);
                    repaint();
                    return;
                }
            }

            if(pointerInfo.drawType!==POINTER && pointerInfo.usedForMultiPointer) {
                return;
            }


            if(pointerInfo.drawType === POINTER) {
                setTimeout(() => {
                    pointerInfo.isThrottle = false;
                }, 14);
                setIsDisplayed(false);
            }
            else {
                setTimeout(() => {
                    pointerInfo.isThrottle = false;
                }, 30);
            }

            switch (drawType) {
                case POINTER: pointerPointerMove(event); break;
                case RECTANGLE: rectanglePointerMove(event); break;
                case ELLIPSE: ellipsePointerMove(event); break;
                case LINE: linePointerMove(event); break;
                case LINEARPATH: linearPathPointerMove(event); break;
                case ERASER: eraserPointerMove(event); break;
            }
            repaint();
        }

    })()


    const handlePointerUp = (event: PointerEvent) => {
        if(!multiPointerMap.has(event.pointerId)) {
            return;
        }

        const pointerInfo = multiPointerMap.get(event.pointerId)!;
        if(pointerInfo.drawType===POINTER && pointerInfo.shape && !hasMoved(pointerInfo.shape) && !pointerInfo.usedForMultiPointer) {
            handleSelect(event);
        }

        if(pointerInfo.drawType===POINTER && selectedShape) {
            setIsDisplayed(true);
            setTopAndLeft(selectedShape!);
            setStrokeStyleStateAndLineWidthState(selectedShape.styleConfig.strokeStyle, selectedShape.styleConfig.lineWidth);
        }
        else {
            setIsDisplayed(false);
        }

        if(pointerInfo.drawType!==POINTER && pointerInfo.drawType !== ERASER && pointerInfo.shape && hasMoved(pointerInfo.shape)) {
            shapeList.push(pointerInfo.shape);
        }

        if(pointerInfo.drawType === ERASER) {
            setShapeList(shapeList.filter(shape => {
                return shape.hasDeleted !== true;
            }));
            multiPointerMap.delete(event.pointerId);
            repaint();
        }

        multiPointerMap.delete(event.pointerId);
        center.hasInitialized = false;
    }


    const handleMultiPointerEvent = (event: PointerEvent) => {
        let currentPointerInfo, anotherPointerInfo;
        const currentX = event.clientX;
        const currentY = event.clientY;
        for (const i of multiPointerMap.keys()) {
            if(i === event.pointerId) {
                currentPointerInfo = multiPointerMap.get(i)!;
            }
            else {
                anotherPointerInfo = multiPointerMap.get(i)!;
            }
        }
        currentPointerInfo.usedForMultiPointer = true;
        anotherPointerInfo.usedForMultiPointer = true;

        // handle translate
        const currentCenter = {
            x: (currentPointerInfo.shape!.clientX+anotherPointerInfo.shape!.clientX)/2,
            y: (currentPointerInfo.shape!.clientY+anotherPointerInfo.shape!.clientY)/2,
        }
        if(!center.hasInitialized){
            center.x = currentCenter.x;
            center.y = currentCenter.y;
            center.hasInitialized = true;
        }
        const moveDistanceX = currentCenter.x - center.x;
        const moveDistanceY = currentCenter.y - center.y;
        setCanvasTranslate(moveDistanceX, moveDistanceY);

        center.x = currentCenter.x;
        center.y = currentCenter.y;

        // handle scale
        const prevDistance = Math.sqrt(
            Math.pow(currentPointerInfo.shape!.clientX - anotherPointerInfo.shape!.clientX, 2)+
            Math.pow(currentPointerInfo.shape!.clientY - anotherPointerInfo.shape!.clientY, 2)
        )
        const currDistance = Math.sqrt(
            Math.pow(currentX - anotherPointerInfo.shape!.clientX, 2)+
            Math.pow(currentY - anotherPointerInfo.shape!.clientY, 2)
        )
        const scaleDistance = currDistance-prevDistance;
        setScaleState(scale*(1+scaleDistance*0.005))
        setCanvasScale(scale*(1+scaleDistance*0.005));
        setCanvasScaleCopy(scale*(1+scaleDistance*0.005))

        if(selectedShape) {
            setTopAndLeft(selectedShape);
        }

        currentPointerInfo.shape!.clientX = currentX;
        currentPointerInfo.shape!.clientY = currentY;
    }


    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        }
    }, []);

    return (
        <></>
    )
}

export default PointerEvent;