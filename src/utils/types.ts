
export interface LinearPathType {
    x: number,
    y: number,
    width: number,
    height: number,
}

export interface ShapeType {
    type: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    radius?: number,
    linearPathList?: LinearPathType[]
}

export interface PointerInfoShapeType{
    type: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    radius?: number,
    clientX: number,
    clientY: number,
    linearPathList?: LinearPathType[]
}

export interface PointerInfoType {
    hasMove: boolean;
    drawType: string;
    isThrottle: boolean;
    shape?: PointerInfoShapeType;
    usedForMultiPointer: boolean;
    selectedArea?: string,
}