import PlusSvg from "./svg/PlusSvg.tsx";
import {useState} from "react";
import {setCanvasScale} from "../utils/canvas.ts";

const ControlBar = () => {

    const [scale, setScale] = useState(100);

    const updateScale = (newScale: number) => {
        setScale(newScale);
        setCanvasScale(newScale);
    }

    return (
        <div className="fixed ">
            <div className="fixed top-2 right-2 bg-white flex flex-row items-center gap-1 p-1 rounded-md
            shadow-[0px_0px_16px_rgba(0,0,0,0.1)]"
                 onPointerDown={(e) => e.stopPropagation()}
                 onPointerMove={(e) => e.stopPropagation()}
                 onPointerUp={(e) => e.stopPropagation()}
            >
                <div className="cursor-pointer" onClick={() => {updateScale(scale+10)}}>
                    <PlusSvg checked={false}/>
                </div>
                <div>{scale}%</div>
                <div className="cursor-pointer text-[40px]" onClick={() => updateScale(scale-10)}>-</div>
            </div>
        </div>
    )
}

export default ControlBar;