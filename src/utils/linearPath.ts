import {CanvasContentPointType, CanvasContentType} from "./types.ts";
import {canvasContent, generator, rc} from "./canvas.ts";
import {Drawable} from "roughjs/bin/core";
import {LINEARPATH} from "./data.ts";


export const repaintLinearPath = () => {
    const currentCanvasContent = canvasContent[canvasContent.length-1];
    rc.draw(currentCanvasContent.points?.[currentCanvasContent.points?.length-1].drawable as Drawable)
}

export const paintLinearPath = (content: CanvasContentType) => {
    content.points?.forEach((point) => {
        rc.draw(point.drawable!);
    })
}

export const linearPathPointerDown = (clientX: number, clientY: number) => {
    canvasContent.push({
        type: LINEARPATH,
        x: clientX,
        y: clientY,
    })
}


export const linearPathPointerMove =  (clientX: number, clientY: number) => {
        const currentContent = canvasContent[canvasContent.length-1];

        if(!currentContent.points) {
            currentContent.points = [];
            currentContent.points.push({
                x: currentContent.x,
                y: currentContent.y,
                width: clientX,
                height: clientY,
                drawable: generator.linearPath([[currentContent.x, currentContent.y], [clientX, clientY]]),
            })
            return;
        }

        const currentPoint = currentContent.points?.[currentContent.points?.length-1] as CanvasContentPointType;
        currentContent.points?.push({
            x: currentPoint.width,
            y: currentPoint.height,
            width: clientX,
            height: clientY,
            drawable: generator.linearPath([[currentPoint.width, currentPoint.height], [clientX, clientY]]),
        })
}

