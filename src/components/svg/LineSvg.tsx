


const LineSvg = ({checked}: {
    checked: boolean,
}) => {
    return (
        <svg viewBox="0 0 24 24" className={`size-6 duration-100 ${checked ? "text-[#3859ff]" : "text-black group-hover/toolItem:text-[#314cd9]"}`} aria-hidden="true" role="presentation"
             focusable="false" data-testid="svg-icon">
            <path xmlns="http://www.w3.org/2000/svg"
                  d="M14.293 8.293l-11 11a1 1 0 0 0 1.414 1.414l11-11L18 12l3-9-9 3 2.293 2.293z" fillRule="nonzero"
                  fill="currentColor"></path>
        </svg>
    )
}

export default LineSvg;