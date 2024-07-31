import RectangleSvg from "../components/svg/RectangleSvg.tsx";
import CircleSvg from "../components/svg/CircleSvg.tsx";
import LinearPathSvg from "../components/svg/LinearPathSvg.tsx";
import PointerSvg from "../components/svg/PointerSvg.tsx";
import LineSvg from "../components/svg/LineSvg.tsx";
// import EllipseSvg from "../components/svg/EllipseSvg.tsx";
import EraserSvg from "../components/svg/EraserSvg.tsx";

export const ERASE_COLOR = "#0000005a   "

export const POINTER = "pointer";
export const RECTANGLE = "rectangle";
export const CIRCLE = "circle";
export const ELLIPSE = "ellipse";
export const LINE = "line";
export const LINEARPATH = "linearPath"
export const ERASER = "eraser"

export const SELECT_SHAPE = "selectShape";
export const SELECT_TOP_LEFT = "selectTopLeft";
export const SELECT_TOP_CENTER = "selectTopCenter";
export const SELECT_TOP_RIGHT = "selectTopRight";
export const SELECT_MIDDLE_LEFT = "selectMiddleLeft";
export const SELECT_MIDDLE_RIGHT = "selectMiddleRight";
export const SELECT_BOTTOM_LEFT = "selectBottomLeft";
export const SELECT_BOTTOM_CENTER = "selectBottomCenter";
export const SELECT_BOTTOM_RIGHT = "selectBottomRight";


export const drawToolBarDataList = [
    {
        toolValue: POINTER,
        Svg: PointerSvg,
    },
    {
        toolValue: RECTANGLE,
        Svg: RectangleSvg ,
    },
    // {
    //     toolValue: CIRCLE,
    //     Svg: CircleSvg ,
    // },
    {
        toolValue: ELLIPSE,
        Svg: CircleSvg,
    },
    {
        toolValue: LINE,
        Svg: LineSvg,
    },
    {
        toolValue: LINEARPATH,
        Svg: LinearPathSvg,
    },
    {
        toolValue: ERASER,
        Svg: EraserSvg,
    }
]
