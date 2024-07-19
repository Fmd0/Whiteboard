import {useState} from "react";
import {drawToolBarDataList, POINTER} from "../../utils/data.ts";
import DrawToolBarItem from "./DrawToolBarItem.tsx";
import {setDrawType} from "../../utils/canvas.ts";


const DrawToolBar = () => {

    const [tool, setTool] = useState(POINTER);


    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-2 bg-white flex flex-col gap-1 p-1 rounded-md
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