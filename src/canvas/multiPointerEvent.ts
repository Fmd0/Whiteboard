import {multiPointerMap} from "./pointerEvent.ts";
import {
    center,
    scale,
    setCanvasScale, setCanvasTranslate,
} from "./index.ts";


export const handleMultiPointerEvent = (event: PointerEvent) => {
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
    setCanvasScale(scale*(1+scaleDistance*0.005));

    currentPointerInfo.shape!.clientX = currentX;
    currentPointerInfo.shape!.clientY = currentY;
}