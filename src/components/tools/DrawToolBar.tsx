import {useState} from "react";
import {drawToolBarDataList, POINTER} from "../../utils/data.ts";
import DrawToolBarItem from "./DrawToolBarItem.tsx";
import {setDrawType, setSelectedShape} from "../../canvas";
import {repaint} from "../../canvas/paint.ts";
import {useCanvasInfoStore} from "../../hooks/useCanvasInfoStore.ts";


const DrawToolBar = () => {

    const [tool, setTool] = useState(POINTER);
    const {
        setIsDisplayed
    } = useCanvasInfoStore();


    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-3 bg-white flex flex-col gap-1 p-1 rounded-md
        shadow-[0px_0px_16px_rgba(0,0,0,0.1)]"
             onPointerDown={(e) => e.stopPropagation()}
             onPointerMove={(e) => e.stopPropagation()}
             onPointerUp={(e) => e.stopPropagation()}
        >
            {
                drawToolBarDataList.map(d => (
                    <DrawToolBarItem value={tool}
                                     handleClick={() => {
                                         setTool(d.toolValue);
                                         setDrawType(d.toolValue);
                                         setSelectedShape(null);
                                         setIsDisplayed(false);
                                         repaint();
                                     }}
                                     itemValue={d.toolValue}
                                     Svg={d.Svg}
                                     key={d.toolValue}
                    />
                ))
            }
        </div>
    )
}

export default DrawToolBar;