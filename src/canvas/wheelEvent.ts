import {scale, setCanvasScale, setCanvasTranslate} from "./index.ts";
import {repaint} from "./paint.ts";


export const handleWheel = (() => {
    let isThrottle = false;
    return (e: WheelEvent) => {
        e.preventDefault();
        if(isThrottle) {
            return;
        }
        isThrottle = true;
        setTimeout(() => {
            isThrottle = false;
        }, 14)

        if(!e.ctrlKey) {
            setCanvasTranslate(
                -e.deltaX/scale*120,
                -e.deltaY/scale*120,
            );
        }
        else {
            setCanvasScale(scale*(1-e.deltaY*0.01));
        }
        repaint();
    }
})()