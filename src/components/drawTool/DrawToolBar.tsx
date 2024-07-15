import {useState} from "react";
import {drawToolBarDataList, RECTANGLE} from "../../utils/data.ts";
import DrawToolBarItem from "./DrawToolBarItem.tsx";
import {setDrawType} from "../../utils/canvas.ts";


const DrawToolBar = () => {

    const [tool, setTool] = useState(RECTANGLE);


    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-2 flex flex-col gap-1 p-1 rounded-md
        shadow-[0px_0px_10px_rgba(0,0,0,0.08)]"
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
                    />
                ))
            }
        </div>
    )
}

export default DrawToolBar;