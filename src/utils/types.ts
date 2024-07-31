
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
    linearPathList?: LinearPathType[],
    hasLinearPathNormalized?: boolean,
    hasDeleted?: boolean,
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
    currentX?: number,
    currentY?: number,
    hasLinearPathNormalized?: boolean,
}

export interface PointerInfoType {
    drawType: string;
    isThrottle: boolean;
    shape?: PointerInfoShapeType;
    usedForMultiPointer: boolean;
    selectedArea?: string,
}