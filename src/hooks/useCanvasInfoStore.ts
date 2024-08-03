import {create} from "zustand";
import {ShapeType} from "../utils/types.ts";
import {
    defaultTranslateX,
    defaultTranslateY,
    globalStyleConfig,
    scale,
    shapeTranslateX,
    shapeTranslateY
} from "../canvas";


interface State {
    scaleState: number;
    isDisplayed: boolean;
    top: number,
    left: number,
    strokeStyleState: string,
    lineWidthState: number,
}

interface Action {
    setScaleState: (scale: number) => void;
    setIsDisplayed: (isDisplayed: boolean) => void;
    setTop: (top: number) => void;
    setLeft: (left: number) => void;
    setTopAndLeft: (shape: ShapeType) => void,
    setStrokeStyleStateAndLineWidthState: (strokeStyleState: string, lineWidthState: number) => void,
}

const initialState: State = {
    scaleState: 100,
    isDisplayed: false,
    top: 500,
    left: 500,
    strokeStyleState: globalStyleConfig.strokeStyle,
    lineWidthState: globalStyleConfig.lineWidth,
}

export const useCanvasInfoStore = create<State & Action>((set) => ({
    ...initialState,
    setScaleState: (scaleState) => set({scaleState}),
    setIsDisplayed: (isDisplayed) => set({isDisplayed}),
    setTop: (top) => set({top}),
    setLeft: (left) => set({left}),
    setTopAndLeft: (shape: ShapeType) => {
        const clientX = ((shape.x+shape.width)/2+shapeTranslateX)/100*scale+defaultTranslateX;
        const clientY = ((shape.y+shape.height)/2+shapeTranslateY)/100*scale+defaultTranslateY;
        const height = Math.abs(shape.y-shape.height)/100*scale;
        set(state => {
            state.setTop(clientY-height/2);
            state.setLeft(clientX);
            return {};
        })
    },
    setStrokeStyleAndLineWidth: (strokeStyleState, lineWidthState) => set({strokeStyleState, lineWidthState}),
}))