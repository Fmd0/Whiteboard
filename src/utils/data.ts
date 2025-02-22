import RectangleSvg from "../components/svg/RectangleSvg.tsx";
import CircleSvg from "../components/svg/CircleSvg.tsx";
import LinearPathSvg from "../components/svg/LinearPathSvg.tsx";
import PointerSvg from "../components/svg/PointerSvg.tsx";
import LineSvg from "../components/svg/LineSvg.tsx";
// import EllipseSvg from "../components/svg/EllipseSvg.tsx";
import EraserSvg from "../components/svg/EraserSvg.tsx";

export const ERASE_COLOR = "#0000005a"
export const ERASER_WIDTH = 20;
export const CANVAS_BACKGROUND_COLOR = "#F2F2F2"
export const CANVAS_GRID_COLOR = "#E2E2E2"


export const POINTER = "pointer";
export const RECTANGLE = "rectangle";
// export const CIRCLE = "circle";
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


export const scaleValueArray: number[] = [
    1, 2, 3, 5, 10, 15, 25, 36, 50, 75, 100, 125, 150, 200, 250, 300, 400
]

export const scaleValueArrayLength: number = 17;