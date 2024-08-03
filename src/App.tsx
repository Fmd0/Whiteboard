import DrawToolBar from "./components/tools/DrawToolBar.tsx";
import ScaleToolBar from "./components/tools/ScaleToolBar.tsx";
import StyleToolBar from "./components/tools/StyleToolBar.tsx";
import PointerEvent from "./components/canvas/PointerEvent.tsx";


const App = () => {

    return (
        <>
            <DrawToolBar />
            <ScaleToolBar />
            <StyleToolBar />
            <PointerEvent />
        </>
    )
}

export default App;