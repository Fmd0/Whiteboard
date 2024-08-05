import {shapeList} from "./index.ts";
import {ELLIPSE, LINE, LINEARPATH, RECTANGLE} from "../utils/data.ts";
import {selectRectangle} from "./shape/rectangle.ts";
import {setSelectedShape} from "./index.ts";
import {repaint} from "./paint.ts";
import {selectEllipse} from "./shape/ellipse.ts";
import {selectLine} from "./shape/line.ts";
import {selectLinearPath} from "./shape/linearPath.ts";


export const handleSelect = (event: PointerEvent) => {
    try {
        for(let i = shapeList.length-1; i >= 0; i--) {
            switch (shapeList[i].type) {
                case RECTANGLE: selectRectangle(event, shapeList[i]); break;
                case ELLIPSE: selectEllipse(event, shapeList[i]); break;
                case LINE: selectLine(event, shapeList[i]); break;
                case LINEARPATH: selectLinearPath(event, shapeList[i]); break;
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