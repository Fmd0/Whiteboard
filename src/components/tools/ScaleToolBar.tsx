import SubtractSvg from "../svg/SubtractSvg.tsx";
import AddSvg from "../svg/AddSvg.tsx";
import {useEffect} from "react";
import {scaleValueArray, scaleValueArrayLength} from "../../utils/data.ts";
import {scale, scaleCopy, selectedShape, setCanvasScale, setCanvasScaleCopy, setCanvasTranslate} from "../../canvas";
import {repaint} from "../../canvas/paint.ts";
import {useCanvasInfoStore} from "../../hooks/useCanvasInfoStore.ts";


const DrawToolBar = () => {

    const {
        setTopAndLeft,
        scaleState,
        setScaleState,
    } = useCanvasInfoStore();

    // implement the animation of scale add and subtract
    const transformScale = (from: number, to: number, includeCopy: boolean) => {

        const times = from<=20 && to<=20 ? 5 : 10;
        const interval = 16;
        const gap = Math.floor(to-from)/times;

        for (let i = 0; i < times-1; i++) {
            setTimeout(() => {
                setScaleState(from+gap*i);
                setCanvasScale(from+gap*i);
                if(includeCopy) {
                    setCanvasScaleCopy(from+gap*i);
                }
                repaint();
            }, i*interval);
        }

        setTimeout(() => {
            setScaleState(to);
            setCanvasScale(to);
            if(includeCopy) {
                setCanvasScaleCopy(to);
            }
            repaint();
        }, (times-1)*interval);
    }

    const handleClickSubtract = () => {
        if(scale === 1) {
            return;
        }
        for (let i = scaleValueArrayLength-1; i >= 0; i--) {
            if(scaleValueArray[i] < scaleState) {
                transformScale(scale, scaleValueArray[i], true);
                break;
            }
        }
    }

    const handleClickAdd = () => {
        if(scale === 400) {
            return;
        }
        for (let i = 0; i < scaleValueArrayLength; i++) {
            if(scaleValueArray[i] > scaleState) {
                transformScale(scale, scaleValueArray[i], true);
                break;
            }
        }
    }

    const handleClickToggle = () => {
        if(scale !== 100) {
            transformScale(scale, 100, false);
        }
        else {
            transformScale(100, scaleCopy, false);
        }
        repaint();
    }

    const handleWheel = (() => {
        let isThrottle = false;
        return  (e: WheelEvent) => {
            e.preventDefault();
            if(isThrottle) {
                return;
            }
            isThrottle = true;
            setTimeout(() => {
                isThrottle = false;
            }, 14);

            if(!e.ctrlKey) {
                setCanvasTranslate(
                    -e.deltaX/scale*120,
                    -e.deltaY/scale*120,
                );
            }
            else {
                let currentScale = scale*(1-e.deltaY*0.01);
                currentScale = currentScale < 1 ? 1: currentScale;
                currentScale = currentScale > 400 ? 400 : currentScale;
                setScaleState(currentScale);
                setCanvasScale(currentScale);
                setCanvasScaleCopy(currentScale);
            }

            if(selectedShape) {
                setTopAndLeft(selectedShape);
            }
            repaint();
        }
    })();


    useEffect(() => {
        window.addEventListener("wheel", handleWheel, {
            passive: false,
        });
        return () => {
            window.removeEventListener("wheel", handleWheel);
        }
    }, []);

    return (
        <div className="fixed right-4 bottom-4 bg-white flex flex-row gap-1 p-1 rounded-md shadow-[0px_0px_16px_rgba(0,0,0,0.1)]"
             onPointerDown={(e) => e.stopPropagation()}
             onPointerMove={(e) => e.stopPropagation()}
             onPointerUp={(e) => e.stopPropagation()}
        >
            <div className="cursor-pointer size-10 grid place-items-center rounded-md duration-100 group/scaleItem bg-white hover:bg-[#e8ecfc]"
                 onClick={handleClickSubtract}>
                <SubtractSvg/>
            </div>

            <div className="cursor-pointer size-10 grid place-items-center rounded-md duration-100 group/scaleItem bg-white hover:bg-[#e8ecfc]"
                 onClick={handleClickToggle}>
                <p className="text-[12px]">{Math.floor(scaleState)}%</p>
            </div>

            <div className="cursor-pointer size-10 grid place-items-center rounded-md duration-100 group/scaleItem bg-white hover:bg-[#e8ecfc]"
                 onClick={handleClickAdd}>
                <AddSvg/>
            </div>

        </div>
    )
}

export default DrawToolBar;