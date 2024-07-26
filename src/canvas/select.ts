import {shapeList} from "./index.ts";
import {RECTANGLE} from "../utils/data.ts";
import {selectRectangle} from "./shape/rectangle.ts";
import {setSelectedShape} from "./index.ts";
import {repaint} from "./paint.ts";


export const handleSelect = (event: PointerEvent) => {
    try {
        for(const shape of shapeList) {
            switch (shape.type) {
                case RECTANGLE: selectRectangle(event, shape);
            }
        }
        setSelectedShape(null);
        // console.log(false);
    }
    catch (shape) {
        setSelectedShape(shape);
        // console.log(JSON.stringify(shape));
    }
    repaint();
}