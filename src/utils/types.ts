
export interface LinearPathType {
    x: number,
    y: number,
}

export interface ShapeType {
    type: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    radius?: number,
    linearPathList?: LinearPathType[],
    hasLinearPathNormalized?: boolean,
    hasDeleted?: boolean,
    styleConfig: ShapeStyleType,
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
    linearPathList?: LinearPathType[],
    hasLinearPathNormalized?: boolean,
    styleConfig: ShapeStyleType,
}

export interface PointerInfoType {
    drawType: string;
    isThrottle: boolean;
    shape?: PointerInfoShapeType;
    usedForMultiPointer: boolean;
    selectedArea?: string,
}

export interface ShapeStyleType {
    strokeStyle: string,
    lineWidth: number,
}