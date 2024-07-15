

const RectangleSvg = ({checked}: {
    checked: boolean,
}) => {
    return (
        <svg viewBox="0 0 24 24" className={`size-6 duration-100 ${checked?"text-[#3859ff]":"text-black group-hover/toolItem:text-[#314cd9]"}`} aria-hidden="true" role="presentation"
             focusable="false" data-testid="svg-icon">
            <path xmlns="http://www.w3.org/2000/svg" d="M3 3h18v18H3z" strokeWidth="2" stroke="currentColor"
                  fillRule="evenodd" fill="none"></path>
        </svg>
    )
}

export default RectangleSvg;