import RectangleSvg from "../components/svg/RectangleSvg.tsx";
import CircleSvg from "../components/svg/CircleSvg.tsx";
import LinearPathSvg from "../components/svg/LinearPathSvg.tsx";
import PointerSvg from "../components/svg/PointerSvg.tsx";
import LineSvg from "../components/svg/LineSvg.tsx";
import EllipseSvg from "../components/svg/EllipseSvg.tsx";


export const POINTER = "pointer";
export const RECTANGLE = "rectangle";
export const CIRCLE = "circle";
export const ELLIPSE = "ellipse";
export const LINE = "line";
export const LINEARPATH = "linearPath"


export const drawToolBarDataList = [
    {
        toolValue: POINTER,
        Svg: PointerSvg,
    },
    {
        toolValue: RECTANGLE,
        Svg: RectangleSvg ,
    },
    {
        toolValue: CIRCLE,
        Svg: CircleSvg ,
    },
    {
        toolValue: ELLIPSE,
        Svg: EllipseSvg,
    },
    {
        toolValue: LINE,
        Svg: LineSvg,
    },
    {
        toolValue: LINEARPATH,
        Svg: LinearPathSvg,
    }
]
