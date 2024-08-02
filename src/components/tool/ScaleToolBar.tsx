import SubtractSvg from "../svg/SubtractSvg.tsx";
import AddSvg from "../svg/AddSvg.tsx";
import {useEffect, useRef, useState} from "react";
import {scaleValueArray, scaleValueArrayLength} from "../../utils/data.ts";
import {scale, setCanvasScale, setCanvasTranslate} from "../../canvas";
import {repaint} from "../../canvas/paint.ts";


const DrawToolBar = () => {

    const [scaleState, setScaleState] = useState<number>(100);
    const scaleRef = useRef<number>(100);
    const scaleRefCopy = useRef<number>(100);

    const transformScale = (from: number, to: number, includeCopy: boolean) => {

        const times = from<=20 && to<=20 ? 5 : 10;
        const interval = 16;
        const gap = Math.floor(to-from)/times;

        for (let i = 0; i < times-1; i++) {
            setTimeout(() => {
                setScaleState(from+gap*i);
                setCanvasScale(from+gap*i);
                scaleRef.current = from+gap*i;
                if(includeCopy) {
                    scaleRefCopy.current = from+gap*i;
                }
                repaint();
            }, i*interval);
        }

        setTimeout(() => {
            setScaleState(to);
            setCanvasScale(to);
            scaleRef.current = to;
            if(includeCopy) {
                scaleRefCopy.current = to;
            }
            repaint();
        }, (times-1)*interval);
    }

    const handleClickSubtract = () => {
        if(scaleRef.current === 1) {
            return;
        }
        for (let i = scaleValueArrayLength-1; i >= 0; i--) {
            if(scaleValueArray[i] < scaleState) {
                transformScale(scaleRef.current, scaleValueArray[i], true);
                break;
            }
        }
    }

    const handleClickAdd = () => {
        if(scaleRef.current === 400) {
            return;
        }
        for (let i = 0; i < scaleValueArrayLength; i++) {
            if(scaleValueArray[i] > scaleState) {
                transformScale(scaleRef.current, scaleValueArray[i], true);
                break;
            }
        }
    }

    const handleClickToggle = () => {
        if(scaleRef.current !== 100) {
            transformScale(scaleRef.current, 100, false);
        }
        else {
            transformScale(100, scaleRefCopy.current, false);
        }
        repaint();
    }

    const handleWheel = (() => {
        let isThrottle = false;
        return (e: WheelEvent) => {
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
                let currentScale = scaleRef.current*(1-e.deltaY*0.01);
                currentScale = currentScale < 1 ? 1: currentScale;
                currentScale = currentScale > 400 ? 400 : currentScale;

                setScaleState(currentScale);
                setCanvasScale(currentScale);
                scaleRef.current = currentScale;
                scaleRefCopy.current = currentScale;
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