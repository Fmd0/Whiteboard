

const DrawToolBarItem = ({value, handleClick, itemValue, Svg}: {
    value: string,
    handleClick: (tool: string) => void,
    itemValue: string,
    Svg:  ({checked}: {checked: boolean }) => JSX.Element
}) => {
    return (
        <div className={`cursor-pointer size-10 grid place-items-center rounded-md duration-100 group/toolItem
            ${value === itemValue ? "bg-[#d9dffc]" : "bg-white hover:bg-[#e8ecfc]"}`}
             onClick={() => handleClick(itemValue)}
        >
            <Svg checked={value === itemValue}/>
        </div>
    )
}

export default DrawToolBarItem;