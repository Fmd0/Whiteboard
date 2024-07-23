import PlusSvg from "./svg/PlusSvg.tsx";
import {useEffect, useState} from "react";
import {scale, setCanvasScale} from "../canvas";
import {repaint} from "../canvas/paint.ts";

const ControlBar = () => {

    const [scaleState, setScaleState] = useState(100);

    const updateScale = (newScale: number) => {
        setScaleState(newScale);
        setCanvasScale(newScale);
        repaint();
    }

    useEffect(() => {
        setScaleState(scale);
    }, [scale]);

    return (
        <div className="fixed select-none">
            <div className="fixed top-2 right-2 bg-white flex flex-row items-center gap-1 p-1 rounded-md
            shadow-[0px_0px_16px_rgba(0,0,0,0.1)]"
                 onPointerDown={(e) => e.stopPropagation()}
                 onPointerMove={(e) => e.stopPropagation()}
                 onPointerUp={(e) => e.stopPropagation()}
            >
                <div className="cursor-pointer" onClick={() => {updateScale(scaleState+10)}}>
                    <PlusSvg checked={false}/>
                </div>
                <div>{scaleState}%</div>
                <div className="cursor-pointer text-[40px]" onClick={() => updateScale(scaleState-10)}>-</div>
            </div>
        </div>
    )
}

export default ControlBar;