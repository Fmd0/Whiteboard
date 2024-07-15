

const PointerSvg = ({checked}: {
    checked: boolean,
}) => {
    return (
        <svg viewBox="0 0 24 24" className={`size-6 duration-100 ${checked ? "text-[#3859ff]" : "text-black group-hover/toolItem:text-[#314cd9]"}`}
             aria-hidden="true" role="presentation"
             focusable="false" data-testid="svg-icon">
            <path xmlns="http://www.w3.org/2000/svg"
                  d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
                  fillRule="evenodd" fill="currentColor"></path>
        </svg>
    )
}

export default PointerSvg;

