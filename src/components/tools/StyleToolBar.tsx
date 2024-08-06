import {useCanvasInfoStore} from "../../hooks/useCanvasInfoStore.ts";
import {selectedShape, setGlobalStyleConfig} from "../../canvas";
import {repaint} from "../../canvas/paint.ts";


const StyleToolBar = () => {

    const {
        isDisplayed,
        left,
        top,
        strokeStyleState,
        lineWidthState,
        setStrokeStyleStateAndLineWidthState
    } = useCanvasInfoStore();

    return (
        <div
            className={`${isDisplayed?"fixed":"hidden"} -translate-y-1/2 -translate-x-1/2 bg-white flex flex-row items-center gap-2 px-3 py-3 rounded-md shadow-[0px_0px_16px_rgba(0,0,0,0.12)]`}
            style={{left: left, top: top-55}}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
        >

            <div
                className="relative cursor-pointer duration-200 rounded-[999px] outline-none hover:outline hover:outline-[#2B5EDA] hover:outline-[1.5px]"
                style={{backgroundColor: strokeStyleState}}>
                <div className="relative z-10 pointer-events-none size-9 rounded-[999px] grid place-items-center">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20"
                         aria-hidden="true" className="text-white size-5" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z"></path>
                    </svg>
                </div>
                <input type="color"
                       className="cursor-pointer absolute left-0 top-0 w-full h-full rounded-[999px] opacity-0"
                       onChange={(e) => {
                           setStrokeStyleStateAndLineWidthState(e.target.value, lineWidthState);
                           setGlobalStyleConfig({
                               strokeStyle: e.target.value,
                               lineWidth: lineWidthState,
                           });
                           selectedShape!.styleConfig.strokeStyle = e.target.value;
                           repaint();
                       }}
                       value={strokeStyleState}
                />
            </div>


            <div className="w-[1.5px] bg-neutral-400 self-stretch"></div>


            {
                [2, 4, 8].map(item => (
                    <div key={item} className={`cursor-pointer size-9 rounded-[999px] grid place-items-center bg-[#DEDFE0] duration-200 outline-none outline-offset-0 ${lineWidthState === item ? "outline outline-[#2B5EDA] outline-[1.5px]" : "hover:outline hover:outline-[#2B5EDA] hover:outline-[1.5px]"}`}
                        onClick={() => {
                            setStrokeStyleStateAndLineWidthState(strokeStyleState, item);
                            setGlobalStyleConfig({
                                strokeStyle: strokeStyleState,
                                lineWidth: item,
                            });
                            selectedShape!.styleConfig.lineWidth = item;
                            repaint();
                        }}
                    >
                        <div className="bg-black rounded-[999px]" style={{width: item*4, height: item*4}}></div>
                    </div>
                ))
            }

        </div>
    )

}

export default StyleToolBar;