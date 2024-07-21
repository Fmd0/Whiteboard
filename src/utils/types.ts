import {Drawable} from "roughjs/bin/core";


export interface CanvasContentType {
    type: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    diameter?: number,
    points?: CanvasContentPointType[],
    drawable?: Drawable,
}

export interface CanvasContentPointType {
    x: number,
    y: number,
    width: number,
    height: number,
    drawable: Drawable,
}

export interface ShapeType {
    type: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    radius?: number,
}